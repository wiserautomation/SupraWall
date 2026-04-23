// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// This is a browser-safe version of the SupraWall core.
// It excludes database adapters that require Node.js modules like 'pg', 'net', or 'tls'.

import { SupraWallConfig, Adapter, Agent } from "./types";
import { SupabaseAdapter } from "./adapters/supabase";
import { FirebaseAdapter } from "./adapters/firebase";

export class SupraWall {
    private adapter: Adapter | null = null;
    private _connectionPromise: Promise<void> | null = null;

    private configOptions: SupraWallConfig | null = null;
    private adapters = new Map<string, any>();

    registerAdapter(name: string, AdapterClass: any) {
        this.adapters.set(name, AdapterClass);
    }

    async config(config: SupraWallConfig) {
        this.configOptions = config;

        const AdapterClass = this.adapters.get(config.adapter);
        if (!AdapterClass) {
            throw new Error(`Adapter "${config.adapter}" is not registered.`);
        }

        this.adapter = new AdapterClass();

        if (config.connectionString && this.adapter) {
             this._connectionPromise = this.adapter.connect(config.connectionString);
        }
    }

    async init(): Promise<void> {
        if (this._connectionPromise) await this._connectionPromise;
    }

    __interop_setAdapterDb(db: any) {
        if (this.adapter && 'setDb' in this.adapter) {
            (this.adapter as any).setDb(db);
        }
    }

    get agents() {
        if (!this.adapter) throw new Error("SupraWall is not configured.");
        const adapter = this.adapter;
        return {
            create: async (agent: Agent) => adapter.createAgent(agent),
            get: async (id: string) => adapter.getAgent(id),
            update: async (id: string, updates: Partial<Agent>) => adapter.updateAgent(id, updates),
            delete: async (id: string) => adapter.deleteAgent(id),
            list: async (filter?: { userId?: string }) => adapter.listAgents(filter),
        };
    }
}

export const suprawall = new SupraWall();
export { SupabaseAdapter, FirebaseAdapter };

export * from "./types";
export * from "./engine";
export * from "./semantic";
export * from "./vault";
export * from "./templates/types";
export * from "./templates/baseline-controls";
export * from "./templates/sector-templates";
