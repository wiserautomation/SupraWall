// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { db, admin } from "@/lib/firebase-admin";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

// GET /api/v1/platforms?userId=...
export async function GET(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId: authUserId } = guard;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        if (userId !== authUserId) return apiError.forbidden();

        const snapshot = await db.collection("platforms").where("ownerId", "==", userId).limit(1).get();
        if (snapshot.empty) {
            return NextResponse.json({ error: "Platform not found" }, { status: 404 });
        }

        const data = snapshot.docs[0].data();
        return NextResponse.json({
            platformId: snapshot.docs[0].id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || null
        });
    } catch (err: any) {
        console.error("[API Platforms GET] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/v1/platforms
export async function POST(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId: authUserId } = guard;

    try {
        const { userId, name } = await req.json();

        if (!userId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (userId !== authUserId) return apiError.forbidden();

        // Check if platform already exists
        const snapshot = await db.collection("platforms").where("ownerId", "==", userId).limit(1).get();
        if (!snapshot.empty) {
            return NextResponse.json({ error: "Platform already exists for this user" }, { status: 400 });
        }

        const platformData = {
            ownerId: userId,
            name,
            plan: "open_source", // Default free plan
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            connectEnabled: true,
            totalSubKeys: 0,
            totalCalls: 0,
            basePolicy: {
                rules: [],
                rateLimit: { requestsPerMinute: 60, requestsPerDay: 10000 }
            }
        };

        const docRef = await db.collection("platforms").add(platformData);
        return NextResponse.json({ platformId: docRef.id, ...platformData });

    } catch (err: any) {
        console.error("[API Platforms POST] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
