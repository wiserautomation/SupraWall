// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { requireDashboardAuth } from "@/lib/api-guard";

// Simple in-memory rate limit for the /generate endpoint (C6 remediation)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 30;

export async function POST(req: NextRequest) {
    // ── C6: Auth Guard ──
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        // ── C6: Rate Limiting ──
        const now = Date.now();
        const userLimit = rateLimitMap.get(userId);
        if (userLimit && userLimit.resetAt > now) {
            if (userLimit.count >= MAX_REQUESTS_PER_HOUR) {
                return NextResponse.json(
                    { error: "Rate limit exceeded for AI generation. Try again in an hour." },
                    { status: 429 }
                );
            }
            userLimit.count++;
        } else {
            rateLimitMap.set(userId, { count: 1, resetAt: now + 3600 * 1000 });
        }

        const body = await req.json();
        const { prompt, toolName = "a generic tool" } = body;
        if (!prompt) {
            return NextResponse.json({ error: "Missing required fields: prompt" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY in environment variables.");
            return NextResponse.json({ error: "Server misconfiguration. Missing AI keys." }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are an expert cybersecurity engineer. The user wants to restrict an AI agent using the tool '${toolName}'. They will describe the restriction in plain English: '${prompt}'. Return ONLY a raw Regular Expression string that matches the user's intent. Do not include markdown formatting, backticks, or explanations. If they want to BLOCK something, write a regex that matches the blocked pattern. If they want to ONLY ALLOW something, write a regex that matches the allowed pattern.`;

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: systemPrompt,
        });

        let regexString = aiResponse.text?.trim() || ".*";

        // Remove markdown formatting if the model slipped it in
        if (regexString.startsWith("```")) {
            regexString = regexString.replace(/```(regex)?/gi, "").trim();
        }

        return NextResponse.json({ regex: regexString });
    } catch (error) {
        console.error("Error generating regex via Gemini:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
