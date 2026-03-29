// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { analyzeAgentCode } from "@/lib/audit/static-analyzer";

// Simple in-memory rate limiter (resets on function cold start)
// For production, use Redis or Firestore-backed rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const window = rateLimitMap.get(ip);

    if (!window || window.resetAt < now) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
        return false;
    }

    if (window.count >= 5) return true;
    window.count++;
    return false;
}

export async function POST(req: NextRequest) {
    try {
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Maximum 5 deep scans per hour." },
                { status: 429 }
            );
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
