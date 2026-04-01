// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Request, Response } from "express";
import { pool } from "../db";
import { logger } from "../logger";

import { adminAuth, gatekeeperAuth, AuthenticatedRequest } from "../auth";
import { rateLimit } from "../rate-limit";

const router = Router();
const threatLogRateLimit = rateLimit({ max: 60, windowMs: 60_000, message: "Threat log rate limit exceeded." });

// ─── POST /v1/threat/log ───────────────────────────────────────────────────
// Internal/SDK-driven logging of suspicious activity — requires valid agent key
router.post("/log", threatLogRateLimit, gatekeeperAuth, async (req: Request, res: Response) => {
    try {
        const { tenantId, agentId, eventType, severity, details } = req.body;

        if (!tenantId || !eventType) {
            return res.status(400).json({ error: "Missing tenantId or eventType" });
        }

        // Fire and forget (don't wait for write completion to return 200)
        pool.query(
            "INSERT INTO threat_events (tenantid, agentid, event_type, severity, details) VALUES ($1, $2, $3, $4, $5)",
            [tenantId, agentId, eventType, severity || "medium", JSON.stringify(details || {})]
        ).catch(err => logger.error("[Threat] Write Error:", err));

        res.json({ status: "logged" });
    } catch (e) {
        logger.error("Threat log error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ─── GET /v1/threat/events ────────────────────────────────────────────────
router.get("/events", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId, limit = 50, offset = 0 } = req.query;
        
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access threat events of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            "SELECT * FROM threat_events WHERE tenantid = $1 ORDER BY createdat DESC LIMIT $2 OFFSET $3",
            [tenantId, limit, offset]
        );

        res.json(result.rows);
    } catch (e) {
        logger.error("[Threat] Events error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ─── GET /v1/threat/summary ────────────────────────────────────────────────
router.get("/summary", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: queryTenantId } = req.query;
        
        const tenantId = queryTenantId || authenticatedTenantId;
        if (queryTenantId && queryTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot access threat summary of another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        const result = await pool.query(
            "SELECT * FROM threat_summaries WHERE tenantid = $1 ORDER BY threat_score DESC",
            [tenantId]
        );

        res.json(result.rows);
    } catch (e) {
        logger.error("[Threat] Summary error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ─── POST /v1/threat/aggregate ─────────────────────────────────────────────
// Manually trigger aggregation (normally a cron job)
router.post("/aggregate", adminAuth, async (req: Request, res: Response) => {
    try {
        const authenticatedTenantId = (req as AuthenticatedRequest).tenantId;
        const { tenantId: bodyTenantId } = req.body;
        
        const tenantId = bodyTenantId || authenticatedTenantId;
        if (bodyTenantId && bodyTenantId !== authenticatedTenantId) {
            return res.status(403).json({ error: "Forbidden: Cannot aggregate threat data for another tenant" });
        }

        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        // Simple aggregation logic: 
        // 1. Calculate scores based on event types and counts in the last 24h
        // 2. Update threat_summaries

        // Severity weights
        const weights = { low: 1, medium: 5, high: 20, critical: 100 };

        const events = await pool.query(
            "SELECT agentid, severity, COUNT(*) as count FROM threat_events WHERE tenantid = $1 AND createdat >= NOW() - INTERVAL '24 hours' GROUP BY agentid, severity",
            [tenantId]
        );

        // Reset/Update scores
        for (const row of events.rows) {
            const score = (weights[row.severity as keyof typeof weights] || 5) * parseInt(row.count);
            
            await pool.query(
                `INSERT INTO threat_summaries (tenantid, entity_id, entity_type, threat_score, total_events, last_updated)
                 VALUES ($1, $2, 'agent', $3, $4, NOW())
                 ON CONFLICT (tenantid, entity_id, entity_type)
                 DO UPDATE SET 
                    threat_score = threat_summaries.threat_score + EXCLUDED.threat_score,
                    total_events = threat_summaries.total_events + EXCLUDED.total_events,
                    last_updated = NOW()`,
                [tenantId, row.agentid, score, parseInt(row.count)]
            );
        }

        res.json({ status: "aggregated", processed: events.rows.length });
    } catch (e) {
        logger.error("[Threat] Aggregation error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
