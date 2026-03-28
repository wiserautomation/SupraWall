// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';

/**
 * SECURE INVITATION DISPATCHER
 * Used to add team members to an organization via privileged backend access.
 * SECURITY: userId is derived from the verified Firebase ID token, not from the request body.
 */
export async function POST(req: NextRequest) {
    try {
        // SECURITY: Authenticate — derive org ownership from token
        const authenticatedUserId = await verifyAuth(req);
        if (!authenticatedUserId) return unauthorizedResponse();

        const { inviteEmail, inviteRole } = await req.json();

        if (!inviteEmail || !inviteRole) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use authenticated userId as the organization ID
        const userId = authenticatedUserId;

        // 1. Resolve Organization/Members sub-collection using Admin privileges
        const membersRef = db.collection('organizations').doc(userId).collection('members');

        // Check for existing invitation
        const existing = await membersRef.where('email', '==', inviteEmail).get();
        if (!existing.empty) {
            return NextResponse.json({
                error: 'Conflict: Identity already has an invitation or is a member of this organization.'
            }, { status: 409 });
        }

        // 2. Persist invitation record
        await membersRef.add({
            email: inviteEmail,
            role: inviteRole,
            status: 'invited',
            addedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. SECURE EVENT LOGGING
        console.log(`[SupraWall] INVITE_SENT | Organization: ${userId} | Target: ${inviteEmail} | Role: ${inviteRole}`);

        return NextResponse.json({
            success: true,
            message: 'Invitation record persisted and secure dispatch initiated.'
        });

    } catch (e: any) {
        console.error('[SupraWall Invite API Error]:', e);
        return NextResponse.json({
            error: 'The invitation request failed to process.',
            details: e.message
        }, { status: 500 });
    }
}
