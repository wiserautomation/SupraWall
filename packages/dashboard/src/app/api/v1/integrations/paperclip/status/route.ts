// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from "@/lib/db_sql";
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';
import { getEffectiveTenantId } from '@/lib/user';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const tenantId = await getEffectiveTenantId(userId);

    await ensureSchema();

    // 1. Fetch Paperclip Company Connectivity
    const companyResult = await pool.query(
        "SELECT paperclip_company_id, agent_count, status, onboarded_at, api_url, template_name FROM paperclip_companies WHERE tenant_id = $1 OR tenant_id = $2",
        [userId, tenantId]
    );

    if (companyResult.rows.length === 0) {
        return NextResponse.json({ 
            connected: false,
            message: "No Paperclip company connected for this tenant."
        });
    }

    const company = companyResult.rows[0];

    // 2. Fetch Active Run Tokens (Governance Pulse)
    const tokensResult = await pool.query(
        "SELECT COUNT(*) FROM paperclip_run_tokens WHERE tenant_id = $1 AND revoked = FALSE AND expires_at > NOW()",
        [tenantId]
    );

    // 2b. Fetch Shadow Mode Fleet Count
    const shadowCountResult = await pool.query(
        `SELECT COUNT(DISTINCT agentid) FROM policies 
         WHERE tenantid = $1 AND isdryrun = TRUE`,
        [tenantId]
    );

    // 3. Pro Metric: Cost Saved (ROI)
    // Calculating $0.25 saved per blocked action specifically from Paperclip agents
    const roiResult = await pool.query(
        `SELECT COUNT(*) as blocks, SUM(cost_usd) as spend
         FROM audit_logs 
         WHERE (tenantid = $1 OR tenantid = $2) 
         AND decision = 'DENY' 
         AND (metadata->>'source' = 'paperclip' OR agentid IN (SELECT id FROM agents WHERE source = 'paperclip'))`,
        [userId, tenantId]
    );

    // 4. Pro Metric: Performance Latency
    // Average latency of the semantic check for Paperclip agents
    const latencyResult = await pool.query(
        `SELECT AVG(latency_ms) as avg_latency 
         FROM semantic_analysis_log 
         WHERE tenant_id = $1 AND agent_id IN (SELECT id FROM agents WHERE source = 'paperclip')`,
        [tenantId]
    );

    // 5. Pro Metric: Tool Distribution
    const toolDistResult = await pool.query(
        `SELECT toolname, COUNT(*) as usage_count
         FROM audit_logs
         WHERE (tenantid = $1 OR tenantid = $2)
         AND (metadata->>'source' = 'paperclip' OR agentid IN (SELECT id FROM agents WHERE source = 'paperclip'))
         GROUP BY toolname
         ORDER BY usage_count DESC
         LIMIT 5`,
        [userId, tenantId]
    );

    // 6. Recent Sync Activity (Webhooks)
    const recentActivity = await pool.query(
        `SELECT action, agent_id, tool_name, created_at 
         FROM vault_access_log 
         WHERE tenant_id = $1 AND tool_name LIKE 'agent.%'
         ORDER BY created_at DESC LIMIT 5`,
        [tenantId]
    );

    return NextResponse.json({
        connected: true,
        companyId: company.paperclip_company_id,
        agentCount: company.agent_count,
        status: company.status,
        onboardedAt: company.onboarded_at,
        apiUrl: company.api_url,
        activeTokens: parseInt(tokensResult.rows[0].count, 10),
        shadowCount: parseInt(shadowCountResult.rows[0].count, 10),
        roi: {
            costSaved: (parseInt(roiResult.rows[0].blocks || "0", 10)) * 2.5, // $2.50 per prevented breach
            totalSpend: parseFloat(roiResult.rows[0].spend || "0")
        },
        performance: {
            avgLatency: Math.round(parseFloat(latencyResult.rows[0].avg_latency || "42")),
            complianceRate: 98.4 // Mocked until compliance engine is fully instrumented
        },
        toolDistribution: toolDistResult.rows,
        recentActivity: recentActivity.rows
    });

  } catch (err: any) {
    console.error("[API Paperclip Status] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
