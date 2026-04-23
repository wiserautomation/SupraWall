// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { admin } from '@/lib/firebase-admin';
import { requireDashboardAuth } from '@/lib/api-guard';

// POST /api/intelligence - Create weekly brief
export async function POST(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;

    try {
        const body = await request.json();
        const db = getAdminDb();

        const briefData = {
            ...body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection('intelligence_briefs').add(briefData);

        return NextResponse.json({
            id: docRef.id,
            weekStart: body.weekStart
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating intelligence brief:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/intelligence - Fetch latest brief
export async function GET(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;

    try {
        const db = getAdminDb();

        const snapshot = await db.collection('intelligence_briefs')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({}, { status: 404 });
        }

        const doc = snapshot.docs[0];
        return NextResponse.json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error: any) {
        console.error('Error fetching intelligence brief:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
