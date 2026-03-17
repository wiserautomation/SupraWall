import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Ensure the tables are initialized (though normally done via migration/schema script)
    // For now, we assume tables are already created.

    const result = await query("SELECT * FROM tenants WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      // Return empty settings for new tenant
      return NextResponse.json({});
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error("[API Tenants GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const fields = body;
    const keys = Object.keys(fields);
    
    if (keys.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const sets = keys.map((key, i) => `${key} = $${i + 2}`);
    const values = Object.values(fields);

    await query(
      `INSERT INTO tenants (id, ${keys.join(", ")}) 
       VALUES ($1, ${values.map((_, i) => `$${i + 2}`).join(", ")})
       ON CONFLICT (id) DO UPDATE SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP`,
      [id, ...values]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API Tenants POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
