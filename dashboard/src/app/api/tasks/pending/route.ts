import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

// GET /api/tasks/pending - Fetch approved or revision tasks for orchestrator
export async function GET() {
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
