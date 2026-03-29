// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

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

    // In a real app, we'd verify the client_id here.
    // For this distribution plan, we redirect to a consent page on the dashboard.
    const consentUrl = new URL('/mcp/consent', req.url);
    consentUrl.searchParams.set('client_id', clientId);
    consentUrl.searchParams.set('redirect_uri', redirectUri);
    if (state) consentUrl.searchParams.set('state', state);

    return NextResponse.redirect(consentUrl);
}
