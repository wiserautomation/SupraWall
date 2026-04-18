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
 * GET /api/v1/threat/baselines?tenantId=xxx
 * Returns behavioral baselines for all agent/tool pairs in a tenant.
 */
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

        // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
        const effectiveTenantId = await getEffectiveTenantId(tenantId);

        await ensureSchema();

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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
