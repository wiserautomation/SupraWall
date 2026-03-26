// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Response } from "express";
import { gatekeeperAuth, AuthenticatedRequest } from "../auth";
import { pool } from "../db";
import { logger } from "../logger";

const router = Router();

// GET /v1/shield/status
router.get("/status", gatekeeperAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const agent = req.agent;
        if (!agent) {
            return res.status(401).json({
                status: "ERROR",
                connected: false,
                error: "Invalid API key or agent not found."
            });
        }

        // 1. Vault Secrets Available
        let vaultSecretsAvailable = 0;
        try {
            const vaultRes = await pool.query(
                "SELECT COUNT(*) FROM vault_secrets WHERE tenant_id = $1",
                [agent.tenantId] 
            );
            vaultSecretsAvailable = parseInt(vaultRes.rows[0].count, 10);
        } catch (e) {
            logger.warn("[Shield Status] Could not fetch vault count", { error: e });
        }

        // 2. Last Evaluation
        let lastEvaluation = null;
        try {
            const logRes = await pool.query(
                "SELECT timestamp FROM audit_logs WHERE agentid = $1 ORDER BY timestamp DESC LIMIT 1",
                [agent.id]
            );
            if (logRes.rows.length > 0) {
                lastEvaluation = logRes.rows[0].created_at;
            }
        } catch (e) {
            logger.warn("[Shield Status] Could not fetch last evaluation", { error: e });
        }

        // 3. Construct response
        // Note: The SDK will measure the round-trip latency.
        res.status(200).json({
            status: "ACTIVE",
            connected: true,
            agentId: agent.id,
            agentName: agent.name,
            policiesLoaded: agent.scopes?.length || 0,
            vaultSecretsAvailable,
            threatDetection: "enabled",
            lastEvaluation,
            version: "1.0.0"
        });
    } catch (e) {
        logger.error("[Shield Status] Internal error:", { error: e });
        res.status(500).json({
            status: "ERROR",
            connected: false,
            error: "Internal Server Error"
        });
    }
});

export default router;
