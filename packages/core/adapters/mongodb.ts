// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

export class MongoAdapter implements Adapter {
    private client: any;
    private db: any;

    async connect(connectionString: string): Promise<void> {
        // In a real implementation we would use 'mongodb' package:
        // const { MongoClient } = require('mongodb');
        // this.client = new MongoClient(connectionString);
        // await this.client.connect();
        // this.db = this.client.db();
        console.log(`Connected to MongoDB with ${connectionString}`);
    }

    async createAgent(agent: Agent): Promise<Agent> {
        // const result = await this.db.collection('agents').insertOne(agent);
        // return { id: result.insertedId.toString(), ...agent };
        const created = { id: `mongo-${Date.now()}`, ...agent };
        console.log("MongoDB: createAgent", created);
        return created;
    }

    async getAgent(id: string): Promise<Agent | null> {
        // const { ObjectId } = require('mongodb');
        // const doc = await this.db.collection('agents').findOne({ _id: new ObjectId(id) });
        // return doc ? { ...doc, id: doc._id.toString() } : null;
        return null;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        // const { ObjectId } = require('mongodb');
        // await this.db.collection('agents').updateOne({ _id: new ObjectId(id) }, { $set: updates });
        // return { id, ...updates };
        return { id, name: "Updated Agent", ...updates };
    }

    async deleteAgent(id: string): Promise<boolean> {
        // const { ObjectId } = require('mongodb');
        // const result = await this.db.collection('agents').deleteOne({ _id: new ObjectId(id) });
        // return result.deletedCount > 0;
        return true;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        // const docs = await this.db.collection('agents').find().toArray();
        // return docs.map(doc => ({ ...doc, id: doc._id.toString() }));
        return [];
    }
}
