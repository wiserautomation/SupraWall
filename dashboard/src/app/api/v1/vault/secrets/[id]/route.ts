
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
