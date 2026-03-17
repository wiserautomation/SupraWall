import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status') || 'PENDING';
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    const result = await query(
      "SELECT * FROM approval_requests WHERE tenantid = $1 AND status = $2 ORDER BY created_at DESC",
      [tenantId, status]
    );
    
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("[API Approvals GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantid, agentid, toolname, parameters, metadata } = body;

    if (!tenantid || !agentid || !toolname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO approval_requests (tenantid, agentid, toolname, parameters, metadata) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [tenantid, agentid, toolname, JSON.stringify(parameters), JSON.stringify(metadata)]
    );

    return NextResponse.json({ id: result.rows[0].id });
  } catch (err: any) {
    console.error("[API Approvals POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
