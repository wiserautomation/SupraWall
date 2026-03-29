// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db, admin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
    try {
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
