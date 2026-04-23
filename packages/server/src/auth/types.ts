// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Auth Provider Interface
 *
 * Defines the contract for authentication providers in SupraWall.
 * The server ships with PostgresAuthProvider by default.
 * Additional providers (Firebase, etc.) can be plugged in via configuration.
 */

export interface AgentInfo {
    id: string;
    tenantId: string;
    name: string;
    scopes: string[];
    max_cost_usd?: number;
    budget_alert_usd?: number;
    slack_webhook?: string;
    status?: string;
}

export interface AuthProvider {
    /**
     * Validate an API key and return the associated agent info.
     * Returns null if the key is invalid or the agent is not found.
     */
    validateApiKey(apiKey: string): Promise<AgentInfo | null>;

    /**
     * Look up an agent by its ID.
     * Returns null if the agent is not found.
     */
    getAgentById(agentId: string): Promise<AgentInfo | null>;
}
