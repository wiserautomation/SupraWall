// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb, pool, purgeOldLogs } from "./db";
import { evaluatePolicy, scrubToolResponse } from "./policy";
import complianceRouter from "./routes/compliance";
import vaultRouter from "./routes/vault";
import threatRouter from "./routes/threat";
import policiesRouter from "./routes/policies";
import approvalsRouter from "./routes/approvals";
import agentsRouter from "./routes/agents";
import { logger } from "./logger";
import auditLogsRouter from "./routes/audit_logs";
import tenantsRouter from "./routes/tenants";
import statsRouter from "./routes/stats";
import contentRouter from "./routes/content";
import shieldRouter from "./routes/shield";
import membersRouter from "./routes/members";
import { resolveTier } from "./tier-guard";
import { gatekeeperAuth } from "./auth";
import { rateLimit } from "./rate-limit";

// NOTE: stripe-app routes are part of SupraWall Cloud (proprietary).
// See: https://github.com/suprawall/suprawall-cloud

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Healthcheck with DB status
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({ status: "ok", database: "connected" });
    } catch (err) {
        res.status(503).json({ status: "degraded", database: "disconnected" });
    }
});

// Global Tier Resolution for all V1 routes
app.use("/v1", resolveTier);

// Policy Evaluation Webhook (rate limited: 120 req/min per IP)
const evaluateRateLimit = rateLimit({ max: 120, windowMs: 60_000, message: "Evaluate rate limit exceeded. Upgrade your plan or reduce request frequency." });
app.post("/v1/evaluate", evaluateRateLimit, gatekeeperAuth, evaluatePolicy);
app.post("/v1/evaluateAction", evaluateRateLimit, gatekeeperAuth, evaluatePolicy); // Alias for MCP compatibility

// Vault scrub endpoint
app.post("/v1/scrub", scrubToolResponse);

// Compliance Routes
app.use("/v1/compliance", complianceRouter);

// Vault Routes (rate limited: 60 req/min per IP)
app.use("/v1/vault", rateLimit({ max: 60, windowMs: 60_000, message: "Vault rate limit exceeded." }), vaultRouter);

// Threat Intel Routes
app.use("/v1/threat", threatRouter);

// Policies Routes
app.use("/v1/policies", policiesRouter);

// Approvals Routes
app.use("/v1/approvals", approvalsRouter);

// Agents Routes
app.use("/v1/agents", agentsRouter);

// Audit Logs Routes
app.use("/v1/audit-logs", auditLogsRouter);

// Tenants Routes
app.use("/v1/tenants", tenantsRouter);

// Stats Routes
app.use("/v1/stats", statsRouter);

// Content Migration Routes
app.use("/v1/content", contentRouter);

// Shield Status Route
app.use("/v1/shield", shieldRouter);

// Organization Members Route
app.use("/v1/members", membersRouter);

// Export the app for Vercel
export default app;

// Only start the server listener if not on Vercel
if (process.env.NODE_ENV !== 'test' && (process.env.NODE_ENV !== "production" || !process.env.VERCEL)) {
    const start = async () => {
        try {
            await initDb();
            logger.info("[Database] Schema initialized.");

            // Start daily log purging
            purgeOldLogs().catch(err => logger.error("[Purge] Startup error:", err));
            setInterval(purgeOldLogs, 24 * 60 * 60 * 1000); // Once every 24h

            app.listen(port, () => {
                logger.info(`[SupraWall] Gateway listening on port ${port} (Mode: ${process.env.SUPRAWALL_MODE || 'cloud'})`);
            });
        } catch (e) {
            logger.error("[Startup] Critical failure:", e);
            process.exit(1);
        }
    };

    if (require.main === module) {
        start();
    }
}
 else {
    // On Vercel, we still need to ensure DB is initialized
    // We can do this at the top level or per-request. 
    // Top-level await is supported in modern Node on Vercel.
    initDb().catch(err => logger.error("Database initialization failed", { error: err }));
}
