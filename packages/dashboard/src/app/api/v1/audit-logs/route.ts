// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/firebase-admin";

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

    let query = db.collection("audit_logs");
    
    if (agentId) {
        // Query specific agent
        const logsSnap = await query.where("agentId", "==", agentId)
                                    .orderBy("timestamp", "desc")
                                    .limit(limitParam)
                                    .get();
        
        const logs = logsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                agentId: data.agentId,
                toolName: data.toolName,
                decision: data.decision,
                reason: data.reason || null,
                cost_usd: data.cost_usd || 0,
                riskScore: data.riskScore ?? null,
                timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
                createdAt: data.timestamp?.toDate?.()?.toISOString() || null,
                arguments: typeof data.arguments === 'string' ? data.arguments : JSON.stringify(data.arguments || {}),
                sessionId: data.sessionId || null,
                is_loop: data.is_loop || false,
                agentRole: data.agentRole || null,
            };
        });

        logs.sort((a, b) => {
            const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return tb - ta;
        });

        return NextResponse.json(logs);
    } else {
        // Step 1: Get the user's agent IDs (both regular and platform keys)
        const agentsSnap = await db.collection("agents").where("userId", "==", tenantId).get();
        const agentIds = agentsSnap.docs.map(doc => doc.id);

        const platformsSnap = await db.collection("platforms").where("ownerId", "==", tenantId).get();
        for (const pDoc of platformsSnap.docs) {
            const keysSnap = await db.collection("connect_keys").where("platformId", "==", pDoc.id).get();
            keysSnap.docs.forEach(kDoc => agentIds.push(kDoc.id));
        }

        if (agentIds.length === 0) {
            return NextResponse.json([]);
        }

        let allLogs: any[] = [];
        // Fetch latest logs for each agent individually to use native single-field + orderBy index
        const logQueries = agentIds.map(id => 
            db.collection("audit_logs")
              .where("agentId", "==", id)
              .orderBy("timestamp", "desc")
              .limit(50)
              .get()
        );

        const queryResults = await Promise.all(logQueries);
        
        for (const logsSnap of queryResults) {
            for (const doc of logsSnap.docs) {
                const data = doc.data();
                allLogs.push({
                    id: doc.id,
                    agentId: data.agentId,
                    toolName: data.toolName,
                    decision: data.decision,
                    reason: data.reason || null,
                    cost_usd: data.cost_usd || 0,
                    riskScore: data.riskScore ?? null,
                    timestamp: data.timestamp?.toDate?.()?.toISOString() || null,
                    createdAt: data.timestamp?.toDate?.()?.toISOString() || null,
                    arguments: typeof data.arguments === 'string' ? data.arguments : JSON.stringify(data.arguments || {}),
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

        return NextResponse.json(allLogs.slice(0, limitParam));
    }

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
