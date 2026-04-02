// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

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
        const res = await this.db.query(
            "UPDATE agents SET name = $1, description = $2 WHERE id = $3 RETURNING *",
            [updates.name, updates.description ?? null, id]
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
