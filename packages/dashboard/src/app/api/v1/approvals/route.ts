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
        const userDoc = await db.collection("users").doc(tenantId).get();
        if (userDoc.exists && userDoc.data()?.tenantId) {
            effectiveTenantId = userDoc.data().tenantId;
        }
    } catch (e) {
        // Fallback to the provided tenantId (UID)
    }

    // Ensure table exists (Self-healing schema)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS approval_requests (
            id VARCHAR(255) PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            agentname VARCHAR(255),
            toolname VARCHAR(255),
            arguments TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            estimated_cost_usd FLOAT DEFAULT 0,
            metadata JSONB,
            timestamp TIMESTAMP DEFAULT NOW()
        );
    `);

    // Only fetch PENDING requests for the Approvals dashboard
    const result = await pool.query(
        "SELECT * FROM approval_requests WHERE (tenantid = $1 OR tenantid = $2) AND status = 'pending' ORDER BY timestamp DESC",
        [tenantId, effectiveTenantId]
    );

    const requests = result.rows.map((row: any) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        return {
            id: row.id,
            agentId: row.agentid,
            agentName: row.agentname || "Unknown Agent",
            toolName: row.toolname,
            arguments: row.arguments,
            status: row.status,
            estimatedCostUsd: row.estimated_cost_usd || 0,
            createdAt: row.timestamp,
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
