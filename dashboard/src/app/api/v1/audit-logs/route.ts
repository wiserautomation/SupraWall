import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const agentId = searchParams.get('agentId');
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    let sql = "SELECT * FROM audit_logs WHERE tenantid = $1";
    const params: any[] = [tenantId];

    if (agentId) {
      sql += " AND agentid = $2";
      params.push(agentId);
    }

    sql += " ORDER BY timestamp DESC LIMIT 100";

    const result = await query(sql, params);
    
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("[API Audit Logs GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
