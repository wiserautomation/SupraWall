// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { admin } from '@/lib/firebase-admin';
import * as crypto from 'crypto';
import { resolveVaultTokens } from '@/lib/vault-server';
import { scrubPii } from '@/lib/guardrail-scrubber';

// ── Types ──

interface PolicyRule {
    toolPattern: string;
    action: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    conditions?: Record<string, any>;
}

interface RateLimitConfig {
    requestsPerMinute: number;
    requestsPerDay: number;
}

interface EvaluateResponse {
    decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    reason?: string;
    estimated_cost_usd?: number;
    is_loop?: boolean;
}

// ── Route Handler ──

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    let {
        apiKey,
        toolName,
        args,
        sessionId = null,
        agentRole = null,
        model = "gpt-4o-mini",
        inputTokens = 0,
        outputTokens = 0,
        costUsd = null,
        isLoop = false
    } = body;

    if (!apiKey || !toolName || args === undefined) {
        return NextResponse.json({ error: "apiKey and toolName are required." }, { status: 400 });
    }

    try {
        let tenantId: string;
        let agentId: string;
        let userId: string;
        let showBranding: boolean = true;
        let effectiveRules: PolicyRule[] = [];
        let effectiveRateLimit: RateLimitConfig | null = null;
        let platformId: string | null = null;
        let customerId: string | null = null;
        let agentName: string = "Unknown Agent";

        // ── Auth & Key Resolution ──

        if (apiKey.startsWith("agc_")) {
            // Platform connect key
            const subKeySnap = await db.collection("connect_keys").doc(apiKey).get();
            if (!subKeySnap.exists || !subKeySnap.data()?.active) {
                return NextResponse.json({ error: "Invalid or inactive Connect sub-key." }, { status: 401 });
            }

            const subKey = subKeySnap.data()!;
            platformId = subKey.platformId;
            customerId = subKey.customerId;
            tenantId = subKey.platformId; // Using platformId as tenant for vault
            agentId = apiKey; // Using apiKey as agentId for vault reference

            const platformSnap = await db.collection("platforms").doc(platformId!).get();
            const platformData = platformSnap.data();
            userId = platformData?.ownerId;
            showBranding = platformData?.plan !== "growth" && platformData?.plan !== "enterprise";

            const basePolicySnap = await db.collection("platforms").doc(platformId!).collection("base_policies").doc("default").get();
            const baseRules: PolicyRule[] = basePolicySnap.data()?.rules ?? [];
            const baseRateLimit: RateLimitConfig = basePolicySnap.data()?.rateLimit ?? { requestsPerMinute: 60, requestsPerDay: 10000 };

            effectiveRules = [...(subKey.policyOverrides ?? []), ...baseRules];
            effectiveRateLimit = subKey.rateLimitOverride ?? baseRateLimit;
        } else {
            // Regular agent key
            const agentsSnapshot = await db.collection("agents").where("apiKey", "==", apiKey).limit(1).get();
            if (agentsSnapshot.empty) {
                return NextResponse.json({ decision: "DENY", reason: "Invalid API Key" }, { status: 403 });
            }

            const agentDoc = agentsSnapshot.docs[0];
            const agentData = agentDoc.data();
            agentId = agentDoc.id;
            tenantId = agentData.userId;
            userId = agentData.userId;
            agentName = agentData.name || "Unknown Agent";

            const userSnap = await db.collection("users").doc(userId).get();
            const userData = userSnap.data();
            showBranding = userData?.plan !== "growth" && userData?.plan !== "enterprise";

            if (agentData.status && agentData.status !== 'active') {
                return NextResponse.json({ decision: "DENY", reason: `Agent is ${agentData.status}.` }, { status: 403 });
            }

            // ── Threat Detection — blocks before any policy evaluation ──
            const threatResult = detectThreats(toolName, args);
            if (threatResult.blocked) {
                await logAudit(agentId, toolName, JSON.stringify(args), "DENY", 0, threatResult.reason!, sessionId, agentRole, isLoop);
                // Fire-and-forget threat event log
                db.collection("threat_events").add({
                    agentId, tenantId, toolName,
                    event_type: threatResult.threatType,
                    severity: threatResult.severity,
                    details: threatResult.detail,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                }).catch(() => {});
                return NextResponse.json({
                    decision: "DENY",
                    reason: threatResult.reason,
                    threatType: threatResult.threatType,
                }, { status: 403 });
            }

            // ── Guardrail Evaluation — hard stops before policy evaluation ──
            const guardrailResult = evaluateGuardrailsSync(agentData, toolName, args);
            if (guardrailResult.blocked) {
                const gr = guardrailResult.reason || 'Blocked by agent guardrail';
                await logAudit(agentId, toolName, JSON.stringify(args), "DENY", 0, gr, sessionId, agentRole, isLoop);
                return NextResponse.json({ decision: "DENY", reason: gr });
            }
            if (guardrailResult.modifiedArgs) {
                args = guardrailResult.modifiedArgs;
            }

            // Simple Policy Evaluation for regular agents (from audit logic)
            const policiesSnapshot = await db.collection("policies")
                .where("agentId", "==", agentId)
                .where("toolName", "==", toolName)
                .get();

            let finalDecision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL" = "ALLOW";
            const argsString = JSON.stringify(args);
            for (const doc of policiesSnapshot.docs) {
                const policy = doc.data();
                const conditionStr = policy.condition || policy.description || "";
                
                // If condition is empty and it's a DENY rule, it's a hard block for this tool
                if (!conditionStr && policy.ruleType === "DENY") {
                    finalDecision = "DENY";
                    break;
                }

                if (conditionStr && new RegExp(conditionStr).test(argsString)) {
                    finalDecision = policy.ruleType;
                    if (finalDecision === "DENY") break;
                }
            }
            // Add a synthetic rule for the unified evaluator below
            effectiveRules = [{ toolPattern: toolName, action: finalDecision }];
        }

        const branding = showBranding ? {
            enabled: true,
            text: "🛡️ Secured by SupraWall — AI agent security & EU AI Act compliance",
            url: "https://SupraWall.ai?ref=agent-output",
            format: "text"
        } : { enabled: false };

        // ── Vault Evaluation ──
        
        const vaultResult = await resolveVaultTokens(tenantId, agentId, toolName, args);
        let resolvedArguments = args;
        let vaultInjected = false;

        if (!vaultResult.success) {
            return NextResponse.json({ 
                decision: "DENY", 
                reason: `Vault Error: ${vaultResult.errors[0].message}`,
                branding 
            });
        }
        
        if (vaultResult.injectedSecrets.length > 0) {
            resolvedArguments = vaultResult.resolvedArgs;
            vaultInjected = true;
        }

        // ── Rate Limit Check ──

        if (effectiveRateLimit) {
            const limitOk = await checkRateLimit(apiKey, effectiveRateLimit);
            if (!limitOk) {
                return NextResponse.json({ decision: "DENY", reason: "Rate limit exceeded.", branding }, { status: 429 });
            }
        }

        // ── Policy Final Decision ──

        const decisionResult = evaluatePolicies(toolName, resolvedArguments, effectiveRules);
        let decision = decisionResult.decision;

        // ── Cost Estimation ──

        const estimatedCost = costUsd ?? estimateActionCost(args, toolName, model, inputTokens, outputTokens);
        const latencyMs = Date.now() - startTime;

        // ── Approval Flow ──

        if (decision === "REQUIRE_APPROVAL") {
            const argsString = JSON.stringify(resolvedArguments);
            const requestId = await createApprovalRequest(userId, agentId, agentName, toolName, argsString, sessionId, agentRole, estimatedCost);
            
            await logAudit(agentId, toolName, argsString, "PAUSED", estimatedCost, "Awaiting human approval", sessionId, agentRole, isLoop);
            
            return NextResponse.json({ 
                decision: "REQUIRE_APPROVAL", 
                reason: "This action requires human approval.", 
                requestId, 
                branding 
            });
        }

        // ── Post-Evaluation Writes ──

        const updates: Promise<any>[] = [
            logAudit(agentId, toolName, JSON.stringify(resolvedArguments), decision, estimatedCost, decisionResult.reason, sessionId, agentRole, isLoop)
        ];

        if (apiKey.startsWith("agc_")) {
            updates.push(db.collection("connect_keys").doc(apiKey).update({
                lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
                totalCalls: admin.firestore.FieldValue.increment(1),
                totalSpendUsd: admin.firestore.FieldValue.increment(estimatedCost),
            }));
            updates.push(db.collection("connect_events").add({
                platformId, customerId, toolName, decision, reason: decisionResult.reason ?? null, latencyMs, costUsd: estimatedCost, isLoop, timestamp: admin.firestore.FieldValue.serverTimestamp(),
            }));
        } else {
            updates.push(db.collection("agents").doc(agentId).update({
                totalCalls: admin.firestore.FieldValue.increment(1),
                totalSpendUsd: admin.firestore.FieldValue.increment(estimatedCost),
                lastUsedAt: admin.firestore.FieldValue.serverTimestamp()
            }));
        }

        if (userId) {
            updates.push(db.collection("users").doc(userId).update({
                operationsThisMonth: admin.firestore.FieldValue.increment(1),
                lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
            }).catch(e => console.error("Failed to update user usage:", e)));
        }

        // Non-blocking writes
        Promise.all(updates).catch(e => console.error("Evaluate background updates failed:", e));

        return NextResponse.json({
            decision,
            reason: decisionResult.reason,
            resolvedArguments: vaultInjected ? resolvedArguments : undefined,
            vaultInjected,
            injectedSecrets: vaultInjected ? vaultResult.injectedSecrets : undefined,
            branding,
            estimated_cost_usd: estimatedCost
        });

    } catch (e: any) {
        console.error("Evaluate error:", e);
        return NextResponse.json({ error: "Internal error", decision: "DENY" }, { status: 500 });
    }
}

