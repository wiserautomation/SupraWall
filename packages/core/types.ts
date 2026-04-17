// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export type RuleDecision = "ALLOW" | "DENY" | "REQUIRE_APPROVAL";

export interface PolicyRule {
    name?: string;
    description?: string;
    tool: string; // Regex or glob pattern
    action: RuleDecision;
    condition?: {
        type: "regex" | "contains";
        pattern: string;
        field?: string; // Target specific argument key
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
