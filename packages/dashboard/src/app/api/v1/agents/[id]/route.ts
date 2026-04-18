import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireDashboardAuth } from '@/lib/api-guard';
import { apiError } from '@/lib/api-errors';
import { pool } from '@/lib/db_sql';
import { getEffectiveTenantId } from '@/lib/user';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  try {
    const { id } = await params;
    const effectiveTenantId = await getEffectiveTenantId(userId);

    console.log(`[API Agent GET] Fetching agent detail: ${id}`);

    // 1. Try PostgreSQL (Modern)
    const pgResult = await pool.query(
        "SELECT * FROM agents WHERE id = $1",
        [id]
    );

    if (pgResult.rowCount && pgResult.rowCount > 0) {
        const row = pgResult.rows[0];
        // Authorization check
        if (row.tenantid !== userId && row.tenantid !== effectiveTenantId) {
            return apiError.forbidden();
        }
        return NextResponse.json({
            id: row.id,
            name: row.name,
            tenantId: row.tenantid,
            status: row.status,
            createdAt: row.createdat,
            scopes: row.scopes,
            max_cost_usd: row.max_cost_usd,
            budget_alert_usd: row.budget_alert_usd,
            max_iterations: row.max_iterations,
            loop_detection: row.loop_detection,
            source: 'postgres'
        });
    }

    // 2. Try Firestore (Legacy)
    const db = getAdminDb();
    const docRef = db.collection("agents").doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        const data = docSnap.data();
        const agentOwnerId = data?.userId || data?.tenantId;
        
        // Authorization check
        if (agentOwnerId !== userId && agentOwnerId !== effectiveTenantId) {
            return apiError.forbidden();
        }

        const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
            if (value && typeof value === 'object' && '_seconds' in value) {
                return new Date(value._seconds * 1000).toISOString();
            }
            return value;
        }));

        return NextResponse.json({
            id: docSnap.id,
            ...sanitized,
            source: 'firestore'
        });
    }

    console.warn(`[API Agent GET] Agent not found in any backend: ${id}`);
    return apiError.notFound("Agent");

  } catch (err: any) {
    console.error("[API Agent GET] Error:", err);
    return apiError.internal();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;

  const db = getAdminDb();
  try {
    const { id } = await params;
    const body = await request.json();

    console.log(`[API Agent PATCH] Updating agent: ${id}`, body);
    const docRef = db.collection("agents").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return apiError.notFound("Agent");
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (body.name) updateData.name = body.name;
    if (body.status) updateData.status = body.status;
    if (body.scopes) updateData.scopes = body.scopes;
    if (body.apiKey) updateData.apiKey = body.apiKey;

    // Budget & safety config
    if ("max_cost_usd" in body) updateData.max_cost_usd = body.max_cost_usd;
    if ("budget_alert_usd" in body) updateData.budget_alert_usd = body.budget_alert_usd;
    if ("max_iterations" in body) updateData.max_iterations = body.max_iterations;
    if ("loop_detection" in body) updateData.loop_detection = body.loop_detection;
    if ("complianceConfig" in body) updateData.complianceConfig = body.complianceConfig;

    await docRef.update(updateData);

    const updatedSnap = await docRef.get();
    const data = updatedSnap.data();

    return NextResponse.json({
      id: updatedSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt
    });
  } catch (err: any) {
    console.error("[API Agent PATCH] Error:", err);
    return apiError.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;

  const db = getAdminDb();
  try {
    const { id } = await params;
    console.log(`[API Agent DELETE] Deleting agent: ${id}`);
    await db.collection("agents").doc(id).delete();
    return NextResponse.json({ message: "Agent deleted successfully" });
  } catch (err: any) {
    console.error("[API Agent DELETE] Error:", err);
    return apiError.internal();
  }
}
