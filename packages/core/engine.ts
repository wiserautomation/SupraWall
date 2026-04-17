// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { SupraWallPolicy, EvaluateRequest, EvaluateResponse, PolicyRule, RuleDecision } from "./types";

export class DeterministicEngine {
    private policies: SupraWallPolicy[] = [];

    constructor(policies: SupraWallPolicy[] = []) {
        this.policies = policies;
    }

    /**
     * Evaluate an agent action against the loaded policies.
     * This follows the Layer 1 (Deterministic) execution: Zero network, <1.2ms.
     */
    public evaluate(request: EvaluateRequest): EvaluateResponse {
        let finalDecision: RuleDecision = "ALLOW";
        let matchedRule: PolicyRule | undefined = undefined;
        let reason = "Default allow: No matching deny or approval rules found.";

        // Flatten all rules from all policies
        const allRules = this.policies.flatMap(p => p.rules);

        for (const rule of allRules) {
            if (this.matchesTool(request.toolName, rule.tool)) {
                // Check additional conditions if any
                if (rule.condition) {
                    if (!this.matchesCondition(request.arguments, rule.condition)) {
                        continue;
                    }
                }

                // If we match, the action determines the priority
                // Priority: DENY > REQUIRE_APPROVAL > ALLOW
                if (rule.action === "DENY") {
                    return {
                        decision: "DENY",
                        reason: rule.message || `Action blocked by policy rule: ${rule.name || rule.tool}`,
                        matchedRule: rule
                    };
                } else if (rule.action === "REQUIRE_APPROVAL") {
                    // We don't return immediately because a DENY might come later in the rules
                    finalDecision = "REQUIRE_APPROVAL";
                    matchedRule = rule;
                    reason = rule.message || `Human approval required for: ${rule.name || rule.tool}`;
                } else if (rule.action === "ALLOW" && finalDecision === "ALLOW") {
                    matchedRule = rule;
                    reason = `Explicitly allowed by rule: ${rule.name || rule.tool}`;
                }
            }
        }

        return {
            decision: finalDecision,
            reason: reason,
            matchedRule: matchedRule
        };
    }

    private matchesTool(actualTool: string, pattern: string): boolean {
        try {
            // Convert glob-like * to regex
            const regexSource = pattern.includes('*') 
                ? '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
                : pattern;
            
            const re = new RegExp(regexSource, 'i');
            return re.test(actualTool);
        } catch (e) {
            return false;
        }
    }

    private matchesCondition(args: Record<string, any>, condition: NonNullable<PolicyRule['condition']>): boolean {
        const argString = JSON.stringify(args);
        
        if (condition.type === "regex") {
            try {
                const re = new RegExp(condition.pattern, 'i');
                return re.test(argString);
            } catch (e) {
                return false;
            }
        } else if (condition.type === "contains") {
            return argString.toLowerCase().includes(condition.pattern.toLowerCase());
        }
        
        return false;
    }
}
