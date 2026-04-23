// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';

export async function POST(request: NextRequest) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  try {
    const { tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    if (tenantId !== userId) return apiError.forbidden();

    // Ensure all tables exist
    await ensureSchema();

    // Aggregation logic (Severity weights)
    const weights: Record<string, number> = { low: 1, medium: 5, high: 20, critical: 100 };

    // Resolve Effective Tenant ID (Dashboard UID -> mapped Tenant ID)
    const effectiveTenantId = await getEffectiveTenantId(tenantId);

    console.log(`[ThreatAggregate] Processing for tenant: ${tenantId} / ${effectiveTenantId}`);

    const eventsResult = await pool.query(
        `SELECT agentid, severity, COUNT(*) as count
         FROM threat_events
         WHERE (tenantid = $1 OR tenantid = $2) AND timestamp >= NOW() - INTERVAL '24 hours'
         GROUP BY agentid, severity`,
        [tenantId, effectiveTenantId]
    );

    let processed = 0;
    for (const row of eventsResult.rows) {
        const severity = (row.severity || 'medium').toLowerCase();
        const score = (weights[severity] || 5) * parseInt(row.count);

        await pool.query(
            `INSERT INTO threat_summaries (tenantid, entity_id, entity_type, threat_score, total_events, last_updated)
             VALUES ($1, $2, 'agent', $3, $4, NOW())
             ON CONFLICT (tenantid, entity_id, entity_type)
             DO UPDATE SET
                threat_score = EXCLUDED.threat_score, -- Reset to current window score
                total_events = threat_summaries.total_events + EXCLUDED.total_events,
                last_updated = NOW()`,
            [effectiveTenantId, row.agentid, score, parseInt(row.count)]
        );
        processed++;
    }

    return NextResponse.json({ status: "aggregated", processed });

  } catch (err: any) {
    console.error("[API Threat Aggregate POST] Error:", err);
    return NextResponse.json({ error: "Failed to aggregate scores" }, { status: 500 });
  }
}
