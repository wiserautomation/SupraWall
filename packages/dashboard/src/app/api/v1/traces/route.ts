// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * POST /api/v1/traces — upload a redacted SupraWall block trace (opt-in, from SDK share_url())
 * GET  /api/v1/traces?id=… — fetch a public trace by ID
 *
 * Rate limiting: 10 uploads per hour per IP.
 * No authentication required for upload or read — the audit hash is the integrity proof.
 */

export const dynamic = "force-dynamic";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { pool, ensureSchema } from "@/lib/db_sql";

// ---------------------------------------------------------------------------
// In-memory rate limiter — 10 uploads / hour / IP
// ---------------------------------------------------------------------------

const _uploadWindows: Map<string, { count: number; resetAt: number }> = new Map();
const UPLOAD_LIMIT = 10;
const UPLOAD_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = _uploadWindows.get(ip);
    if (!entry || now > entry.resetAt) {
        _uploadWindows.set(ip, { count: 1, resetAt: now + UPLOAD_WINDOW_MS });
        return true;
    }
    if (entry.count >= UPLOAD_LIMIT) return false;
    entry.count++;
    return true;
}

// ---------------------------------------------------------------------------
// Audit-hash verification
// Mirrors the Python SDK's compute_audit_hash() canonicalisation.
// ---------------------------------------------------------------------------

function sortObject(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    return Object.keys(obj)
        .sort()
        .reduce((res: any, key: string) => {
            res[key] = sortObject(obj[key]);
            return res;
        }, {});
}

function verifyAuditHash(body: Record<string, any>): boolean {
    const { audit_hash, ...rest } = body;
    if (!audit_hash || typeof audit_hash !== "string") return false;

    const canonical = JSON.stringify(sortObject({
        agent_reasoning: rest.agent_reasoning,
        attempted_action: rest.attempted_action,
        blocked_at: rest.blocked_at,
        environment: rest.environment,
        framework: rest.framework,
        id: rest.id,
        matched_policy: rest.matched_policy,
        sdk_version: rest.sdk_version,
    }));

    const expected = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
    return expected === audit_hash;
}

// ---------------------------------------------------------------------------
// POST — upload a trace
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";

    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: "Rate limit exceeded: 10 trace uploads per hour per IP." },
            { status: 429 }
        );
    }

    let body: Record<string, any>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    // Required fields
    const required = ["id", "blocked_at", "framework", "attempted_action", "matched_policy", "audit_hash"];
    for (const field of required) {
        if (!(field in body)) {
            return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
        }
    }

    // Validate ID format: single letter + dash + 5 digits (e.g. "A-00847")
    if (!/^[A-Z]-\d{5}$/.test(body.id)) {
        return NextResponse.json({ error: "Invalid trace ID format." }, { status: 400 });
    }

    // Verify the audit hash — rejects tampered traces
    if (!verifyAuditHash(body)) {
        return NextResponse.json(
            { error: "Audit hash mismatch. Trace content was altered after signing." },
            { status: 422 }
        );
    }

    const isPublic = body.public !== false;
    const secretToken = crypto.randomBytes(32).toString("hex");

    await ensureSchema();

    try {
        // Upsert: if the ID already exists (SDK retried), update silently
        await pool.query(
            `INSERT INTO public_traces (id, trace_json, audit_hash, public, secret_token, upload_ip)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [body.id, JSON.stringify(body), body.audit_hash, isPublic, secretToken, ip]
        );
    } catch (err: any) {
        console.error("[Traces POST] DB error:", err.message);
        return NextResponse.json({ error: "Failed to store trace." }, { status: 500 });
    }

    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://supra-wall.com"}/trace/${body.id}`;
    return NextResponse.json({ id: body.id, url, secret_token: secretToken }, { status: 201 });
}

// ---------------------------------------------------------------------------
// GET — fetch a single trace by ID
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing ?id= parameter." }, { status: 400 });
    }

    await ensureSchema();

    try {
        const result = await pool.query(
            "SELECT * FROM public_traces WHERE id = $1 AND deleted = FALSE AND flagged = FALSE",
            [id]
        );
        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Trace not found." }, { status: 404 });
        }
        const row = result.rows[0];
        if (!row.public) {
            return NextResponse.json({ error: "This trace is private." }, { status: 403 });
        }
        return NextResponse.json({ trace: row.trace_json, created_at: row.created_at });
    } catch (err: any) {
        console.error("[Traces GET] DB error:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ---------------------------------------------------------------------------
// DELETE — remove a trace (requires secret_token from upload response)
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id || !token) {
        return NextResponse.json({ error: "Missing id or token." }, { status: 400 });
    }

    await ensureSchema();

    const result = await pool.query(
        "SELECT secret_token FROM public_traces WHERE id = $1",
        [id]
    );
    if (result.rows.length === 0) {
        return NextResponse.json({ error: "Trace not found." }, { status: 404 });
    }
    const stored = result.rows[0].secret_token;
    const expected = Buffer.from(stored ?? "", "hex");
    const given = Buffer.from(token, "hex");
    const match = expected.length === given.length && crypto.timingSafeEqual(expected, given);
    if (!match) {
        return NextResponse.json({ error: "Invalid token." }, { status: 403 });
    }

    await pool.query("UPDATE public_traces SET deleted = TRUE WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
}
