// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * GET /api/v1/oss-stats/public
 *
 * Public, no-auth endpoint that powers the homepage "X agent attacks blocked" counter.
 * Returns aggregate SDK telemetry and GitHub stars — anonymised, read-only.
 * Cached for 5 minutes so the homepage counter refreshes frequently but doesn't hammer the DB.
 */

export const revalidate = 300; // 5 minutes

import { NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db_sql";

export async function GET() {
    let totalBlocks = 0;
    let totalInstalls = 0;
    let totalWraps = 0;

    try {
        await ensureSchema();
        const res = await pool.query(
            "SELECT key, value_int FROM global_stats WHERE key IN ('block', 'install', 'wrap')"
        );
        for (const row of res.rows) {
            const v = Number(row.value_int);
            if (row.key === "block")   totalBlocks   = v;
            if (row.key === "install") totalInstalls = v;
            if (row.key === "wrap")    totalWraps    = v;
        }
    } catch {
        // Return zeros on DB error — this is a public read, never error out
    }

    // GitHub stars — optional, cached
    let stars: number | null = null;
    const ghToken = process.env.GITHUB_TOKEN;
    if (ghToken) {
        try {
            const ghRes = await fetch("https://api.github.com/repos/wiserautomation/SupraWall", {
                headers: {
                    Authorization: `token ${ghToken}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "SupraWall-Public",
                },
                next: { revalidate: 3600 }, // stars change slowly
            });
            if (ghRes.ok) {
                const data = await ghRes.json();
                stars = data.stargazers_count ?? null;
            }
        } catch {
            // non-fatal
        }
    }

    return NextResponse.json({
        blocks: totalBlocks,
        installs: totalInstalls,
        wraps: totalWraps,
        github_stars: stars,
        fetched_at: new Date().toISOString(),
    });
}
