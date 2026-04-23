// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { requireDashboardAuth } from '@/lib/api-guard';
import * as crypto from 'crypto';

/**
 * Internal callback to generate OAuth code after consent.
 * Requires the user to be authenticated — userId is derived from JWT.
 */
export async function POST(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    const { clientId, redirectUri } = await req.json();

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
