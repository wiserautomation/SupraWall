import { onRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";
import * as crypto from "crypto";
import { Resend } from "resend";
import { decryptSecret, logVaultAccess } from "./vault";

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

interface PolicyRule {
    toolPattern: string;  // glob or regex
    condition?: string;   // regex for arguments
    matchType: "regex" | "glob";
    action: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    priority: number;
    reason?: string;
    isDryRun?: boolean;
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
    isDryRun?: boolean;
}

export const evaluateAction = onRequest({ cors: true }, async (req, res) => {
    if (req.method === "OPTIONS") { res.status(204).send(""); return; }
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    const body = req.body;
    const apiKey = body.apiKey;
    const toolName = body.toolName;
    const args = body.args;
    const sessionId = body.sessionId || null;
    const agentRole = body.agentRole || null;
    const model = body.model || "gpt-4o-mini";
    const inputTokens = body.inputTokens || 0;
    const outputTokens = body.outputTokens || 0;
    const clientReportedCost = body.costUsd || null;
    const isLoopDetectedByClient = body.isLoop || false;
    const logOnly = body.logOnly || false;
    const forceApproval = body.forceApproval || false;

    const startTime = Date.now();

    if (!apiKey || !toolName || args === undefined) {
        res.status(400).json({ error: "apiKey and toolName are required." });
        return;
    }

    try {
        // ── Route: Connect sub-key (agc_) ──────────────────────────────────────
        if (apiKey.startsWith("agc_")) {
            const subKeySnap = await db.collection("connect_keys").doc(apiKey).get();

            if (!subKeySnap.exists || !subKeySnap.data()?.active) {
                res.status(401).json({ error: "Invalid or inactive Connect sub-key." });
                return;
            }

            const subKey = subKeySnap.data()!;
            const { platformId, customerId, policyOverrides, rateLimitOverride } = subKey;

            // Get platform owner to track billing
            const platformSnap = await db.collection("platforms").doc(platformId).get();
            const platformData = platformSnap.data();
            const ownerId = platformData?.ownerId;
            const showBranding = platformData?.plan !== "growth" && platformData?.plan !== "enterprise";
            const branding = showBranding ? {
                enabled: true,
                text: "🛡️ Secured by SupraWall — AI agent security & EU AI Act compliance",
                url: "https://SupraWall.ai?ref=agent-output",
                format: "text"
            } : { enabled: false };

            // Load platform base policies
            const basePolicySnap = await db
                .collection("platforms")
                .doc(platformId)
                .collection("base_policies")
                .doc("default")
                .get();

            const baseRules: PolicyRule[] = basePolicySnap.data()?.rules ?? [];
            const baseRateLimit: RateLimitConfig = basePolicySnap.data()?.rateLimit ?? {
                requestsPerMinute: 60,
                requestsPerDay: 10000,
            };

            // Merge: customer overrides WIN over platform base rules
            const effectiveRules: PolicyRule[] = [
                ...(policyOverrides ?? []),
                ...baseRules,
            ];
            const effectiveRateLimit: RateLimitConfig = rateLimitOverride ?? baseRateLimit;

            // Rate limit check
            const rateLimitResult = await checkRateLimit(apiKey, effectiveRateLimit);
            if (!rateLimitResult.allowed) {
                res.status(429).json({ decision: "DENY", reason: "Rate limit exceeded.", branding });
                return;
            }

            // Policy evaluation 
            const decision = evaluateAgentAction(toolName, args, effectiveRules.map(r => ({
                ...r,
                matchType: r.matchType || "glob",
                priority: r.priority || 100
            })));

            // Cost estimation
            const estimatedCost = clientReportedCost ?? estimateActionCost(args, toolName, model, inputTokens, outputTokens);
            const latencyMs = Date.now() - startTime;

            const effectiveDecision = decision.isDryRun ? "ALLOW" : decision.decision;

            // Update usage counters and write audit log (non-blocking)
            const updates: Promise<any>[] = [
                db.collection("connect_keys").doc(apiKey).update({
                    lastUsedAt: FieldValue.serverTimestamp(),
                    totalCalls: FieldValue.increment(1),
                    totalSpendUsd: FieldValue.increment(estimatedCost),
                }),
                db.collection("connect_events").add({
                    platformId,
                    subKeyId: apiKey,
                    customerId,
                    toolName,
                    args: sanitizeArgs(args),
                    decision: decision.decision, // log the intended decision
                    effectiveDecision,          // log the actual effect
                    isDryRun: decision.isDryRun ?? false,
                    reason: decision.reason ?? null,
                    latencyMs,
                    costUsd: estimatedCost,
                    isLoop: isLoopDetectedByClient,
                    timestamp: FieldValue.serverTimestamp(),
                }),
                // ── Global Stats Update (for ROI Counter) ──
                db.collection("global_stats").doc("aggregate").update({
                    totalInteractions: FieldValue.increment(1),
                    totalDollarsSaved: effectiveDecision === "DENY" ? FieldValue.increment(2.50) : FieldValue.increment(0),
                    rogueActionsBlocked: effectiveDecision === "DENY" ? FieldValue.increment(1) : FieldValue.increment(0),
                }).catch(() => {
                    db.collection("global_stats").doc("aggregate").set({
                        totalInteractions: 1,
                        totalDollarsSaved: effectiveDecision === "DENY" ? 2.50 : 0,
                        rogueActionsBlocked: effectiveDecision === "DENY" ? 1 : 0
                    }, { merge: true });
                })
            ];

            // If we found an owner, increment their monthly billing counter
            if (ownerId) {
                updates.push(
                    db.collection("organizations").doc(ownerId).update({
                        operationsThisMonth: FieldValue.increment(1),
                        lastUsedAt: FieldValue.serverTimestamp(),
                    }).catch(err => console.warn(`Failed to update organization ${ownerId}:`, err.message))
                );
            }

            Promise.all(updates).catch((e) => console.error("SupraWall: Non-critical write failed:", e));

            res.status(200).json({ 
                decision: effectiveDecision,
                intended_decision: decision.decision,
                is_dry_run: decision.isDryRun,
                estimated_cost_usd: estimatedCost,
                branding
            });
            return;
        }

        // ── Route: Regular single-tenant key (ag_) ─────────────────────────────
        if (apiKey.startsWith("ag_") || !apiKey.startsWith("agc_")) {
            const argsString = typeof args === 'string' ? args : JSON.stringify(args);

            // 1. Find the agent by apiKey (supporting both legacy cleartext and new hashed keys)
            const prefix = apiKey.substring(0, 7); // ag_xxxx
            const agentsSnapshot = await db.collection("agents").where("apiKeyPrefix", "==", prefix).get();

            let agentDoc = null;
            let foundKey = false;

            const inputHash = crypto.createHash("sha256").update(apiKey).digest("hex");

            for (const doc of agentsSnapshot.docs) {
                const data = doc.data();
                // Check new hashed key first
                if (data.apiKeyHash && data.apiKeyHash === inputHash) {
                    agentDoc = doc;
                    foundKey = true;
                    break;
                }
                // Fallback: Check legacy cleartext key
                if (data.apiKey === apiKey) {
                    agentDoc = doc;
                    foundKey = true;
                    break;
                }
            }

            if (!foundKey || !agentDoc) {
                await logAudit(null as any, "unknown", toolName, argsString, "DENY", 0, "Invalid API Key", sessionId, agentRole);
                res.status(403).json({ decision: "DENY", reason: "Invalid API Key" });
                return;
            }
            const agentId = agentDoc.id;
            const agentData = agentDoc.data();

            // 2. Resolve Owner/Org and check status
            const userId = agentData.userId;
            if (!userId) {
                throw new HttpsError(
                    "failed-precondition",
                    "Agent document is missing a valid owner (userId)."
                );
            }

            const userSnap = await db.collection("users").doc(userId).get();
            if (!userSnap.exists) {
                throw new HttpsError(
                    "not-found",
                    "The organization/user owning this agent no longer exists."
                );
            }

            const userData = userSnap.data()!;
            const showBranding = userData?.plan !== "growth" && userData?.plan !== "enterprise";
            const branding = showBranding ? {
                enabled: true,
                text: "🛡️ Secured by SupraWall — AI agent security & EU AI Act compliance",
                url: "https://SupraWall.ai?ref=agent-output",
                format: "text"
            } : { enabled: false };

            // ── 1.5 Agent Status Check ──
            if (agentData.status && agentData.status !== 'active') {
                await logAudit(userId, agentId, toolName, argsString, "DENY", 0, `Agent is ${agentData.status}`, sessionId, agentRole);
                res.status(403).json({ decision: "DENY", reason: `Agent is ${agentData.status}. Contact your administrator.` });
                return;
            }

            // ── 1.6 Scope Enforcement (Principle of Least Privilege) ──
            const agentScopes: string[] | undefined = agentData.scopes;
            if (agentScopes && agentScopes.length > 0) {
                const hasScope = agentScopes.some(scope => {
                    if (scope === '*:*') return true; // wildcard: all access
                    const [ns, action] = scope.split(':');
                    if (action === '*') {
                        // namespace wildcard: e.g. "crm:*" matches "crm:read", "crm:write"
                        return toolName.startsWith(ns + ':') || toolName.startsWith(ns + '_');
                    }
                    // exact match or prefix match (e.g., scope "email:send" matches tool "email:send" or "email_send")
                    return toolName === scope || toolName === `${ns}_${action}`;
                });

                if (!hasScope) {
                    const reason = `Agent lacks scope for tool '${toolName}'. Granted scopes: [${agentScopes.join(', ')}]`;
                    await logAudit(userId, agentId, toolName, argsString, "DENY", 0, reason, sessionId, agentRole);
                    res.status(403).json({ decision: "DENY", reason });
                    return;
                }
            }

            // ── 1.7 Scope Limits Enforcement (Per-Scope Rate Limiting) ──
            const scopeLimits: Record<string, any> | undefined = agentData.scopeLimits;
            if (scopeLimits) {
                // Find the matching scope limit for this tool
                const matchingLimit = Object.entries(scopeLimits).find(([scopeKey]) => {
                    if (scopeKey === '*:*') return true;
                    const [ns, action] = scopeKey.split(':');
                    if (action === '*') {
                        return toolName.startsWith(ns + ':') || toolName.startsWith(ns + '_');
                    }
                    return toolName === scopeKey || toolName === `${ns}_${action}`;
                });

                if (matchingLimit) {
                    const [scopeKey, limits] = matchingLimit;

                    // Check each time-window limit
                    const timeWindows: Array<{ key: string; label: string; ms: number }> = [
                        { key: 'max_per_minute', label: 'minute', ms: 60 * 1000 },
                        { key: 'max_per_hour', label: 'hour', ms: 60 * 60 * 1000 },
                        { key: 'max_per_day', label: 'day', ms: 24 * 60 * 60 * 1000 },
                    ];

                    for (const tw of timeWindows) {
                        const maxCalls = limits[tw.key];
                        if (maxCalls !== undefined && maxCalls !== null) {
                            const since = new Date(Date.now() - tw.ms);
                            const recentCalls = await db.collection("audit_logs")
                                .where("agentId", "==", agentId)
                                .where("toolName", "==", toolName)
                                .where("decision", "==", "ALLOW")
                                .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(since))
                                .count()
                                .get();

                            const count = recentCalls.data().count;
                            if (count >= maxCalls) {
                                const reason = `Scope limit exceeded for '${scopeKey}': ${count}/${maxCalls} calls per ${tw.label}. Try again later.`;
                                await logAudit(userId, agentId, toolName, argsString, "DENY", 0, reason, sessionId, agentRole);
                                res.status(429).json({ decision: "DENY", reason });
                                return;
                            }
                        }
                    }
                }
            }

            // 2. Query policies for this agent (we fetch all and evaluate unified)
            const policiesSnapshot = await db.collection("policies")
                .where("agentId", "==", agentId)
                .get();

            const agentPolicies: PolicyRule[] = policiesSnapshot.docs.map(d => {
                const p = d.data();
                return {
                    toolPattern: p.toolName, // existing ag_ policies have toolName exactly
                    condition: p.condition,  // existing ag_ policies have condition as regex
                    matchType: "glob",       // existing ag_ toolNames are exact (glob handles this)
                    action: p.ruleType,      // ruleType -> action
                    priority: p.priority || 100,
                    reason: p.reason,
                    isDryRun: p.isDryRun || false
                };
            });

            const currentArgsString = typeof args === 'string' ? args : JSON.stringify(args);
                
            // ── 3. Handle logOnly and forceApproval flags (MCP Support) ──
            if (logOnly) {
                await logAudit(userId, agentId, toolName, currentArgsString, "ALLOW", 0, "MCP: Manual log entry", sessionId, agentRole, isLoopDetectedByClient, false);
                res.status(200).json({ decision: "ALLOW", reason: "Logged successfully", branding });
                return;
            }

            if (forceApproval) {
                // Skip evaluation, go to approval
                const estimatedCost = clientReportedCost ?? estimateActionCost(args, toolName, model, inputTokens, outputTokens);
                await handleApprovalFlow(res, userId, agentId, agentData, toolName, currentArgsString, sessionId, agentRole, estimatedCost, userData, branding, false, isLoopDetectedByClient, false, body.reason || "Manual approval request via MCP");
                return;
            }

            const decision = evaluateAgentAction(toolName, args, agentPolicies);
            const finalDecision = decision.isDryRun ? "ALLOW" : decision.decision;
            const intendedDecision = decision.decision;
            const isDryRun = decision.isDryRun || false;

            // 4. Cost estimation (moved up)
            const estimatedCost = clientReportedCost ?? estimateActionCost(args, toolName, model, inputTokens, outputTokens);

            // ── Vault token injection ──
            let vaultInjected: string[] = [];
            let vaultRequiresApproval = false;

            if (currentArgsString.includes('$SUPRAWALL_VAULT_')) {
                const vaultResult = await injectVaultTokens(args, agentId, userId, toolName);
                // We keep the args for logging AS-IS (tokens), but the action might be blocked if it requires approval
                vaultInjected = vaultResult.injectedSecrets;
                vaultRequiresApproval = vaultResult.requiresApproval;
                // Note: We don't overwrite the original 'args' yet because if it requires approval, 
                // we want the approval request to show the tokens, not the secrets.
            }

            // ── 5. Handle Approval Flow ──
            if (finalDecision === "REQUIRE_APPROVAL" || vaultRequiresApproval) {
                await handleApprovalFlow(res, userId, agentId, agentData, toolName, currentArgsString, sessionId, agentRole, estimatedCost, userData, branding, vaultRequiresApproval, isLoopDetectedByClient, isDryRun);
                return;
            }

            // 6. Update usage counters (non-blocking)
            const updates: Promise<any>[] = [
                logAudit(userId, agentId, toolName, currentArgsString, intendedDecision, estimatedCost, null, sessionId, agentRole, isLoopDetectedByClient, isDryRun)
            ];

            if (userId) {
                updates.push(
                    db.collection("organizations").doc(userId).update({
                        operationsThisMonth: FieldValue.increment(1),
                        lastUsedAt: FieldValue.serverTimestamp(),
                    }).catch(err => console.warn(`Failed to update organization ${userId}:`, err.message))
                );
            }

            // Also update agent level stats
            updates.push(
                db.collection("agents").doc(agentId).update({
                    totalCalls: FieldValue.increment(1),
                    totalSpendUsd: FieldValue.increment(estimatedCost),
                    lastUsedAt: FieldValue.serverTimestamp()
                }).catch(err => console.warn(`Failed to update agent ${agentId}:`, err.message))
            );

            Promise.all(updates).catch(e => console.error("Audit/Usage update failed:", e));

            // 6. Return the decision
            const rawResponse = {
                decision: finalDecision,
                intended_decision: intendedDecision,
                is_dry_run: isDryRun,
                estimated_cost_usd: estimatedCost,
                is_loop: isLoopDetectedByClient,
                vault_tokens_injected: vaultInjected,
                branding
            };

            res.status(200).json(scrubVaultSecrets(rawResponse, vaultInjected));
            return;
        }


    } catch (e) {
        console.error("SupraWall evaluateAction error:", e);
        res.status(500).json({ error: "Internal SupraWall error.", decision: "DENY" });
    }
});

