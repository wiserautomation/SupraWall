// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export async function GET(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
        }

        if (tenantId !== userId) return apiError.forbidden();

        let effectiveTenantId = tenantId;
        try {
            const { getAdminDb } = require('@/lib/firebase-admin');
            const db = getAdminDb();
            const userDoc = await db.collection("users").doc(tenantId).get().catch(() => null);
            const data = userDoc?.data();
            if (userDoc && userDoc.exists && data && data.tenantId) {
                effectiveTenantId = data.tenantId;
            }
        } catch (e) {
            console.warn("[IdentityMapping] Firebase lookup failed for stats:", e);
        }

        // Ensure all tables exist
        await ensureSchema();

        // 2. Fetch Aggregated Data from Postgres
        const statsResult = await pool.query(`
            SELECT
                COUNT(*) as total_calls,
                SUM(cost_usd) as total_spend,
                COUNT(*) FILTER (WHERE decision = 'DENY') as blocked_actions
            FROM audit_logs
            WHERE tenantid = $1 OR tenantid = $2
        `, [tenantId, effectiveTenantId]);

        const statsRow = statsResult.rows[0];
        const totalCalls = parseInt(statsRow.total_calls || "0", 10);
        const actualSpend = parseFloat(statsRow.total_spend || "0");
        const blockedActions = parseInt(statsRow.blocked_actions || "0", 10);

        // 3. Fetch Pending Approvals
        const approvalsResult = await pool.query(`
            SELECT COUNT(*) FROM approval_requests
            WHERE (tenantid = $1 OR tenantid = $2) AND status = 'PENDING'
        `, [tenantId, effectiveTenantId]);
        const pendingApprovalsCount = parseInt(approvalsResult.rows[0].count || "0", 10);

        // 4. Generate chart data for the last 7 days
        const chartResult = await pool.query(`
            SELECT
                TO_CHAR(timestamp, 'Dy') as day_name,
                COUNT(*) as call_count
            FROM audit_logs
            WHERE (tenantid = $1 OR tenantid = $2)
              AND timestamp > NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(timestamp, 'Dy'), DATE_TRUNC('day', timestamp)
            ORDER BY DATE_TRUNC('day', timestamp)
        `, [tenantId, effectiveTenantId]);

        const chartData = chartResult.rows.map(row => ({
            name: row.day_name,
            calls: parseInt(row.call_count || "0", 10)
        }));

        // Fill in if chart data is empty
        const finalChartData = chartData.length > 0 ? chartData : [
            { name: 'Mon', calls: 0 }, { name: 'Tue', calls: 0 }, { name: 'Wed', calls: 0 },
            { name: 'Thu', calls: 0 }, { name: 'Fri', calls: 0 }, { name: 'Sat', calls: 0 }, { name: 'Sun', calls: 0 }
        ];

        const costSaved = blockedActions * 0.25; // Estimated $0.25 saved per blocked harmful action

        return NextResponse.json({
            totalCalls,
            blockedActions,
            actualSpend,
            costSaved,
            pendingApprovalsCount,
            chartData: finalChartData
        });

    } catch (error: any) {
        console.error('[API Stats GET] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard statistics from Postgres' }, { status: 500 });
    }
}
