// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from '@/lib/db_sql';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/v1/threat/semantic?tenantId=xxx&limit=50
 * Returns recent semantic analysis log entries for a tenant.
 */
export async function GET(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');
        const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

        if (!tenantId) {
            return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
        }

        if (tenantId !== userId) return apiError.forbidden();

        // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
        const effectiveTenantId = await getEffectiveTenantId(tenantId);

        await ensureSchema();

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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
