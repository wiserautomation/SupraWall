// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * GET /api/admin/oss/github
 *
 * Fetches repo metadata, 14-day traffic views, and clones for wiserautomation/SupraWall.
 * Requires GITHUB_TOKEN with repo scope (traffic/* endpoints need push access).
 * Cached for 6 hours — GitHub traffic endpoints rate-limit aggressively.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",").map(e => e.trim()).filter(Boolean);

const REPO = "wiserautomation/SupraWall";
const CACHE_SECS = 6 * 60 * 60;

async function ghFetch(path: string, token: string) {
    const res = await fetch(`https://api.github.com${path}`, {
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SupraWall-Admin",
        },
        next: { revalidate: CACHE_SECS },
    });
    if (!res.ok) throw new Error(`GitHub ${path} returned ${res.status}`);
    return res.json();
}

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

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return NextResponse.json({
            error: "GITHUB_TOKEN not configured.",
            configured: false,
        }, { status: 200 });
    }

    const errors: Record<string, string> = {};

    // Repo metadata (stars, forks, open issues)
    let repo: any = null;
    try { repo = await ghFetch(`/repos/${REPO}`, token); }
    catch (e: any) { errors.repo = e.message; }

    // 14-day views
    let views: any = null;
    try { views = await ghFetch(`/repos/${REPO}/traffic/views`, token); }
    catch (e: any) { errors.views = e.message; }

    // 14-day clones
    let clones: any = null;
    try { clones = await ghFetch(`/repos/${REPO}/traffic/clones`, token); }
    catch (e: any) { errors.clones = e.message; }

    // Top referrers
    let referrers: any[] = [];
    try { referrers = await ghFetch(`/repos/${REPO}/traffic/popular/referrers`, token); }
    catch (e: any) { errors.referrers = e.message; }

    return NextResponse.json({
        configured: true,
        repo: repo ? {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            open_issues: repo.open_issues_count,
            pushed_at: repo.pushed_at,
            description: repo.description,
        } : null,
        views: views ? {
            total_count: views.count,
            unique_count: views.uniques,
            daily: (views.views ?? []).map((v: any) => ({ day: v.timestamp?.slice(0, 10), views: v.count, unique: v.uniques })),
        } : null,
        clones: clones ? {
            total_count: clones.count,
            unique_count: clones.uniques,
            daily: (clones.clones ?? []).map((c: any) => ({ day: c.timestamp?.slice(0, 10), clones: c.count, unique: c.uniques })),
        } : null,
        top_referrers: referrers.slice(0, 10).map((r: any) => ({ referrer: r.referrer, count: r.count, unique: r.uniques })),
        errors,
        fetched_at: new Date().toISOString(),
        note: Object.keys(errors).length > 0
            ? "Some traffic endpoints require 'repo' scope on the GitHub token."
            : undefined,
    });
}