async function handleApprovalFlow(
    res: any,
    userId: string,
    agentId: string,
    agentData: any,
    toolName: string,
    argsString: string,
    sessionId: string | null,
    agentRole: string | null,
    estimatedCost: number,
    userData: any,
    branding: any,
    vaultRequiresApproval: boolean,
    isLoop: boolean,
    isDryRun: boolean,
    forcedReason?: string
) {
    const existingReq = await db.collection("approvalRequests")
        .where("agentId", "==", agentId)
        .where("toolName", "==", toolName)
        .where("arguments", "==", argsString)
        .where("status", "==", "pending")
        .limit(1)
        .get();

    let requestId: string;
    if (!existingReq.empty) {
        requestId = existingReq.docs[0].id;
    } else {
        const newReq = await db.collection("approvalRequests").add({
            userId,
            agentId,
            agentName: agentData.name || "Unknown Agent",
            toolName,
            arguments: argsString,
            sessionId,
            agentRole,
            status: "pending",
            createdAt: FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
            estimatedCostUsd: estimatedCost,
            requiresVaultInjection: vaultRequiresApproval,
            reason: forcedReason || null
        });
        requestId = newReq.id;

        const slackUrl = userData?.slackWebhookUrl;
        const contactEmail = userData?.contactEmail || userData?.email;

        if (slackUrl) {
            try {
                await sendSlackNotification(slackUrl, {
                    requestId,
                    agentName: agentData.name || "Unknown Agent",
                    toolName,
                    arguments: argsString,
                    estimatedCost,
                    showBranding: !!branding.enabled
                });
            } catch (err) {
                console.error("[SupraWall] Slack notification failed:", err);
            }
        }

        if (contactEmail && userData?.emailAlertsEnabled !== false) {
            try {
                await sendEmailNotification(contactEmail, {
                    requestId,
                    agentName: agentData.name || "Unknown Agent",
                    toolName,
                    arguments: argsString,
                    estimatedCost
                });
            } catch (err) {
                console.error("[SupraWall] Email alert failed:", err);
            }
        }
    }

    await logAudit(userId, agentId, toolName, argsString, "REQUIRE_APPROVAL", estimatedCost, forcedReason || "Awaiting human approval", sessionId, agentRole, isLoop, isDryRun);
    res.json({
        decision: "REQUIRE_APPROVAL",
        intended_decision: "REQUIRE_APPROVAL",
        is_dry_run: isDryRun,
        reason: forcedReason || (vaultRequiresApproval ? "One or more vault secrets require manual approval." : "This action requires human approval."),
        requestId,
        branding
    });
}

