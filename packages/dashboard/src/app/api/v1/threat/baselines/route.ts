// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db_sql';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/threat/baselines?tenantId=xxx
 * Returns behavioral baselines for all agent/tool pairs in a tenant.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
        }

        // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
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
            console.warn("[IdentityMapping] Firebase lookup failed for baselines:", e);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS agent_behavioral_baselines (
                id SERIAL PRIMARY KEY,
                tenant_id VARCHAR(255) NOT NULL,
                agent_id VARCHAR(255) NOT NULL,
                tool_name VARCHAR(255) NOT NULL,
                avg_args_length INTEGER DEFAULT 0,
                avg_calls_per_hour INTEGER DEFAULT 0,
                common_arg_patterns JSONB DEFAULT '[]',
                total_samples INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT NOW()
            );
        `);

        const result = await pool.query(
            `SELECT agent_id, tool_name, avg_args_length, avg_calls_per_hour,
                    common_arg_patterns, total_samples, last_updated
             FROM agent_behavioral_baselines
             WHERE tenant_id = $1 OR tenant_id = $2
             ORDER BY total_samples DESC
             LIMIT 100`,
            [tenantId, effectiveTenantId]
        );

        return NextResponse.json(result.rows);
    } catch (err: any) {
        console.error("[API Baselines GET] Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}

