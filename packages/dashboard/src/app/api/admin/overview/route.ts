// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db, getAdminAuth } from '@/lib/firebase-admin';
import { query, ensureSchema } from '@/lib/db_sql';
import { subDays, startOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS_RAW = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
const ADMIN_EMAILS = ADMIN_EMAILS_RAW.length > 0 ? ADMIN_EMAILS_RAW : [];

export async function GET(req: NextRequest) {
    // --- 1. Admin Auth Check ---
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

    // Each data source fails independently — we always return 200 with whatever we have.
    const warnings: string[] = [];

    // --- 2. Firebase Aggregates ---
    let totalUsers = 0;
    let totalAgents = 0;
    let totalPaidUsers = 0;
    let signupTrends: { date: string; count: number }[] = [];

    try {
        const [usersSnap, agentsSnap, orgsSnap] = await Promise.all([
            db.collection('users').get(),
            db.collection('agents').get(),
            db.collection('organizations').get()
        ]);
        totalUsers = usersSnap.size;
        totalAgents = agentsSnap.size;
        totalPaidUsers = orgsSnap.docs.filter(d => d.data().status === 'active').length;

        // Signup Trends (Last 7 days)
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const count = usersSnap.docs.filter(d => {
                const createdAt = d.data().createdAt;
                if (!createdAt) return false;
                return new Date(createdAt).toDateString() === date.toDateString();
            }).length;
            signupTrends.push({ date: dateStr, count });
        }
    } catch (fbErr: any) {
        console.error('[Admin Overview] Firebase fetch failed:', fbErr.message);
        warnings.push('Firebase data unavailable: ' + fbErr.message);
    }

    // --- 3. PostgreSQL Aggregates ---
    let opsToday = 0;
    let successRate = '100%';

    try {
        await ensureSchema();
        const todayStr = startOfDay(new Date()).toISOString();

        const [opsTodayRes, successTodayRes] = await Promise.all([
            query("SELECT COUNT(*) as count FROM audit_logs WHERE timestamp >= $1", [todayStr]),
            query("SELECT decision, COUNT(*) as count FROM audit_logs WHERE timestamp >= $1 GROUP BY decision", [todayStr])
        ]);

        opsToday = parseInt(opsTodayRes.rows[0].count || '0', 10);

        let allowed = 0, denied = 0;
        successTodayRes.rows.forEach(row => {
            if (row.decision === 'ALLOW') allowed = parseInt(row.count, 10);
            else if (row.decision === 'DENY') denied = parseInt(row.count, 10);
        });
        successRate = allowed + denied > 0 ? (allowed / (allowed + denied) * 100).toFixed(1) + '%' : '100%';
    } catch (pgErr: any) {
        console.error('[Admin Overview] Postgres fetch failed:', pgErr.message);
        warnings.push('Postgres data unavailable: ' + pgErr.message);
    }

    // --- 4. Stripe Aggregates ---
    let mrr = 0;
    let totalRevenue = 0;
    let churnRate = 0;

    try {
        // Lazily import stripe to catch the getStripe() throw inside the try block
        const { stripe } = await import('@/lib/stripe');
        const [subscriptions, invoices] = await Promise.all([
            stripe.subscriptions.list({ status: 'active', limit: 100 }),
            stripe.invoices.list({ status: 'paid', limit: 100 })
        ]);

        subscriptions.data.forEach(sub => {
            mrr += ((sub.items.data[0]?.plan?.amount || 0) / 100);
        });
        invoices.data.forEach(inv => {
            totalRevenue += (inv.amount_paid / 100);
        });

        const thirtyDaysAgo = Math.floor(subDays(new Date(), 30).getTime() / 1000);
        const canceledSubs = await stripe.subscriptions.list({
            status: 'canceled',
            limit: 100,
            created: { gte: thirtyDaysAgo }
        });
        const totalActiveCount = subscriptions.data.length || 1;
        churnRate = (canceledSubs.data.length / totalActiveCount) * 100;
    } catch (stripeErr: any) {
        console.warn('[Admin Overview] Stripe fetch failed (non-fatal):', stripeErr.message);
        warnings.push('Stripe data unavailable: ' + stripeErr.message);
    }

    return NextResponse.json({
        stats: {
            totalUsers,
            totalAgents,
            totalPaidUsers,
            opsToday,
            successRate,
            mrr: Math.round(mrr),
            totalRevenue: Math.round(totalRevenue),
            churnRate: churnRate.toFixed(1) + '%'
        },
        signupTrends,
        warnings
    });
}
