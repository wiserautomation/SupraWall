// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { pool } from "./db";
import { AuthProvider, AgentInfo } from "./auth/types";
import { PostgresAuthProvider } from "./auth/postgres";

// Re-export types for backward compatibility
export type { AgentInfo } from "./auth/types";
export type { AuthProvider } from "./auth/types";

export interface AuthenticatedRequest extends Request {
    agent?: AgentInfo;
    tenantId?: string;
}

/**
 * Initialize the auth provider based on configuration.
 *
 * Priority:
 *   1. AUTH_PROVIDER=firebase → FirebaseAuthProvider (requires firebase-admin)
 *   2. AUTH_PROVIDER=postgres → PostgresAuthProvider (default)
 *   3. No config → PostgresAuthProvider
 */
function createAuthProvider(): AuthProvider {
    const providerType = (process.env.AUTH_PROVIDER || "postgres").toLowerCase();

    if (providerType === "firebase") {
        try {
            const { FirebaseAuthProvider } = require("./auth/firebase");
            console.log("[Auth] Using FirebaseAuthProvider");
            return new FirebaseAuthProvider();
        } catch (e) {
            console.warn("[Auth] Firebase provider requested but failed to load. Falling back to PostgreSQL.");
            return new PostgresAuthProvider();
        }
    }

    console.log("[Auth] Using PostgresAuthProvider");
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

    try {
        const result = await pool.query(
            "SELECT id FROM tenants WHERE master_api_key = $1",
            [masterKey]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Unauthorized: Invalid Master API Key." });
        }

        (req as AuthenticatedRequest).tenantId = result.rows[0].id;
        next();
    } catch (error) {
        console.error("[AdminAuth] Error:", error);
        res.status(500).json({ error: "Internal authentication error" });
    }
};

/**
 * Gatekeeper authentication middleware.
 * Validates agent API keys using the configured AuthProvider.
 */
export const gatekeeperAuth = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract API Key
    const apiKey = (req.headers["x-api-key"] as string) || req.body.apiKey;

    if (!apiKey) {
        return res.status(401).json({
            decision: "DENY",
            reason: "Unauthorized: Missing API Key. Get your key at https://supra-wall.com"
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

        if (agent.status === "inactive") {
            return res.status(403).json({
                decision: "DENY",
                reason: "Unauthorized: Agent is inactive."
            });
        }

        // 2. Attach agent info to request
        (req as AuthenticatedRequest).agent = agent;
        next();
    } catch (error) {
        console.error("[Gatekeeper] Auth error:", error);
        res.status(500).json({ decision: "DENY", reason: "Internal authentication error" });
    }
};

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

    // Simple wildcard support: "*:*" or "namespace:*"
    if (scopes.includes("*:*")) return true;

    const [namespace] = toolName.includes(":") ? toolName.split(":") : [null];

    if (namespace && scopes.includes(`${namespace}:*`)) return true;

    return scopes.includes(toolName);
};