// ── Connect Helpers ────────────────────────────────────────────────────────

async function injectVaultTokens(
  args: any,
  agentId: string,
  tenantId: string,
  toolName: string
): Promise<{ injectedArgs: any; injectedSecrets: string[]; requiresApproval: boolean }> {
  const argsString = typeof args === 'string' ? args : JSON.stringify(args);
  
  // Find all $SUPRAWALL_VAULT_XXX tokens in the args
  const tokenPattern = /\$SUPRAWALL_VAULT_([A-Z0-9_]+)/g;
  const matches = [...argsString.matchAll(tokenPattern)];
  
  if (matches.length === 0) {
    return { injectedArgs: args, injectedSecrets: [], requiresApproval: false };
  }
  
  let injectedString = argsString;
  const injectedSecrets: string[] = [];
  let requiresApproval = false;

  for (const match of matches) {
    const secretName = match[1];
    const fullToken = match[0];

    // 1. Find the secret in vault_secrets
    const secretSnap = await db.collection('vault_secrets')
      .where('tenantId', '==', tenantId)
      .where('secret_name', '==', secretName)
      .limit(1)
      .get();

    if (secretSnap.empty) {
      logVaultAccess(tenantId, agentId, secretName, toolName, 'NOT_FOUND');
      continue;
    }

    const secret = secretSnap.docs[0].data();

    // 2. Check expiry
    if (secret.expires_at && new Date(secret.expires_at) < new Date()) {
      logVaultAccess(tenantId, agentId, secretName, toolName, 'EXPIRED');
      injectedString = injectedString.replace(fullToken, '[VAULT_SECRET_EXPIRED]');
      continue;
    }

    // 3. Check agent is allowed (assigned_agents empty = all agents of this tenant)
    if (secret.assigned_agents?.length > 0 && !secret.assigned_agents.includes(agentId)) {
      logVaultAccess(tenantId, agentId, secretName, toolName, 'DENIED');
      injectedString = injectedString.replace(fullToken, '[VAULT_ACCESS_DENIED]');
      continue;
    }

    // 4. Find matching vault_rule for this agent+secret
    const ruleSnap = await db.collection('vault_rules')
      .where('tenantId', '==', tenantId)
      .where('agent_id', '==', agentId)
      .where('secret_name', '==', secretName)
      .limit(1)
      .get();

    if (!ruleSnap.empty) {
      const rule = ruleSnap.docs[0].data() as any;
      
      // 4a. Check allowed_tools
      if (rule.allowed_tools?.length > 0 && !rule.allowed_tools.includes(toolName)) {
        logVaultAccess(tenantId, agentId, secretName, toolName, 'DENIED');
        injectedString = injectedString.replace(fullToken, '[VAULT_TOOL_NOT_ALLOWED]');
        continue;
      }

      // 4b. Check rate limit (uses per hour)
      if (rule.max_uses_per_hour > 0) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const recentUses = await db.collection('vault_access_log')
          .where('tenantId', '==', tenantId)
          .where('agent_id', '==', agentId)
          .where('secret_name', '==', secretName)
          .where('action', '==', 'INJECTED')
          .where('created_at', '>=', oneHourAgo)
          .count()
          .get();
        
        if (recentUses.data().count >= rule.max_uses_per_hour) {
          logVaultAccess(tenantId, agentId, secretName, toolName, 'RATE_LIMITED');
          injectedString = injectedString.replace(fullToken, '[VAULT_RATE_LIMITED]');
          continue;
        }
      }

      // 4c. Check if approval is required
      if (rule.requires_approval) {
        requiresApproval = true;
      }
    }

    // 5. Decrypt and inject
    try {
        const realValue = decryptSecret(secret.encrypted_value);
        injectedString = injectedString.replace(fullToken, realValue);
        injectedSecrets.push(secretName);
        logVaultAccess(tenantId, agentId, secretName, toolName, 'INJECTED');
    } catch (e) {
        console.error("[VAULT] Decryption Error:", e);
        logVaultAccess(tenantId, agentId, secretName, toolName, 'NOT_FOUND');
        injectedString = injectedString.replace(fullToken, '[VAULT_DECRYPTION_ERROR]');
    }
  }

  // Parse back to original type
  const injectedArgs = typeof args === 'string' ? injectedString : JSON.parse(injectedString);
  return { injectedArgs, injectedSecrets, requiresApproval };
}

