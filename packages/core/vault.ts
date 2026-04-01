interface IDatabasePool {
    query(text: string, params?: any[]): Promise<any>;
}

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
    reason: "NOT_FOUND" | "ACCESS_DENIED" | "TOOL_NOT_ALLOWED" | "EXPIRED" | "RATE_LIMITED" | "PARSE_ERROR";
    message: string;
}

export async function resolveVaultTokens(
    pool: IDatabasePool,
    encryptionKey: string,
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

    // Perf fix: Batch DB queries to resolve multiple secrets concurrently
    const secretPromises = secretNames.map(async (secretName) => {
        const token = `$SUPRAWALL_VAULT_${secretName}`;

        const secretResult = await pool.query(
            `SELECT id, secret_name, expires_at,
                    pgp_sym_decrypt(encrypted_value, $1) as decrypted_value
             FROM vault_secrets
             WHERE tenant_id = $2 AND secret_name = $3`,
            [encryptionKey, tenantId, secretName]
        );

        if (secretResult.rows.length === 0) {
            return { error: { secretName, reason: "NOT_FOUND", message: `Secret '${secretName}' not found in vault` }, token: null, value: null };
        }

        const secret = secretResult.rows[0];

        if (secret.expires_at && new Date(secret.expires_at) < new Date()) {
            return { error: { secretName, reason: "EXPIRED", message: `Secret '${secretName}' has expired` }, token: null, value: null };
        }

        const ruleResult = await pool.query(
            `SELECT * FROM vault_access_rules
             WHERE tenant_id = $1 AND agent_id = $2 AND secret_id = $3`,
            [tenantId, agentId, secret.id]
        );

        if (ruleResult.rows.length === 0) {
            return { error: { secretName, reason: "ACCESS_DENIED", message: `Agent '${agentId}' has no access to secret '${secretName}'` }, token: null, value: null };
        }

        const rule = ruleResult.rows[0];

        const allowedTools: string[] = rule.allowed_tools || [];
        const toolAllowed = allowedTools.length === 0 || allowedTools.some(pattern => {
            try { return new RegExp(pattern).test(toolName); }
            catch { return pattern === toolName; }
        });

        if (!toolAllowed) {
            return { error: {
                secretName,
                reason: "TOOL_NOT_ALLOWED",
                message: `Secret '${secretName}' cannot be used with tool '${toolName}'. Allowed: ${allowedTools.join(", ")}`
            }, token: null, value: null };
        }

        const rateLimitOk = await checkRateLimit(pool, tenantId, agentId, secretName, rule.max_uses_per_hour);
        if (!rateLimitOk) {
            return { error: {
                secretName,
                reason: "RATE_LIMITED",
                message: `Secret '${secretName}' rate limit exceeded (${rule.max_uses_per_hour}/hour)`
            }, token: null, value: null };
        }

        return { error: null, token, secretName, value: secret.decrypted_value, action: "INJECTED" };
    });

    const results = await Promise.all(secretPromises);

    // FIX: Optimized one-pass replacement to prevent cascading token leaks (Section 2.2)
    const replacementMap = new Map<string, string>();
    for (const res of results) {
        if (res.error) {
            errors.push(res.error as VaultError);
            await logVaultAccess(pool, tenantId, agentId, (res.error as VaultError).secretName, toolName, (res.error as VaultError).reason);
        } else if (res.token) {
            replacementMap.set(res.token, res.value as string);
            injectedSecrets.push(res.secretName as string);
            secretValues.push(res.value as string);
            await logVaultAccess(pool, tenantId, agentId, res.secretName as string, toolName, "INJECTED");
            await incrementRateLimit(pool, tenantId, agentId, res.secretName as string);
        }
    }

    // Perform the actual replacement in one pass using the VAULT_TOKEN_PATTERN
    resolvedArgsString = argsString.replace(VAULT_TOKEN_PATTERN, (match) => {
        return replacementMap.has(match) ? replacementMap.get(match)! : match;
    });

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
                reason: "PARSE_ERROR",
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
    pool: IDatabasePool,
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
    pool: IDatabasePool,
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
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours()));
}

async function logVaultAccess(
    pool: IDatabasePool,
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
