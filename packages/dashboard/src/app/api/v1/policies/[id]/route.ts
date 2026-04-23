// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  const db = getAdminDb();
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (tenantId !== userId) return apiError.forbidden();

    const docRef = db.collection("policies").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }

    const data = docSnap.data();
    if (!data || (data.tenantId !== tenantId && data.userId !== tenantId)) {
        return NextResponse.json({ error: "Unauthorized or missing policy data" }, { status: 403 });
    }

    await docRef.delete();

    return NextResponse.json({ status: "deleted" });
  } catch (err: any) {
    console.error("[API Policy DELETE] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
