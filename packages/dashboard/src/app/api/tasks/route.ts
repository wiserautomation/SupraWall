// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { admin } from '@/lib/firebase-admin';

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = getAdminDb();

        const taskData = {
            ...body,
            status: body.status || 'pending_review',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedAt: null,
            publishedAt: null,
            humanAction: null,
            humanNote: null
        };

        const docRef = await db.collection('tasks').add(taskData);

        return NextResponse.json({
            id: docRef.id,
            taskNumber: body.taskNumber
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET /api/tasks - Fetch tasks (can be filtered by status)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const db = getAdminDb();

        let queryBuilder = db.collection('tasks').orderBy('createdAt', 'desc');

        if (status) {
            const snapshot = await db.collection('tasks')
                .where('status', '==', status)
                .orderBy('createdAt', 'desc')
                .get();

            const tasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return NextResponse.json(tasks);
        }

        const snapshot = await queryBuilder.get();
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(tasks);
    } catch (error: any) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
