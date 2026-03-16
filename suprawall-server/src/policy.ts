import { Request, Response } from "express";
import { pool } from "./db";
import { resolveVaultTokens, VaultResolutionResult } from "./vault";
import { scrubResponse } from "./scrubber";
import { getAgentById } from "./auth";
import { sendSlackNotification } from "./slack";

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

        // 0. Threat Detection (Fire-and-forget)
        const argsString = JSON.stringify(args || {});
        (async () => {
            // SQL Injection Check
            const sqlInjections = [/' OR '1'='1/i, /UNION SELECT/i, /--;/];
            for (const pattern of sqlInjections) {
                if (pattern.test(argsString)) {
                    pool.query(
                        "INSERT INTO threat_events (tenantid, agentid, event_type, severity, details) VALUES ($1, $2, $3, $4, $5)",
                        [tenantId, agentId, "sql_injection_attempt", "high", JSON.stringify({ toolName, pattern: pattern.source })]
                    ).catch(console.error);
                }
            }
            // Prompt Injection Check
            if (argsString.includes("Ignore all previous instructions") || argsString.includes("System bypass")) {
                pool.query(
                    "INSERT INTO threat_events (tenantid, agentid, event_type, severity, details) VALUES ($1, $2, $3, $4, $5)",
                    [tenantId, agentId, "prompt_injection_attempt", "medium", JSON.stringify({ toolName })]
                ).catch(console.error);
            }
        })();

        // 1. Gatekeeper: Scope Verification (Delegation Chain)
        const { delegationChain } = req.body as EvaluationRequest;
        const chain = delegationChain || [];
        const uniqueChain = Array.from(new Set([...chain, agentId]));

        for (const actorId of uniqueChain) {
            const actor = (agent && agent.id === actorId) ? agent : await getAgentById(actorId);
            
            if (!actor) {
                console.warn(`[Gatekeeper] Actor ${actorId} in chain not found.`);
                continue; 
            }

            const scopes = actor.scopes || [];
            const isAllowedByScope = scopes.includes("*:*") || 
                                     scopes.includes(toolName) || 
                                     (toolName.includes(":") && scopes.includes(`${toolName.split(":")[0]}:*`));
            
            if (!isAllowedByScope) {
                await pool.query(
                    "INSERT INTO auditlogs (tenantid, agentid, toolname, parameters, decision, riskscore, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), "DENY", 100, 
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
        
        // Advanced matching in JS
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
                
                // Create approval request in DB
                try {
                    const approvalRes = await pool.query(
                        "INSERT INTO approval_requests (tenantid, agentid, toolname, parameters, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING id",
                        [tenantId, agentId, toolName, JSON.stringify(args || {}), JSON.stringify({ matchedRule })]
                    );
                    const approvalId = approvalRes.rows[0].id;
                    
                    // Send Slack notification if agent has webhook
                    const agentDetails = await getAgentById(agentId);
                    if (agentDetails?.slack_webhook) {
                        await sendSlackNotification(
                            agentDetails.slack_webhook,
                            agentDetails.name || agentId,
                            toolName,
                            args,
                            approvalId
                        );
                    }
                    
                    // Attach ID to response for tracking
                    response.approvalId = approvalId;
                } catch (err) {
                    console.error("Failed to create approval request", err);
                    // Fallback to DENY if we can't create the approval request
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
        let hasVaultTokens = false;

        // argsString is already declared above
        hasVaultTokens = /\$SUPRAWALL_VAULT_[A-Z][A-Z0-9_]+/.test(argsString);

        if (hasVaultTokens && decision !== "DENY") {
            vaultResult = await resolveVaultTokens(tenantId, agentId, toolName, args);

            if (!vaultResult.success) {
                decision = "DENY";
                matchedRule = `vault:${vaultResult.errors.map(e => e.reason).join(",")}`;

                await pool.query(
                    "INSERT INTO auditlogs (tenantid, agentid, toolname, parameters, decision, riskscore, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), decision, 95,
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

        // 4. Audit Logging
        await pool.query(
            "INSERT INTO auditlogs (tenantid, agentid, toolname, parameters, decision, riskscore, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [tenantId, agentId, toolName,
             JSON.stringify(args || {}),
             decision,
             decision === "DENY" ? 90 : (decision === "REQUIRE_APPROVAL" ? 60 : 10),
             JSON.stringify({
                 matchedRule,
                 agentName: agent?.name,
                 vaultInjected: hasVaultTokens,
                 vaultSecrets: vaultResult?.injectedSecrets || [],
             })
            ]
        );

        if (hasVaultTokens && vaultResult?.success) {
            response.resolvedArguments = resolvedArgs;
            response.vaultInjected = true;
            response.injectedSecrets = vaultResult.injectedSecrets;
        }

        res.json(response);
    } catch (e) {
        console.error("Evaluation error:", e);
        res.status(500).json({ decision: "DENY", reason: "Internal Server Error" });
    }
};

export const scrubToolResponse = async (req: Request, res: Response) => {
    try {
        const { tenantId, secretNames, toolResponse } = req.body;

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
        console.error("Scrub error:", e);
        res.json({ scrubbedResponse: "[SCRUB_ERROR: Response redacted for safety]" });
    }
};
