// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db, getAdminAuth } from '@/lib/firebase-admin';
import { query, ensureSchema } from '@/lib/db_sql';
import { subMonths, startOfMonth, format } from 'date-fns';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS_RAW = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
const ADMIN_EMAILS = ADMIN_EMAILS_RAW.length > 0 ? ADMIN_EMAILS_RAW : [];

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    let decodedToken: { email?: string };
    try {
        decodedToken = await getAdminAuth().verifyIdToken(token);
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!decodedToken.email || !ADMIN_EMAILS.includes(decodedToken.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const warnings: string[] = [];

    // --- 1. Firebase Aggregates ---
    let allUserIds: string[] = [];
    let usersWithAgents = new Set<string>();
    let paidUserIds = new Set<string>();
    let stage1_Signups = 0;
    let stage2_AgentsCreated = 0;
    let stage4_Paid = 0;
    let trends: { month: string; Signups: number; Paid: number }[] = [];

    try {
        const [usersSnap, agentsSnap, orgsSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('agents').get(),
            db.collection('organizations').where('status', '==', 'active').get()
        ]);
        allUserIds = usersSnap.docs.map(d => d.id);
        usersWithAgents = new Set(agentsSnap.docs.map(d => d.data().userId).filter(Boolean));
        paidUserIds = new Set(orgsSnap.docs.map(d => d.id));

        stage1_Signups = allUserIds.length;
        stage2_AgentsCreated = allUserIds.filter(id => usersWithAgents.has(id)).length;
        stage4_Paid = allUserIds.filter(id => paidUserIds.has(id)).length;

        for (let i = 3; i >= 0; i--) {
            const start = startOfMonth(subMonths(new Date(), i)).getTime();
            const monthLabel = format(start, 'MMM');
            const monthlySignups = usersSnap.docs.filter(d => {
                const c = d.data().createdAt;
                return c && new Date(c).getTime() >= start;
            }).length;
            trends.push({ month: monthLabel, Signups: monthlySignups, Paid: stage4_Paid });
        }
    } catch (fbErr: any) {
        console.error('[Admin Funnel] Firebase fetch failed:', fbErr.message);
        warnings.push('Firebase data unavailable: ' + fbErr.message);
    }

    // --- 2. PostgreSQL: Users with evaluations ---
    let stage3_FirstEval = 0;

    try {
        await ensureSchema();
        const evalUsersRes = await query('SELECT DISTINCT tenantid FROM audit_logs');
        const usersWithEvals = new Set(evalUsersRes.rows.map((r: any) => r.tenantid));
        stage3_FirstEval = allUserIds.filter(id => usersWithEvals.has(id)).length;
    } catch (pgErr: any) {
        console.error('[Admin Funnel] Postgres fetch failed:', pgErr.message);
        warnings.push('Postgres eval data unavailable: ' + pgErr.message);
        // Estimate based on agents: if they have an agent, assume they've eval'd
        stage3_FirstEval = stage2_AgentsCreated;
    }

    const funnel = [
        { name: 'Signups', count: stage1_Signups, ratio: 100 },
        { name: 'Agent Created', count: stage2_AgentsCreated, ratio: stage1_Signups > 0 ? Math.round((stage2_AgentsCreated / stage1_Signups) * 100) : 0 },
        { name: 'First Eval', count: stage3_FirstEval, ratio: stage2_AgentsCreated > 0 ? Math.round((stage3_FirstEval / stage2_AgentsCreated) * 100) : 0 },
        { name: 'Paid Coverage', count: stage4_Paid, ratio: stage3_FirstEval > 0 ? Math.round((stage4_Paid / stage3_FirstEval) * 100) : 0 }
    ];

    return NextResponse.json({
        funnel,
        trends,
        leakyPoint: stage2_AgentsCreated > 0 && (stage3_FirstEval / stage2_AgentsCreated) < 0.5
            ? 'Activation Gap (Agent to Eval)'
            : stage1_Signups > 0 && (stage2_AgentsCreated / stage1_Signups) < 0.5
            ? 'Setup Drop-off (Signup to Agent)'
            : 'Retention Gap (Eval to Paid)',
        conversionRate: stage1_Signups > 0 ? (stage4_Paid / stage1_Signups * 100).toFixed(1) + '%' : '0%',
        warnings
    });
}
