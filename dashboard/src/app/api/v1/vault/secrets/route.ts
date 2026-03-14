
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { admin } from '@/lib/firebase-admin';
import { encrypt } from '@/lib/vault-server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

    const snap = await db.collection("vault_secrets")
        .where("tenant_id", "==", tenantId)
        .get();

    const secrets = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        encrypted_value: undefined // Never return the encrypted value
    }));

    return NextResponse.json(secrets);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { tenantId, secretName, secretValue, description, expiresAt } = body;

    if (!tenantId || !secretName || !secretValue) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if secret already exists
    const existing = await db.collection("vault_secrets")
        .where("tenant_id", "==", tenantId)
        .where("secret_name", "==", secretName)
        .limit(1)
        .get();

    if (!existing.empty) {
        return NextResponse.json({ error: "Secret name already exists in vault" }, { status: 409 });
    }

    const encrypted = encrypt(secretValue);

    const res = await db.collection("vault_secrets").add({
        tenant_id: tenantId,
        secret_name: secretName,
        encrypted_value: encrypted,
        description: description || null,
        expires_at: expiresAt ? new Date(expiresAt) : null,
        last_rotated_at: new Date(),
        created_at: new Date()
    });

    return NextResponse.json({ id: res.id, secret_name: secretName });
}
