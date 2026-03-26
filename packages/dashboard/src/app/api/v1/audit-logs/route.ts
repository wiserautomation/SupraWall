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
                                    .limit(limitParam)
                                    .get(); // Note: no orderBy to avoid index errors, sort in memory
        
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
        // If no agentId, just return empty list to prevent unindexed queries over ALL logs
        return NextResponse.json([]);
    }

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
