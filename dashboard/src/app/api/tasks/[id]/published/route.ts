import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { admin } from '@/lib/firebase-admin';

// PATCH /api/tasks/[id]/published - Mark task as published
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getAdminDb();

        const updateData = {
            status: 'published',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection('tasks').doc(id).update(updateData);

        const updatedDoc = await db.collection('tasks').doc(id).get();

        return NextResponse.json({ id, ...updatedDoc.data() });
    } catch (error: any) {
        console.error('Error marking task as published:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
