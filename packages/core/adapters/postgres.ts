// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

// Whitelist of columns that may appear in UPDATE SET clauses.
// Prevents SQL injection via dynamically-constructed column names.
const ALLOWED_COLUMNS = new Set([
    "name", "description", "status", "scopes", "slack_webhook",
    "max_cost_usd", "budget_alert_usd", "max_iterations", "loop_detection",
    "apikeyhash", "tenantid", "user_id", "metadata",
]);

export class PostgresAdapter implements Adapter {
    private client: {
        query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
        end: () => Promise<void>;
    } | null = null;

    async connect(connectionString: string): Promise<void> {
        // Requires optional peer dependency: npm install pg @types/pg
        const { Client } = await import("pg");
        const client = new Client({ connectionString });
        await client.connect();
        this.client = client as any;
    }

    private get db() {
        if (!this.client) throw new Error("PostgresAdapter: call connect() before using the adapter");
        return this.client;
    }

    async createAgent(agent: Agent): Promise<Agent> {
        const res = await this.db.query(
            "INSERT INTO agents (name, description) VALUES ($1, $2) RETURNING *",
            [agent.name, agent.description ?? null]
        );
        return res.rows[0] as Agent;
    }

    async getAgent(id: string): Promise<Agent | null> {
        const res = await this.db.query("SELECT * FROM agents WHERE id = $1", [id]);
        return (res.rows[0] as Agent) ?? null;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        const { id: _ignoreId, ...fields } = updates;
        const keys = Object.keys(fields).filter(k => ALLOWED_COLUMNS.has(k));
        if (keys.length === 0) {
            const existing = await this.getAgent(id);
            if (!existing) throw new Error(`Agent ${id} not found`);
            return existing;
        }
        const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
        const values = keys.map(k => (fields as Record<string, unknown>)[k] ?? null);
        values.push(id);
        const res = await this.db.query(
            `UPDATE agents SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
            values
        );
        return res.rows[0] as Agent;
    }

    async deleteAgent(id: string): Promise<boolean> {
        const res = await this.db.query(
            "DELETE FROM agents WHERE id = $1 RETURNING id",
            [id]
        );
        return res.rows.length > 0;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        if (filter?.userId) {
            const res = await this.db.query(
                "SELECT * FROM agents WHERE user_id = $1",
                [filter.userId]
            );
            return res.rows as Agent[];
        }
        const res = await this.db.query("SELECT * FROM agents");
        return res.rows as Agent[];
    }
}
