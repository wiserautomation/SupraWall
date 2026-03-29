// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, decision_by, decision_comment } = body;

    const result = await query(
      `UPDATE approval_requests 
       SET status = $1, 
           decision_by = $2, 
           decision_comment = $3, 
           decision_at = CURRENT_TIMESTAMP 
       WHERE id = $4
       RETURNING *`,
      [status, decision_by, decision_comment, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Approval request not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error("[API Approval PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
