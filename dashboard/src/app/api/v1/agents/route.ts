import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (tenantId === 'DEBUG_ENV') {
      return NextResponse.json({
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length,
        privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 40),
      });
    }

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
      .get();

    console.log(`[API Agents GET] Found ${snapshot.docs.length} agents for tenantId: ${tenantId}`);

    const agents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
    })).sort((a: any, b: any) => {
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const all = searchParams.get('all') === 'true';

    if (!tenantId && !all) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (all) {
      console.log(`[API Agents DELETE] Resetting entire database (all agents)`);
      const snapshot = await db.collection("agents").get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      return NextResponse.json({ message: `Successfully deleted all ${snapshot.docs.length} agents.` });
    }

    console.log(`[API Agents DELETE] Deleting all agents for tenantId: ${tenantId}`);
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
