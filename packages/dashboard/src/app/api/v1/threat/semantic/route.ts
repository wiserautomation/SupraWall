// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db_sql';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/threat/semantic?tenantId=xxx&limit=50
 * Returns recent semantic analysis log entries for a tenant.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

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
            console.warn("[IdentityMapping] Firebase lookup failed for semantic log:", e);
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS semantic_analysis_log (
                id SERIAL PRIMARY KEY,
                tenant_id VARCHAR(255) NOT NULL,
                agent_id VARCHAR(255),
                tool_name VARCHAR(255),
                semantic_score INTEGER,
                anomaly_score INTEGER,
                confidence VARCHAR(50),
                decision_override VARCHAR(50),
                reasoning TEXT,
                model_used VARCHAR(100),
                latency_ms INTEGER,
                timestamp TIMESTAMP DEFAULT NOW()
            );
        `);

        const result = await pool.query(
            `SELECT id, agent_id, tool_name, semantic_score, anomaly_score,
                    confidence, decision_override, reasoning, model_used,
                    latency_ms, timestamp
             FROM semantic_analysis_log
             WHERE tenant_id = $1 OR tenant_id = $2
             ORDER BY timestamp DESC
             LIMIT $3`,
            [tenantId, effectiveTenantId, limit]
        );

        return NextResponse.json(result.rows);
    } catch (err: any) {
        console.error("[API Semantic GET] Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}

