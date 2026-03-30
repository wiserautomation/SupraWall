// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db_sql";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); // maps to tenantId in server
        const agentId = searchParams.get("agentId");
        const decision = searchParams.get("decision");
        const search = searchParams.get("search");
        const limitParam = parseInt(searchParams.get("limit") || "100", 10);

        if (!userId) {
            return NextResponse.json({ error: "userId (tenantId) is required" }, { status: 400 });
        }

        console.log(`[AuditDB] Fetching logs directly for UID: ${userId}`);
        
        // Ensure table exists (new migrations)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                tenantid VARCHAR(255) NOT NULL,
                agentid VARCHAR(255),
                toolname VARCHAR(255),
                decision VARCHAR(50),
                riskscore INTEGER,
                cost_usd FLOAT DEFAULT 0,
                reason TEXT,
                arguments TEXT,
                timestamp TIMESTAMP DEFAULT NOW(),
                parameters JSONB,
                metadata JSONB
            );
        `);
        
        // 1. Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
        let mappedTenantId = userId;
        try {
            const { getAdminDb } = require("@/lib/firebase-admin");
            const dbRef = getAdminDb();
            const userDoc = await dbRef.collection("users").doc(userId).get().catch(() => null);
            if (userDoc && userDoc.exists && userDoc.data()?.tenantId) {
                mappedTenantId = userDoc.data().tenantId;
            }
        } catch (e) {
            console.warn("[IdentityMapping] Firebase lookup failed for audit:", e);
        }

        console.log(`[AuditDB] Fetching logs with identity mapping: ${userId} -> ${mappedTenantId}`);
        
        // Build base query
        let query = "SELECT * FROM audit_logs WHERE (tenantid = $1 OR tenantid = $2)";
        const params: any[] = [userId, mappedTenantId];

        if (agentId && agentId !== "ALL") {
            params.push(agentId);
            query += ` AND agentid = $${params.length}`;
        }
        
        if (decision && decision !== "ALL") {
            query += " AND decision = $" + (params.length + 1);
            // Ensure uppercase for canonical SDK decisions
            params.push(decision.toUpperCase());
        }
        
        query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
        params.push(limitParam);

        const result = await pool.query(query, params);
        const rows = result.rows || [];

        // 3. Post-fetch filters and mapping
        let logs = rows.map((row: any) => {
            // Map Postgres metadata to top-level fields if they exist
            const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
            
            return {
                id: row.id,
                agentid: row.agentid, // For Monitoring UI
                agentId: row.agentid, // For Audit UI
                agentName: metadata.agentName || "Agent " + row.agentid,
                toolName: row.toolname,
                toolname: row.toolname, // Consistency
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
    } catch (error: any) {
        console.error("Forensic audit query failed:", error);
        return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
    }
}
