import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

const db = getAdminDb();

/**
 * GET /api/approvals/[id]
 * 
 * Fetches the status of a specific approval request.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const doc = await db.collection('approvalRequests').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
        }

        const data = doc.data();
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
