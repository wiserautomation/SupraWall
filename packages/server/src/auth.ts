// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { pool } from "./db";
import { AuthProvider, AgentInfo } from "./auth/types";
import { PostgresAuthProvider } from "./auth/postgres";
import { logger } from "./logger";
import { hashApiKey } from "./util/hash";
import { TIER_LIMITS } from "./tier-guard";

// Re-export types for backward compatibility
export type { AgentInfo } from "./auth/types";
export type { AuthProvider } from "./auth/types";

export interface AuthenticatedRequest extends Request {
    agent?: AgentInfo;
    tenantId?: string;
    userEmail?: string;
}

/**
 * Initialize the auth provider based on configuration.
 * OSS version defaults to PostgresAuthProvider.
 */
function createAuthProvider(): AuthProvider {
    logger.info("[Auth] Initializing PostgresAuthProvider (OSS)");
    return new PostgresAuthProvider();
}

// Singleton auth provider instance
let authProvider: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
    if (!authProvider) {
        authProvider = createAuthProvider();
    }
    return authProvider;
}

/**
 * Admin authentication middleware.
 * Validates the master API key (Bearer token) against the tenants table.
 */
export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header. Use Bearer sw_admin_xxxx" });
    }

    const masterKey = authHeader.split(" ")[1];
    const hashedMasterKey = hashApiKey(masterKey);

    try {
        const result = await pool.query(
            "SELECT id FROM tenants WHERE master_api_key = $1 LIMIT 1",
            [hashedMasterKey]
        );

        if (result.rows.length > 0) {
            (req as AuthenticatedRequest).tenantId = result.rows[0].id;
            return next();
        }

        return res.status(401).json({ error: "Unauthorized: Invalid Master API Key." });
    } catch (error) {
        logger.error("[AdminAuth] Error:", { error });
        res.status(500).json({ error: "Internal authentication error" });
    }
};

/**
 * Gatekeeper authentication middleware.
 * Validates agent API keys using the configured AuthProvider.
 */
export async function gatekeeperAuth(req: Request, res: Response, next: NextFunction) {
    let apiKey = req.body?.apiKey || req.headers["x-api-key"];
    const authHeader = req.headers.authorization;

    // Support Bearer Token (Master Key) in gatekeeper as well
    if (!apiKey && authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const hashedToken = hashApiKey(token);
        
        const masterRes = await pool.query(
            "SELECT id FROM tenants WHERE master_api_key = $1",
            [hashedToken]
        );
        if (masterRes.rows.length > 0) {
            (req as AuthenticatedRequest).tenantId = masterRes.rows[0].id;
            return next();
        }
    }

    if (!apiKey) {
        return res.status(401).json({
            decision: "DENY",
            reason: "Unauthorized: Missing API Key."
        });
    }

    try {
        const provider = getAuthProvider();
        const agent = await provider.validateApiKey(apiKey);

        if (!agent) {
            return res.status(401).json({
                decision: "DENY",
                reason: "Unauthorized: Invalid API Key."
            });
        }

        if (agent.status && agent.status !== "active") {
            return res.status(403).json({
                decision: "DENY",
                reason: `Unauthorized: Agent is ${agent.status}.`
            });
        }

        (req as AuthenticatedRequest).agent = agent;
        (req as AuthenticatedRequest).tenantId = agent.tenantId;
        next();
    } catch (error) {
        logger.error("[Gatekeeper] Auth error:", { error });
        res.status(500).json({ decision: "DENY", reason: "Internal authentication error" });
    }
}

/**
 * Role-enforcement middleware for organization member management.
 * In OSS mode with Master Key auth, the caller is implicitly the owner.
 */
export function requireMemberRole(requiredRole: "admin" | "owner") {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Master API key holders are implicitly owners
        next();
    };
}

/**
 * Look up an agent by its ID using the configured AuthProvider.
 */
export const getAgentById = async (agentId: string): Promise<AgentInfo | null> => {
    const provider = getAuthProvider();
    return provider.getAgentById(agentId);
};

/**
 * Verify that an agent has the required scope for a tool.
 */
export const verifyScope = (req: AuthenticatedRequest, toolName: string): boolean => {
    const scopes = req.agent?.scopes || [];
    if (scopes.includes("*:*")) return true;
    const [namespace] = toolName.includes(":") ? toolName.split(":") : [null];
    if (namespace && scopes.includes(`${namespace}:*`)) return true;
    return scopes.includes(toolName);
};
