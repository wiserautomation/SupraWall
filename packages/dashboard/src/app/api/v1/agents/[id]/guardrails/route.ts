// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { id } = await params;
        const snap = await db.collection('agents').doc(id).get();
        if (!snap.exists) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        if (snap.data()?.userId !== userId) return apiError.forbidden();
        return NextResponse.json(snap.data()?.guardrails || {});
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { id } = await params;
        const snap = await db.collection('agents').doc(id).get();
        if (!snap.exists) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        if (snap.data()?.userId !== userId) return apiError.forbidden();

        const guardrails = await req.json();
        await db.collection('agents').doc(id).update({ guardrails, updatedAt: new Date() });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
