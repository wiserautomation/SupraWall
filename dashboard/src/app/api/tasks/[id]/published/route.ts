import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * PATCH /api/tasks/[id]/published
 * Body: { published_url }
 * Action: set status = "published", record published_at
 * Auth: service role key
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
        const { published_url } = await request.json();

        const { data, error } = await supabaseAdmin
            .from('tasks')
            .update({
                status: 'published',
                url: published_url,
                published_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