function scrubVaultSecrets(response: any, injectedSecrets: string[]): any {
  if (injectedSecrets.length > 0) {
    return { ...response, vault_injected: injectedSecrets.map(s => `$SUPRAWALL_VAULT_${s}`) };
  }
  return response;
}

function evaluateAgentAction(
    toolName: string,
    args: any,
    rules: PolicyRule[]
): EvaluateResponse {
    const argsString = typeof args === 'string' ? args : JSON.stringify(args);
    
    // Sort rules by priority (lower is first)
    const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

    let dryRunMatch: EvaluateResponse | null = null;

    for (const rule of sortedRules) {
        // 1. Tool Match
        let toolMatch = false;
        if (rule.matchType === "regex") {
            try {
                toolMatch = new RegExp(rule.toolPattern).test(toolName);
            } catch (e) {
                console.error(`Invalid regex in toolPattern: ${rule.toolPattern}`, e);
            }
        } else {
            toolMatch = matchesPattern(toolName, rule.toolPattern);
        }

        if (!toolMatch) continue;

        // 2. Condition (Args) Match
        if (rule.condition) {
            try {
                const conditionMatch = new RegExp(rule.condition).test(argsString);
                if (!conditionMatch) continue;
            } catch (e) {
                console.error(`Invalid regex in condition: ${rule.condition}`, e);
                continue;
            }
        }

        // If we got here, the rule matches
        if (rule.isDryRun) {
            // If it's a dry run, we save the first hit but keep searching for an ACTUAL rule
            if (!dryRunMatch) {
                dryRunMatch = { decision: rule.action, reason: rule.reason, isDryRun: true };
            }
            continue;
        } else {
            // Not a dry run: this is our winner
            return { 
                decision: rule.action, 
                reason: rule.reason,
                isDryRun: false
            };
        }
    }
    
    // No non-dry-run rules matched.
    if (dryRunMatch) {
        return dryRunMatch;
    }

    return { decision: "ALLOW" };
}

