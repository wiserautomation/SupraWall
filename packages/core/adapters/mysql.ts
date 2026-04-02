// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

type MySQLConnection = {
    execute: (sql: string, params?: unknown[]) => Promise<[Record<string, unknown>[], unknown]>;
    end: () => Promise<void>;
};

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
        const insertResult = result as any as { insertId: number };
        return { id: String(insertResult.insertId), ...agent };
    }

    async getAgent(id: string): Promise<Agent | null> {
        const [rows] = await this.db.execute("SELECT * FROM agents WHERE id = ?", [id]);
        const agents = rows as Agent[];
        return agents[0] ?? null;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        await this.db.execute(
            "UPDATE agents SET name = ?, description = ? WHERE id = ?",
            [updates.name, updates.description ?? null, id]
        );
        return { id, ...updates } as Agent;
    }

    async deleteAgent(id: string): Promise<boolean> {
        const [result] = await this.db.execute("DELETE FROM agents WHERE id = ?", [id]);
        const res = result as any as { affectedRows: number };
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
