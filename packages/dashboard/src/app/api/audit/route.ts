// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); // maps to tenantId in server
        const agentId = searchParams.get("agentId");
        const decision = searchParams.get("decision");
        const search = searchParams.get("search");
        const limitParam = searchParams.get("limit") || "100";

        if (!userId) {
            return NextResponse.json({ error: "userId (tenantId) is required" }, { status: 400 });
        }

        const serverBaseUrl = process.env.SUPRAWALL_API_URL || "http://localhost:3000";
        const url = new URL(`${serverBaseUrl}/v1/audit-logs`);
        url.searchParams.set("tenantId", userId);
        url.searchParams.set("limit", limitParam);

        const response = await fetch(url.toString());
        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Dashboard Audit Proxy] Server returned error:", errorText);
            return NextResponse.json({ error: "Server API error", details: errorText }, { status: response.status });
        }

        const data = await response.json();
        const rows = data.rows || [];

        // 3. Post-fetch filters and mapping
        let logs = rows.map((row: any) => {
            // Map Postgres metadata to top-level fields if they exist
            const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
            
            return {
                id: row.id,
                agentId: row.agentid,
                agentName: metadata.agentName || "Agent " + row.agentid,
                toolName: row.toolname,
                arguments: row.parameters ? (typeof row.parameters === 'string' ? row.parameters : JSON.stringify(row.parameters)) : "{}",
                decision: row.decision,
                reason: row.reason || metadata.reason || null,
                cost_usd: row.cost_usd || 0,
                riskScore: row.riskscore ?? null,
                timestamp: row.timestamp || null,
                createdAt: row.timestamp || null, // UI compatibility
                // Forensic fields (might be in metadata or missing in Postgres for now)
                integrityHash: metadata.integrityHash || null,
                previousHash: metadata.previousHash || null,
                sequenceNumber: metadata.sequenceNumber ?? null,
                isLoop: metadata.isLoop || false,
                metadata: metadata
            };
        });

        // Agent ID filter
        if (agentId && agentId !== "ALL") {
            logs = logs.filter((l: any) => l.agentId === agentId);
        }

        // Decision filter
        if (decision && decision !== "ALL") {
            logs = logs.filter((l: any) => l.decision === decision);
        }

        // Text search filter (client-side)
        if (search) {
            const q = search.toLowerCase();
            logs = logs.filter(
                (l: any) =>
                    l.toolName.toLowerCase().includes(q) ||
                    l.agentName.toLowerCase().includes(q) ||
                    (l.arguments || "").toLowerCase().includes(q) ||
                    (l.reason || "").toLowerCase().includes(q)
            );
        }

        return NextResponse.json({ 
            logs, 
            stats: { 
                total: logs.length, 
                allowed: logs.filter((l: any) => l.decision === "ALLOW").length, 
                denied: logs.filter((l: any) => l.decision === "DENY").length,
                approvals: logs.filter((l: any) => l.decision === "REQUIRE_APPROVAL").length,
                avgRisk: logs.length > 0 ? Math.round(logs.reduce((sum: number, l: any) => sum + (l.riskScore ?? 0), 0) / logs.length) : 0,
                totalCost: parseFloat(logs.reduce((sum: number, l: any) => sum + (l.cost_usd || 0), 0).toFixed(6)),
            } 
        });
    } catch (error) {
        console.error("Forensic audit query failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
