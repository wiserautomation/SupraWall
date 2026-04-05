// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

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
        console.warn("[IdentityMapping] Firebase lookup failed for threat events:", e);
    }

    await ensureSchema();

    // Alias timestamp as createdat for UI compatibility
    const result = await pool.query(
        "SELECT *, timestamp as createdat FROM threat_events WHERE tenantid = $1 OR tenantid = $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4",
        [tenantId, effectiveTenantId, limit, offset]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("[API Threat Events GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


