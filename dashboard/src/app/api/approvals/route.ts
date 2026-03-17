import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

const db = getAdminDb();

/**
 * GET /api/approvals
 * 
 * Fetches pending and recent approval requests for the organization.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId'); // In production, get from auth session
        const status = searchParams.get('status') || 'pending';

        if (!userId) {
            return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
        }

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
