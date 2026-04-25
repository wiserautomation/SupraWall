// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool, ensureSchema } from '@/lib/db_sql';
import { getAdminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS_RAW = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
const ADMIN_EMAILS = ADMIN_EMAILS_RAW.length > 0 ? ADMIN_EMAILS_RAW : [];

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    let decodedToken: { email?: string };
    try {
        decodedToken = await getAdminAuth().verifyIdToken(token);
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!decodedToken.email || !ADMIN_EMAILS.includes(decodedToken.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await ensureSchema();
        
        const pgResult = await pool.query(
            `SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100`
        );
        
        const logs = pgResult.rows.map((row: any) => ({
            id: row.id,
            userId: row.tenantid,
            agentId: row.agentid,
            toolName: row.toolname,
            decision: row.decision,
            timestamp: row.timestamp,
            source: 'postgres'
        }));

        return NextResponse.json(logs);
    } catch (err: any) {
        console.error('[Admin Audit API] Fetch failed:', err.message);
        return NextResponse.json({ warnings: ['Failed to fetch global audit logs from Postgres: ' + err.message] });
    }
}