function matchesPattern(toolName: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern.endsWith("*")) {
        return toolName.startsWith(pattern.slice(0, -1));
    }
    return toolName === pattern;
}

async function checkRateLimit(
    key: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean }> {
    const now = new Date();
    const minuteKey = `${key}_${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}${now.getUTCHours()}${now.getUTCMinutes()}`;
    const dayKey = `${key}_${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}`;

    const batch = db.batch();

    const minuteRef = db.collection("rate_limit_counters").doc(minuteKey);
    const dayRef = db.collection("rate_limit_counters").doc(dayKey);

    const [minuteSnap, daySnap] = await Promise.all([
        minuteRef.get(),
        dayRef.get(),
    ]);

    const minuteCount = minuteSnap.data()?.count ?? 0;
    const dayCount = daySnap.data()?.count ?? 0;

    if (minuteCount >= config.requestsPerMinute || dayCount >= config.requestsPerDay) {
        return { allowed: false };
    }

    batch.set(minuteRef, { count: minuteCount + 1, expiresAt: new Date(Date.now() + 60_000) }, { merge: true });
    batch.set(dayRef, { count: dayCount + 1, expiresAt: new Date(Date.now() + 86_400_000) }, { merge: true });
    await batch.commit();

    return { allowed: true };
}

