// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from "@/lib/db_sql";

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
        const userDoc = await db.collection("users").doc(tenantId).get();
        if (userDoc.exists && userDoc.data()?.tenantId) {
            effectiveTenantId = userDoc.data().tenantId;
        }
    } catch (e) {
        // Fallback to the provided tenantId (UID)
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS threat_events (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            event_type VARCHAR(100) NOT NULL,
            severity VARCHAR(50) DEFAULT 'medium',
            details JSONB,
            timestamp TIMESTAMP DEFAULT NOW()
        );
    `);

    // Alias timestamp as createdat for UI compatibility
    const result = await pool.query(
        "SELECT *, timestamp as createdat FROM threat_events WHERE tenantid = $1 OR tenantid = $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4",
        [tenantId, effectiveTenantId, limit, offset]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("[API Threat Events GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}


