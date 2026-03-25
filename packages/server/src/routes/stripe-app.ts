// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import express, { Request, Response } from "express";
import { pool } from "../db";
import { gatekeeperAuth } from "../auth";

const router = express.Router();

// ONBOARD: Links Stripe account -> SupraWall tenant
router.post("/onboard", gatekeeperAuth, async (req: Request, res: Response) => {
    try {
        const { stripeAccountId, tenantId } = req.body;
        if (!stripeAccountId || !tenantId) {
            return res.status(400).json({ error: "Missing stripeAccountId or tenantId" });
        }

        await pool.query(
            `UPDATE tenants SET stripe_account_id = $1 WHERE id = $2`,
            [stripeAccountId, tenantId]
        );

        res.json({ success: true, message: "Onboarding complete" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// USAGE-AUDIT: Returns anomaly analysis of metered billing
router.get("/usage-audit", gatekeeperAuth, async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.query;
        if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

        // Retrieve metered billing data from audit logs
        const auditLogs = await pool.query(
            `SELECT timestamp, cost_usd, agent_id, tool_name, decision FROM audit_logs 
             WHERE tenantid = $1 AND timestamp > NOW() - INTERVAL '30 days'
             ORDER BY timestamp DESC`,
            [tenantId]
        );

        if (auditLogs.rows.length === 0) {
            return res.json({ healthScore: 100, totalAnomalies: 0, anomalies: [], avgCost: 0 });
        }

        // Standard Deviation based anomaly detection
        const costs = auditLogs.rows.map(log => parseFloat(log.cost_usd || 0));
        const n = costs.length;
        const avgCost = costs.reduce((a, b) => a + b, 0) / n;
        const stdDev = Math.sqrt(costs.map(x => Math.pow(x - avgCost, 2)).reduce((a, b) => a + b, 0) / n);
        
        // Flag logs with cost > avg + 2*stdDev (95th percentile)
        const threshold = avgCost + (2 * stdDev);
        const anomalies = auditLogs.rows.filter(log => parseFloat(log.cost_usd) > threshold && threshold > 0);

        // Calculate potential savings (sum of excess cost in anomalies)
        const potentialSavings = anomalies.reduce((sum, log) => sum + (parseFloat(log.cost_usd) - avgCost), 0);

        res.json({
            healthScore: Math.max(0, Math.min(100, 100 - (anomalies.length * 10))),
            totalAnomalies: anomalies.length,
            anomalies: anomalies.slice(0, 5).map(log => ({
                ...log,
                isAnomaly: true,
                reason: "Sudden spike in tool cost"
            })),
            avgCost,
            stdDev,
            threshold,
            potentialSavings: parseFloat(potentialSavings.toFixed(2))
        });
    } catch (e) {
        console.error("Usage Audit Error:", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// VAULT-PROXY: Wraps a Stripe Restricted API Key
router.post("/vault-proxy", gatekeeperAuth, async (req: Request, res: Response) => {
    try {
        const { tenantId, apiKey, label } = req.body;
        if (!apiKey || !tenantId) return res.status(400).json({ error: "Missing apiKey or tenantId" });

        // In a real scenario, we'd encrypt the key and store it in vault_secrets
        // Using existing vault logic or similar
        const secretName = `STRIPE_RAK_${Date.now()}`;
        
        await pool.query(
            `INSERT INTO vault_secrets (tenant_id, secret_name, encrypted_value, description)
             VALUES ($1, $2, pgp_sym_encrypt($3, $4), $5)`,
            [tenantId, secretName, apiKey, process.env.VAULT_ENCRYPTION_KEY, label || "Stripe Proxy Key"]
        );

        res.json({
            success: true,
            vaultToken: `$SUPRAWALL_VAULT_${secretName}`
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// BUDGET-CTRL: Auto-revoke agent permissions on payment failure
router.post("/budget-ctrl", gatekeeperAuth, async (req: Request, res: Response) => {
    try {
        const { action, subscriptionId, tenantId } = req.body;
        if (!action || !subscriptionId) return res.status(400).json({ error: "Missing action or subscriptionId" });

        if (action === "revoke") {
            // Revoke logic: mark all agents for this tenant as inactive
            await pool.query(
                `UPDATE agents SET status = 'inactive' WHERE tenant_id = (
                    SELECT id FROM tenants WHERE stripe_subscription_id = $1
                )`,
                [subscriptionId]
            );
        } else if (action === "restore") {
            await pool.query(
                `UPDATE agents SET status = 'active' WHERE tenant_id = (
                    SELECT id FROM tenants WHERE stripe_subscription_id = $1
                )`,
                [subscriptionId]
            );
        }

        res.json({ success: true, action });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
