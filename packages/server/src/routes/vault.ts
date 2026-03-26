// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Request, Response } from "express";
import { pool } from "../db";
import { resolveTier, TieredRequest, tierLimitError } from "../tier-guard";
import { logger } from "../logger";

const router = Router();

const SECRET_NAME_PATTERN = /^[A-Z][A-Z0-9_]{2,63}$/;

// POST /v1/vault/secrets — Create a secret
router.post("/secrets", resolveTier, async (req: Request, res: Response) => {
    try {
        const { tenantId, secretName, secretValue, description, expiresAt, assignedAgents } = req.body;
        const tierLimits = (req as TieredRequest).tierLimits!;

        if (!tenantId || !secretName || !secretValue) {
            return res.status(400).json({ error: "Missing required fields: tenantId, secretName, secretValue" });
        }

        // --- Tier Enforcement: Vault Secret Count ---
        if (isFinite(tierLimits.maxVaultSecrets)) {
            const countResult = await pool.query(
                "SELECT COUNT(*) FROM vault_secrets WHERE tenant_id = $1",
                [tenantId]
            );
            const currentCount = parseInt(countResult.rows[0].count, 10);
            if (currentCount >= tierLimits.maxVaultSecrets) {
                return res.status(403).json(
                    tierLimitError("Vault secrets", currentCount, tierLimits.maxVaultSecrets)
                );
            }
        }

        if (!SECRET_NAME_PATTERN.test(secretName)) {
            return res.status(400).json({ error: "secretName must match pattern: ^[A-Z][A-Z0-9_]{2,63}$" });
        }

        if (!process.env.VAULT_ENCRYPTION_KEY) {
            return res.status(500).json({ error: "Vault encryption key not configured" });
        }

        const result = await pool.query(
            `INSERT INTO vault_secrets (tenant_id, secret_name, encrypted_value, description, expires_at, assigned_agents)
             VALUES ($1, $2, pgp_sym_encrypt($3, $4), $5, $6, $7)
             RETURNING id, secret_name, description, expires_at, created_at, assigned_agents`,
            [tenantId, secretName, secretValue, process.env.VAULT_ENCRYPTION_KEY, description || null, expiresAt || null, assignedAgents || []]
        );

        res.status(201).json(result.rows[0]);
    } catch (e: any) {
        if (e.code === "23505") {
            return res.status(409).json({ error: `Secret '${req.body.secretName}' already exists for this tenant` });
        }
        logger.error("Vault create secret error:", { error: e, tenantId: req.body.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /v1/vault/secrets/bulk — Create multiple secrets
router.post("/secrets/bulk", async (req: Request, res: Response) => {
    try {
        const { tenantId, secrets } = req.body;

        if (!tenantId || !Array.isArray(secrets)) {
            return res.status(400).json({ error: "Missing required fields: tenantId, secrets (array)" });
        }

        if (secrets.length > 100) {
            return res.status(400).json({ error: "Bulk import limit is 100 secrets per request" });
        }

        if (!process.env.VAULT_ENCRYPTION_KEY) {
            return res.status(500).json({ error: "Vault encryption key not configured" });
        }

        const created = [];
        const skipped = [];
        const errors = [];

        for (const s of secrets) {
            const { secretName, secretValue, description } = s;

            if (!secretName || !secretValue || !SECRET_NAME_PATTERN.test(secretName)) {
                errors.push({ secretName, error: "Invalid name or missing value" });
                continue;
            }

            try {
                const result = await pool.query(
                    `INSERT INTO vault_secrets (tenant_id, secret_name, encrypted_value, description)
                     VALUES ($1, $2, pgp_sym_encrypt($3, $4), $5)
                     RETURNING id, secret_name`,
                    [tenantId, secretName, secretValue, process.env.VAULT_ENCRYPTION_KEY, description || "Bulk imported"]
                );
                created.push(result.rows[0]);
            } catch (e: any) {
                if (e.code === "23505") {
                    skipped.push({ secretName, reason: "Already exists" });
                } else {
                    logger.error(`Bulk import error for ${secretName}:`, { error: e, tenantId });
                    errors.push({ secretName, error: "Database error" });
                }
            }
        }

        res.status(207).json({ created, skipped, errors });
    } catch (e: any) {
        logger.error("Vault bulk import error:", { error: e, tenantId: req.body.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /v1/vault/secrets?tenantId=<id> — List secrets (metadata only)
router.get("/secrets", async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.query;

        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId query param" });
        }

        const result = await pool.query(
            `SELECT id, tenant_id, secret_name, description, expires_at, last_rotated_at, created_at, assigned_agents
             FROM vault_secrets WHERE tenant_id = $1
             ORDER BY created_at DESC`,
            [tenantId]
        );

        res.json(result.rows);
    } catch (e) {
        logger.error("Vault list secrets error:", { error: e, tenantId: req.query.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /v1/vault/secrets/:id/rotate — Rotate a secret
router.put("/secrets/:id/rotate", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tenantId, newValue } = req.body;

        if (!tenantId || !newValue) {
            return res.status(400).json({ error: "Missing required fields: tenantId, newValue" });
        }

        if (!process.env.VAULT_ENCRYPTION_KEY) {
            return res.status(500).json({ error: "Vault encryption key not configured" });
        }

        const result = await pool.query(
            `UPDATE vault_secrets
             SET encrypted_value = pgp_sym_encrypt($1, $2), last_rotated_at = NOW()
             WHERE id = $3 AND tenant_id = $4
             RETURNING id, secret_name, last_rotated_at`,
            [newValue, process.env.VAULT_ENCRYPTION_KEY, id, tenantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Secret not found" });
        }

        await pool.query(
            `INSERT INTO vault_access_log (tenant_id, agent_id, secret_name, tool_name, action, request_metadata)
             VALUES ($1, 'system', $2, 'rotate', 'ROTATED', '{}')`,
            [tenantId, result.rows[0].secret_name]
        );

        res.json(result.rows[0]);
    } catch (e) {
        logger.error("Vault rotate secret error:", { error: e, id: req.params.id, tenantId: req.body.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /v1/vault/secrets/:id — Delete a secret
router.delete("/secrets/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tenantId } = req.query;

        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId query param" });
        }

        const secretResult = await pool.query(
            `SELECT secret_name FROM vault_secrets WHERE id = $1 AND tenant_id = $2`,
            [id, tenantId]
        );

        if (secretResult.rows.length === 0) {
            return res.status(404).json({ error: "Secret not found" });
        }

        await pool.query(`DELETE FROM vault_secrets WHERE id = $1 AND tenant_id = $2`, [id, tenantId]);

        await pool.query(
            `INSERT INTO vault_access_log (tenant_id, agent_id, secret_name, tool_name, action, request_metadata)
             VALUES ($1, 'system', $2, 'delete', 'DELETED', '{}')`,
            [tenantId, secretResult.rows[0].secret_name]
        );

        res.json({ deleted: true });
    } catch (e) {
        logger.error("Vault delete secret error:", { error: e, id: req.params.id, tenantId: req.query.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /v1/vault/rules — Create an access rule
router.post("/rules", async (req: Request, res: Response) => {
    try {
        const { tenantId, agentId, secretId, allowedTools, maxUsesPerHour, requiresApproval } = req.body;

        if (!tenantId || !agentId || !secretId) {
            return res.status(400).json({ error: "Missing required fields: tenantId, agentId, secretId" });
        }

        const result = await pool.query(
            `INSERT INTO vault_access_rules (tenant_id, agent_id, secret_id, allowed_tools, max_uses_per_hour, requires_approval)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [tenantId, agentId, secretId, allowedTools || [], maxUsesPerHour ?? 100, requiresApproval ?? false]
        );

        res.status(201).json(result.rows[0]);
    } catch (e) {
        logger.error("Vault create rule error:", { error: e, tenantId: req.body.tenantId, agentId: req.body.agentId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /v1/vault/rules?tenantId=<id>&agentId=<id> — List rules
router.get("/rules", async (req: Request, res: Response) => {
    try {
        const { tenantId, agentId } = req.query;

        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId query param" });
        }

        const result = await pool.query(
            `SELECT r.*, s.secret_name FROM vault_access_rules r
             JOIN vault_secrets s ON r.secret_id = s.id
             WHERE r.tenant_id = $1 AND ($2::text IS NULL OR r.agent_id = $2)
             ORDER BY r.created_at DESC`,
            [tenantId, agentId || null]
        );

        res.json(result.rows);
    } catch (e) {
        logger.error("Vault list rules error:", { error: e, tenantId: req.query.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /v1/vault/rules/:id — Remove an access rule
router.delete("/rules/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { tenantId } = req.query;

        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId query param" });
        }

        const result = await pool.query(
            `DELETE FROM vault_access_rules WHERE id = $1 AND tenant_id = $2 RETURNING id`,
            [id, tenantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Rule not found" });
        }

        res.json({ deleted: true });
    } catch (e) {
        logger.error("Vault delete rule error:", { error: e, id: req.params.id, tenantId: req.query.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /v1/vault/log?tenantId=<id> — View vault access log
router.get("/log", async (req: Request, res: Response) => {
    try {
        const { tenantId, agentId, action, from, to, limit = "50", offset = "0" } = req.query;

        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId query param" });
        }

        const conditions: string[] = ["tenant_id = $1"];
        const params: any[] = [tenantId];
        let idx = 2;

        if (agentId) { conditions.push(`agent_id = $${idx++}`); params.push(agentId); }
        if (action) { conditions.push(`action = $${idx++}`); params.push(action); }
        if (from) { conditions.push(`created_at >= $${idx++}`); params.push(from); }
        if (to) { conditions.push(`created_at <= $${idx++}`); params.push(to); }

        params.push(Number(limit), Number(offset));

        const result = await pool.query(
            `SELECT * FROM vault_access_log
             WHERE ${conditions.join(" AND ")}
             ORDER BY created_at DESC
             LIMIT $${idx} OFFSET $${idx + 1}`,
            params
        );

        res.json(result.rows);
    } catch (e) {
        logger.error("Vault log error:", { error: e, tenantId: req.query.tenantId });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
