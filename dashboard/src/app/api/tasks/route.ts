import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * POST /api/tasks
 * Body: task object
 * Auth: service role key
 */
export async function POST(request: Request) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Ensure status defaults if not provided
        if (!body.status) body.status = 'pending_review';

        const { data, error } = await supabaseAdmin
            .from('tasks')
            .insert([body])
            .select('id, task_number')
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

/**
 * GET /api/tasks
 * Query params can be used to distinguish between different GET requests
 * but the prompt specifically asked for /api/tasks/pending which is a sub-path.
 * I will implement it as a query param or handle the path properly.
 * Actually, let's follow the standard Next.js path structure:
 * /api/tasks/pending -> src/app/api/tasks/pending/route.ts
 */
