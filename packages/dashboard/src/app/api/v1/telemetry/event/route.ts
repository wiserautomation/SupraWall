// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * POST /api/v1/telemetry/event
 *
 * Records an anonymous SDK event in global_stats.
 * Used by the OSS Metrics dashboard to show aggregate installs, wraps, and blocks.
 */

import { NextRequest, NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db_sql";

const ALLOWED_EVENTS = ["block", "install", "wrap"] as const;
type TelemetryEvent = typeof ALLOWED_EVENTS[number];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { event, framework } = body;

        if (!ALLOWED_EVENTS.includes(event as TelemetryEvent)) {
            return NextResponse.json(
                { error: `Unsupported event type. Allowed: ${ALLOWED_EVENTS.join(", ")}` },
                { status: 400 }
            );
        }

        await ensureSchema();

        const upsertKey = async (key: string) => {
            await pool.query(
                `INSERT INTO global_stats (key, value_int, last_updated)
                 VALUES ($1, 1, NOW())
                 ON CONFLICT (key)
                 DO UPDATE SET value_int = global_stats.value_int + 1, last_updated = NOW()`,
                [key]
            );
        };

        await upsertKey(event);

        // For wraps, also track per-framework breakdown
        if (event === "wrap" && framework && typeof framework === "string") {
            const safe = framework.replace(/[^a-z0-9_-]/gi, "").slice(0, 32);
            if (safe) await upsertKey(`wrap:${safe}`);
        }

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err: any) {
        console.error("[Telemetry API] Error:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
