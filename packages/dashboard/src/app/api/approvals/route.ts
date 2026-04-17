// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

/**
 * GET /api/approvals
 *
 * Fetches pending and recent approval requests for the authenticated user.
 */
export async function GET(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId: authUserId } = guard;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const status = searchParams.get('status') || 'pending';

        if (!userId) {
            return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
        }

        if (userId !== authUserId) return apiError.forbidden();

        let query = db.collection('approvalRequests')
            .where('userId', '==', userId);

        if (status !== 'all') {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').limit(50).get();

        const approvals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamps to ISO strings for JSON serialization
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            expiresAt: doc.data().expiresAt?.toDate().toISOString(),
            respondedAt: doc.data().respondedAt?.toDate().toISOString(),
        }));

        return NextResponse.json(approvals);
    } catch (error: any) {
        console.error('[SupraWall] Error fetching approvals:', error);
        return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
    }
}
