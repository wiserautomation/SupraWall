// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

    const snap = await db.collection("vault_access_rules")
        .where("tenant_id", "==", tenantId)
        .get();

    const rules = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { tenantId, agentId, secretId, allowedTools, maxUsesPerHour, requiresApproval } = body;

    if (!tenantId || !agentId || !secretId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get secret name for the rule
    const secretSnap = await db.collection("vault_secrets").doc(secretId).get();
    if (!secretSnap.exists) {
        return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    }
    const secretName = secretSnap.data()?.secret_name;

    const res = await db.collection("vault_access_rules").add({
        tenant_id: tenantId,
        agent_id: agentId,
        secret_id: secretId,
        secret_name: secretName,
        allowed_tools: allowedTools || [],
        max_uses_per_hour: maxUsesPerHour || 100,
        requires_approval: !!requiresApproval,
        created_at: new Date()
    });

    return NextResponse.json({ id: res.id });
}
