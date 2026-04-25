// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, Router } from "express";
import { pool } from "../db";
import { logger } from "../logger";

const router = Router();

/**
 * POST /v1/telemetry/event
 * 
 * Records an anonymous event (e.g. "block").
 * Used for the homepage real-time counter.
 * No PII or arguments are sent or stored.
 */
router.post("/event", async (req: Request, res: Response) => {
    const { event, framework } = req.body;

    if (event !== "block") {
        return res.status(400).json({ error: "Unsupported event type" });
    }

    try {
        // Increment the global total_blocks counter
        await pool.query(
            `INSERT INTO global_stats (key, value_int) 
             VALUES ('total_blocks', 1) 
             ON CONFLICT (key) 
             DO UPDATE SET value_int = global_stats.value_int + 1, last_updated = NOW()`
        );
        
        return res.status(201).json({ ok: true });
    } catch (err: any) {
        logger.error("[Telemetry] Error incrementing block counter:", { error: err.message });
        // Don't fail the request for the SDK, just return 500
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
