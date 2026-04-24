// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool } from "@/lib/db_sql";
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';
import { db as firestore } from '@/lib/firebase-admin';
import { getEffectiveTenantId } from '@/lib/user';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Authenticate request
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    const tenantId = await getEffectiveTenantId(userId);

    // 1. Fetch from PostgreSQL (Source of Truth for new logs)
    let pgQuery = "SELECT * FROM audit_logs WHERE (tenantid = $1 OR tenantid = $2)";
    const pgParams: any[] = [userId, tenantId];

    if (agentId && agentId !== "ALL") {
        pgParams.push(agentId);
        pgQuery += ` AND agentid = $${pgParams.length}`;
    }
    
    pgQuery += ` ORDER BY timestamp DESC LIMIT $${pgParams.length + 1}`;
    pgParams.push(limitParam);

    const pgResult = await pool.query(pgQuery, pgParams);
    const pgRows = pgResult.rows || [];

    // 2. Fetch from Firestore (Legacy logs)
    let fsRows: any[] = [];
    try {
        const queryIds = Array.from(new Set([userId, tenantId]));
        let fsQuery = firestore.collection("audit_logs")
            .where("userId", "in", queryIds);
            
        if (agentId && agentId !== "ALL") {
            fsQuery = fsQuery.where("agentId", "==", agentId);
        }
        
        const fsSnap = await fsQuery.orderBy("timestamp", "desc").limit(limitParam).get();
        fsRows = fsSnap.docs.map(doc => {
            const data = doc.data();
            const ts = data.timestamp || data.createdAt;
            return {
                id: doc.id,
                agentid: data.agentId,
                toolname: data.toolName,
                decision: data.decision,
                reason: data.reason,
                cost_usd: data.cost_usd || 0,
                timestamp: ts?.toDate?.() || ts,
                metadata: data.metadata || {},
                source: 'firestore'
            };
        });
    } catch (e) {
        console.warn("[API Audit Logs GET] Legacy Firestore fetch failed:", e);
    }

    const allRows = [...pgRows, ...fsRows].sort((a, b) => {
        const tA = new Date(a.timestamp || a.createdAt || 0).getTime();
        const tB = new Date(b.timestamp || b.createdAt || 0).getTime();
        return tB - tA;
    }).slice(0, limitParam);

    const logs = allRows.map((row: any) => {
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
            createdAt: row.timestamp || row.createdAt || null,
            arguments: row.parameters ? (typeof row.parameters === 'string' ? row.parameters : JSON.stringify(row.parameters)) : (metadata.arguments ? JSON.stringify(metadata.arguments) : "{}"),
            sessionId: metadata.sessionId || null,
            is_loop: metadata.isLoop || false,
            agentRole: metadata.agentRole || null,
            integrityHash: metadata.integrityHash || null,
            source: row.source || 'postgres'
        };
    });

    return NextResponse.json(logs);

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


