// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Proxy to the SupraWall Backend (PostgreSQL source of truth)
    const serverUrl = process.env.SUPRAWALL_API_URL || "https://suprawall.vercel.app";
    const response = await fetch(`${serverUrl}/v1/threat/aggregate`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-api-key": process.env.SUPRAWALL_MASTER_KEY || ""
        },
        body: JSON.stringify({ tenantId })
    });

    if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error: "Backend failure", details: error }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (err: any) {
    console.error("[API Threat Aggregate POST] Error:", err);
    return NextResponse.json({ error: "Failed to aggregate scores" }, { status: 500 });
  }
}

