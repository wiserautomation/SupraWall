// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { db, admin } from "@/lib/firebase-admin";
import { nanoid } from "nanoid";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

/** Verify the authenticated user owns the given platform. */
async function verifyPlatformOwnership(platformId: string, userId: string): Promise<boolean> {
    const snap = await db.collection("platforms").doc(platformId).get();
    return snap.exists && snap.data()?.ownerId === userId;
}

// GET /api/v1/platforms/keys?platformId=...
export async function GET(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { searchParams } = new URL(req.url);
        const platformId = searchParams.get("platformId");

        if (!platformId) {
            return NextResponse.json({ error: "Missing platformId" }, { status: 400 });
        }

        if (!await verifyPlatformOwnership(platformId, userId)) return apiError.forbidden();

        const snapshot = await db.collection("connect_keys").where("platformId", "==", platformId).get();
        const keys = snapshot.docs.map(doc => ({
            subKeyId: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ keys });
    } catch (err: any) {
        console.error("[API Platform Keys GET] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/v1/platforms/keys
export async function POST(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { platformId, customerId, customerLabel, policyOverrides, rateLimitOverride } = await req.json();

        if (!platformId || !customerId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!await verifyPlatformOwnership(platformId, userId)) return apiError.forbidden();

        // Check if customerId already exists for this platform
        const snapshot = await db.collection("connect_keys")
            .where("platformId", "==", platformId)
            .where("customerId", "==", customerId)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            return NextResponse.json({ error: "Connect sub-key already exists for this customer ID" }, { status: 400 });
        }

        // Generate a new agc_ key
        const subKeyId = `agc_${nanoid(32)}`;

        const subKeyData = {
            platformId,
            customerId,
            customerLabel: customerLabel || customerId,
            active: true,
            totalCalls: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUsedAt: null,
            policyOverrides: policyOverrides || [],
            rateLimitOverride: rateLimitOverride || null
        };

        await db.collection("connect_keys").doc(subKeyId).set(subKeyData);

        // Atomically increment totalSubKeys on the platform
        await db.collection("platforms").doc(platformId).update({
            totalSubKeys: admin.firestore.FieldValue.increment(1)
        });

        return NextResponse.json({ subKeyId, ...subKeyData });

    } catch (err: any) {
        console.error("[API Platform Keys POST] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/v1/platforms/keys?subKeyId=...
export async function DELETE(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { searchParams } = new URL(req.url);
        const subKeyId = searchParams.get("subKeyId");

        if (!subKeyId) {
            return NextResponse.json({ error: "Missing subKeyId" }, { status: 400 });
        }

        const subKeyRef = db.collection("connect_keys").doc(subKeyId);
        const subKeySnap = await subKeyRef.get();
        if (!subKeySnap.exists) {
            return NextResponse.json({ error: "Sub-key not found" }, { status: 404 });
        }

        const platformId = subKeySnap.data()?.platformId;
        if (!platformId || !await verifyPlatformOwnership(platformId, userId)) return apiError.forbidden();

        await subKeyRef.delete();

        // Atomically decrement totalSubKeys on the platform
        await db.collection("platforms").doc(platformId).update({
            totalSubKeys: admin.firestore.FieldValue.increment(-1)
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("[API Platform Keys DELETE] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
