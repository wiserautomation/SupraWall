// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

/**
 * GET /api/tier-usage?tenantId=<id>
 * Returns the current tenant tier and usage metrics for the dashboard.
 */
export async function GET(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    const tenantId = req.nextUrl.searchParams.get('tenantId');
    if (!tenantId) {
        return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 });
    }

    if (tenantId !== userId) return apiError.forbidden();

    const serverUrl = process.env.SUPRAWALL_API_URL || 'http://localhost:3000';

    try {
        // Fetch tier info from the server
        const [tierRes, agentRes, vaultRes, opsRes] = await Promise.all([
            fetch(`${serverUrl}/v1/tenants/${tenantId}`, { cache: 'no-store' }),
            fetch(`${serverUrl}/v1/agents?tenantId=${tenantId}`, {
                headers: { Authorization: `Bearer ${process.env.SUPRAWALL_MASTER_KEY}` },
                cache: 'no-store',
            }),
            fetch(`${serverUrl}/v1/vault/secrets?tenantId=${tenantId}`, { cache: 'no-store' }),
            fetch(`${serverUrl}/v1/stats?tenantId=${tenantId}`, { cache: 'no-store' }),
        ]);

        let tier = tierRes.ok ? (await tierRes.json()).tier ?? 'open_source' : 'open_source';
        // Handle legacy tier names
        if (tier === 'free') tier = 'open_source';
        if (tier === 'starter') tier = 'developer';
        if (tier === 'growth') tier = 'team';

        const agents = agentRes.ok ? await agentRes.json() : [];
        const secrets = vaultRes.ok ? await vaultRes.json() : [];
        const stats = opsRes.ok ? await opsRes.json() : {};

        const tierLimits: Record<string, any> = {
            open_source: { maxAgents: 2, maxVaultSecrets: 3, auditRetentionDays: 3, maxEvaluationsPerMonth: 5_000 },
            developer:   { maxAgents: 5, maxVaultSecrets: 15, auditRetentionDays: 30, maxEvaluationsPerMonth: 25_000 },
            team:        { maxAgents: 25, maxVaultSecrets: 100, auditRetentionDays: 90, maxEvaluationsPerMonth: 250_000 },
            business:    { maxAgents: Infinity, maxVaultSecrets: Infinity, auditRetentionDays: 365, maxEvaluationsPerMonth: 2_000_000 },
            enterprise:  { maxAgents: Infinity, maxVaultSecrets: Infinity, auditRetentionDays: 2555, maxEvaluationsPerMonth: Infinity },
        };

        return NextResponse.json({
            tier,
            limits: tierLimits[tier] || tierLimits.open_source,
            usage: {
                agents: Array.isArray(agents) ? agents.length : 0,
                vaultSecrets: Array.isArray(secrets) ? secrets.length : 0,
                opsThisMonth: stats.opsThisMonth ?? null,
            },
            upgradeUrl: tier === 'open_source' ? 'https://www.supra-wall.com/pricing' : null,
        });
    } catch (err: any) {
        console.error('[TierUsage] Error:', err);
        return NextResponse.json({ tier: 'open_source', limits: {}, usage: {}, upgradeUrl: 'https://www.supra-wall.com/pricing' });
    }
}
