// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from '@/lib/db_sql';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';
import { apiError } from '@/lib/api-errors';

/**
 * POST /api/v1/members/invite — Invite a new team member
 */
export async function POST(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { tenantId, email, role } = await request.json();

        const resolvedTenantId = tenantId || userId;
        if (tenantId && tenantId !== userId) {
            const effectiveTenantId = await getEffectiveTenantId(userId);
            if (tenantId !== effectiveTenantId) {
                return apiError.forbidden();
            }
        }

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        await ensureSchema();

        // Check for existing invitation/member
        const existing = await pool.query(
            `SELECT id FROM organization_members WHERE tenant_id = $1 AND user_email = $2 AND status != 'removed'`,
            [resolvedTenantId, email]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { error: 'This email already has an invitation or is a member of this organization.' },
                { status: 409 }
            );
        }

        await pool.query(
            `INSERT INTO organization_members (tenant_id, user_email, role, status, invited_at)
             VALUES ($1, $2, $3, 'pending', NOW())`,
            [resolvedTenantId, email, role || 'member']
        );

        return NextResponse.json({ success: true, message: `Invite sent to ${email}` }, { status: 201 });
    } catch (error: any) {
        console.error('[API Members Invite] Error:', error);
        return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 });
    }
}
