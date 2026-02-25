import { Request, Response } from "express";
import { pool } from "./db";

export interface EvaluationRequest {
    agentId: string;
    toolName: string;
    arguments: any;
}

export const evaluatePolicy = async (req: Request, res: Response) => {
    try {
        const { agentId, toolName, arguments: args } = req.body as EvaluationRequest;

        if (!agentId || !toolName) {
            return res.status(400).json({ error: "Missing agentId or toolName" });
        }

        // Fetch policies for this agent
        const result = await pool.query(
            "SELECT * FROM policies WHERE agent_id = $1",
            [agentId]
        );
        const policies = result.rows;

        let decision = "ALLOW"; // Default behavior
        let matchedRule = "default";

        // Check explicit DENYs first
        const denyRules = policies.filter((p) => p.rule_type === "DENY");
        for (const rule of denyRules) {
            try {
                const regex = new RegExp(rule.condition);
                if (regex.test(toolName)) {
                    decision = "DENY";
                    matchedRule = rule.id.toString();
                    break;
                }
            } catch (e) {
                console.warn("Invalid regex in policy:", rule.condition);
            }
        }

        // If not denied, check REQUIRE_APPROVAL
        if (decision !== "DENY") {
            const approvalRules = policies.filter((p) => p.rule_type === "REQUIRE_APPROVAL");
            for (const rule of approvalRules) {
                try {
                    const regex = new RegExp(rule.condition);
                    if (regex.test(toolName)) {
                        decision = "REQUIRE_APPROVAL";
                        matchedRule = rule.id.toString();
                        break;
                    }
                } catch (e) {
                    console.warn("Invalid regex in policy:", rule.condition);
                }
            }
        }

        // Log the decision
        await pool.query(
            "INSERT INTO audit_logs (agent_id, tool_name, arguments, decision) VALUES ($1, $2, $3, $4)",
            [agentId, toolName, JSON.stringify(args || {}), decision]
        );

        res.json({
            decision,
            reason: decision === "ALLOW" ? "No restrictions matched" : \`Matched rule \${matchedRule}\`,
        });
    } catch (e) {
        console.error("Evaluation error:", e);
        res.status(500).json({ decision: "DENY", reason: "Internal Server Error" }); // Fail-closed
    }
};
