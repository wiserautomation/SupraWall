// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db as firestore } from '@/lib/firebase-admin';
import { pool } from "@/lib/db_sql";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
        }

        let effectiveTenantId = tenantId;
        try {
            const { getAdminDb } = require('@/lib/firebase-admin');
            const db = getAdminDb();
            const userDoc = await db.collection("users").doc(tenantId).get().catch(() => null);
            if (userDoc && userDoc.exists && userDoc.data()?.tenantId) {
                effectiveTenantId = userDoc.data().tenantId;
            }
        } catch (e) {
            console.warn("[IdentityMapping] Firebase lookup failed for stats:", e);
        }

        // Ensure tables exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                tenantid VARCHAR(255) NOT NULL,
                agentid VARCHAR(255),
                toolname VARCHAR(255),
                decision VARCHAR(50),
                riskscore INTEGER,
                cost_usd FLOAT DEFAULT 0,
                reason TEXT,
                arguments TEXT,
                timestamp TIMESTAMP DEFAULT NOW(),
                parameters JSONB,
                metadata JSONB
            );
            CREATE TABLE IF NOT EXISTS approval_requests (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tenantid VARCHAR(255) NOT NULL,
                agentid VARCHAR(255) NOT NULL,
                toolname VARCHAR(255) NOT NULL,
                parameters JSONB,
                status VARCHAR(50) DEFAULT 'PENDING',
                decision_by VARCHAR(255),
                decision_at TIMESTAMP,
                decision_comment TEXT,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        // 2. Fetch Aggregated Data from Postgres
        const totalCallsRes = await pool.query(
            "SELECT COUNT(*) FROM audit_logs WHERE tenantid = $1 OR tenantid = $2",
            [tenantId, effectiveTenantId]
        );
        const blockedActionsRes = await pool.query(
            "SELECT COUNT(*) FROM audit_logs WHERE (tenantid = $1 OR tenantid = $2) AND decision = 'DENY'",
            [tenantId, effectiveTenantId]
        );
        const costSavedRes = await pool.query(
            "SELECT SUM(cost_usd) as total FROM audit_logs WHERE (tenantid = $1 OR tenantid = $2) AND decision = 'DENY'",
            [tenantId, effectiveTenantId]
        );
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
