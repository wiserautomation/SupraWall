import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import * as crypto from 'crypto';

/**
 * Internal callback to generate OAuth code after consent
 */
export async function POST(req: NextRequest) {
    const { clientId, redirectUri } = await req.json();

    // In a real app, we'd get the current user session here
    const userId = "demo_user_123"; 

    const code = crypto.randomBytes(16).toString('hex');
    
    await db.collection('mcp_oauth_codes').doc(code).set({
        userId,
        clientId,
        redirectUri,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    return NextResponse.json({ code });
}
