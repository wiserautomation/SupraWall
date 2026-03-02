import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/tasks/pending
 * Returns: all tasks where status = "approved" OR status = "revision"
 * Auth: service role key
 */
export async function GET() {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('tasks')
            .select('*')
            .or('status.eq.approved,status.eq.revision')
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
