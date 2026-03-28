// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router } from "express";
import { pool } from "../db";
import { logger } from "../logger";

import { adminAuth, AuthenticatedRequest } from "../auth";

const router = Router();

// GET /v1/approvals/status/:id - Poll for decision (SDK use case)
router.get("/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT status, decision_at, decision_comment FROM approval_requests WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Approval request not found" });
        }

        res.json(result.rows[0]);
    } catch (e) {
        logger.error("[Approvals] Status check error:", { error: e });
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /v1/approvals/respond - Decision from Dashboard
router.post("/respond", adminAuth, async (req, res) => {
    try {
        const { id, decision, comment, userId } = req.body; 
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;

        // decision: approved | denied
        if (!['approved', 'denied'].includes(decision)) {
            return res.status(400).json({ error: "Invalid decision" });
        }

        const result = await pool.query(
            "UPDATE approval_requests SET status = $1, decision_at = NOW(), decision_comment = $2, decision_by = $3 WHERE id = $4 AND tenantid = $5 RETURNING *",
            [decision, comment, userId, id, authenticatedTenantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Approval request not found or unauthorized" });
        }

        res.json({ success: true, request: result.rows[0] });
    } catch (e) {
        logger.error("[Approvals] Respond error:", { error: e });
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /v1/approvals/pending/:tenantId - List pending for dashboard (Admin Protected)
router.get("/pending/:tenantId", adminAuth, async (req, res) => {
    try {
        const { tenantId: requestedTenantId } = req.params;
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;

        if (requestedTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access approvals of another tenant" });
        }

        const result = await pool.query(
            "SELECT * FROM approval_requests WHERE tenantid = $1 AND status = 'pending' ORDER BY createdat DESC",
            [authenticatedTenantId]
        );
        res.json(result.rows);
    } catch (e) {
        logger.error("[Approvals] Fetch pending error:", { error: e });
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
