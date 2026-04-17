// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0
// PUBLIC ENDPOINT — no auth by design. Called by Dify's webhook system with a shared secret in the body.

import { NextResponse } from 'next/server';

/**
 * SupraWall Security - Dify API Extension
 * Self-contained version to ensure build safety on Vercel.
 */

// --- Core Security Engine (Deterministic) ---

interface ThreatResult {
    blocked: boolean;
    reason?: string;
    threatType?: string;
}

function detectThreats(content: string): ThreatResult {
    const payload = content.toLowerCase();

    // SQL Injection
    const sqlPatterns = [
        { re: /drop\s+table/i, label: "DROP TABLE" },
        { re: /delete\s+from/i, label: "DELETE FROM" },
        { re: /union\s+select/i, label: "UNION SELECT" },
        { re: /or\s+['"]?1['"]?\s*=\s*['"]?1/i, label: "OR 1=1" }
    ];

    for (const { re, label } of sqlPatterns) {
        if (re.test(payload)) {
            return { blocked: true, reason: `SQL injection pattern (${label})`, threatType: "sql_injection" };
        }
    }

    // Prompt Injection
    const promptPatterns = [
        { re: /(ignore|forget|disregard)\s+(.*)\s+(instructions|prompt|rules|safety)/i, label: "instruction override" },
        { re: /you\s+are\s+now\s+(a|an|the)\s/i, label: "persona override" },
        { re: /jailbreak/i, label: "jailbreak attempt" }
    ];

    for (const { re, label } of promptPatterns) {
        if (re.test(payload)) {
            return { blocked: true, reason: "Prompt injection attempt detected", threatType: "prompt_injection" };
        }
    }

    return { blocked: false };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { point, params } = body;

        console.log('[SupraWall Dify Extension] Processing:', point);

        if (point === 'moderation') {
            const { text } = params;
            
            // Phase 1: Threat Detection
            const threat = detectThreats(text || "");
            
            if (threat.blocked) {
                return NextResponse.json({
                    flagged: true,
                    action: 'overridden',
                    overridden_message: `[SupraWall Security] Blocked: ${threat.reason}`,
                });
            }

            // Phase 2: Allow by default if no threats found
            return NextResponse.json({
                flagged: false,
                action: 'passed',
            });
        }

        if (point === 'app_external_data_variable') {
            return NextResponse.json({ result: params.inputs });
        }

        return NextResponse.json({ error: 'Unsupported extension point' }, { status: 400 });

    } catch (error: any) {
        console.error('[SupraWall Dify Extension Error]:', error);
        return NextResponse.json({
            flagged: false,
            action: 'passed',
        }, { status: 500 });
    }
}
