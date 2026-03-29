// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { pool } from "@/lib/db_sql";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    const result = await pool.query(
        "SELECT * FROM threat_events WHERE tenantid = $1 ORDER BY createdat DESC LIMIT $2 OFFSET $3",
        [tenantId, limit, offset]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("[API Threat Events GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

