import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';
import { getAdminDb } from '@/lib/firebase-admin';

const db = getAdminDb();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Attempt SQL Query if configured
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (connectionString) {
      try {
        let sql = "SELECT * FROM audit_logs WHERE tenantid = $1";
        const params: any[] = [tenantId];

        if (agentId) {
          sql += " AND agentid = $2";
          params.push(agentId);
        }

        sql += " ORDER BY timestamp DESC LIMIT $ " + (params.length + 1);
        params.push(limit);

        const result = await query(sql, params);
        if (result.rows && result.rows.length > 0) {
          return NextResponse.json(result.rows);
        }
      } catch (sqlErr) {
        console.warn("[API Audit Logs] SQL Query failed, falling back to Firestore:", sqlErr);
      }
    }

    // Fallback: Firestore Audit Logs
    // Note: Evaluate logs to 'audit_logs' or 'connect_events'
    let firestoreQuery: any = db.collection('audit_logs');
    
    // If agentId is provided, filter by it. 
    // Otherwise, we might need to filter by tenantId (userId)
    // In Evaluate's logAudit, we only pass agentId. 
    // We might need to find all agents for this tenant first.
    
    if (agentId) {
      firestoreQuery = firestoreQuery.where('agentId', '==', agentId);
    } else {
      // Get all agents for this tenant to filter logs
      const agentsSnap = await db.collection('agents').where('userId', '==', tenantId).get();
      const agentIds = agentsSnap.docs.map(d => d.id);
      
      if (agentIds.length === 0) return NextResponse.json([]);
      
      // Firestore 'in' query limit is 10/30 depending on version, but let's assume small count for now or just filter by first few
      firestoreQuery = firestoreQuery.where('agentId', 'in', agentIds.slice(0, 30));
    }

    const snapshot = await firestoreQuery
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const logs = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
    }));

    return NextResponse.json(logs);

  } catch (err: any) {
    console.error("[API Audit Logs GET] Fatal Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
