// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getOAuthClient, isValidRedirectUri } from '@/lib/oauth-clients';

/**
 * OAuth 2.0 Authorization Endpoint
 * 
 * GET /api/mcp/auth/authorize?client_id=...&redirect_uri=...&state=...
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');

    if (!clientId || !redirectUri) {
        return NextResponse.json({ error: "Missing client_id or redirect_uri" }, { status: 400 });
    }

    // ── C5: Client Verification ──
    const client = getOAuthClient(clientId);
    if (!client) {
        return NextResponse.json({ error: "invalid_client", message: "Client not registered." }, { status: 400 });
    }
    if (!isValidRedirectUri(client, redirectUri)) {
        return NextResponse.json({ error: "invalid_redirect_uri", message: "Redirect URI not registered for this client." }, { status: 400 });
    }
    // For this distribution plan, we redirect to a consent page on the dashboard.
    const consentUrl = new URL('/mcp/consent', req.url);
    consentUrl.searchParams.set('client_id', clientId);
    consentUrl.searchParams.set('redirect_uri', redirectUri);
    if (state) consentUrl.searchParams.set('state', state);

    return NextResponse.redirect(consentUrl);
}