/**
 * Enhanced estimation of agentic 'overhead' cost for a tool call.
 */
function estimateActionCost(args: any, toolName: string, model: string = "gpt-4o-mini", inTokens: number = 0, outTokens: number = 0): number {
    // If tokens provided, use them
    if (inTokens > 0 || outTokens > 0) {
        const rates: Record<string, { in: number, out: number }> = {
            "gpt-4o": { in: 0.005, out: 0.015 },
            "gpt-4o-mini": { in: 0.00015, out: 0.0006 },
            "claude-3-5-sonnet": { in: 0.003, out: 0.015 },
            "gemini-1.5-pro": { in: 0.00125, out: 0.005 },
        };
        const key = Object.keys(rates).find(k => model.toLowerCase().includes(k)) || "gpt-4o-mini";
        const rate = rates[key];
        return (inTokens / 1000 * rate.in) + (outTokens / 1000 * rate.out);
    }

    // Heuristic fallback
    const payloadLength = JSON.stringify(args || {}).length + toolName.length;
    const tokens = Math.ceil(payloadLength / 4) + 50; // +50 tokens for tool overhead
    const costPerToken = 0.00000015; // $0.15 per 1M tokens
    return parseFloat((tokens * costPerToken).toFixed(8));
}

async function sendSlackNotification(url: string, data: { requestId: string, agentName: string, toolName: string, arguments: string, estimatedCost: number, showBranding?: boolean }) {
    const dashboardUrl = "https://www.supra-wall.com/dashboard/approvals";

    // Slack Block Kit message for a premium look
    const payload = {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                text: "🛡️ SupraWall: Action Approval Required",
                    emoji: true
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Agent:* ${data.agentName}\n*Tool:* \`${data.toolName}\`\n*Estimated Cost:* $${data.estimatedCost.toFixed(4)}`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Arguments:*\n\`\`\`${data.arguments.slice(0, 1000)}${data.arguments.length > 1000 ? '...' : ''}\`\`\``
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Review in Dashboard",
                            emoji: true
                        },
                        url: dashboardUrl,
                        style: "primary",
                        action_id: "review_action"
                    }
                ]
            },
            ...(data.showBranding ? [{
                type: "context",
                elements: [
                    {
                        type: "image",
                        image_url: "https://SupraWall.ai/icon-small.png",
                        alt_text: "SupraWall"
                    },
                    {
                        type: "mrkdwn",
                        text: "🛡️ Protected by <https://SupraWall.ai?ref=slack-approval|*SupraWall*> — AI agent security & EU AI Act compliance"
                    }
                ]
            }] : [])
        ]
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
    }
}

