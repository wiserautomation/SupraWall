// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";
import { logger } from "../logger";

import { adminAuth, AuthenticatedRequest } from "../auth";
import { validate, CreatePolicySchema } from "../validation";

const router = express.Router();

// ─── GET /v1/policies ──────────────────────────────────────────────────
router.get("/", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        // Security: Ensure query tenantId matches authenticated tenantId
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access policies of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            "SELECT * FROM policies WHERE tenantid = $1 OR tenantid = 'global' ORDER BY id DESC",
            [tenantId]
        );
        res.json(result.rows);
    } catch (e) {
        logger.error("[Policies] Error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ─── POST /v1/policies ─────────────────────────────────────────────────
router.post("/", adminAuth, validate(CreatePolicySchema), async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: bodyTenantId, name, toolName, ruleType, description } = req.body;
        
        const tenantId = bodyTenantId || authenticatedTenantId;
        if (bodyTenantId && bodyTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot create policies for another tenant" });
        }

        if (!tenantId || !name || !ruleType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await pool.query(
            "INSERT INTO policies (tenantid, name, toolname, ruletype, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [tenantId, name, toolName, ruleType, description]
        );
        res.json(result.rows[0]);
    } catch (e) {
        logger.error("[Policies] Error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ─── DELETE /v1/policies/:id ───────────────────────────────────────────
router.delete("/:id", adminAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot delete policies of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        await pool.query(
            "DELETE FROM policies WHERE id = $1 AND tenantid = $2",
            [id, tenantId]
        );
        res.json({ status: "deleted" });
    } catch (e) {
        logger.error("[Policies] Error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
