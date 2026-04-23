// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { resolveSecret } from '@/lib/vault-server';

export const dynamic = 'force-dynamic';

/**
 * Public Vault Resolver API for Agents
 * POST /api/v1/vault
 * Body: { "apiKey": string, "secretName": string, "toolName": string (optional) }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { apiKey, secretName, toolName } = body;

        console.log(`[API Vault Resolve] Incoming request for secret: ${secretName}`);

        if (!apiKey || !secretName) {
            return NextResponse.json({ error: "Missing required fields: apiKey, secretName" }, { status: 400 });
        }

        const result = await resolveSecret(apiKey, secretName, toolName);

        if (!result.success) {
            console.warn(`[API Vault Resolve] Failed: ${result.error} (Status: ${result.status})`);
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json({ 
            success: true,
            secret_name: secretName,
            value: result.value 
        });

    } catch (e: any) {
        console.error("[API Vault Resolve] Unexpected Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
