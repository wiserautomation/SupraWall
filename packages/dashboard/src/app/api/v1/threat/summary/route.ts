// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // --- Mock Aggregation based on event counts for the dashboard ---
    const snapshot = await db.collection("threat_events")
      .where("tenantId", "==", tenantId)
      .limit(100)
      .get();

    const entityMap: Record<string, { entity_id: string; total_events: number; last_updated: string }> = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const entId = data.agentId || 'global';
      if (!entityMap[entId]) {
        entityMap[entId] = {
          entity_id: entId,
          total_events: 1,
          last_updated: data.timestamp?._seconds ? new Date(data.timestamp._seconds * 1000).toISOString() : new Date().toISOString()
        };
      } else {
        entityMap[entId].total_events += 1;
      }
    });

    const summaries = Object.values(entityMap).map((ent, idx) => ({
      id: idx,
      ...ent,
      entity_type: "agent",
      threat_score: Math.min(ent.total_events * 25, 100), // Simple mock score rule
    })).sort((a, b) => b.threat_score - a.threat_score);

    return NextResponse.json(summaries);
  } catch (err: any) {
    console.error("[API Threat Summary GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
