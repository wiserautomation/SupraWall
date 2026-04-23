// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { pool } from '@/lib/db_sql';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

/**
 * POST /api/approvals/[id]/respond
 *
 * Responds to an approval request (Approve or Deny).
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { id } = await params;
        const body = await request.json();
        const { decision, reviewedBy, reviewNote } = body;

        if (!['approved', 'denied'].includes(decision)) {
            return NextResponse.json({ error: 'Invalid decision. Must be "approved" or "denied".' }, { status: 400 });
        }

        // Verify ownership before updating
        const approvalRef = db.collection('approvalRequests').doc(id);
        const doc = await approvalRef.get();
        if (doc.exists && doc.data()?.userId !== userId) {
            return apiError.forbidden();
        }

        let firestoreUpdated = false;
        try {
            if (doc.exists) {
                await approvalRef.update({
                    status: decision,
                    reviewedBy: reviewedBy || 'Admin',
                    reviewNote: reviewNote || '',
                    respondedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                firestoreUpdated = true;
            }
        } catch (e) {
            console.error('[SupraWall] Firebase update failed:', e);
        }

        // Update Postgres
        const pgRes = await pool.query(
            `UPDATE approval_requests
             SET status = $1,
                 decision_by = $2,
                 decision_comment = $3,
                 decision_at = CURRENT_TIMESTAMP
             WHERE (id::text = $4 OR metadata->>'id' = $4) AND tenantid = $5`,
            [decision.toUpperCase(), reviewedBy || 'Admin', reviewNote || '', id, userId]
        );

        if (!firestoreUpdated && pgRes.rowCount === 0) {
            return NextResponse.json({ error: 'Approval request not found in neither Database.' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            id,
            status: decision
        });

    } catch (error: any) {
        console.error('[SupraWall] Error responding to approval:', error);
        return NextResponse.json({ error: 'Failed to update approval status.' }, { status: 500 });
    }
}
