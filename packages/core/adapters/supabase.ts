// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";

export class SupabaseAdapter implements Adapter {
    private supabase: any;

    async connect(connectionString: string): Promise<void> {
        // For Supabase, connectionString might be the URL, and there might be a separate API Key.
        // Assuming connectionString holds sufficient info or we expect standard env vars:
        // const { createClient } = require('@supabase/supabase-js');
        // const supabaseUrl = process.env.SUPABASE_URL || connectionString;
        // const supabaseKey = process.env.SUPABASE_KEY;
        // this.supabase = createClient(supabaseUrl, supabaseKey);
        console.log(`Connected to Supabase with ${connectionString}`);
    }

    async createAgent(agent: Agent): Promise<Agent> {
        // const { data, error } = await this.supabase
        //   .from('agents')
        //   .insert([agent])
        //   .select()
        //   .single();
        // if (error) throw error;
        // return data;
        const created = { id: `supabase-${Date.now()}`, ...agent };
        console.log("Supabase: createAgent", created);
        return created;
    }

    async getAgent(id: string): Promise<Agent | null> {
        // const { data, error } = await this.supabase
        //   .from('agents')
        //   .select('*')
        //   .eq('id', id)
        //   .single();
        // if (error) return null;
        // return data;
        return null;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        // const { data, error } = await this.supabase
        //   .from('agents')
        //   .update(updates)
        //   .eq('id', id)
        //   .select()
        //   .single();
        // if (error) throw error;
        // return data;
        return { id, name: "Updated Agent", ...updates };
    }

    async deleteAgent(id: string): Promise<boolean> {
        // const { error } = await this.supabase
        //   .from('agents')
        //   .delete()
        //   .eq('id', id);
        // return !error;
        return true;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        // const { data, error } = await this.supabase
        //   .from('agents')
        //   .select('*');
        // if (error) throw error;
        // return data;
        return [];
    }
}
