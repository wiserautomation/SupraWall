// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

type MySQLConnection = {
    execute: (sql: string, params?: unknown[]) => Promise<[Record<string, unknown>[], unknown]>;
    end: () => Promise<void>;
};

const ALLOWED_COLUMNS = new Set([
    "name", "description", "status", "scopes", "slack_webhook",
    "max_cost_usd", "budget_alert_usd", "max_iterations", "loop_detection",
    "apikeyhash", "tenantid", "user_id", "metadata", "user_email", "total_evaluation_count"
]);

export class MySQLAdapter implements Adapter {
    private connection: MySQLConnection | null = null;

    async connect(connectionString: string): Promise<void> {
        // Requires optional peer dependency: npm install mysql2
        const mysql = await import("mysql2/promise");
        this.connection = await mysql.createConnection(connectionString) as unknown as MySQLConnection;
    }

    private get db(): MySQLConnection {
        if (!this.connection) throw new Error("MySQLAdapter: call connect() before using the adapter");
        return this.connection;
    }

    async createAgent(agent: Agent): Promise<Agent> {
        const [result] = await this.db.execute(
            "INSERT INTO agents (name, description) VALUES (?, ?)",
            [agent.name, agent.description ?? null]
        );
        const insertResult = result as unknown as { insertId: number | string };
        return { id: String(insertResult.insertId), ...agent };
    }

    async getAgent(id: string): Promise<Agent | null> {
        const [rows] = await this.db.execute("SELECT * FROM agents WHERE id = ?", [id]);
        const agents = rows as Agent[];
        return agents[0] ?? null;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        const { id: _ignoreId, ...fields } = updates;
        const keys = Object.keys(fields).filter(k => ALLOWED_COLUMNS.has(k));
        if (keys.length === 0) {
            const existing = await this.getAgent(id);
            if (!existing) throw new Error(`Agent ${id} not found`);
            return existing;
        }
        const setClauses = keys.map(key => `${key} = ?`);
        const values = keys.map(k => (fields as Record<string, unknown>)[k] ?? null);
        values.push(id);
        await this.db.execute(
            `UPDATE agents SET ${setClauses.join(", ")} WHERE id = ?`,
            values
        );
        // Re-fetch to return accurate state
        const updated = await this.getAgent(id);
        if (!updated) throw new Error(`Agent ${id} not found after update`);
        return updated;
    }

    async deleteAgent(id: string): Promise<boolean> {
        const [result] = await this.db.execute("DELETE FROM agents WHERE id = ?", [id]);
        const res = result as unknown as { affectedRows: number };
        return res.affectedRows > 0;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        if (filter?.userId) {
            const [rows] = await this.db.execute(
                "SELECT * FROM agents WHERE user_id = ?",
                [filter.userId]
            );
            return rows as Agent[];
        }
        const [rows] = await this.db.execute("SELECT * FROM agents");
        return rows as Agent[];
    }
}
