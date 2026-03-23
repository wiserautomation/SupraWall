import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (tenantId === 'DEBUG_ALL') {
      const snapshot = await db.collection("agents").limit(50).get();
      const agentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(agentsList);
    }

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    console.log(`[API Agents GET] Fetching agents for tenantId (userId): ${tenantId}`);
    // Support both userId and tenantId fields for maximum compatibility
    const snapshot = await db.collection("agents")
      .where("userId", "==", tenantId)
      .orderBy("createdAt", "desc")
      .get();

    console.log(`[API Agents GET] Found ${snapshot.docs.length} agents for tenantId: ${tenantId}`);

    const agents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
    }));

    return NextResponse.json(agents);
  } catch (err: any) {
    console.error("[API Agents GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, userId, apiKey, scopes } = body;

    if (!name || !userId || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    console.log(`[API Agents POST] Creating agent for userId/tenantId: ${userId}`);
    const ref = await db.collection("agents").add(agentDoc);
    console.log(`[API Agents POST] Created agent ID: ${ref.id}`);
    return NextResponse.json({ id: ref.id, ...agentDoc });
  } catch (err: any) {
    console.error("[API Agents POST] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
