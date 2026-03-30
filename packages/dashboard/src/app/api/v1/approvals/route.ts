// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from "@/lib/db_sql";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
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
        console.warn("[IdentityMapping] Firebase lookup failed, using direct UID:", e);
        // Fallback to the provided tenantId (UID)
    }

    // Ensure table exists (Self-healing schema) - aligning with SDK types
    await pool.query(`
        CREATE TABLE IF NOT EXISTS approval_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            toolname VARCHAR(255),
            parameters TEXT,
            status VARCHAR(50) DEFAULT 'PENDING',
            decision_by VARCHAR(255),
            decision_at TIMESTAMP,
            decision_comment TEXT,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Only fetch PENDING requests for the Approvals dashboard (SDK uses 'PENDING')
    const result = await pool.query(
        "SELECT * FROM approval_requests WHERE (tenantid = $1 OR tenantid = $2) AND status = 'PENDING' ORDER BY created_at DESC",
        [tenantId, effectiveTenantId]
    );

    const requests = result.rows.map((row: any) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        return {
            id: row.id,
            agentId: row.agentid,
            agentName: metadata.agentName || row.agentid || "Unknown Agent",
            toolName: row.toolname,
            arguments: row.parameters || "{}",
            status: row.status,
            createdAt: row.created_at,
            sessionId: metadata.sessionId,
            agentRole: metadata.agentRole,
            reason: metadata.reason
        };
    });

    return NextResponse.json(requests);

  } catch (err: any) {
    console.error("[API Approvals GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
