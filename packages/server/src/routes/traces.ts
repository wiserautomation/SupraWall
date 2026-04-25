// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Public trace routes (Express server).
 *
 * POST /v1/traces   — upload a redacted SupraWall block trace (from SDK share_url())
 * GET  /v1/traces/:id — fetch a public trace by ID
 * DELETE /v1/traces/:id — delete a trace (requires ?token=)
 *
 * Rate limiting: 10 uploads / hour / IP (applied at router level from index.ts).
 * No authentication required — the audit hash is the integrity proof.
 */

import crypto from "crypto";
import { Request, Response, Router } from "express";
import { pool } from "../db";
import { logger } from "../logger";
import { rateLimit } from "../rate-limit";

const router = Router();

// ---------------------------------------------------------------------------
// Schema bootstrap (runs once per process, idempotent)
// ---------------------------------------------------------------------------

let _schemaReady = false;
async function ensureTracesSchema(): Promise<void> {
    if (_schemaReady) return;
    await pool.query(`
        CREATE TABLE IF NOT EXISTS public_traces (
            id VARCHAR(20) PRIMARY KEY,
            trace_json JSONB NOT NULL,
            audit_hash VARCHAR(64) NOT NULL,
            public BOOLEAN DEFAULT TRUE,
            secret_token VARCHAR(128),
            flagged BOOLEAN DEFAULT FALSE,
            deleted BOOLEAN DEFAULT FALSE,
            upload_ip VARCHAR(45),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_public_traces_created ON public_traces(created_at DESC);
    `);
    _schemaReady = true;
}

// ---------------------------------------------------------------------------
// Audit-hash verification
// Mirrors the Python SDK's compute_audit_hash() canonicalisation.
// ---------------------------------------------------------------------------

function verifyAuditHash(body: Record<string, any>): boolean {
    const { audit_hash, ...rest } = body;
    if (!audit_hash || typeof audit_hash !== "string") return false;

    const fields = {
        id: rest.id,
        blocked_at: rest.blocked_at,
        framework: rest.framework,
        attempted_action: rest.attempted_action,
        agent_reasoning: rest.agent_reasoning,
        matched_policy: rest.matched_policy,
        environment: rest.environment,
        sdk_version: rest.sdk_version,
    };

    // Deterministic key order, no extra spaces — mirrors Python's json.dumps(sort_keys=True, separators=(',',':'))
    const sortedKeys = Object.keys(fields).sort();
    const ordered: Record<string, any> = {};
    for (const k of sortedKeys) ordered[k] = (fields as any)[k];

    const canonical = JSON.stringify(ordered).replace(/\s/g, "");
    const expected = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
    return expected === audit_hash;
}

// ---------------------------------------------------------------------------
// POST — upload a trace (rate limited: 10/hour/IP, applied in index.ts)
// ---------------------------------------------------------------------------

router.post(
    "/",
    rateLimit({ max: 10, windowMs: 60 * 60 * 1000, message: "Trace upload rate limit: 10 per hour per IP." }),
    async (req: Request, res: Response) => {
        const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
        const body = req.body as Record<string, any>;

        const required = ["id", "blocked_at", "framework", "attempted_action", "matched_policy", "audit_hash"];
        for (const field of required) {
            if (!(field in body)) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        if (!/^[A-Z]-\d{5}$/.test(body.id)) {
            return res.status(400).json({ error: "Invalid trace ID format." });
        }

        if (!verifyAuditHash(body)) {
            return res.status(422).json({
                error: "Audit hash mismatch. Trace content was altered after signing.",
            });
        }

        const isPublic = body.public !== false;
        const secretToken = crypto.randomBytes(32).toString("hex");

        try {
            await ensureTracesSchema();
            await pool.query(
                `INSERT INTO public_traces (id, trace_json, audit_hash, public, secret_token, upload_ip)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO NOTHING`,
                [body.id, JSON.stringify(body), body.audit_hash, isPublic, secretToken, ip]
            );
        } catch (err: any) {
            logger.error("[Traces POST] DB error:", { error: err.message });
            return res.status(500).json({ error: "Failed to store trace." });
        }

        const baseUrl = process.env.APP_URL ?? "https://supra-wall.com";
        const url = `${baseUrl}/trace/${body.id}`;
        return res.status(201).json({ id: body.id, url, secret_token: secretToken });
    }
);

// ---------------------------------------------------------------------------
// GET — fetch a trace by ID
// ---------------------------------------------------------------------------

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await ensureTracesSchema();
        const result = await pool.query(
            "SELECT trace_json, created_at FROM public_traces WHERE id = $1 AND deleted = FALSE AND flagged = FALSE AND public = TRUE",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Trace not found." });
        }
        return res.json({ trace: result.rows[0].trace_json, created_at: result.rows[0].created_at });
    } catch (err: any) {
        logger.error("[Traces GET] DB error:", { error: err.message });
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// ---------------------------------------------------------------------------
// DELETE — soft-delete a trace (requires ?token=)
// ---------------------------------------------------------------------------

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const token = req.query.token as string;

    if (!token) return res.status(400).json({ error: "Missing ?token= parameter." });

    try {
        await ensureTracesSchema();
        const result = await pool.query(
            "SELECT secret_token FROM public_traces WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Trace not found." });

        const stored = result.rows[0].secret_token ?? "";
        const buf1 = Buffer.from(stored, "hex");
        const buf2 = Buffer.from(token, "hex");
        const valid = buf1.length === buf2.length && crypto.timingSafeEqual(buf1, buf2);
        if (!valid) return res.status(403).json({ error: "Invalid token." });

        await pool.query("UPDATE public_traces SET deleted = TRUE WHERE id = $1", [id]);
        return res.json({ ok: true });
    } catch (err: any) {
        logger.error("[Traces DELETE] DB error:", { error: err.message });
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
