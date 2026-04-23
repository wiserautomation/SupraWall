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

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (tenantId !== userId) return apiError.forbidden();

    // Ensure all tables exist
    await ensureSchema();

    // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
    const effectiveTenantId = await getEffectiveTenantId(tenantId);

    const result = await pool.query(
        "SELECT * FROM threat_summaries WHERE tenantid = $1 OR tenantid = $2 ORDER BY threat_score DESC",
        [tenantId, effectiveTenantId]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("[API Threat Summary GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
