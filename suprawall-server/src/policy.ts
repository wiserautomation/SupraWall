import { Request, Response } from "express";
import { pool } from "./db";
import { resolveVaultTokens, VaultResolutionResult } from "./vault";
import { scrubResponse } from "./scrubber";

export interface EvaluationRequest {
    agentId: string;
    toolName: string;
    arguments: any;
    tenantId?: string;
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

        // 1. Gatekeeper: Scope Verification
        if (agent) {
            const scopes = agent.scopes || [];
            const isAllowedByScope = scopes.includes("*:*") || 
                                     scopes.includes(toolName) || 
                                     (toolName.includes(":") && scopes.includes(`${toolName.split(":")[0]}:*`));
            
            if (!isAllowedByScope) {
                // Log the unauthorized scope attempt
                await pool.query(
                    "INSERT INTO auditlogs (tenantid, agentid, toolname, parameters, decision, riskscore, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                    [tenantId, agentId, toolName, JSON.stringify(args || {}), "DENY", 100, 
                     JSON.stringify({ reason: "Unauthorized scope", requiredScope: toolName, agentScopes: scopes })]
                );

                return res.status(403).json({ 
                    decision: "DENY", 
                    reason: `Unauthorized: Agent does not have scope for tool '${toolName}'.` 
                });
            }
        }

        // 2. Policy Engine: Check complex rules in Postgres
        const result = await pool.query(
            "SELECT * FROM policies WHERE (tenantid = $1 OR tenantid = 'global') AND (toolname = $2 OR toolname IS NULL OR toolname = '' OR toolname = '*')",
            [tenantId, toolName]
        );
        const policies = result.rows;

        let decision = "ALLOW";
        let matchedRule = "default";

        // Check DENY policies
        const denyRules = policies.filter((p) => p.ruletype === "DENY");
        for (const rule of denyRules) {
            decision = "DENY";
            matchedRule = rule.name;
            break;
        }

        // Check REQUIRE_APPROVAL policies
        if (decision !== "DENY") {
            const approvalRules = policies.filter((p) => p.ruletype === "REQUIRE_APPROVAL");
            for (const rule of approvalRules) {
                decision = "REQUIRE_APPROVAL";
                matchedRule = rule.name;
                break;
            }
        }

        // 3. Vault: Secret Resolution
        let resolvedArgs = args;
        let vaultResult: VaultResolutionResult | null = null;
        let hasVaultTokens = false;

        const argsString = JSON.stringify(args || {});
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

        const response: any = {
            decision,
            reason: decision === "ALLOW" ? "No restrictions matched" : `Matched rule ${matchedRule}`,
        };

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
