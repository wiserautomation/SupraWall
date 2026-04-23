// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import "server-only";
import { db } from "./firebase-admin";

export interface MCPTokenData {
    userId: string;
    agentId?: string | null;
    clientId: string;
    expiresAt: Date;
    scope: string;
}

/**
 * Verifies an MCP OAuth access token against Firestore. (H5 remediation)
 */
export async function verifyMCPToken(token: string): Promise<MCPTokenData | null> {
    if (!token) return null;

    try {
        const snap = await db.collection("mcp_oauth_tokens").doc(token).get();
        if (!snap.exists) return null;

        const data = snap.data()!;
        const expiresAt = data.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);

        if (expiresAt < new Date()) {
            await db.collection("mcp_oauth_tokens").doc(token).delete();
            return null;
        }

        return {
            userId: data.userId,
            agentId: data.agentId,
            clientId: data.clientId,
            expiresAt,
            scope: data.scope || "mcp:all"
        };
    } catch (err) {
        console.error("[MCP Auth] Token verification failed:", err);
        return null;
    }
}
