// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireDashboardAuth } from '@/lib/api-guard';

// GET /api/tasks/pending - Fetch approved or revision tasks for orchestrator
export async function GET(req: NextRequest) {
    const guard = await requireDashboardAuth(req);
    if (guard instanceof NextResponse) return guard;

    try {
        const db = getAdminDb();

        const snapshot = await db.collection('tasks')
            .where('status', 'in', ['approved', 'revision'])
            .get();

        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(tasks);
    } catch (error: any) {
        console.error('Error fetching pending tasks:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
