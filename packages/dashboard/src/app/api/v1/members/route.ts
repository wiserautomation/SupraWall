// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from '@/lib/db_sql';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';
import { apiError } from '@/lib/api-errors';

/**
 * GET /api/v1/members — List organization members
 */
export async function GET(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId');

        if (!tenantId) {
            return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 });
        }

        const effectiveTenantId = await getEffectiveTenantId(userId);
        if (tenantId !== userId && tenantId !== effectiveTenantId) {
            return apiError.forbidden();
        }

        await ensureSchema();

        const result = await pool.query(
            `SELECT id, user_email, role, status, invited_at, accepted_at
             FROM organization_members WHERE tenant_id = $1 ORDER BY invited_at DESC`,
            [tenantId]
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('[API Members GET] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }
}
