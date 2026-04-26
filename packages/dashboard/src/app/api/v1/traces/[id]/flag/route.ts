// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * POST /api/v1/traces/[id]/flag
 *
 * Marks a public trace as flagged. Flagged traces are hidden from the public
 * gallery and the trace view page. No auth required — rate limited by IP.
 * The flag is soft: admins can review and unflag via the DB.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db_sql";

// 5 flag reports per IP per hour
const _flagWindows: Map<string, { count: number; resetAt: number }> = new Map();
const FLAG_LIMIT = 5;
const FLAG_WINDOW_MS = 60 * 60 * 1000;

function checkFlagRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = _flagWindows.get(ip);
    if (!entry || now > entry.resetAt) {
        _flagWindows.set(ip, { count: 1, resetAt: now + FLAG_WINDOW_MS });
        return true;
    }
    if (entry.count >= FLAG_LIMIT) return false;
    entry.count++;
    return true;
}

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const ip =
        _request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        _request.headers.get("x-real-ip") ??
        "unknown";

    if (!checkFlagRateLimit(ip)) {
        return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }

    if (!id || !/^[A-Z]-\d{5}$/.test(id)) {
        return NextResponse.json({ error: "Invalid trace ID." }, { status: 400 });
    }

    try {
        await ensureSchema();
        const result = await pool.query(
            "UPDATE public_traces SET flagged = TRUE WHERE id = $1 AND deleted = FALSE RETURNING id",
            [id]
        );
        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Trace not found." }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("[Traces Flag] DB error:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
