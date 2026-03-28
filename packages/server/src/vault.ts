// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { pool } from "./db";

const VAULT_TOKEN_PATTERN = /\$SUPRAWALL_VAULT_([A-Z][A-Z0-9_]{2,63})/g;

export interface VaultResolutionResult {
    success: boolean;
    resolvedArgs: any;
    injectedSecrets: string[];
    secretValues: string[];
    errors: VaultError[];
}

export interface VaultError {
    secretName: string;
    reason: "NOT_FOUND" | "ACCESS_DENIED" | "TOOL_NOT_ALLOWED" | "EXPIRED" | "RATE_LIMITED";
    message: string;
}

export async function resolveVaultTokens(
    tenantId: string,
    agentId: string,
    toolName: string,
    args: any
): Promise<VaultResolutionResult> {
    const argsString = JSON.stringify(args);
    const tokenMatches = [...argsString.matchAll(VAULT_TOKEN_PATTERN)];

    if (tokenMatches.length === 0) {
        return { success: true, resolvedArgs: args, injectedSecrets: [], secretValues: [], errors: [] };
    }

    const secretNames = [...new Set(tokenMatches.map(m => m[1]))];
    const errors: VaultError[] = [];
    const injectedSecrets: string[] = [];
    const secretValues: string[] = [];
    let resolvedArgsString = argsString;

    for (const secretName of secretNames) {
        const token = `$SUPRAWALL_VAULT_${secretName}`;

        const secretResult = await pool.query(
            `SELECT id, secret_name, expires_at,
                    pgp_sym_decrypt(encrypted_value, $1) as decrypted_value
             FROM vault_secrets
             WHERE tenant_id = $2 AND secret_name = $3`,
            [process.env.VAULT_ENCRYPTION_KEY, tenantId, secretName]
        );

        if (secretResult.rows.length === 0) {
            errors.push({ secretName, reason: "NOT_FOUND", message: `Secret '${secretName}' not found in vault` });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "NOT_FOUND");
            continue;
        }

        const secret = secretResult.rows[0];

        if (secret.expires_at && new Date(secret.expires_at) < new Date()) {
            errors.push({ secretName, reason: "EXPIRED", message: `Secret '${secretName}' has expired` });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "EXPIRED");
            continue;
        }

        const ruleResult = await pool.query(
            `SELECT * FROM vault_access_rules
             WHERE tenant_id = $1 AND agent_id = $2 AND secret_id = $3`,
            [tenantId, agentId, secret.id]
        );

        if (ruleResult.rows.length === 0) {
            errors.push({ secretName, reason: "ACCESS_DENIED", message: `Agent '${agentId}' has no access to secret '${secretName}'` });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "DENIED");
            continue;
        }

        const rule = ruleResult.rows[0];

        const allowedTools: string[] = rule.allowed_tools || [];
        const toolAllowed = allowedTools.length === 0 || allowedTools.some(pattern => {
            try { return new RegExp(pattern).test(toolName); }
            catch { return pattern === toolName; }
        });

        if (!toolAllowed) {
            errors.push({
                secretName,
                reason: "TOOL_NOT_ALLOWED",
                message: `Secret '${secretName}' cannot be used with tool '${toolName}'. Allowed: ${allowedTools.join(", ")}`
            });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "DENIED");
            continue;
        }

        const rateLimitOk = await checkRateLimit(tenantId, agentId, secretName, rule.max_uses_per_hour);
        if (!rateLimitOk) {
            errors.push({
                secretName,
                reason: "RATE_LIMITED",
                message: `Secret '${secretName}' rate limit exceeded (${rule.max_uses_per_hour}/hour)`
            });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "RATE_LIMITED");
            continue;
        }

        const decryptedValue = secret.decrypted_value;
        resolvedArgsString = resolvedArgsString.split(token).join(decryptedValue);
        injectedSecrets.push(secretName);
        secretValues.push(decryptedValue);

        await logVaultAccess(tenantId, agentId, secretName, toolName, "INJECTED");
        await incrementRateLimit(tenantId, agentId, secretName);
    }

    if (errors.length > 0) {
        return { success: false, resolvedArgs: args, injectedSecrets: [], secretValues: [], errors };
    }

    let parsedArgs;
    try {
        parsedArgs = JSON.parse(resolvedArgsString);
    } catch (parseErr) {
        return {
            success: false,
            resolvedArgs: args,
            injectedSecrets: [],
            secretValues: [],
            errors: [{
                secretName: "unknown",
                reason: "EXPIRED",
                message: "Failed to parse resolved arguments after vault injection."
            }]
        };
    }

    return {
        success: true,
        resolvedArgs: parsedArgs,
        injectedSecrets,
        secretValues,
        errors: []
    };
}

async function checkRateLimit(
    tenantId: string,
    agentId: string,
    secretName: string,
    maxPerHour: number
): Promise<boolean> {
    const windowStart = getHourWindow();
    const result = await pool.query(
        `SELECT use_count FROM vault_rate_limits
         WHERE tenant_id = $1 AND agent_id = $2 AND secret_name = $3 AND window_start = $4`,
        [tenantId, agentId, secretName, windowStart]
    );
    if (result.rows.length === 0) return true;
    return result.rows[0].use_count < maxPerHour;
}

async function incrementRateLimit(
    tenantId: string,
    agentId: string,
    secretName: string
): Promise<void> {
    const windowStart = getHourWindow();
    await pool.query(
        `INSERT INTO vault_rate_limits (tenant_id, agent_id, secret_name, window_start, use_count)
         VALUES ($1, $2, $3, $4, 1)
         ON CONFLICT (tenant_id, agent_id, secret_name, window_start)
         DO UPDATE SET use_count = vault_rate_limits.use_count + 1`,
        [tenantId, agentId, secretName, windowStart]
    );
}

function getHourWindow(): Date {
    // Use UTC to ensure consistent windows across servers/timezones
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours()));
}

async function logVaultAccess(
    tenantId: string,
    agentId: string,
    secretName: string,
    toolName: string,
    action: string,
    metadata?: any
): Promise<void> {
    await pool.query(
        `INSERT INTO vault_access_log (tenant_id, agent_id, secret_name, tool_name, action, request_metadata)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [tenantId, agentId, secretName, toolName, action, JSON.stringify(metadata || {})]
    );
}
