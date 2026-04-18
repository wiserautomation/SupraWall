// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from '@/lib/db_sql';
import { requireDashboardAuth } from '@/lib/api-guard';
import { getEffectiveTenantId } from '@/lib/user';
import { apiError } from '@/lib/api-errors';

/**
 * DELETE /api/v1/members/[id] — Remove a team member
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get('tenantId') || userId;

        if (tenantId !== userId) {
            const effectiveTenantId = await getEffectiveTenantId(userId);
            if (tenantId !== effectiveTenantId) {
                return apiError.forbidden();
            }
        }

        await ensureSchema();

        const result = await pool.query(
            `UPDATE organization_members SET status = 'removed' WHERE id = $1 AND tenant_id = $2 RETURNING id`,
            [id, tenantId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Member removed' });
    } catch (error: any) {
        console.error('[API Members DELETE] Error:', error);
        return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
    }
}
