// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

    const docRef = db.collection("vault_secrets").doc(id);
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.tenant_id !== tenantId) {
        return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    }

    // Cascade delete rules for this secret
    const secretName = snap.data()?.secret_name;
    const rulesSnap = await db.collection("vault_access_rules")
        .where("tenant_id", "==", tenantId)
        .where("secret_name", "==", secretName)
        .get();

    const batch = admin.firestore().batch();
    batch.delete(docRef);
    rulesSnap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({ success: true });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const body = await req.json();

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

    const docRef = db.collection("vault_secrets").doc(id);
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.tenant_id !== tenantId) {
        return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    }

    const { secretName, secretType, assignedAgents, description, expiresAt } = body;
    const updateData: any = {
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    if (secretName) updateData.secret_name = secretName;
    if (secretType) updateData.secret_type = secretType;
    if (assignedAgents) updateData.assigned_agents = assignedAgents;
    if (description !== undefined) updateData.description = description;
    if (expiresAt !== undefined) updateData.expires_at = expiresAt;

    await docRef.update(updateData);

    return NextResponse.json({ success: true, id });
}
