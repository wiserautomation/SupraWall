// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, Router } from "express";
import { pool } from "../db";
import { logger } from "../logger";

const router = Router();

const ALLOWED_EVENTS = ["block", "install", "wrap"] as const;
type TelemetryEvent = typeof ALLOWED_EVENTS[number];

/**
 * POST /v1/telemetry/event
 *
 * Records an anonymous SDK event. No PII, no arguments stored.
 * Events:
 *   block   — an agent action was blocked by a policy (existing)
 *   install — first wrap_with_firewall() call on a new machine (opt-in, once per machine)
 *   wrap    — each subsequent wrap_with_firewall() call, with optional framework name
 *
 * Each event type has its own row in global_stats keyed by event name.
 * Framework-specific wrap counts are stored as "wrap:<framework>".
 */
router.post("/event", async (req: Request, res: Response) => {
    const { event, framework, plugin } = req.body;

    if (!ALLOWED_EVENTS.includes(event as TelemetryEvent)) {
        return res.status(400).json({ error: `Unsupported event type. Allowed: ${ALLOWED_EVENTS.join(", ")}` });
    }

    const upsertKey = async (key: string) => {
        await pool.query(
            `INSERT INTO global_stats (key, value_int)
             VALUES ($1, 1)
             ON CONFLICT (key)
             DO UPDATE SET value_int = global_stats.value_int + 1, last_updated = NOW()`,
            [key]
        );
    };

    try {
        await upsertKey(event);

        // Track per-framework breakdown
        if (framework && typeof framework === "string") {
            const safe = framework.replace(/[^a-z0-9_-]/gi, "").slice(0, 32);
            if (safe) await upsertKey(`wrap:${safe}`);
        }

        // Track per-plugin breakdown
        if (plugin && typeof plugin === "string") {
            const safe = plugin.replace(/[^a-z0-9_-]/gi, "").slice(0, 32);
            if (safe) await upsertKey(`plugin:${safe}`);
        }

        return res.status(201).json({ ok: true });
    } catch (err: any) {
        logger.error("[Telemetry] Error recording event:", { event, error: err.message });
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
