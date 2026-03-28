// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    const limitParam = searchParams.get('limit') || '50';
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Proxy to the SupraWall Backend (PostgreSQL source of truth)
    const serverUrl = process.env.SUPRAWALL_API_URL || "https://suprawall.vercel.app";
    const url = new URL(`${serverUrl}/v1/audit-logs`);
    url.searchParams.set("tenantId", tenantId);
    url.searchParams.set("limit", limitParam);
    if (agentId && agentId !== "ALL") {
        url.searchParams.set("agentId", agentId);
    }

    const response = await fetch(url.toString(), {
        headers: {
            "x-api-key": process.env.SUPRAWALL_MASTER_KEY || ""
        }
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("[Dashboard Audit Proxy] Backend Error:", error);
        return NextResponse.json({ error: "Backend failure", details: error }, { status: response.status });
    }

    const data = await response.json();
    const rows = data.rows || [];

    // Map to common dashboard format
    const logs = rows.map((row: any) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        return {
            id: row.id,
            agentId: row.agentid,
            toolName: row.toolname,
            decision: row.decision,
            reason: row.reason || metadata.reason || null,
            cost_usd: row.cost_usd || 0,
            riskScore: row.riskscore ?? null,
            timestamp: row.timestamp || null,
            createdAt: row.timestamp || null,
            arguments: row.parameters ? (typeof row.parameters === 'string' ? row.parameters : JSON.stringify(row.parameters)) : "{}",
            sessionId: metadata.sessionId || null,
            is_loop: metadata.isLoop || false,
            agentRole: metadata.agentRole || null,
            integrityHash: metadata.integrityHash || null,
        };
    });

    return NextResponse.json(logs);

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

