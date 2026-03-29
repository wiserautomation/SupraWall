// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { description } = await req.json();

        if (!description) {
            return NextResponse.json({ error: "Missing agent description" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `
Act as a Senior AI Security Architect for SupraWall. 
Given the following description of an AI agent's functionality, suggest the most appropriate security guardrails and policies to apply.

Agent Functionality: "${description}"

SupraWall supports the following guardrail configuration:
- budget: { limitUsd: number, resetPeriod: "daily" | "weekly" | "monthly" | "never", tokenLimit?: number }
- allowedTools: string[] (names of tools the agent IS allowed to call)
- blockedTools: string[] (names of tools the agent IS NOT allowed to call)
- piiScrubbing: { enabled: boolean, patterns: ("email" | "phone" | "ssn" | "credit_card" | "ip")[] }

Also suggest 2-3 specific tool-level policies (Rules) for precise control.
IMPORTANT: The "condition" field must be a valid Regular Expression string that will be tested against the JSON string representation of the tool arguments.
If you want to block a specific email recipient, the condition should be the email address (e.g. "sam@olawale\\.com").
If you want to allow only a specific domain, use a regex for that domain (e.g. "@company\\.com").

Respond ONLY with a JSON object in this format:
{
  "assessment": "Short 1-2 sentence security strategy summary",
  "guardrails": {
    "budget": { "limitUsd": 1.00, "resetPeriod": "monthly", "tokenLimit": 50000 },
    "allowedTools": ["tool1", "tool2"],
    "blockedTools": ["tool3"],
    "piiScrubbing": { "enabled": true, "patterns": ["email"] }
  },
  "suggestedPolicies": [
    { 
      "toolName": "tool_name", 
      "ruleType": "ALLOW|DENY", 
      "condition": "regex_pattern",
      "description": "Human readable explanation of what this regex does"
    }
  ]
}
`;

        const result = await client.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json"
            }
        });

        const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        return NextResponse.json(JSON.parse(analysisText));

    } catch (err: any) {
        console.error("[API Agent Assess] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
