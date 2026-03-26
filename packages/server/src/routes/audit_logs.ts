// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";
import { resolveTier, TieredRequest } from "../tier-guard";
import { retentionCutoff } from "../tier-config";

const router = express.Router();

// GET audit logs for a tenant (retention window enforced by tier)
router.get("/", resolveTier, async (req: Request, res: Response) => {
    try {
        const { tenantId, limit = 50, offset = 0 } = req.query;
        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const tier = (req as TieredRequest).tier || "free";
        const cutoff = retentionCutoff(tier);

        const result = await pool.query(
            `SELECT * FROM audit_logs
             WHERE tenantid = $1 AND timestamp >= $2
             ORDER BY timestamp DESC LIMIT $3 OFFSET $4`,
            [tenantId, cutoff.toISOString(), limit, offset]
        );

        res.json({
            rows: result.rows,
            retentionDays: (req as TieredRequest).tierLimits?.auditRetentionDays,
            tier,
            upgradeUrl: tier === "free" ? "https://www.supra-wall.com/pricing" : undefined,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
