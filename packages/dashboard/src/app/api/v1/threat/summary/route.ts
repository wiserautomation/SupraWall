// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Proxy to the SupraWall Backend (PostgreSQL source of truth)
    const serverUrl = process.env.SUPRAWALL_API_URL || "https://suprawall.vercel.app";
    const url = new URL(`${serverUrl}/v1/threat/summary`);
    url.searchParams.set("tenantId", tenantId);

    const response = await fetch(url.toString(), {
        headers: {
            "x-api-key": process.env.SUPRAWALL_MASTER_KEY || ""
        }
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("[Dashboard Threat Summary Proxy] Backend Error:", error);
        return NextResponse.json({ error: "Backend failure", details: error }, { status: response.status });
    }

    const summaries = await response.json();
    return NextResponse.json(summaries);

  } catch (err: any) {
    console.error("[API Threat Summary GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

