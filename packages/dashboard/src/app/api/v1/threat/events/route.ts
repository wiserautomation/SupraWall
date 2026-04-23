// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (tenantId !== userId) return apiError.forbidden();

    // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
    const effectiveTenantId = await getEffectiveTenantId(tenantId);

    await ensureSchema();

    // Alias timestamp as createdat for UI compatibility
    const result = await pool.query(
        "SELECT *, timestamp as createdat FROM threat_events WHERE tenantid = $1 OR tenantid = $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4",
        [tenantId, effectiveTenantId, limit, offset]
    );

    const globalCountRes = await pool.query("SELECT COUNT(*) FROM threat_events");
    const globalCount = parseInt(globalCountRes.rows[0].count, 10);

    return NextResponse.json({
        events: result.rows,
        debug: {
            tenantId,
            effectiveTenantId,
            globalCount
        }
    });

  } catch (err: any) {
    console.error("[API Threat Events GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
