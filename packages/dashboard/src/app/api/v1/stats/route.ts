// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';
import { getAdminDb } from '@/lib/firebase-admin';

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

        // SEC-011: Verify mapping
        const effectiveTenantId = await getEffectiveTenantId(userId);
        if (tenantId !== userId && tenantId !== effectiveTenantId) {
            return apiError.forbidden();
        }

        // Ensure all tables exist
        await ensureSchema();

        // 1. Fetch Aggregated Data from Postgres (Modern Source)
        const statsResult = await pool.query(`
            SELECT
                COUNT(*) as total_calls,
                SUM(cost_usd) as total_spend,
                COUNT(*) FILTER (WHERE decision = 'DENY') as blocked_actions
            FROM audit_logs
            WHERE tenantid = $1 OR tenantid = $2
        `, [userId, effectiveTenantId]);

        const statsRow = statsResult.rows[0];
        let totalCalls = parseInt(statsRow.total_calls || "0", 10);
        let actualSpend = parseFloat(statsRow.total_spend || "0");
        let blockedActions = parseInt(statsRow.blocked_actions || "0", 10);

        // 2. Fetch Aggregated Data from Firestore (Legacy Source)
        try {
            const db = getAdminDb();
            const queryIds = Array.from(new Set([userId, effectiveTenantId]));
            
            // Count legacy agents that might not be in Postgres
            const agentsCountSnap = await db.collection("agents").where("userId", "in", queryIds).count().get();
            const legacyAgentsCount = agentsCountSnap.data().count;

            // Count legacy audit logs
            const logsCountSnap = await db.collection("audit_logs").where("userId", "in", queryIds).count().get();
            const legacyLogsCount = logsCountSnap.data().count;
            
            totalCalls += legacyLogsCount;
            // Note: actualSpend and blockedActions from Firestore are harder to aggregate without a full scan
            // For now we just restore the visibility of the primary volume KPI
        } catch (e) {
            console.warn("[API Stats GET] Legacy Firestore count failed:", e);
        }

        // 3. Fetch Pending Approvals (Postgres)
        const approvalsResult = await pool.query(`
            SELECT COUNT(*) FROM approval_requests
            WHERE (tenantid = $1 OR tenantid = $2) AND status = 'PENDING'
        `, [userId, effectiveTenantId]);
        const pendingApprovalsCount = parseInt(approvalsResult.rows[0].count || "0", 10);

        // 4. Generate chart data for the last 7 days (Postgres only - legacy data is usually stagnant)
        const chartResult = await pool.query(`
            SELECT
                TO_CHAR(timestamp, 'Dy') as day_name,
                COUNT(*) as call_count
            FROM audit_logs
            WHERE (tenantid = $1 OR tenantid = $2)
              AND timestamp > NOW() - INTERVAL '7 days'
            GROUP BY TO_CHAR(timestamp, 'Dy'), DATE_TRUNC('day', timestamp)
            ORDER BY DATE_TRUNC('day', timestamp)
        `, [userId, effectiveTenantId]);

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
        return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
    }
}
