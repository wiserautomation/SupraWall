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

    const snapshot = await db.collection("agents")
      .where("userId", "==", tenantId)
      .get();

    const agents = snapshot.docs.map(doc => {
      const data = doc.data();
      const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
        if (value && typeof value === 'object' && '_seconds' in value) {
          return new Date(value._seconds * 1000).toISOString();
        }
        return value;
      }));
      return {
        id: doc.id,
        ...sanitized
      };
    }).sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    return NextResponse.json(agents);
  } catch (err: any) {
    console.error("[API Agents GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, userId, apiKey, scopes } = body;

    if (!name || !userId || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Tier Enforcement: Agent Count ---
    try {
        const countSnapshot = await db.collection("agents").where("userId", "==", userId).get();
        const currentCount = countSnapshot.size;

        // Fetch user tier from the backend server
        let maxAgents = 3; // Default free tier limit
        const serverUrl = process.env.SUPRAWALL_API_URL || 'http://localhost:3000';
        try {
            const tierRes = await fetch(`${serverUrl}/v1/tenants/${userId}`);
            if (tierRes.ok) {
                const tierData = await tierRes.json();
                if (['starter', 'growth', 'business', 'enterprise'].includes(tierData.tier)) {
                    maxAgents = Infinity;
                }
            }
        } catch (err) {
            console.warn("[Dashboard API POST Agents] Failed to fetch tier, using fallback limit:", err);
        }

        if (currentCount >= maxAgents) {
            return NextResponse.json({ 
                error: `Agent limit reached (${currentCount}/${maxAgents}). Upgrade to Business for unlimited access.`,
                code: "TIER_LIMIT_EXCEEDED"
            }, { status: 403 });
        }
    } catch (err) {
        console.error("[Dashboard API POST Agents] Count check error:", err);
        // Fail-closed/open policy choice: Here we allow if DB fails but log it.
    }

    const agentDoc = {
      name,
      userId,
      tenantId: userId, // ✅ Save BOTH for compatibility
      status: 'active',
      apiKey,
      totalCalls: 0,
      totalSpendUsd: 0,
      createdAt: new Date(),
      scopes: scopes?.length > 0 ? scopes : ["*:*"],
    };

    const ref = await db.collection("agents").add(agentDoc);
    return NextResponse.json({ id: ref.id, ...agentDoc });
  } catch (err: any) {
    console.error("[API Agents POST] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const all = searchParams.get('all') === 'true';

    if (!tenantId && !all) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (all) {
      const snapshot = await db.collection("agents").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      return NextResponse.json({ message: `Successfully deleted all ${snapshot.docs.length} agents.` });
    }

    const snapshot = await db.collection("agents").where("userId", "==", tenantId).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({ message: `Successfully deleted ${snapshot.docs.length} agents for tenant: ${tenantId}` });
  } catch (err: any) {
    console.error("[API Agents DELETE] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
