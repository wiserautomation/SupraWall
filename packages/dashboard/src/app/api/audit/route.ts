// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const agentId = searchParams.get("agentId");
        const decision = searchParams.get("decision");
        const search = searchParams.get("search");
        const riskMin = searchParams.get("riskMin");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const limitParam = parseInt(searchParams.get("limit") || "100");
        const format = searchParams.get("format") || "json"; // json | csv

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // 1. Get user's agent IDs
        const agentsSnap = await getAdminDb()
            .collection("agents")
            .where("userId", "==", userId)
            .get();

        if (agentsSnap.empty) {
            if (format === "csv") {
                return new Response("No agents found", { status: 200, headers: { "Content-Type": "text/csv" } });
            }
            return NextResponse.json({ logs: [], stats: { total: 0, allowed: 0, denied: 0, avgRisk: 0 } });
        }

        let targetAgentIds = agentsSnap.docs.map((d) => d.id);

        // Filter by specific agent if provided
        if (agentId && targetAgentIds.includes(agentId)) {
            targetAgentIds = [agentId];
        }

        // Firestore `in` limit is 30
        const idsSlice = targetAgentIds.slice(0, 30);

        // 2. Build query
        let logsQuery = getAdminDb()
            .collection("auditLogs")
            .where("agentId", "in", idsSlice)
            .orderBy("timestamp", "desc")
            .limit(Math.min(limitParam, 1000));

        // Decision filter
        if (decision && ["ALLOW", "DENY", "REQUIRE_APPROVAL"].includes(decision)) {
            logsQuery = getAdminDb()
                .collection("auditLogs")
                .where("agentId", "in", idsSlice)
                .where("decision", "==", decision)
                .orderBy("timestamp", "desc")
                .limit(Math.min(limitParam, 1000));
        }

        const logsSnap = await logsQuery.get();

        // 3. Post-fetch filters (Firestore can't do text search or range on multiple fields easily)
        const agentMap = new Map(agentsSnap.docs.map((d) => [d.id, d.data().name || "Unknown"]));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let logs = logsSnap.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                agentId: data.agentId,
                agentName: agentMap.get(data.agentId) || "Unknown",
                toolName: data.toolName,
                arguments: data.arguments,
                decision: data.decision,
                reason: data.reason || null,
                sessionId: data.sessionId || null,
                agentRole: data.agentRole || null,
                cost_usd: data.cost_usd || 0,
                riskScore: data.riskScore ?? null,
                riskFactors: data.riskFactors || [],
                integrityHash: data.integrityHash || null,
                previousHash: data.previousHash || null,
                sequenceNumber: data.sequenceNumber ?? null,
                isLoop: data.is_loop || false,
                timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
            };
        });

        // Text search filter (client-side)
        if (search) {
            const q = search.toLowerCase();
            logs = logs.filter(
                (l) =>
                    l.toolName.toLowerCase().includes(q) ||
                    l.agentName.toLowerCase().includes(q) ||
                    (l.arguments || "").toLowerCase().includes(q) ||
                    (l.reason || "").toLowerCase().includes(q)
            );
        }

        // Risk min filter
        if (riskMin) {
            const minScore = parseInt(riskMin);
            logs = logs.filter((l) => (l.riskScore ?? 0) >= minScore);
        }

        // Date range filters
        if (dateFrom) {
            const from = new Date(dateFrom);
            logs = logs.filter((l) => l.timestamp && new Date(l.timestamp) >= from);
        }
        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            logs = logs.filter((l) => l.timestamp && new Date(l.timestamp) <= to);
        }

        // 4. Compute stats
        const stats = {
            total: logs.length,
            allowed: logs.filter((l) => l.decision === "ALLOW").length,
            denied: logs.filter((l) => l.decision === "DENY").length,
            approvals: logs.filter((l) => l.decision === "REQUIRE_APPROVAL").length,
            avgRisk: logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + (l.riskScore ?? 0), 0) / logs.length) : 0,
            highRisk: logs.filter((l) => (l.riskScore ?? 0) >= 70).length,
            totalCost: parseFloat(logs.reduce((sum, l) => sum + (l.cost_usd || 0), 0).toFixed(6)),
        };

        // 5. CSV export
        if (format === "csv") {
            const header = "Timestamp,Agent,Tool,Decision,Risk Score,Cost USD,Reason,Integrity Hash,Arguments\n";
            const rows = logs
                .map(
                    (l) =>
                        `"${l.timestamp}","${l.agentName}","${l.toolName}","${l.decision}",${l.riskScore ?? ""},${l.cost_usd},"${(l.reason || "").replace(/"/g, '""')}","${l.integrityHash || ""}","${(l.arguments || "").replace(/"/g, '""').substring(0, 500)}"`
                )
                .join("\n");

            return new Response(header + rows, {
                status: 200,
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="audit_logs_${new Date().toISOString().split("T")[0]}.csv"`,
                },
            });
        }

        return NextResponse.json({ logs, stats });
    } catch (error) {
        console.error("Forensic audit query failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
