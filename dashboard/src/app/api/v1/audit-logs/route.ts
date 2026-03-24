import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const db = getAdminDb();
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    let firestoreQuery: any = db.collection('audit_logs');
    
    if (agentId) {
      firestoreQuery = firestoreQuery.where('agentId', '==', agentId);
    } else {
      // Get all agents for this tenant to filter logs
      const agentsSnap = await db.collection('agents').where('userId', '==', tenantId).get();
      const agentIds = agentsSnap.docs.map(d => d.id);
      
      if (agentIds.length === 0) return NextResponse.json([]);
      
      // Firestore 'in' query limit is 30 in recent versions
      firestoreQuery = firestoreQuery.where('agentId', 'in', agentIds.slice(0, 30));
    }

    const snapshot = await firestoreQuery
      .limit(limit)
      .get();

    const logs = snapshot.docs.map((doc: any) => {
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
    });

    // Sort in-memory to avoid mandatory composite index errors in new projects
    logs.sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp || 0).getTime();
        const dateB = new Date(b.timestamp || 0).getTime();
        return dateB - dateA;
    });

    return NextResponse.json(logs);

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
