import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    const result = await query(
      "SELECT * FROM policies WHERE tenantid = $1 OR tenantid = 'global' ORDER BY id DESC",
      [tenantId]
    );
    
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("[API Policies GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, name, toolName, ruleType, description } = body;

    if (!tenantId || !name || !ruleType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await query(
      "INSERT INTO policies (tenantid, name, toolname, ruletype, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [tenantId, name, toolName, ruleType, description || '']
    );

    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error("[API Policies POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
