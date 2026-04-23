// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    if (tenantId !== userId) return apiError.forbidden();

    const docRef = db.collection("vault_access_rules").doc(id);
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.tenant_id !== tenantId) {
        return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
}
