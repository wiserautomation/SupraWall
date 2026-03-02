import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * POST /api/intelligence
 * Body: intelligence brief object
 * Auth: service role key
 */
export async function POST(request: Request) {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    try {
        const body = await request.json();

        const { data, error } = await supabaseAdmin
            .from('intelligence_briefs')
            .insert([body])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

/**
 * GET /api/intelligence
 * Returns the latest intelligence brief
 */
export async function GET() {
    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('intelligence_briefs')
            .select('*')
            .order('week_start', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'

        return NextResponse.json(data || {});
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
