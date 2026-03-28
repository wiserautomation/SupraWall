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

        const result = await pool.query(
            `SELECT agent_id, tool_name, avg_args_length, avg_calls_per_hour,
                    common_arg_patterns, total_samples, last_updated
             FROM agent_behavioral_baselines
             WHERE tenant_id = $1
             ORDER BY total_samples DESC
             LIMIT 100`,
            [tenantId]
        );

        return NextResponse.json(result.rows);
    } catch (err: any) {
        console.error("[API Baselines GET] Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
