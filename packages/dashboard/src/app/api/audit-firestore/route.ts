// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

// GET /api/audit-firestore?userId=<uid>&limit=200
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const limitParam = parseInt(searchParams.get("limit") || "200", 10);

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Step 1a: Get the user's regular agent IDs
        const agentsSnap = await db.collection("agents").where("userId", "==", userId).get();
        const agentIds = agentsSnap.docs.map(doc => doc.id);

        // Step 1b: Get the user's Connect Platform sub-key IDs (API keys starting with agc_)
        const platformsSnap = await db.collection("platforms").where("ownerId", "==", userId).get();
        for (const pDoc of platformsSnap.docs) {
            const keysSnap = await db.collection("connect_keys").where("platformId", "==", pDoc.id).get();
            keysSnap.docs.forEach(kDoc => agentIds.push(kDoc.id));
        }

        if (agentIds.length === 0) {
            return NextResponse.json({ logs: [], stats: { total: 0, allowed: 0, denied: 0, approvals: 0, avgRisk: 0, totalCost: 0 } });
        }

        // Step 2: Query audit_logs for those agent IDs (batch in groups of 30 for Firestore "in" limit)
        const batches: string[][] = [];
        for (let i = 0; i < agentIds.length; i += 30) {
            batches.push(agentIds.slice(i, i + 30));
        }

        let allLogs: any[] = [];
        for (const batch of batches) {
            const logsSnap = await db.collection("audit_logs")
                .where("agentId", "in", batch)
                .limit(limitParam)
                .get();
            
            for (const doc of logsSnap.docs) {
                const data = doc.data();
                allLogs.push({
                    id: doc.id,
                    agentId: data.agentId,
                    toolName: data.toolName,
                    arguments: typeof data.arguments === 'string' ? data.arguments : JSON.stringify(data.arguments || {}),
                    decision: data.decision,
                    reason: data.reason || null,
                    cost_usd: data.cost_usd || 0,
                    riskScore: data.riskScore ?? null,
                    timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
                    sessionId: data.sessionId || null,
                    is_loop: data.is_loop || false,
                    agentRole: data.agentRole || null,
                });
            }
        }

        // Sort by timestamp descending
        allLogs.sort((a, b) => {
            const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return tb - ta;
        });

        // Trim to limit
        allLogs = allLogs.slice(0, limitParam);

        // Stats
        const allowed = allLogs.filter(l => l.decision === "ALLOW").length;
        const denied = allLogs.filter(l => l.decision === "DENY").length;
        const approvals = allLogs.filter(l => l.decision === "REQUIRE_APPROVAL").length;
        const avgRisk = allLogs.length > 0 ? Math.round(allLogs.reduce((sum, l) => sum + (l.riskScore ?? 0), 0) / allLogs.length) : 0;
        const totalCost = parseFloat(allLogs.reduce((sum, l) => sum + (l.cost_usd || 0), 0).toFixed(6));

        return NextResponse.json({
            logs: allLogs,
            stats: { total: allLogs.length, allowed, denied, approvals, avgRisk, totalCost }
        });
    } catch (error: any) {
        console.error("[API Audit Firestore] Error:", error);
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
