// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { checkResourceLimit } from '@/lib/tier-enforcement';
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Authenticate and derive tenantId from token
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const snapshot = await db.collection("agents")
      .where("userId", "==", userId)
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
    // SECURITY: Authenticate and derive tenantId from token
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const body = await request.json();
    const { name, apiKey, scopes } = body;

    if (!name || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Tier Enforcement: Agent Count ---
    const { allowed, count, limit } = await checkResourceLimit(userId, 'agents', 'userId');

    if (!allowed) {
        return NextResponse.json({
            error: `Agent limit reached (${count}/${limit}). Upgrade your plan to create more agents.`,
            code: "TIER_LIMIT_EXCEEDED"
        }, { status: 403 });
    }

    const agentDoc = {
      name,
      userId,
      tenantId: userId,
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
    // SECURITY: Authenticate and derive tenantId from token
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    // SECURITY: Removed ?all=true global delete. Only tenant-scoped delete allowed.
    const snapshot = await db.collection("agents").where("userId", "==", userId).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({ message: `Successfully deleted ${snapshot.docs.length} agents for tenant.` });
  } catch (err: any) {
    console.error("[API Agents DELETE] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
