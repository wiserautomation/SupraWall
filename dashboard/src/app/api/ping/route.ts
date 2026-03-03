
import { NextResponse } from 'next/server';

export async function GET() {
    const key = process.env.FIREBASE_PRIVATE_KEY || '';
    return NextResponse.json({
        status: 'ok',
        time: new Date().toISOString(),
        key_len: key.length,
        key_start: key.substring(0, 30),
        key_end: key.substring(key.length - 30),
        env: {
            node: process.version,
            firebase_p: !!process.env.FIREBASE_PROJECT_ID,
            firebase_k: !!process.env.FIREBASE_PRIVATE_KEY,
            gemini: !!process.env.GEMINI_API_KEY,
            cron: !!process.env.CRON_SECRET
        }
    });
}
