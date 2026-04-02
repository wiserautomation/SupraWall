// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

type SupabaseClient = {
    from: (table: string) => {
        insert: (data: Record<string, unknown>) => { select: () => { single: () => Promise<{ data: Record<string, unknown> | null; error: Error | null }> } };
        select: (cols?: string) => {
            eq: (col: string, val: string) => { single: () => Promise<{ data: Record<string, unknown> | null; error: Error | null }> };
        } & { then: Promise<{ data: Record<string, unknown>[]; error: Error | null }>["then"] };
        update: (data: Record<string, unknown>) => { eq: (col: string, val: string) => { select: () => { single: () => Promise<{ data: Record<string, unknown> | null; error: Error | null }> } } };
        delete: () => { eq: (col: string, val: string) => Promise<{ error: Error | null; count: number }> };
    };
};

export class SupabaseAdapter implements Adapter {
    private supabase: SupabaseClient | null = null;

    async connect(connectionString: string): Promise<void> {
        // Requires optional peer dependency: npm install @supabase/supabase-js
        // connectionString format: "https://<project>.supabase.co|<anon-key>"
        const supabaseUrl = process.env.SUPABASE_URL || connectionString.split("|")[0];
        const supabaseKey = process.env.SUPABASE_KEY || connectionString.split("|")[1];
        if (!supabaseUrl || !supabaseKey) {
            throw new Error("SupabaseAdapter: SUPABASE_URL and SUPABASE_KEY are required");
        }
        const { createClient } = await import("@supabase/supabase-js");
        this.supabase = createClient(supabaseUrl, supabaseKey) as unknown as SupabaseClient;
    }

    private get db(): SupabaseClient {
        if (!this.supabase) throw new Error("SupabaseAdapter: call connect() before using the adapter");
        return this.supabase;
    }

    async createAgent(agent: Agent): Promise<Agent> {
        const { data, error } = await this.db
            .from("agents")
            .insert(agent as Record<string, unknown>)
            .select()
            .single();
        if (error) throw error;
        return data as Agent;
    }

    async getAgent(id: string): Promise<Agent | null> {
        const { data, error } = await this.db
            .from("agents")
            .select("*")
            .eq("id", id)
            .single();
        if (error) return null;
        return data as Agent;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        const { data, error } = await this.db
            .from("agents")
            .update(updates as Record<string, unknown>)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data as Agent;
    }

    async deleteAgent(id: string): Promise<boolean> {
        const { error, count } = await this.db
            .from("agents")
            .delete()
            .eq("id", id);
        if (error) throw error;
        return (count ?? 0) > 0;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        let q = this.db.from("agents").select("*");
        if (filter?.userId) {
            const { data, error } = await (q as unknown as { eq: (c: string, v: string) => Promise<{ data: Record<string, unknown>[]; error: Error | null }> }).eq("user_id", filter.userId);
            if (error) throw error;
            return data as Agent[];
        }
        const { data, error } = await (q as unknown as Promise<{ data: Record<string, unknown>[]; error: Error | null }>);
        if (error) throw error;
        return data as Agent[];
    }
}
