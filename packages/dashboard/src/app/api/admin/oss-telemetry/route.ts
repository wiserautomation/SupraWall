// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * GET /api/admin/oss-telemetry
 *
 * Reads global_stats rows written by the Express /v1/telemetry/event endpoint.
 * Returns aggregate install / wrap / block counts plus per-framework breakdown.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { pool, ensureSchema } from "@/lib/db_sql";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",").map(e => e.trim()).filter(Boolean);

export async function GET(req: NextRequest) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const decoded = await getAdminAuth().verifyIdToken(auth.slice(7));
        if (!decoded.email || !ADMIN_EMAILS.includes(decoded.email))
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureSchema();

    try {
        const res = await pool.query("SELECT key, value_int, last_updated FROM global_stats ORDER BY key");

        let totalBlocks = 0;
        let totalInstalls = 0;
        let totalWraps = 0;
        const frameworkBreakdown: { framework: string; wraps: number }[] = [];
        const pluginBreakdown: { plugin: string; uses: number }[] = [];

        for (const row of res.rows) {
            const count = Number(row.value_int);
            if (row.key === "block")   totalBlocks   = count;
            else if (row.key === "install") totalInstalls = count;
            else if (row.key === "wrap")    totalWraps    = count;
            else if (row.key.startsWith("wrap:")) {
                frameworkBreakdown.push({ framework: row.key.slice(5), wraps: count });
            }
            else if (row.key.startsWith("plugin:")) {
                pluginBreakdown.push({ plugin: row.key.slice(7), uses: count });
            }
        }

        frameworkBreakdown.sort((a, b) => b.wraps - a.wraps);
        pluginBreakdown.sort((a, b) => b.uses - a.uses);

        return NextResponse.json({
            totals: { blocks: totalBlocks, installs: totalInstalls, wraps: totalWraps },
            framework_breakdown: frameworkBreakdown,
            plugin_breakdown: pluginBreakdown,
            fetched_at: new Date().toISOString(),
        });
    } catch (err: any) {
        console.error("[OSS Telemetry] DB error:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
