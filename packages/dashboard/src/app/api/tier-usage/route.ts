// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/tier-usage?tenantId=<id>
 * Returns the current tenant tier and usage metrics for the dashboard.
 */
export async function GET(req: NextRequest) {
    const tenantId = req.nextUrl.searchParams.get('tenantId');
    if (!tenantId) {
        return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 });
    }

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

        const tier = tierRes.ok ? (await tierRes.json()).tier ?? 'free' : 'free';
        const agents = agentRes.ok ? await agentRes.json() : [];
        const secrets = vaultRes.ok ? await vaultRes.json() : [];
        const stats = opsRes.ok ? await opsRes.json() : {};

        const tierLimits: Record<string, any> = {
            free:       { maxAgents: 3, maxVaultSecrets: 5, auditRetentionDays: 7, maxOpsPerMonth: 10_000 },
            cloud:      { maxAgents: Infinity, maxVaultSecrets: Infinity, auditRetentionDays: 365, maxOpsPerMonth: Infinity },
            enterprise: { maxAgents: Infinity, maxVaultSecrets: Infinity, auditRetentionDays: 2555, maxOpsPerMonth: Infinity },
        };

        return NextResponse.json({
            tier,
            limits: tierLimits[tier] || tierLimits.free,
            usage: {
                agents: Array.isArray(agents) ? agents.length : 0,
                vaultSecrets: Array.isArray(secrets) ? secrets.length : 0,
                opsThisMonth: stats.opsThisMonth ?? null,
            },
            upgradeUrl: tier === 'free' ? 'https://www.supra-wall.com/pricing' : null,
        });
    } catch (err: any) {
        console.error('[TierUsage] Error:', err);
        return NextResponse.json({ tier: 'free', limits: {}, usage: {}, upgradeUrl: 'https://www.supra-wall.com/pricing' });
    }
}
