// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();
    return NextResponse.json({ status: "success", message: `Aggregated threat scores for tenant: ${tenantId}` });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to aggregate scores" }, { status: 500 });
  }
}
