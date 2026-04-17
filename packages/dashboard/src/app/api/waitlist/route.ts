// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0
// PUBLIC ENDPOINT — intentionally unauthenticated. Rate-limited to prevent abuse.

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db, admin } from "@/lib/firebase-admin";

// In-memory rate limiter: max 5 signups per IP per hour
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
                { error: "Too many signups from this address. Please try again later." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { name, surname, email, framework, agentsCount, mainRisk } = body;

        if (!email || !framework || !agentsCount || !mainRisk) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Auto-qualification logic
        // Qualify if agentsCount is "10+" OR mainRisk contains certain keywords
        const highRiskKeywords = ["pci", "hipaa", "financial", "bank", "health", "audit", "compliance", "eu ai act", "leak", "rogue", "governance", "security"];
        const riskLower = mainRisk.toLowerCase();
        const isHighRisk = highRiskKeywords.some(kw => riskLower.includes(kw));

        const isQualified = agentsCount === "10+" || isHighRisk;

        const leadData = {
            name: name || "",
            surname: surname || "",
            email,
            framework,
            agentsCount,
            mainRisk,
            isQualified,
            status: "pending",
            appliedAt: admin.firestore.FieldValue.serverTimestamp(),
            source: "waitlist_landing"
        };

        await db.collection("waitlist").add(leadData);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("[Waitlist API Error]:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