async function sendEmailNotification(email: string, data: { requestId: string, agentName: string, toolName: string, arguments: string, estimatedCost: number }) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const dashboardUrl = "https://www.supra-wall.com/dashboard/approvals";

    await resend.emails.send({
        from: "SupraWall Alerts <alerts@supra-wall.com>",
        to: email,
        subject: `🛡️ Action Approval Required: ${data.agentName}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #10b981; margin-top: 0;">SupraWall Security Alert</h2>
                <p>An action performed by <strong>${data.agentName}</strong> requires your manual approval.</p>
                
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Tool Name</p>
                    <p style="margin: 5px 0 15px 0; font-weight: bold;">${data.toolName}</p>
                    
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Estimated Cost</p>
                    <p style="margin: 5px 0 15px 0; font-weight: bold;">$${data.estimatedCost.toFixed(4)}</p>
                    
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Arguments</p>
                    <pre style="background: #fff; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 12px; overflow-x: auto;">${data.arguments.slice(0, 1000)}${data.arguments.length > 1000 ? '...' : ''}</pre>
                </div>
                
                <a href="${dashboardUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">Review Action</a>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                    🛡️ Protected by SupraWall — AI agent security & EU AI Act compliance
                </p>
            </div>
        `
    });
}

function sanitizeArgs(args: any): any {
    if (!args || typeof args !== "object") return args;
    const secretFields = ["password", "token", "secret", "key", "apiKey", "api_key", "authorization"];
    const sanitized = { ...args };
    for (const field of secretFields) {
        if (field in sanitized) sanitized[field] = "[REDACTED]";
    }
    return sanitized;
}

