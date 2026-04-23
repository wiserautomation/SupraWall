// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { analyzeAgentCode } from "@/lib/audit/static-analyzer";
import { requireDashboardAuth } from "@/lib/api-guard";

// Simple in-memory rate limiter per user (C6/H4 remediation)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_SCANS_PER_HOUR = 10;

export async function POST(req: NextRequest) {
    // ── H4: Auth Guard ──
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        // ── H4: Rate Limiting ──
        const now = Date.now();
        const userLimit = rateLimitMap.get(userId);
        if (userLimit && userLimit.resetAt > now) {
            if (userLimit.count >= MAX_SCANS_PER_HOUR) {
                return NextResponse.json(
                    { error: "Rate limit exceeded for deep scans. Maximum 10 per hour." },
                    { status: 429 }
                );
            }
            userLimit.count++;
        } else {
            rateLimitMap.set(userId, { count: 1, resetAt: now + 3600 * 1000 });
        }

        const { code, framework } = await req.json();

        if (!code || typeof code !== "string") {
            return NextResponse.json({ error: "code is required" }, { status: 400 });
        }

        // First run static analysis
        const staticResult = analyzeAgentCode(code.slice(0, 10000), framework || "auto");

        // If Google/Anthropic API key is available, do LLM-powered deep analysis
        const anthropicKey = process.env.ANTHROPIC_API_KEY;

        if (!anthropicKey) {
            // Return static analysis as deep scan result
            return NextResponse.json(staticResult);
        }

        // LLM-powered deep scan using Claude
        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": anthropicKey,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-6",
                    max_tokens: 2000,
                    system: `You are an EU AI Act compliance auditor specializing in AI agent code. Analyze the provided ${framework || "AI"} agent code and identify violations of Articles 9 (risk management), 12 (audit logging), and 14 (human oversight).

Return ONLY valid JSON in this exact format:
{
  "violations": [
    {
      "article": "Article 12",
      "severity": "critical",
      "title": "Brief title",
      "description": "Detailed explanation of the violation",
      "fix": "// Code example showing the Supra-wall fix"
    }
  ],
  "score": 65
}

Severity levels: critical (25pt deduction), high (15pt), medium (8pt), low (3pt). Score starts at 100.
Be specific and actionable. Reference line numbers when possible.`,
                    messages: [
                        {
                            role: "user",
                            content: `Analyze this agent code for EU AI Act compliance:\n\n\`\`\`\n${code.slice(0, 5000)}\n\`\`\``,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                return NextResponse.json(staticResult);
            }

            const data = await response.json() as any;
            const content = data.content?.[0]?.text || "";

            // Parse JSON from LLM response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    violations: parsed.violations || staticResult.violations,
                    score: parsed.score ?? staticResult.score,
                    framework: framework || "auto",
                    source: "ai",
                });
            }
        } catch {
            // Fall back to static analysis on any LLM error
        }

        return NextResponse.json({ ...staticResult, source: "static" });
    } catch (error) {
        console.error("Audit scan failed:", error);
        return NextResponse.json({ error: "Scan failed" }, { status: 500 });
    }
}
