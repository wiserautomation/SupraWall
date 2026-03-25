// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { pool } from "../db";
import { AuthProvider, AgentInfo } from "./types";

/**
 * PostgreSQL Auth Provider
 *
 * Default authentication provider for self-hosted SupraWall deployments.
 * Validates API keys and retrieves agent information directly from PostgreSQL.
 */
export class PostgresAuthProvider implements AuthProvider {
    async validateApiKey(apiKey: string): Promise<AgentInfo | null> {
        try {
            // Query agents table by API key hash
            const result = await pool.query(
                `SELECT id, tenantid, name, scopes, status, max_cost_usd, budget_alert_usd, slack_webhook
                 FROM agents
                 WHERE apikeyhash = $1 AND status = 'active'
                 LIMIT 1`,
                [apiKey]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const agent = result.rows[0];
            return {
                id: agent.id,
                tenantId: agent.tenantid,
                name: agent.name,
                scopes: agent.scopes || [],
                max_cost_usd: agent.max_cost_usd,
                budget_alert_usd: agent.budget_alert_usd,
                slack_webhook: agent.slack_webhook,
                status: agent.status,
            };
        } catch (error) {
            console.error("[PostgresAuth] Error validating API key:", error);
            return null;
        }
    }

    async getAgentById(agentId: string): Promise<AgentInfo | null> {
        try {
            const result = await pool.query(
                `SELECT id, tenantid, name, scopes, status, max_cost_usd, budget_alert_usd, slack_webhook
                 FROM agents
                 WHERE id = $1
                 LIMIT 1`,
                [agentId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const agent = result.rows[0];
            return {
                id: agent.id,
                tenantId: agent.tenantid,
                name: agent.name,
                scopes: agent.scopes || [],
                max_cost_usd: agent.max_cost_usd,
                budget_alert_usd: agent.budget_alert_usd,
                slack_webhook: agent.slack_webhook,
                status: agent.status,
            };
        } catch (error) {
            console.error("[PostgresAuth] Error getting agent:", error);
            return null;
        }
    }
}
