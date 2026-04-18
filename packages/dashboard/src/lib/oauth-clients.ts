// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import "server-only";

export interface OAuthClient {
    clientId: string;
    clientSecret: string;
    redirectUris: string[];
    name: string;
}

/**
 * Hardcoded registry of allowed OAuth clients (C4, C5 remediation).
 * In a production multi-tenant environment, this would be moved to a 
 * 'oauth_clients' Firestore collection.
 */
const CLIENT_REGISTRY: Record<string, OAuthClient> = {
    "suprawall_cli": {
        clientId: "suprawall_cli",
        clientSecret: (() => {
            const secret = process.env.MCP_CLI_CLIENT_SECRET;
            if (!secret && process.env.NODE_ENV === "production") {
                throw new Error("CRITICAL SECURITY: MCP_CLI_CLIENT_SECRET is not set in production. OAuth token exchange is compromised.");
            }
            return secret || "cli_secret_dev_fallback";
        })(),
        redirectUris: ["http://localhost:3000/callback", "https://www.supra-wall.com/api/mcp/auth/callback"],
        name: "SupraWall CLI"
    },
};

export function getOAuthClient(clientId: string): OAuthClient | null {
    return CLIENT_REGISTRY[clientId] || null;
}

export function isValidRedirectUri(client: OAuthClient, redirectUri: string): boolean {
    return client.redirectUris.includes(redirectUri);
}

export function verifyClientSecret(client: OAuthClient, clientSecret: string): boolean {
    // If we're using a public client (like CLI) without a secret, we might skip this 
    // or use PKCE. For now, we enforce the registered secret.
    return client.clientSecret === clientSecret;
}