// ── Helpers ──

// ── Threat Detection Engine ──

interface ThreatResult {
    blocked: boolean;
    reason?: string;
    threatType?: string;
    severity?: string;
    detail?: string;
}

function detectThreats(toolName: string, args: any): ThreatResult {
    const payload = `${toolName} ${JSON.stringify(args || {})}`.toLowerCase();
    const rawPayload = JSON.stringify(args || {});

    // SQL Injection Patterns
    const sqlPatterns: Array<{ re: RegExp; label: string }> = [
        { re: /drop\s+table/i,                        label: "DROP TABLE" },
        { re: /delete\s+from/i,                       label: "DELETE FROM" },
        { re: /insert\s+into/i,                       label: "INSERT INTO" },
        { re: /update\s+\S+\s+set/i,                  label: "UPDATE SET" },
        { re: /union\s+select/i,                      label: "UNION SELECT" },
        { re: /or\s+['"]?1['"]?\s*=\s*['"]?1/i,      label: "OR 1=1" },
        { re: /;\s*--/i,                              label: "comment terminator" },
        { re: /exec(\s+|\()sp_/i,                     label: "EXEC stored procedure" },
        { re: /xp_cmdshell/i,                         label: "xp_cmdshell" },
        { re: /\bsleep\s*\(\s*\d+\s*\)/i,             label: "SLEEP() time-based" },
        { re: /benchmark\s*\(/i,                      label: "BENCHMARK() DoS" },
    ];

    for (const { re, label } of sqlPatterns) {
        if (re.test(rawPayload)) {
            return {
                blocked: true,
                reason: `Threat detected: SQL injection pattern (${label}) blocked by SupraWall Threat Engine.`,
                threatType: "sql_injection",
                severity: "critical",
                detail: label,
            };
        }
    }

    // Prompt Injection Patterns
    const promptPatterns: Array<{ re: RegExp; label: string }> = [
        { re: /ignore\s+(all\s+)?previous\s+instructions/i,   label: "ignore previous instructions" },
        { re: /system\s+bypass/i,                             label: "system bypass" },
        { re: /you\s+are\s+now\s+(a|an|the)\s/i,             label: "persona override" },
        { re: /forget\s+(all\s+)?(your|previous)\s+instructions/i, label: "forget instructions" },
        { re: /ignore\s+previous/i,                          label: "ignore previous" },
        { re: /override\s+(system|safety|security)/i,        label: "override safety" },
        { re: /disregard\s+(all|any|your)\s+(previous|prior|safety)/i, label: "disregard safety" },
        { re: /act\s+as\s+if\s+you\s+have\s+no\s+restrictions/i, label: "no restrictions" },
        { re: /reveal\s+(your|the)\s+(system\s+)?prompt/i,   label: "reveal system prompt" },
        { re: /do\s+not\s+follow\s+(your|the|any)\s+(previous|original)/i, label: "do not follow instructions" },
    ];

    for (const { re, label } of promptPatterns) {
        if (re.test(rawPayload)) {
            return {
                blocked: true,
                reason: "Threat detected: Prompt injection attempt blocked by SupraWall Threat Engine.",
                threatType: "prompt_injection",
                severity: "high",
                detail: label,
            };
        }
    }

    // XSS Patterns
    const xssPatterns: Array<{ re: RegExp; label: string }> = [
        { re: /<script[\s>]/i,                    label: "<script> tag" },
        { re: /javascript\s*:/i,                  label: "javascript: URI" },
        { re: /on(error|load|click|mouseover)\s*=/i, label: "inline event handler" },
        { re: /eval\s*\(/i,                       label: "eval()" },
        { re: /<iframe/i,                         label: "<iframe>" },
    ];

    for (const { re, label } of xssPatterns) {
        if (re.test(rawPayload)) {
            return {
                blocked: true,
                reason: `Threat detected: XSS pattern (${label}) blocked by SupraWall Threat Engine.`,
                threatType: "xss_injection",
                severity: "high",
                detail: label,
            };
        }
    }

    return { blocked: false };
}

function matchesWildcard(toolName: string, pattern: string): boolean {
    if (!pattern.includes('*')) return toolName === pattern;
    return new RegExp('^' + pattern.replace(/\*/g, '.*') + '$').test(toolName);
}

function evaluateGuardrailsSync(
    agentData: any, toolName: string, args: any
): { blocked: boolean; reason?: string; modifiedArgs?: any } {
    const g = agentData.guardrails;
    if (!g) return { blocked: false };

    if (g.budget?.limitUsd) {
        const spend = agentData.totalSpendUsd || 0;
        if (spend >= g.budget.limitUsd) {
            if (g.budget.onExceeded === 'block')
                return { blocked: true, reason: `Spend guardrail: limit $${g.budget.limitUsd} exceeded ($${spend.toFixed(4)} spent)` };
            if (g.budget.onExceeded === 'require_approval')
                return { blocked: true, reason: 'PENDING_APPROVAL:budget_exceeded' };
        }
    }

    if (g.allowedTools?.length > 0) {
        if (!g.allowedTools.some((p: string) => matchesWildcard(toolName, p)))
            return { blocked: true, reason: `Tool guardrail: "${toolName}" not in allowlist` };
    }

    if (g.blockedTools?.length > 0) {
        if (g.blockedTools.some((p: string) => matchesWildcard(toolName, p)))
            return { blocked: true, reason: `Tool guardrail: "${toolName}" is blocked` };
    }

    if (g.piiScrubbing?.enabled && g.piiScrubbing.patterns?.length > 0) {
        const { modifiedArgs, shouldBlock } = scrubPii(args, g.piiScrubbing);
        if (shouldBlock) return { blocked: true, reason: 'PII guardrail: sensitive data detected in arguments' };
        return { blocked: false, modifiedArgs };
    }

    return { blocked: false };
}

function evaluatePolicies(toolName: string, args: any, rules: PolicyRule[]): { decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL"; reason?: string } {
    for (const rule of rules) {
        if (matchesPattern(toolName, rule.toolPattern)) {
            return { decision: rule.action, reason: rule.conditions?.reason };
        }
    }
    return { decision: "ALLOW" };
}

function matchesPattern(toolName: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern.endsWith("*")) return toolName.startsWith(pattern.slice(0, -1));
    return toolName === pattern;
}

async function checkRateLimit(key: string, config: RateLimitConfig): Promise<boolean> {
    const now = new Date();
    const minKey = `rl_${key}_${now.toISOString().slice(0, 16)}`; // simplified
    const snap = await db.collection("rate_limit_counters").doc(minKey).get();
    if (snap.exists && (snap.data()?.count || 0) >= config.requestsPerMinute) return false;
    
    await db.collection("rate_limit_counters").doc(minKey).set({
        count: admin.firestore.FieldValue.increment(1),
        expiresAt: new Date(Date.now() + 60000)
    }, { merge: true });
    return true;
}

function estimateActionCost(args: any, toolName: string, model: string, inT: number, outT: number): number {
    if (inT > 0 || outT > 0) {
        const rates: any = { "gpt-4o": 0.005, "gpt-4o-mini": 0.00015, "claude": 0.003 };
        const rate = rates[Object.keys(rates).find(k => model.includes(k)) || "gpt-4o-mini"];
        return (inT / 1000 * rate) + (outT / 1000 * rate * 3);
    }
    return 0.0001; // minimal fallback
}

async function createApprovalRequest(userId: string, agentId: string, agentName: string, toolName: string, args: string, sessionId: any, agentRole: any, cost: number) {
    const res = await db.collection("approvalRequests").add({
        userId, agentId, agentName, toolName, arguments: args, sessionId, agentRole,
        status: "pending", createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 86400000), estimatedCostUsd: cost
    });
    return res.id;
}

async function logAudit(agentId: string, toolName: string, args: string, decision: string, cost: number, reason: any, sId: any, role: any, isLoop: boolean) {
    await db.collection("audit_logs").add({
        agentId, toolName, arguments: args, decision, reason, sessionId: sId, agentRole: role,
        cost_usd: cost, is_loop: isLoop, timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
}
