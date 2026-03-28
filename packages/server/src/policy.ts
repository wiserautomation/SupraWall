// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response } from "express";
import { pool } from "./db";
import { logger } from "./logger";
import { logToFirestore, getFirestore, admin } from "./firebase";
import { resolveVaultTokens, VaultResolutionResult } from "./vault";
import { scrubResponse } from "./scrubber";
import { getAgentById } from "./auth";
import { sendSlackNotification } from "./slack";
import { TIER_LIMITS, currentMonth } from "./tier-config";
import type { Tier } from "./tier-config";
import { checkEvaluationLimit, recordEvaluation, tierLimitError } from "./tier-guard";

export interface EvaluationRequest {
    agentId: string;
    toolName: string;
    arguments: any;
    tenantId?: string;
    delegationChain?: string[]; 
}

export const evaluatePolicy = async (req: Request, res: Response) => {
    try {
        const authReq = req as any;
        const agent = authReq.agent;
        
        const { toolName, arguments: args } = req.body as EvaluationRequest;
        const agentId = agent?.id || req.body.agentId;
        const tenantId = agent?.tenantId || req.body.tenantId || "default-tenant";

        if (!agentId || !toolName) {
            return res.status(400).json({ error: "Missing agentId or toolName" });
        }

        // 0a. Resolve tenant tier
        let tenantTier: Tier = (req as any).tier || "open_source";
        const tierLimits = (req as any).tierLimits || TIER_LIMITS[tenantTier];

        // 0b. Cost Estimation (Early calculation for budget enforcement)
        const inputTokens = req.body.inputTokens || 0;
        const outputTokens = req.body.outputTokens || 0;
        const model = req.body.model || "gpt-4o-mini";
        
        const estimateActionCost = (inT: number, outT: number, mdl: string) => {
            if (inT > 0 || outT > 0) {
                const rates: any = { "gpt-4o": 0.005, "gpt-4o-mini": 0.00015, "claude": 0.003 };
                const rate = rates[Object.keys(rates).find(k => mdl.includes(k)) || "gpt-4o-mini"];
                return (inT / 1000 * rate) + (outT / 1000 * rate * 3);
            }
            return 0.0001; // minimal fallback for non-token actions
        };
        const estimatedCost = req.body.costUsd ?? estimateActionCost(inputTokens, outputTokens, model);

        // 0c. Monthly Evaluation Limit & Metering
        const { allowed, current } = await checkEvaluationLimit(tenantId, tierLimits);
        if (!allowed) {
            return res.status(402).json(tierLimitError("Monthly evaluations", current, tierLimits.maxEvaluationsPerMonth));
        }

        // 0d. Agent Budget Enforcement
        if (tierLimits.budgetEnforcement) {
            const maxBudget = agent?.max_cost_usd || 10;
            const spendRes = await pool.query(
                "SELECT SUM(cost_usd) as total FROM audit_logs WHERE agentid = $1",
                [agentId]
            );
            const currentSpend = parseFloat(spendRes.rows[0]?.total ?? "0");
            
            if (currentSpend + estimatedCost > maxBudget) {
                logger.warn(`[Budget] Denying request for agent ${agentId} due to budget limit: ${currentSpend + estimatedCost} > ${maxBudget}`);
                return res.status(403).json({
                    decision: "DENY",
                    reason: `Agent budget exceeded (${(currentSpend + estimatedCost).toFixed(4)} / ${maxBudget}).`,
                });
            }
        }

        // 0. Threat Detection (Blocking — returns DENY on match)
        const argsString = JSON.stringify(args || {});

        // SQL Injection Patterns
        const sqlPatterns = [
            { pattern: /DROP\s+TABLE/i, label: "DROP TABLE" },
            { pattern: /DELETE\s+FROM/i, label: "DELETE FROM" },
            { pattern: /INSERT\s+INTO/i, label: "INSERT INTO" },
        ];

        // Extended patterns for paid tiers
        if (tierLimits.threatDetectionPatterns !== 3) {
            sqlPatterns.push(
                { pattern: /UPDATE\s+\S+\s+SET/i, label: "UPDATE SET" },
                { pattern: /UNION\s+SELECT/i, label: "UNION SELECT" },
                { pattern: /OR\s+['"]?1['"]?\s*=\s*['"]?1/i, label: "OR 1=1" },
                { pattern: /'\s*OR\s+'[^']*'\s*=\s*'/i, label: "OR tautology" },
                { pattern: /;\s*--/i, label: "comment terminator" },
                { pattern: /'\s*;\s*DROP/i, label: "chained DROP" },
                { pattern: /EXEC(\s+|\()sp_/i, label: "EXEC stored procedure" },
                { pattern: /xp_cmdshell/i, label: "xp_cmdshell" }
            );
        }

        for (const { pattern, label } of sqlPatterns) {
            if (pattern.test(argsString)) {
                logger.warn(`[ThreatEngine] SQL Injection blocked: ${label}`, { agentId, toolName });
                pool.query(
                    "INSERT INTO threat_events (tenantid, agentid, event_type, severity, details) VALUES ($1, $2, $3, $4, $5)",
                    [tenantId, agentId, "sql_injection_attempt", "critical", JSON.stringify({ toolName, pattern: label })]
                ).catch(err => logger.error("Failed to log SQL injection threat", { error: err }));
                
                // Mirror to Firestore for dashboard real-time view
                logToFirestore("threat_events", {
                    tenantid: tenantId,
                    agentid: agentId,
                    event_type: "sql_injection_attempt",
                    severity: "critical",
                    details: { toolName, pattern: label }
                });

                await pool.query(
                    "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), "DENY", 100, 0,
                     JSON.stringify({ reason: `Threat blocked: SQL injection (${label})`, matchedRule: "threat_engine" })]
                );

                return res.status(403).json({
                    decision: "DENY",
                    reason: `Threat detected: SQL injection pattern (${label}) blocked by SupraWall Threat Engine.`,
                    threatType: "sql_injection",
                });
            }
        }

        // Prompt Injection Patterns
        const promptPatterns = [
            /Ignore\s+(all\s+)?previous\s+instructions/i,
            /System\s+bypass/i,
            /You\s+are\s+now\s+(a|an|the)\s/i,
            /Forget\s+(all\s+)?(your|previous)\s+instructions/i,
            /IGNORE\s+PREVIOUS/i,
            /Do\s+not\s+follow\s+(your|the|any)\s+(previous|original)/i,
            /Override\s+(system|safety|security)/i,
            /Disregard\s+(all|any|your)\s+(previous|prior|safety)/i,
            /Act\s+as\s+if\s+you\s+have\s+no\s+restrictions/i,
            /Reveal\s+(your|the)\s+(system\s+)?prompt/i,
        ];

        for (const pattern of promptPatterns) {
            if (pattern.test(argsString)) {
                logger.warn(`[ThreatEngine] Prompt Injection blocked`, { agentId, toolName, pattern: pattern.source });
                pool.query(
                    "INSERT INTO threat_events (tenantid, agentid, event_type, severity, details) VALUES ($1, $2, $3, $4, $5)",
                    [tenantId, agentId, "prompt_injection_attempt", "high", JSON.stringify({ toolName, pattern: pattern.source })]
                ).catch(err => logger.error("Failed to log prompt injection threat", { error: err }));

                // Mirror to Firestore
                logToFirestore("threat_events", {
                    tenantid: tenantId,
                    agentid: agentId,
                    event_type: "prompt_injection_attempt",
                    severity: "high",
                    details: { toolName, matchedPattern: pattern.source }
                });

                await pool.query(
                    "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), "DENY", 95, 0,
                     JSON.stringify({ reason: "Threat blocked: Prompt injection attempt", matchedRule: "threat_engine" })]
                );

                return res.status(403).json({
                    decision: "DENY",
                    reason: "Threat detected: Prompt injection attempt blocked by SupraWall Threat Engine.",
                    threatType: "prompt_injection",
                });
            }
        }

        // XSS / Script Injection Patterns
        const xssPatterns = [
            /<script[\s>]/i,
            /javascript\s*:/i,
            /on(error|load|click|mouseover)\s*=/i,
            /<iframe[\s>]/i,
            /<img[^>]+onerror/i,
        ];

        for (const pattern of xssPatterns) {
            if (pattern.test(argsString)) {
                logger.warn(`[ThreatEngine] XSS attempt blocked`, { agentId, toolName });
                pool.query(
                    "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), "DENY", 95, 0,
                     JSON.stringify({ reason: "Threat blocked: XSS/script injection attempt", matchedRule: "threat_engine" })]
                );
                return res.status(403).json({
                    decision: "DENY",
                    reason: "Threat detected: XSS/script injection attempt blocked by SupraWall Threat Engine.",
                    threatType: "xss_injection",
                });
            }
        }

        // 1. Gatekeeper: Scope Verification (Delegation Chain)
        const { delegationChain } = req.body as EvaluationRequest;
        const chain = delegationChain || [];
        const uniqueChain = Array.from(new Set([...chain, agentId]));

        // Batch-fetch all chain agents in a single query to avoid N+1
        const chainIdsToFetch = uniqueChain.filter(id => !(agent && agent.id === id));
        let chainAgentsMap: Map<string, any> = new Map();
        if (chainIdsToFetch.length > 0) {
            const batchResult = await pool.query(
                `SELECT id, tenantid, name, scopes, status, max_cost_usd, budget_alert_usd, slack_webhook
                 FROM agents WHERE id = ANY($1)`,
                [chainIdsToFetch]
            );
            for (const row of batchResult.rows) {
                chainAgentsMap.set(row.id, row);
            }
        }

        for (const actorId of uniqueChain) {
            const actor = (agent && agent.id === actorId) ? agent : (chainAgentsMap.get(actorId) || null);

            if (!actor) {
                logger.warn(`[Gatekeeper] Actor ${actorId} in chain not found.`);
                continue;
            }

            const scopes = actor.scopes || [];
            const isAllowedByScope = scopes.includes("*:*") ||
                                     scopes.includes(toolName) ||
                                     (toolName.includes(":") && scopes.includes(`${toolName.split(":")[0]}:*`));

            if (!isAllowedByScope) {
                await pool.query(
                    "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), "DENY", 100, 0,
                     JSON.stringify({ reason: "Chain scope failure", actorId, requiredScope: toolName, agentScopes: scopes })]
                );

                return res.status(403).json({
                    decision: "DENY",
                    reason: `Unauthorized: Actor '${actorId}' in delegation chain lacks scope for '${toolName}'.`
                });
            }
        }

        // 2. Policy Engine: Check complex rules in Postgres
        const result = await pool.query(
            "SELECT * FROM policies WHERE (tenantid = $1 OR tenantid = 'global')",
            [tenantId]
        );
        
        const toolMatches = (ruleTool: string, targetTool: string) => {
            if (!ruleTool || ruleTool === "*" || ruleTool === "" || ruleTool === targetTool) return true;
            if (ruleTool.includes("*")) {
                const regex = new RegExp("^" + ruleTool.replace(/\*/g, ".*") + "$");
                return regex.test(targetTool);
            }
            return false;
        };

        const policies = result.rows.filter(p => toolMatches(p.toolname, toolName));

        let decision = "ALLOW";
        let matchedRule = "default";

        // Check DENY policies
        const denyRules = policies.filter((p) => p.ruletype === "DENY");
        for (const rule of denyRules) {
            decision = "DENY";
            matchedRule = rule.name;
            break;
        }

        const response: any = {
            decision,
            reason: decision === "ALLOW" ? "No restrictions matched" : `Matched rule ${matchedRule}`,
        };

        // Check REQUIRE_APPROVAL policies
        if (decision !== "DENY") {
            const approvalRules = policies.filter((p) => p.ruletype === "REQUIRE_APPROVAL");
            for (const rule of approvalRules) {
                decision = "REQUIRE_APPROVAL";
                matchedRule = rule.name;
                response.decision = decision;
                response.reason = `Matched rule ${matchedRule}`;
                
                try {
                    const approvalRes = await pool.query(
                        "INSERT INTO approval_requests (tenantid, agentid, toolname, parameters, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                        [tenantId, agentId, toolName, JSON.stringify(args || {}), JSON.stringify({ matchedRule })]
                    );
                    const approvalId = approvalRes.rows[0]?.id;
                    if (!approvalId) {
                        return res.status(500).json({ decision: "DENY", reason: "Failed to create approval request." });
                    }
                    
                    const agentDetails = await getAgentById(agentId);
                    if (tierLimits.slackApprovals && agentDetails?.slack_webhook) {
                        await sendSlackNotification(
                            agentDetails.slack_webhook,
                            agentDetails.name || agentId,
                            toolName,
                            args,
                            approvalId
                        );
                    }
                    
                    response.approvalId = approvalId;
                } catch (err) {
                    logger.error("Failed to create approval request", { error: err, agentId, toolName });
                    decision = "DENY";
                    matchedRule = "approval_system_error";
                    response.decision = decision;
                    response.reason = matchedRule;
                }
                break;
            }
        }

        // 3. Vault: Secret Resolution
        let resolvedArgs = args;
        let vaultResult: VaultResolutionResult | null = null;
        let hasVaultTokens = /$SUPRAWALL_VAULT_[A-Z][A-Z0-9_]+/.test(argsString);

        if (hasVaultTokens && decision !== "DENY") {
            vaultResult = await resolveVaultTokens(tenantId, agentId, toolName, args);

            if (!vaultResult.success) {
                decision = "DENY";
                matchedRule = `vault:${vaultResult.errors.map(e => e.reason).join(",")}`;

                await pool.query(
                    "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), decision, 95, 0,
                     JSON.stringify({ vaultErrors: vaultResult.errors })]
                );

                return res.json({
                    decision: "DENY",
                    reason: `Vault access denied: ${vaultResult.errors.map(e => e.message).join("; ")}`,
                    vaultErrors: vaultResult.errors,
                });
            }

            resolvedArgs = vaultResult.resolvedArgs;
        }

        // 3b. Record evaluation usage
        if (decision !== "DENY") {
            await recordEvaluation(tenantId, tierLimits);
        }

        // 4. Audit Logging
        const auditRecord = {
            tenantid: tenantId,
            agentid: agentId,
            toolname: toolName,
            parameters: args,
            decision: decision,
            riskscore: decision === "DENY" ? 90 : (decision === "REQUIRE_APPROVAL" ? 60 : 10),
            cost_usd: estimatedCost,
            metadata: {
                matchedRule,
                agentName: agent?.name,
                vaultInjected: hasVaultTokens,
                vaultSecrets: vaultResult?.injectedSecrets || [],
                sessionId: req.body.sessionId || null,
                agentRole: req.body.agentRole || null,
                isLoop: req.body.isLoop || false
            }
        };

        await pool.query(
            "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [auditRecord.tenantid, auditRecord.agentid, auditRecord.toolname,
             JSON.stringify(auditRecord.parameters || {}),
             auditRecord.decision,
             auditRecord.riskscore,
             auditRecord.cost_usd,
             JSON.stringify(auditRecord.metadata)
            ]
        );

        // 5. Mirror to Firestore & Update Agent Stats
        const firestore = getFirestore();
        if (firestore) {
            logToFirestore("audit_logs", auditRecord);

            firestore.collection("agents").doc(agentId).set({
                totalCalls: (admin as any).firestore.FieldValue.increment(1),
                totalSpendUsd: (admin as any).firestore.FieldValue.increment(estimatedCost),
                lastUsedAt: (admin as any).firestore.FieldValue.serverTimestamp()
            }, { merge: true }).catch((err: any) => logger.error("[Firestore] Failed to update agent stats:", { error: err }));
        }

        if (hasVaultTokens && vaultResult?.success) {
            response.resolvedArguments = resolvedArgs;
            response.vaultInjected = true;
            response.injectedSecrets = vaultResult.injectedSecrets;
        }

        res.json(response);
    } catch (e) {
        logger.error("Evaluation error:", { error: e });
        res.status(500).json({ decision: "DENY", reason: "Internal Server Error" });
    }
};

export const scrubToolResponse = async (req: Request, res: Response) => {
    let tenantId = "default-tenant";
    try {
        const { tenantId: reqTenantId, secretNames, toolResponse } = req.body;
        tenantId = reqTenantId || "default-tenant";
        
        if (!secretNames || secretNames.length === 0) {
            return res.json({ scrubbedResponse: toolResponse });
        }

        const secretValues: string[] = [];
        for (const name of secretNames) {
            const result = await pool.query(
                `SELECT pgp_sym_decrypt(encrypted_value, $1) as value
                 FROM vault_secrets
                 WHERE tenant_id = $2 AND secret_name = $3`,
                [process.env.VAULT_ENCRYPTION_KEY, tenantId || "default-tenant", name]
            );
            if (result.rows.length > 0) {
                secretValues.push(result.rows[0].value);
            }
        }

        const scrubbed = scrubResponse(toolResponse, secretValues);
        res.json({ scrubbedResponse: scrubbed });
    } catch (e) {
        logger.error("Scrub error:", { error: e, tenantId });
        res.json({ scrubbedResponse: "[SCRUB_ERROR: Response redacted for safety]" });
    }
};
