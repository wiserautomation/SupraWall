// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * GET /api/admin/oss/npm
 *
 * Returns last-30-day npm download counts for suprawall and related packages.
 * Cached for 6 hours via Next.js fetch cache.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",").map(e => e.trim()).filter(Boolean);

const PACKAGES = [
    "suprawall",
    "@suprawall/sdk",
    "@suprawall/langchain",
    "@suprawall/langgraph",
    "@suprawall/vercel-ai",
];

const CACHE_SECS = 6 * 60 * 60; // 6 hours

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

    const results = await Promise.all(
        PACKAGES.map(async pkg => {
            const encoded = encodeURIComponent(pkg);
            try {
                const res = await fetch(
                    `https://api.npmjs.org/downloads/range/last-month/${encoded}`,
                    { next: { revalidate: CACHE_SECS } }
                );
                if (!res.ok) return { package: pkg, total: 0, daily: [], error: `HTTP ${res.status}` };
                const data = await res.json();
                const daily: { day: string; downloads: number }[] = (data.downloads ?? []).map((d: any) => ({
                    day: d.day,
                    downloads: d.downloads,
                }));
                const total = daily.reduce((sum, d) => sum + d.downloads, 0);
                return { package: pkg, total, daily };
            } catch (err: any) {
                return { package: pkg, total: 0, daily: [], error: err.message };
            }
        })
    );

    const grandTotal = results.reduce((sum, r) => sum + r.total, 0);

    return NextResponse.json({ packages: results, grand_total: grandTotal, fetched_at: new Date().toISOString() });
}
