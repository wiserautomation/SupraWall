// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export async function GET(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    if (tenantId !== userId) return apiError.forbidden();

    const snap = await db.collection("vault_access_log")
        .where("tenant_id", "==", tenantId)
        .orderBy("created_at", "desc")
        .limit(limit)
        .get();

    const logs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at.toDate().toISOString()
    }));

    return NextResponse.json(logs);
}
