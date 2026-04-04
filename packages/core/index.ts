// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { SupraWallConfig, Adapter, Agent } from "./types";
import { PostgresAdapter } from "./adapters/postgres";
import { MySQLAdapter } from "./adapters/mysql";
import { MongoAdapter } from "./adapters/mongodb";
import { SupabaseAdapter } from "./adapters/supabase";
import { FirebaseAdapter } from "./adapters/firebase";

export class SupraWall {
    private configOptions: SupraWallConfig | null = null;
    private adapter: Adapter | null = null;
    private _connectionPromise: Promise<void> | null = null;

    config(config: SupraWallConfig) {
        this.configOptions = config;

        switch (config.adapter) {
            case "postgres":
                this.adapter = new PostgresAdapter();
                break;
            case "mysql":
                this.adapter = new MySQLAdapter();
                break;
            case "mongo":
                this.adapter = new MongoAdapter();
                break;
            case "supabase":
                this.adapter = new SupabaseAdapter();
                break;
            case "firebase":
                this.adapter = new FirebaseAdapter();
                break;
            default:
                throw new Error(`Adapter ${config.adapter} is not supported yet.`);
        }

        if (config.connectionString) {
            this._connectionPromise = this.adapter.connect(config.connectionString).catch(err => {
                process.stderr.write(`[SupraWall] Failed to connect ${config.adapter} adapter: ${err}\n`);
                throw err;
            });
        }
    }

    /**
     * Explicit async initializer. Call this after config() to guarantee the
     * database connection is established before performing any operations.
     *
     * @example
     *   suprawall.config({ adapter: "postgres", connectionString: "..." });
     *   await suprawall.init(); // waits for the connection
     */
    async init(): Promise<void> {
        if (this._connectionPromise) {
            await this._connectionPromise;
        }
    }

    // Expose internal setter for test/interop
    __interop_setAdapterDb(db: any) {
        if (this.adapter && 'setDb' in this.adapter) {
            (this.adapter as any).setDb(db);
        }
    }

    get agents() {
        if (!this.adapter) {
            throw new Error("SupraWall is not configured. Call suprawall.config() first.");
        }
        const adapter = this.adapter;
        const ensureConnected = this._connectionPromise
            ? () => this._connectionPromise!
            : () => Promise.resolve();

        return {
            create: async (agent: Agent) => { await ensureConnected(); return adapter.createAgent(agent); },
            get: async (id: string) => { await ensureConnected(); return adapter.getAgent(id); },
            update: async (id: string, updates: Partial<Agent>) => { await ensureConnected(); return adapter.updateAgent(id, updates); },
            delete: async (id: string) => { await ensureConnected(); return adapter.deleteAgent(id); },
            list: async (filter?: { userId?: string }) => { await ensureConnected(); return adapter.listAgents(filter); },
        };
    }
}

export const suprawall = new SupraWall();
export * from "./types";
export * from "./semantic";
export * from "./vault";
