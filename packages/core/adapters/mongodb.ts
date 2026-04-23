// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

export class MongoAdapter implements Adapter {
    private client: {
        connect: () => Promise<void>;
        close: () => Promise<void>;
        db: (name?: string) => {
            collection: (name: string) => {
                insertOne: (doc: Record<string, unknown>) => Promise<{ insertedId: { toString: () => string } }>;
                findOne: (filter: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
                updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>) => Promise<unknown>;
                deleteOne: (filter: Record<string, unknown>) => Promise<{ deletedCount: number }>;
                find: (filter?: Record<string, unknown>) => { toArray: () => Promise<Record<string, unknown>[]> };
            };
        };
    } | null = null;
    private _db: ReturnType<NonNullable<MongoAdapter["client"]>["db"]> | null = null;

    async connect(connectionString: string): Promise<void> {
        // Requires optional peer dependency: npm install mongodb
        const { MongoClient } = require("mongodb");
        this.client = new MongoClient(connectionString) as unknown as NonNullable<MongoAdapter["client"]>;
        await this.client.connect();
        this._db = this.client.db();
    }

    private get agents() {
        if (!this._db) throw new Error("MongoAdapter: call connect() before using the adapter");
        return this._db.collection("agents");
    }

    async createAgent(agent: Agent): Promise<Agent> {
        const { id, ...doc } = agent;
        const result = await this.agents.insertOne(doc as Record<string, unknown>);
        return { ...agent, id: result.insertedId.toString() };
    }

    async getAgent(id: string): Promise<Agent | null> {
        const { ObjectId } = require("mongodb");
        const doc = await this.agents.findOne({ _id: new ObjectId(id) });
        if (!doc) return null;
        const { _id, ...rest } = doc;
        return { id: (_id as { toString: () => string }).toString(), ...rest } as Agent;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        const { ObjectId } = require("mongodb");
        const { id: _id, ...fields } = updates;
        await this.agents.updateOne({ _id: new ObjectId(id) }, { $set: fields as Record<string, unknown> });
        return { id, ...updates } as Agent;
    }

    async deleteAgent(id: string): Promise<boolean> {
        const { ObjectId } = require("mongodb");
        const result = await this.agents.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        const query = filter?.userId ? { user_id: filter.userId } : {};
        const docs = await this.agents.find(query).toArray();
        return docs.map(doc => {
            const { _id, ...rest } = doc;
            return { id: (_id as { toString: () => string }).toString(), ...rest } as Agent;
        });
    }
}
