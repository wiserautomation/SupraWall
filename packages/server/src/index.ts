// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb, pool } from "./db";
import { evaluatePolicy, scrubToolResponse } from "./policy";
import complianceRouter from "./routes/compliance";
import vaultRouter from "./routes/vault";
import threatRouter from "./routes/threat";
import policiesRouter from "./routes/policies";
import approvalsRouter from "./routes/approvals";
import agentsRouter from "./routes/agents";
import auditLogsRouter from "./routes/audit_logs";
import tenantsRouter from "./routes/tenants";
import statsRouter from "./routes/stats";
import contentRouter from "./routes/content";
import { gatekeeperAuth } from "./auth";

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

// Policy Evaluation Webhook
app.post("/v1/evaluate", gatekeeperAuth, evaluatePolicy);
app.post("/v1/evaluateAction", gatekeeperAuth, evaluatePolicy); // Alias for MCP compatibility

// Vault scrub endpoint
app.post("/v1/scrub", scrubToolResponse);

// Compliance Routes
app.use("/v1/compliance", complianceRouter);

// Vault Routes
app.use("/v1/vault", vaultRouter);

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

// Export the app for Vercel
export default app;

// Only start the server listener if not on Vercel
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    const startServer = async () => {
        try {
            await initDb();
            console.log("Database initialized");
            app.listen(port, () => {
                console.log(`SupraWall Server running on port ${port}`);
            });
        } catch (e) {
            console.error("Failed to start server", e);
            process.exit(1);
        }
    };
    startServer();
} else {
    // On Vercel, we still need to ensure DB is initialized
    // We can do this at the top level or per-request. 
    // Top-level await is supported in modern Node on Vercel.
    initDb().catch(err => console.error("Database initialization failed", err));
}
