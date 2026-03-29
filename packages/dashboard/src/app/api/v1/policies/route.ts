// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const db = getAdminDb();
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    
    let firestoreQuery: any = db.collection("policies");
    
    if (agentId) {
      firestoreQuery = firestoreQuery.where("agentId", "==", agentId);
    } else if (tenantId) {
        // Find policies for all agents of this tenant or global
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
    const db = getAdminDb();
  try {
    const body = await request.json();
    const { tenantId, name, toolName, ruleType, description, condition, agentId, priority, isDryRun } = body;

    if (!tenantId || !name || !ruleType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
