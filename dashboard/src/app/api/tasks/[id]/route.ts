import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * PATCH /api/tasks/[id]
 * Body: { status, human_action, human_note }
 * Action: update task in Supabase
 * Returns: updated task
 * Auth: admin session (In real world, verify session here)
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const { status, human_action, human_note } = body;

        const updates: any = {
            status,
            human_action,
            human_note,
            updated_at: new Date().toISOString()
        };

        if (status === 'approved' || status === 'rejected' || status === 'revision') {
            updates.reviewed_at = new Date().toISOString();
        }

        const { data, error } = await supabaseAdmin
            .from('tasks')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

/**
 * GET /api/tasks/[id]
 * Optional: useful for the UI
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    try {
        const { id } = await params;
        const { data, error } = await supabaseAdmin
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
