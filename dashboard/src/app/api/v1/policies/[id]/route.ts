import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db_sql';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    await query(
      "DELETE FROM policies WHERE id = $1 AND tenantid = $2",
      [id, tenantId]
    );

    return NextResponse.json({ status: "deleted" });
  } catch (err: any) {
    console.error("[API Policy DELETE] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
