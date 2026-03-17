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
      "SELECT * FROM agents WHERE tenantid = $1 ORDER BY createdat DESC",
      [tenantId]
    );
    
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("[API Agents GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
