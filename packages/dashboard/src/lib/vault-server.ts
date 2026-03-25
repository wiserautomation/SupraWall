// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import { db } from './firebase-admin';
import * as crypto from 'crypto';

const VAULT_TOKEN_PATTERN = /$SUPRAWALL_VAULT_([A-Z][A-Z0-9_]{2,63})/g;
const ALGORITHM = 'aes-256-cbc';
// Use a fixed IV for now to keep it simple, or store it alongside the value.
// Storing alongside is better. Format: iv:encryptedValue
const IV_LENGTH = 16; 

function getEncryptionKey() {
    const key = process.env.VAULT_ENCRYPTION_KEY;
    if (!key) {
        // Fallback or throw error. Let's throw for security.
        throw new Error("VAULT_ENCRYPTION_KEY is not set in environment variables.");
    }
    // Ensure 32 bytes
    return crypto.createHash('sha256').update(String(key)).digest();
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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

        const secretSnap = await db.collection("vault_secrets")
            .where("tenant_id", "==", tenantId)
            .where("secret_name", "==", secretName)
            .limit(1)
            .get();

        if (secretSnap.empty) {
            errors.push({ secretName, reason: "NOT_FOUND", message: `Secret '${secretName}' not found in vault` });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "NOT_FOUND");
            continue;
        }

        const secretDoc = secretSnap.docs[0];
        const secret = secretDoc.data();

        if (secret.expires_at) {
            const expiry = secret.expires_at.toDate ? secret.expires_at.toDate() : new Date(secret.expires_at);
            if (expiry < new Date()) {
                errors.push({ secretName, reason: "EXPIRED", message: `Secret '${secretName}' has expired` });
                await logVaultAccess(tenantId, agentId, secretName, toolName, "EXPIRED");
                continue;
            }
        }

        const ruleSnap = await db.collection("vault_access_rules")
            .where("tenant_id", "==", tenantId)
            .where("agent_id", "==", agentId)
            .where("secret_name", "==", secretName)
            .limit(1)
            .get();

        if (ruleSnap.empty) {
            errors.push({ secretName, reason: "ACCESS_DENIED", message: `Agent '${agentId}' has no access to secret '${secretName}'` });
            await logVaultAccess(tenantId, agentId, secretName, toolName, "DENIED");
            continue;
        }

        const rule = ruleSnap.docs[0].data();

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

        const decryptedValue = decrypt(secret.encrypted_value);
        resolvedArgsString = resolvedArgsString.split(token).join(decryptedValue);
        injectedSecrets.push(secretName);
        secretValues.push(decryptedValue);

        await logVaultAccess(tenantId, agentId, secretName, toolName, "INJECTED");
        await incrementRateLimit(tenantId, agentId, secretName);
    }

    if (errors.length > 0) {
        return { success: false, resolvedArgs: args, injectedSecrets: [], secretValues: [], errors };
    }

    return {
        success: true,
        resolvedArgs: JSON.parse(resolvedArgsString),
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
    const windowStartStr = windowStart.toISOString();
    
    // Format doc ID to avoid conflicts: tenant:agent:secret:window
    const docId = `${tenantId}:${agentId}:${secretName}:${windowStartStr}`;
    const snap = await db.collection("vault_rate_limits").doc(docId).get();
    
    if (!snap.exists) return true;
    return (snap.data()?.use_count || 0) < maxPerHour;
}

async function incrementRateLimit(
    tenantId: string,
    agentId: string,
    secretName: string
): Promise<void> {
    const windowStart = getHourWindow();
    const windowStartStr = windowStart.toISOString();
    const docId = `${tenantId}:${agentId}:${secretName}:${windowStartStr}`;
    
    const docRef = db.collection("vault_rate_limits").doc(docId);
    await db.runTransaction(async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists) {
            transaction.set(docRef, {
                tenant_id: tenantId,
                agent_id: agentId,
                secret_name: secretName,
                window_start: windowStart,
                use_count: 1
            });
        } else {
            transaction.update(docRef, {
                use_count: (snap.data()?.use_count || 0) + 1
            });
        }
    });
}

function getHourWindow(): Date {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setMilliseconds(0);
    return now;
}

export async function logVaultAccess(
    tenantId: string,
    agentId: string,
    secretName: string,
    toolName: string,
    action: string,
    metadata?: any
): Promise<void> {
    await db.collection("vault_access_log").add({
        tenant_id: tenantId,
        agent_id: agentId,
        secret_name: secretName,
        tool_name: toolName,
        action,
        request_metadata: metadata || {},
        created_at: new Date()
    });
}
