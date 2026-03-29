// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from "@/lib/db_sql";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Ensure table exists (Self-healing schema)
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
    let effectiveTenantId = tenantId;
    try {
        const { getAdminDb } = require('@/lib/firebase-admin');
        const db = getAdminDb();
        const userDoc = await db.collection("users").doc(tenantId).get();
        if (userDoc.exists && userDoc.data()?.tenantId) {
            effectiveTenantId = userDoc.data().tenantId;
        }
    } catch (e) {
        // Fallback to the provided tenantId (UID)
    }

    // Query Postgres directly
    let query = "SELECT * FROM audit_logs WHERE tenantid = $1";
    const params: any[] = [effectiveTenantId];

    if (agentId && agentId !== "ALL") {
        params.push(agentId);
        query += ` AND agentid = $${params.length}`;
    }
    
    query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limitParam);

    const result = await pool.query(query, params);
    const rows = result.rows || [];

    // Map to common dashboard format
    const logs = rows.map((row: any) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        return {
            id: row.id,
            agentId: row.agentid,
            agentid: row.agentid, // UI consistency
            toolName: row.toolname,
            toolname: row.toolname, // UI consistency
            decision: row.decision,
            reason: row.reason || metadata.reason || null,
            cost_usd: row.cost_usd || 0,
            riskScore: row.riskscore ?? null,
            timestamp: row.timestamp || null,
            createdAt: row.timestamp || null,
            arguments: row.parameters ? (typeof row.parameters === 'string' ? row.parameters : JSON.stringify(row.parameters)) : "{}",
            sessionId: metadata.sessionId || null,
            is_loop: metadata.isLoop || false,
            agentRole: metadata.agentRole || null,
            integrityHash: metadata.integrityHash || null,
            // Layer 2 Fields
            semanticScore: metadata.semanticScore ?? null,
            anomalyScore: metadata.anomalyScore ?? null,
            semanticDecision: metadata.semanticDecision ?? null,
            semanticLatencyMs: metadata.semanticLatencyMs ?? null,
        };
    });

    return NextResponse.json(logs);

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}


