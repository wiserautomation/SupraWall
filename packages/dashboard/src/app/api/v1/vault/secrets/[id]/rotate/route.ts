// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { encrypt } from '@/lib/vault-server';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    const { tenantId, newValue } = body;

    if (!tenantId || !newValue) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docRef = db.collection("vault_secrets").doc(id);
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.tenant_id !== tenantId) {
        return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    }

    const encrypted = encrypt(newValue);

    await docRef.update({
        encrypted_value: encrypted,
        last_rotated_at: new Date()
    });

    return NextResponse.json({ success: true });
}
