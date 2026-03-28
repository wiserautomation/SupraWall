// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express from "express";
import { pool } from "../db";
import { logger } from "../logger";

import { adminAuth, gatekeeperAuth, AuthenticatedRequest } from "../auth";

const router = express.Router();

// GET /api/v1/content/published (Admin Protected)
router.get("/published", adminAuth, async (req, res) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access content of another tenant" });
        }
        const result = await pool.query(
            `SELECT * FROM content_tasks 
             WHERE tenantid = $1 AND status = 'published' 
             ORDER BY published_at DESC`,
            [tenantId]
        );
        res.json(result.rows);
    } catch (error: any) {
        logger.error("[Content] Error:", { error });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /api/v1/content/task (For agents to report published content - Gatekeeper Protected)
router.post("/task", gatekeeperAuth, async (req, res) => {
    try {
        const agent = (req as AuthenticatedRequest).agent!;
        const tenantId = agent.tenantId;
        const { url, type, primary_keyword, status, published_at } = req.body;
        
        const result = await pool.query(
            `INSERT INTO content_tasks (tenantid, url, type, primary_keyword, status, published_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [tenantId || "default-tenant", url, type, primary_keyword, status || "published", published_at || new Date()]
        );
        
        res.json({ success: true, id: result.rows[0].id });
    } catch (error: any) {
        logger.error("[Content] Create task error:", { error });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
