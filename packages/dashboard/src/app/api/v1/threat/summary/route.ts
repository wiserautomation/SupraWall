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

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Ensure table exists
    await pool.query(`
        CREATE TABLE IF NOT EXISTS threat_summaries (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            entity_id VARCHAR(255) NOT NULL, 
            entity_type VARCHAR(50) NOT NULL,
            threat_score FLOAT DEFAULT 0,
            total_events INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT NOW(),
            UNIQUE(tenantid, entity_id, entity_type)
        );
    `);

    // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
    let effectiveTenantId = tenantId;
    try {
        const { getAdminDb } = require('@/lib/firebase-admin');
        const db = getAdminDb();
        const userDoc = await db.collection("users").doc(tenantId).get().catch(() => null);
        if (userDoc && userDoc.exists && userDoc.data()?.tenantId) {
            effectiveTenantId = userDoc.data().tenantId;
        }
    } catch (e) {
        console.warn("[IdentityMapping] Firebase lookup failed for threat summary:", e);
    }

    const result = await pool.query(
        "SELECT * FROM threat_summaries WHERE tenantid = $1 OR tenantid = $2 ORDER BY threat_score DESC",
        [tenantId, effectiveTenantId]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("[API Threat Summary GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}


