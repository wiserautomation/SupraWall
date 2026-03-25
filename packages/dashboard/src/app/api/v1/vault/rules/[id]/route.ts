// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

    const docRef = db.collection("vault_access_rules").doc(id);
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.tenant_id !== tenantId) {
        return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
}
