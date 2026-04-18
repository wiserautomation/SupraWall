// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0
// PUBLIC ENDPOINT — no auth by design. Called client-side to scrub vault tokens from display strings.

export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text, secretValues } = await req.json();

        if (!text || !secretValues || !Array.isArray(secretValues)) {
            return NextResponse.json({ text }); // Return as is if missing data
        }

        // H11: DoS Prevention - limit payload sizes
        if (text.length > 100000) {
            return NextResponse.json({ error: "Text payload too large" }, { status: 413 });
        }
        if (secretValues.length > 50) {
            return NextResponse.json({ error: "Too many secrets provided" }, { status: 400 });
        }

        let scrubbedText = text;
        for (const value of secretValues) {
            if (!value || typeof value !== 'string') continue;
            // Escape special regex chars in the value
            const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\$&');
            const regex = new RegExp(escapedValue, 'g');
            scrubbedText = scrubbedText.replace(regex, '[REDACTED_BY_SUPRAWALL_VAULT]');
        }

        return NextResponse.json({ 
            text: scrubbedText,
            scrubbed: scrubbedText !== text
        });
    } catch (e) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
