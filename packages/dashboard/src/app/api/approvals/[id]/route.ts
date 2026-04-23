// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

/**
 * GET /api/approvals/[id]
 *
 * Fetches the status of a specific approval request.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { id } = await params;
        const doc = await db.collection('approvalRequests').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
        }

        const data = doc.data();

        // Verify the authenticated user owns this approval request
        if (data?.userId !== userId) return apiError.forbidden();

        return NextResponse.json({
            id: doc.id,
            status: data?.status,
            decision: data?.status, // alias for clarity
            respondedAt: data?.respondedAt?.toDate().toISOString(),
            createdAt: data?.createdAt?.toDate().toISOString(),
        });

    } catch (error: any) {
        console.error('[SupraWall] Error fetching approval status:', error);
        return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
    }
}
