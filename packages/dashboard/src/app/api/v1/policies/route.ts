// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export async function GET(request: NextRequest) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  const db = getAdminDb();
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');

    let firestoreQuery: any = db.collection("policies");

    if (agentId) {
      // Verify the agent belongs to the authenticated user before filtering
      const agentSnap = await db.collection("agents").doc(agentId).get();
      if (!agentSnap.exists || agentSnap.data()?.userId !== userId) {
        return apiError.forbidden();
      }
      firestoreQuery = firestoreQuery.where("agentId", "==", agentId);
    } else if (tenantId) {
      if (tenantId !== userId) return apiError.forbidden();
      firestoreQuery = firestoreQuery.where("tenantId", "==", tenantId);
    } else {
      return NextResponse.json({ error: "Missing tenantId or agentId" }, { status: 400 });
    }

    const snapshot = await firestoreQuery.get();
    const policies = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(policies);
  } catch (err: any) {
    console.error("[API Policies GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  const db = getAdminDb();
  try {
    const body = await request.json();
    const { tenantId, name, toolName, ruleType, description, condition, agentId, priority, isDryRun } = body;

    if (!tenantId || !name || !ruleType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (tenantId !== userId) return apiError.forbidden();

    const policyDoc = {
      tenantId,
      agentId: agentId || null,
      name,
      toolName: toolName || '',
      ruleType,
      description: description || '',
      condition: condition || '',
      priority: typeof priority === 'number' ? priority : 100,
      isDryRun: isDryRun === true,
      createdAt: new Date()
    };

    const ref = await db.collection("policies").add(policyDoc);
    return NextResponse.json({ id: ref.id, ...policyDoc });
  } catch (err: any) {
    console.error("[API Policies POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
