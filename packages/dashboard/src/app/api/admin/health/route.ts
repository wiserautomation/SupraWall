// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * GET /api/admin/health
 *
 * Returns the configuration and reachability status for every external
 * dependency the admin panel relies on. Designed to be the first thing
 * rendered on /admin — operators should be able to distinguish
 * "no data" from "no config" from "service unreachable" in one glance.
 *
 * Shape per source:
 *   { configured: bool, reachable: bool, last_seen_at: string | null, detail: string }
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { pool, ensureSchema } from "@/lib/db_sql";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",").map(e => e.trim()).filter(Boolean);

async function verifyAdmin(req: NextRequest): Promise<string | null> {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return "Unauthorized";
    try {
        const decoded = await getAdminAuth().verifyIdToken(auth.slice(7));
        if (!decoded.email || !ADMIN_EMAILS.includes(decoded.email)) return "Forbidden";
        return null;
    } catch {
        return "Unauthorized";
    }
}

type SourceStatus = {
    configured: boolean;
    reachable: boolean;
    last_seen_at: string | null;
    detail: string;
};

export async function GET(req: NextRequest) {
    const authErr = await verifyAdmin(req);
    if (authErr) return NextResponse.json({ error: authErr }, { status: authErr === "Forbidden" ? 403 : 401 });

    const sources: Record<string, SourceStatus> = {};

    // -----------------------------------------------------------------------
    // 1. PostgreSQL
    // -----------------------------------------------------------------------
    const pgConfigured = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    let pgReachable = false;
    let pgLastSeen: string | null = null;
    let pgDetail = pgConfigured ? "Connection string set." : "DATABASE_URL / POSTGRES_URL not set.";
    if (pgConfigured) {
        try {
            await ensureSchema();
            await pool.query("SELECT 1");
            pgReachable = true;
            const res = await pool.query("SELECT timestamp FROM audit_logs ORDER BY timestamp DESC LIMIT 1");
            pgLastSeen = res.rows[0]?.timestamp?.toISOString() ?? null;
            pgDetail = pgLastSeen ? "Reachable. Last audit log: " + pgLastSeen : "Reachable but audit_logs is empty.";
        } catch (err: any) {
            pgDetail = "Connection failed: " + err.message;
        }
    }
    sources.postgres = { configured: pgConfigured, reachable: pgReachable, last_seen_at: pgLastSeen, detail: pgDetail };

    // -----------------------------------------------------------------------
    // 2. Firestore
    // -----------------------------------------------------------------------
    const fbConfigured = !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID);
    let fbReachable = false;
    let fbLastSeen: string | null = null;
    let fbDetail = fbConfigured ? "Service account credentials set." : "FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY / FIREBASE_PROJECT_ID missing.";
    if (fbConfigured) {
        try {
            const { db } = await import("@/lib/firebase-admin");
            const snap = await db.collection("users").orderBy("createdAt", "desc").limit(1).get();
            fbReachable = true;
            if (!snap.empty) {
                const d = snap.docs[0].data();
                fbLastSeen = d.createdAt ?? null;
                fbDetail = `Reachable. Latest user: ${fbLastSeen ?? "no timestamp"}`;
            } else {
                fbDetail = "Reachable. users collection is empty.";
            }
        } catch (err: any) {
            fbDetail = "Connection failed: " + err.message;
        }
    }
    sources.firestore = { 
        configured: fbConfigured, 
        reachable: fbReachable, 
        last_seen_at: fbLastSeen, 
        detail: fbDetail + ` (Project: ${process.env.FIREBASE_PROJECT_ID})`
    };

    // -----------------------------------------------------------------------
    // 3. Stripe
    // -----------------------------------------------------------------------
    const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
    let stripeReachable = false;
    let stripeLastSeen: string | null = null;
    let stripeDetail = stripeConfigured ? "Secret key set." : "STRIPE_SECRET_KEY not set.";
    if (stripeConfigured) {
        try {
            const { stripe } = await import("@/lib/stripe");
            const invoices = await stripe.invoices.list({ limit: 1, status: "paid" });
            stripeReachable = true;
            if (invoices.data.length > 0) {
                stripeLastSeen = new Date(invoices.data[0].created * 1000).toISOString();
                stripeDetail = "Reachable. Last paid invoice: " + stripeLastSeen;
            } else {
                stripeDetail = "Reachable. No paid invoices yet.";
            }
        } catch (err: any) {
            stripeDetail = "API call failed: " + err.message;
        }
    }
    sources.stripe = { 
        configured: stripeConfigured, 
        reachable: stripeReachable, 
        last_seen_at: stripeLastSeen, 
        detail: stripeDetail + ` (Key: ${process.env.STRIPE_SECRET_KEY?.slice(0, 7)}...${process.env.STRIPE_SECRET_KEY?.slice(-4)})`
    };

    // -----------------------------------------------------------------------
    // 4. GA4 (Google Analytics)
    // -----------------------------------------------------------------------
    const ga4Configured = !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
    let ga4Reachable = false;
    let ga4LastSeen: string | null = null;
    let ga4Detail = ga4Configured ? "Service account credentials available (shared with Firebase Admin)." : "FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY missing.";
    if (ga4Configured) {
        try {
            const { BetaAnalyticsDataClient } = await import("@google-analytics/data");
            const client = new BetaAnalyticsDataClient({
                credentials: {
                    client_email: process.env.FIREBASE_CLIENT_EMAIL,
                    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                },
            });
            await client.runReport({
                property: "properties/525946717",
                dateRanges: [{ startDate: "1daysAgo", endDate: "today" }],
                metrics: [{ name: "sessions" }],
            });
            ga4Reachable = true;
            ga4LastSeen = new Date().toISOString();
            ga4Detail = "Reachable. Property 525946717 responding.";
        } catch (err: any) {
            ga4Detail = "GA4 API call failed: " + err.message;
        }
    }
    sources.ga4 = { configured: ga4Configured, reachable: ga4Reachable, last_seen_at: ga4LastSeen, detail: ga4Detail };

    // -----------------------------------------------------------------------
    // 5. SDK Telemetry (global_stats in Postgres)
    // -----------------------------------------------------------------------
    let telReachable = false;
    let telLastSeen: string | null = null;
    let telDetail = "Reads global_stats table (same Postgres as main DB).";
    if (pgReachable) {
        try {
            const res = await pool.query("SELECT value_int, last_updated FROM global_stats WHERE key = 'total_blocks'");
            if (res.rows.length > 0) {
                telReachable = true;
                const row = res.rows[0];
                telLastSeen = row.last_updated?.toISOString() ?? null;
                telDetail = `total_blocks = ${row.value_int}. Last updated: ${telLastSeen ?? "never"}`;
            } else {
                telReachable = true;
                telDetail = "global_stats table reachable but no rows yet (no SDK blocks recorded).";
            }
        } catch (err: any) {
            telDetail = "global_stats query failed: " + err.message;
        }
    } else {
        telDetail = "Unavailable — Postgres is not reachable.";
    }
    sources.sdk_telemetry = {
        configured: pgConfigured,
        reachable: telReachable,
        last_seen_at: telLastSeen,
        detail: telDetail,
    };

    // -----------------------------------------------------------------------
    // 6. GitHub token
    // -----------------------------------------------------------------------
    const ghConfigured = !!process.env.GITHUB_TOKEN;
    let ghReachable = false;
    let ghLastSeen: string | null = null;
    let ghDetail = ghConfigured ? "GITHUB_TOKEN set." : "GITHUB_TOKEN not set — GitHub stats unavailable.";
    if (ghConfigured) {
        try {
            const ghRes = await fetch("https://api.github.com/repos/wiserautomation/SupraWall", {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "SupraWall-Admin",
                },
            });
            if (ghRes.ok) {
                const data = await ghRes.json();
                ghReachable = true;
                ghLastSeen = data.updated_at ?? null;
                ghDetail = `Reachable. Stars: ${data.stargazers_count}. Last push: ${data.pushed_at ?? "unknown"}`;
            } else {
                ghDetail = `GitHub API returned ${ghRes.status}: ${ghRes.statusText}`;
            }
        } catch (err: any) {
            ghDetail = "GitHub API call failed: " + err.message;
        }
    }
    sources.github = { configured: ghConfigured, reachable: ghReachable, last_seen_at: ghLastSeen, detail: ghDetail };

    return NextResponse.json({ sources, checked_at: new Date().toISOString() });
}
