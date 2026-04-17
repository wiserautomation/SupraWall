// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

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

    // Ensure all tables exist
    await ensureSchema();

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
            arguments: typeof row.parameters === 'object' && row.parameters !== null ? JSON.stringify(row.parameters) : (row.parameters || "{}"),
            status: row.status,
            createdAt: row.created_at,
            sessionId: metadata.sessionId,
            agentRole: metadata.agentRole,
            reason: row.reason,
            estimatedCostUsd: Number(row.estimated_cost_usd) || 0
        };
    });

    return NextResponse.json(requests);

  } catch (err: any) {
    console.error("[API Approvals GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
