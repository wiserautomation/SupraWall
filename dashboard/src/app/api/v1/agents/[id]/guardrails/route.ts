import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const snap = await db.collection('agents').doc(id).get();
        if (!snap.exists) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        return NextResponse.json(snap.data()?.guardrails || {});
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const guardrails = await req.json();
        await db.collection('agents').doc(id).update({ guardrails, updatedAt: new Date() });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
