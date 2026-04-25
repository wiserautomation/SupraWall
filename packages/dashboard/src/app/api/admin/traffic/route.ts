// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { query, ensureSchema } from '@/lib/db_sql';
import { getAdminAuth } from '@/lib/firebase-admin';
import { subHours, subDays, format, startOfHour } from 'date-fns';

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

    // Pre-fill last 24 slots to ensure a continuous line in the chart
    const hourlyMap: Record<string, any> = {};
    for (let i = 24; i >= 0; i--) {
        const h = startOfHour(subHours(new Date(), i)).toISOString();
        hourlyMap[h] = { hour: format(new Date(h), 'HH:00'), ALLOW: 0, DENY: 0, REQUIRE_APPROVAL: 0 };
    }

    let topTools: any[] = [];
    let topAgents: any[] = [];
    let daily: any[] = [];

    try {
        await ensureSchema();
        const last24hStart = subHours(new Date(), 24).toISOString();
        const last7dStart = subDays(new Date(), 7).toISOString();
        const last30dStart = subDays(new Date(), 30).toISOString();

        const [hourlyRes, topToolsRes, topAgentsRes, dailyRes] = await Promise.all([
            query(
                `SELECT date_trunc('hour', timestamp) as hour, decision, COUNT(*) as count 
                 FROM audit_logs WHERE timestamp >= $1 
                 GROUP BY date_trunc('hour', timestamp), decision ORDER BY hour ASC`,
                [last24hStart]
            ),
            query(
                `SELECT toolname as name, COUNT(*) as count 
                 FROM audit_logs WHERE timestamp >= $1 
                 GROUP BY toolname ORDER BY count DESC LIMIT 10`,
                [last7dStart]
            ),
            query(
                `SELECT agentid as id, COUNT(*) as count 
                 FROM audit_logs WHERE timestamp >= $1 
                 GROUP BY agentid ORDER BY count DESC LIMIT 10`,
                [last7dStart]
            ),
            query(
                `SELECT date_trunc('day', timestamp) as day, COUNT(*) as count 
                 FROM audit_logs WHERE timestamp >= $1 
                 GROUP BY date_trunc('day', timestamp) ORDER BY day ASC`,
                [last30dStart]
            )
        ]);

        hourlyRes.rows.forEach((row: any) => {
            const h = row.hour.toISOString();
            if (hourlyMap[h]) {
                hourlyMap[h][row.decision] = parseInt(row.count, 10);
            }
        });

        topTools = topToolsRes.rows;
        topAgents = topAgentsRes.rows;
        daily = dailyRes.rows.map((r: any) => ({
            day: format(new Date(r.day), 'MMM d'),
            count: parseInt(r.count, 10)
        }));
    } catch (pgErr: any) {
        console.error('[Admin Traffic API] Postgres fetch failed:', pgErr.message);
        warnings.push('Traffic data unavailable — Postgres connection failed: ' + pgErr.message);
    }

    return NextResponse.json({
        hourly: Object.values(hourlyMap),
        topTools,
        topAgents,
        daily,
        warnings
    });
}
