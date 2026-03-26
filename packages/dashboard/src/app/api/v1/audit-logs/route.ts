// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    const limit = searchParams.get('limit') || '50';
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    const serverBaseUrl = process.env.SUPRAWALL_API_URL || "http://localhost:3000";
    const url = new URL(`${serverBaseUrl}/v1/audit-logs`);
    url.searchParams.set("tenantId", tenantId);
    url.searchParams.set("limit", limit);

    const response = await fetch(url.toString());
    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: "Server API error", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const rows = data.rows || [];

    let logs = rows.map((row: any) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        return {
            id: row.id,
            agentId: row.agentid,
            toolName: row.toolname,
            decision: row.decision,
            riskScore: row.riskscore,
            cost_usd: row.cost_usd,
            timestamp: row.timestamp,
            createdAt: row.timestamp, // Alias for page.tsx compatibility
            arguments: row.parameters,
            reason: row.reason || metadata.reason,
            metadata: metadata
        };
    });

    if (agentId) {
        logs = logs.filter((l: any) => l.agentId === agentId);
    }

    return NextResponse.json(logs);

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
