// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export interface Agent {
    id?: string;
    name: string;
    description?: string;
    [key: string]: any;
}

export interface Adapter {
    connect(connectionString: string): Promise<void>;
    createAgent(agent: Agent): Promise<Agent>;
    getAgent(id: string): Promise<Agent | null>;
    updateAgent(id: string, updates: Partial<Agent>): Promise<Agent>;
    deleteAgent(id: string): Promise<boolean>;
    listAgents(filter?: { userId?: string }): Promise<Agent[]>;
}

export interface SupraWallConfig {
    adapter: "postgres" | "mysql" | "mongo" | "supabase" | "sqlite" | "firebase";
    connectionString?: string;
    projectId?: string; // For supabase/firebase
    apiKey?: string;    // For supabase/firebase
}
