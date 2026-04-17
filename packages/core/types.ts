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
    adapter: "postgres" | "mysql" | "mongo" | "supabase" | "firebase";
    connectionString?: string;
    projectId?: string; // For supabase/firebase
    apiKey?: string;    // For supabase/firebase
}

export type RuleDecision = "ALLOW" | "DENY" | "REQUIRE_APPROVAL";

export interface PolicyRule {
    name?: string;
    description?: string;
    tool: string; // Regex or glob pattern
    action: RuleDecision;
    condition?: {
        type: "regex" | "contains";
        pattern: string;
    };
    message?: string;
}

export interface SupraWallPolicy {
    $schema?: string;
    name: string;
    version: string;
    description?: string;
    rules: PolicyRule[];
}

export interface EvaluateRequest {
    agentId?: string;
    toolName: string;
    arguments: Record<string, any>;
    delegationChain?: string[];
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
}

export interface EvaluateResponse {
    decision: RuleDecision;
    reason: string;
    matchedRule?: PolicyRule;
    approvalId?: string;
    resolvedArguments?: Record<string, any>;
    vaultInjected?: boolean;
    semanticScore?: number;
    threatType?: string;
}
