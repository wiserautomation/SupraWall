// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";
import { logger } from "../logger";

const router = express.Router();

// GET tenant settings
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM tenants WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            // Auto-create tenant on first access if needed, or return empty
            return res.json({});
        }
        res.json(result.rows[0]);
    } catch (e) {
        logger.error("[Tenants] Fetch error:", { error: e, tenantId: req.params.id });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// UPDATE tenant settings
router.post("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const body = req.body;

        // Whitelist allowed columns to prevent SQL injection
        const ALLOWED_COLUMNS = ["name", "slack_webhook_url", "tier"];
        const entries = Object.entries(body).filter(([key]) => ALLOWED_COLUMNS.includes(key));

        if (entries.length === 0) return res.status(400).json({ error: "No valid fields to update" });

        const columns = entries.map(([key]) => key);
        const values = entries.map(([, val]) => val);
        const sets = columns.map((col, i) => `${col} = $${i + 2}`);
        const placeholders = values.map((_, i) => `$${i + 2}`);

        await pool.query(
            `INSERT INTO tenants (id, ${columns.join(", ")})
             VALUES ($1, ${placeholders.join(", ")})
             ON CONFLICT (id) DO UPDATE SET ${sets.join(", ")}`,
            [id, ...values]
        );

        res.json({ success: true });
    } catch (e) {
        logger.error("[Tenants] Update error:", { error: e, tenantId: req.params.id });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
