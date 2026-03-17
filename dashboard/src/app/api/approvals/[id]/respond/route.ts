import { NextRequest, NextResponse } from 'next/server';
import { admin, getAdminDb } from '@/lib/firebase-admin';

const db = getAdminDb();

/**
 * POST /api/approvals/[id]/respond
 * 
 * Responds to an approval request (Approve or Deny).
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { decision, reviewedBy, reviewNote } = body;

        if (!['approved', 'denied'].includes(decision)) {
            return NextResponse.json({ error: 'Invalid decision. Must be "approved" or "denied".' }, { status: 400 });
        }

        const approvalRef = db.collection('approvalRequests').doc(id);
        const doc = await approvalRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Approval request not found.' }, { status: 404 });
        }

        const data = doc.data();
        if (data?.status !== 'pending') {
            return NextResponse.json({ error: `Request has already been ${data?.status}.` }, { status: 400 });
        }

        // Update the approval request
        await approvalRef.update({
            status: decision,
            reviewedBy: reviewedBy || 'Admin',
            reviewNote: reviewNote || '',
            respondedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Optional: If approved, we could trigger a webhook here if the SDKs were listening to webooks
        // For now, the SDKs will poll or wait for a status change in Firestore

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