// ── Forensic Risk Scoring ───────────────────────────────────────────────
const HIGH_RISK_TOOLS = ['delete', 'drop', 'remove', 'destroy', 'execute', 'eval', 'exec', 'sudo', 'admin', 'transfer', 'payment', 'withdraw'];
const SENSITIVE_ARG_PATTERNS = [/password/i, /secret/i, /token/i, /api.?key/i, /authorization/i, /credit.?card/i, /ssn/i, /\broot\b/i, /\/etc\//i];

function computeRiskScore(toolName: string, args: string, decision: string, costUsd: number, isLoop: boolean): { score: number; factors: string[] } {
    let score = 0;
    const factors: string[] = [];

    // Tool name sensitivity
    const toolLower = toolName.toLowerCase();
    if (HIGH_RISK_TOOLS.some(t => toolLower.includes(t))) {
        score += 35;
        factors.push(`High-risk tool pattern: '${toolName}'`);
    }

    // Decision-based risk
    if (decision === 'DENY') {
        score += 25;
        factors.push('Action was denied by policy');
    } else if (decision === 'PAUSED' || decision === 'REQUIRE_APPROVAL') {
        score += 15;
        factors.push('Action required human approval');
    }

    // Cost-based risk
    if (costUsd > 0.10) {
        score += 15;
        factors.push(`High estimated cost: $${costUsd.toFixed(4)}`);
    } else if (costUsd > 0.01) {
        score += 5;
        factors.push(`Moderate cost: $${costUsd.toFixed(4)}`);
    }

    // Argument sensitivity scan
    for (const pattern of SENSITIVE_ARG_PATTERNS) {
        if (pattern.test(args)) {
            score += 10;
            factors.push(`Sensitive data pattern detected in arguments`);
            break; // only count once
        }
    }

    // Loop detection
    if (isLoop) {
        score += 20;
        factors.push('Detected as part of a loop pattern');
    }

    // Payload size risk
    if (args.length > 5000) {
        score += 5;
        factors.push(`Large payload: ${args.length} chars`);
    }

    return { score: Math.min(score, 100), factors };
}

// ── Forensic Audit Logger (Tamper-Proof Hash Chain) ─────────────────────
async function logAudit(userId: string, agentId: string, toolName: string, args: string, decision: string, costUsd: number = 0, reason: string | null = null, sessionId: string | null = null, agentRole: string | null = null, isLoop: boolean = false, isDryRun: boolean = false) {
    try {
        // 1. Compute risk score
        const { score: riskScore, factors: riskFactors } = computeRiskScore(toolName, args, decision, costUsd, isLoop);
        if (isDryRun) riskFactors.push("ACTION ALLOWED BY DRY-RUN MODE");

        // 2. Perform transaction-based forensic logging
        const forensicStateRef = db.collection("system").doc("forensic_state");

        await db.runTransaction(async (transaction) => {
            const forensicStateDoc = await transaction.get(forensicStateRef);
            let prevHash = 'GENESIS';
            let sequenceNumber = 0;

            if (forensicStateDoc.exists) {
                const data = forensicStateDoc.data()!;
                prevHash = data.lastHash || 'GENESIS';
                sequenceNumber = data.sequenceCounter || 0;
            }

            sequenceNumber++;

            // 3. Compute canonical representation for hashing
            const canonicalPayload = JSON.stringify({
                seq: sequenceNumber,
                prev: prevHash,
                userId, agentId, toolName, args, decision, reason, sessionId, agentRole, costUsd, isLoop, riskScore
            });

            // 4. Compute SHA-256 integrity hash
            const integrityHash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');

            // 5. Update the global forensic state
            transaction.set(forensicStateRef, {
                lastHash: integrityHash,
                sequenceCounter: sequenceNumber,
                updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });

            // 6. Write the forensic log entry
            const logRef = db.collection("audit_logs").doc();
            transaction.set(logRef, {
                userId,
                agentId,
                toolName,
                arguments: args,
                decision,
                reason,
                sessionId,
                agentRole,
                cost_usd: costUsd,
                is_loop: isLoop,
                is_dry_run: isDryRun,
                // Forensic fields
                integrityHash,
                previousHash: prevHash,
                sequenceNumber: sequenceNumber,
                riskScore,
                riskFactors,
                timestamp: FieldValue.serverTimestamp()
            });
        });
    } catch (e) {
        console.error("Forensic log failure:", e);
    }
}

export const generatePolicyRegex = onRequest({ cors: true }, async (request, response) => {
    if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
    }

    try {
        const { prompt, toolName } = request.body;

        if (!prompt || !toolName) {
            response.status(400).json({ error: "Missing required fields: prompt, toolName" });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are an expert cybersecurity engineer. The user wants to restrict an AI agent using the tool '${toolName}'. They will describe the restriction in plain English: '${prompt}'. Return ONLY a raw Regular Expression string that matches the user's intent. Do not include markdown formatting, backticks, or explanations. If they want to BLOCK something, write a regex that matches the blocked pattern. If they want to ONLY ALLOW something, write a regex that matches the allowed pattern.`;

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
        });

        let regexString = aiResponse.text?.trim() || ".*";

        // Remove markdown formatting if the model slipped it in
        if (regexString.startsWith("\`\`\`")) {
            regexString = regexString.replace(/\`\`\`(regex)?/gi, "").trim();
        }

        response.status(200).json({ regex: regexString });
        return;
    } catch (error) {
        console.error("Error generating regex via Gemini:", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
