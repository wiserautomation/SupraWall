// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import * as crypto from 'crypto';
import { getOAuthClient, isValidRedirectUri, verifyClientSecret } from '@/lib/oauth-clients';

/**
 * OAuth 2.0 Token Endpoint
 * 
 * POST /api/mcp/auth/token
 * Body: Grant type, code, client_id, client_secret
 */
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { grant_type, code, client_id, client_secret, redirect_uri } = body;

    if (grant_type !== 'authorization_code') {
        return NextResponse.json({ error: "unsupported_grant_type" }, { status: 400 });
    }

    // ── C4: Client Verification ──
    const client = getOAuthClient(client_id);
    if (!client) {
        return NextResponse.json({ error: "invalid_client", message: "Client not registered." }, { status: 401 });
    }
    if (!verifyClientSecret(client, client_secret)) {
        return NextResponse.json({ error: "invalid_client", message: "Client authentication failed." }, { status: 401 });
    }
    if (redirect_uri && !isValidRedirectUri(client, redirect_uri)) {
        return NextResponse.json({ error: "invalid_grant", message: "Redirect URI mismatch." }, { status: 400 });
    }

    // Verify code in Firestore
    const codeSnap = await db.collection('mcp_oauth_codes').doc(code).get();
    if (!codeSnap.exists) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
    }

    const codeData = codeSnap.data()!;
    if (Date.now() > codeData.expiresAt.toMillis()) {
        await db.collection('mcp_oauth_codes').doc(code).delete();
        return NextResponse.json({ error: "invalid_grant", message: "Code expired" }, { status: 400 });
    }

    // Generate Access Token
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');

    // Store token
    await db.collection('mcp_oauth_tokens').doc(accessToken).set({
        userId: codeData.userId,
        agentId: codeData.agentId || null,
        clientId: client_id,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
        refreshToken
    });

    // Cleanup code
    await db.collection('mcp_oauth_codes').doc(code).delete();

    return NextResponse.json({
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: refreshToken,
        scope: "mcp:all"
    });
}
