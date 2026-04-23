// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";
import { logger } from "../logger";

import { adminAuth, AuthenticatedRequest } from "../auth";

const router = express.Router();

// GET aggregate stats for a tenant (Admin Protected)
router.get("/", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        // Security: Ensure query tenantId matches authenticated tenantId
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access stats of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        // Total calls
        const totalCallsRes = await pool.query(
            "SELECT COUNT(*) as count FROM audit_logs WHERE tenantid = $1",
            [tenantId]
        );
        
        // Blocked actions
        const blockedRes = await pool.query(
            "SELECT COUNT(*) as count FROM audit_logs WHERE tenantid = $1 AND decision = 'DENY'",
            [tenantId]
        );

        // Actual spend
        const spendRes = await pool.query(
            "SELECT SUM(cost_usd) as total FROM audit_logs WHERE tenantid = $1 AND decision = 'ALLOW'",
            [tenantId]
        );

        // Pending approvals
        const pendingRes = await pool.query(
            "SELECT COUNT(*) as count FROM approval_requests WHERE tenantid = $1 AND status = 'PENDING'",
            [tenantId]
        );

        // Chart data (last 7 days spend)
        const chartRes = await pool.query(
            `SELECT TO_CHAR(timestamp, 'MM/DD') as date, SUM(cost_usd) as spend
             FROM audit_logs 
             WHERE tenantid = $1 AND decision = 'ALLOW' 
             GROUP BY TO_CHAR(timestamp, 'MM/DD')
             ORDER BY date ASC`,
            [tenantId]
        );

        res.json({
            totalCalls: parseInt(totalCallsRes.rows[0].count),
            blockedActions: parseInt(blockedRes.rows[0].count),
            actualSpend: parseFloat(spendRes.rows[0].total || 0),
            pendingApprovalsCount: parseInt(pendingRes.rows[0].count),
            chartData: chartRes.rows
        });
    } catch (e) {
        logger.error("[Stats] Error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
