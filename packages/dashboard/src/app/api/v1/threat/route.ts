// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from "@/lib/db_sql";
import { admin } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Authentication: verify Firebase ID token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let verifiedUid: string;
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      verifiedUid = decoded.uid;
    } catch {
      return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Ensure the authenticated user is only querying their own tenant
    if (verifiedUid !== tenantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Resolve Effective Tenant ID
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
        console.warn("[IdentityMapping] Firebase lookup failed for threat aggregate:", e);
    }

    // Fetch most recent threat events for the RiskRegister
    const result = await pool.query(
        "SELECT *, timestamp as createdat FROM threat_events WHERE tenantid = $1 OR tenantid = $2 ORDER BY timestamp DESC LIMIT $3",
        [tenantId, effectiveTenantId, limit]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("[API Threat Aggregate GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
