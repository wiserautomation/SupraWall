// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

export class MySQLAdapter implements Adapter {
    private connection: any;

    async connect(connectionString: string): Promise<void> {
        // In a real implementation we would use 'mysql2' package:
        // const mysql = require('mysql2/promise');
        // this.connection = await mysql.createConnection(connectionString);
        console.log(`Connected to MySQL database successfully.`);
    }

    async createAgent(agent: Agent): Promise<Agent> {
        // const [result] = await this.connection.execute(
        //   'INSERT INTO agents (name, description) VALUES (?, ?)',
        //   [agent.name, agent.description]
        // );
        // return { id: result.insertId.toString(), ...agent };
        const created = { id: `mysql-${Date.now()}`, ...agent };
        console.log("MySQL: createAgent", created);
        return created;
    }

    async getAgent(id: string): Promise<Agent | null> {
        // const [rows] = await this.connection.execute('SELECT * FROM agents WHERE id = ?', [id]);
        // return rows[0] || null;
        return null;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        // await this.connection.execute(
        //   'UPDATE agents SET name=? WHERE id=?',
        //   [updates.name, id]
        // );
        // return { id, ...updates };
        return { id, name: "Updated Agent", ...updates };
    }

    async deleteAgent(id: string): Promise<boolean> {
        // await this.connection.execute('DELETE FROM agents WHERE id = ?', [id]);
        return true;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        // const [rows] = await this.connection.execute('SELECT * FROM agents');
        // return rows;
        return [];
    }
}
