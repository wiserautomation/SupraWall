import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query("SELECT * FROM agents WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error("[API Agent GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { 
      name, 
      slack_webhook, 
      max_cost_usd, 
      budget_alert_usd, 
      max_iterations, 
      loop_detection 
    } = body;

    const result = await query(
      `UPDATE agents 
       SET name = COALESCE($1, name),
           slack_webhook = COALESCE($2, slack_webhook),
           max_cost_usd = $3,
           budget_alert_usd = $4,
           max_iterations = $5,
           loop_detection = COALESCE($6, loop_detection)
       WHERE id = $7
       RETURNING *`,
      [name, slack_webhook, max_cost_usd, budget_alert_usd, max_iterations, loop_detection, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    console.error("[API Agent PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
