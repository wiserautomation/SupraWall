// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * GET /api/admin/oss/pypi
 *
 * Returns recent PyPI download counts for the suprawall Python package.
 * pypistats.org provides "last_day", "last_week", "last_month" buckets.
 * Cached for 6 hours.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",").map(e => e.trim()).filter(Boolean);

const CACHE_SECS = 6 * 60 * 60;

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

    // Fetch overall recent downloads
    let recent: { last_day: number; last_week: number; last_month: number } | null = null;
    let recentError: string | null = null;
    try {
        const res = await fetch(
            "https://pypistats.org/api/packages/suprawall/recent",
            { next: { revalidate: CACHE_SECS } }
        );
        if (res.ok) {
            const data = await res.json();
            recent = {
                last_day: data.data?.last_day ?? 0,
                last_week: data.data?.last_week ?? 0,
                last_month: data.data?.last_month ?? 0,
            };
        } else {
            recentError = `HTTP ${res.status}`;
        }
    } catch (err: any) {
        recentError = err.message;
    }

    // Fetch 30-day daily breakdown (system category = all installs)
    let daily: { date: string; downloads: number }[] = [];
    let dailyError: string | null = null;
    try {
        const res = await fetch(
            "https://pypistats.org/api/packages/suprawall/system?period=month",
            { next: { revalidate: CACHE_SECS } }
        );
        if (res.ok) {
            const data = await res.json();
            // Sum across OS variants per day
            const byDay: Record<string, number> = {};
            for (const row of data.data ?? []) {
                byDay[row.date] = (byDay[row.date] ?? 0) + (row.downloads ?? 0);
            }
            daily = Object.entries(byDay)
                .map(([date, downloads]) => ({ date, downloads }))
                .sort((a, b) => a.date.localeCompare(b.date));
        } else {
            dailyError = `HTTP ${res.status}`;
        }
    } catch (err: any) {
        dailyError = err.message;
    }

    return NextResponse.json({
        package: "suprawall",
        recent,
        daily,
        errors: { recent: recentError, daily: dailyError },
        fetched_at: new Date().toISOString(),
    });
}
