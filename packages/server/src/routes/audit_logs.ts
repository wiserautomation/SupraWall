// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";
import { adminAuth, AuthenticatedRequest } from "../auth";
import { resolveTier, TieredRequest } from "../tier-guard";
import { retentionCutoff } from "../tier-config";
import { logger } from "../logger";

const router = express.Router();

// GET audit logs for a tenant (retention window enforced by tier)
router.get("/", adminAuth, resolveTier, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId, limit = 50, offset = 0 } = req.query;
        
        // Security: Ensure query tenantId matches authenticated tenantId
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access logs of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const tier = (req as TieredRequest).tier || "open_source";
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
            upgradeUrl: tier === "open_source" || tier === "developer" ? "https://www.supra-wall.com/pricing" : undefined,
        });
    } catch (e) {
        logger.error("[AuditLogs] Error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
