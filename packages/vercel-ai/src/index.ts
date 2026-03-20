/**
 * SupraWall Vercel AI SDK Integration
 * 
 * Provides deterministic tool-level security middleware.
 */

export interface SupraWallOptions {
    /** Your SupraWall API key (sw_...) */
    apiKey?: string;
    /** Override the default API endpoint */
    apiUrl?: string;
    /** Agent identifier shown in audit logs */
    agentId?: string;
}

/**
 * Wraps Vercel AI SDK tools with SupraWall governance.
 * 
 * @example
 * ```typescript
 * const tools = wrapTools({
 *   myTool: tool({ ... })
 * }, { apiKey: "sw_..." });
 * ```
 */
export function wrapTools(
    tools: Record<string, any>, 
    options?: SupraWallOptions
) {
    const apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
    if (!apiKey) {
        throw new Error("[SupraWall] SUPRAWALL_API_KEY is required.");
    }

    const apiUrl = options?.apiUrl || 
                 process.env.SUPRAWALL_API_URL || 
                 "https://api.supra-wall.com/v1/evaluate";
    
    const agentId = options?.agentId || "vercel_ai_agent";

    const securedTools: Record<string, any> = {};

    for (const [toolName, tool] of Object.entries(tools)) {
        securedTools[toolName] = {
            ...tool,
            execute: async (args: any, ...rest: any[]) => {
                // Determine if we should evaluate (some tools might be internal)
                
                try {
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            agentId,
                            toolName,
                            arguments: args
                        })
                    });

                    if (!response.ok) {
                        // Fail closed on network errors
                        throw new Error(`[SupraWall] Network error (${response.status}). Failing closed for safety.`);
                    }

                    const data = await response.json() as { decision: string; reason?: string };

                    if (data.decision === "DENY") {
                        throw new Error(`[SupraWall] Policy Violation: Tool '${toolName}' is explicitly denied. ${data.reason || ""}`);
                    } else if (data.decision === "REQUIRE_APPROVAL") {
                        throw new Error(`[SupraWall] Policy Violation: Tool '${toolName}' requires human approval. Visit the dashboard to approve or use the approval webhook.`);
                    }

                    // ALLOW - Proceed to original execution
                    if (typeof tool.execute === "function") {
                        return await tool.execute(args, ...rest);
                    }
                } catch (error: any) {
                    // Re-throw SupraWall errors, or wrap network errors
                    if (error.message.includes("[SupraWall]")) {
                        throw error;
                    }
                    throw new Error(`[SupraWall] Security Interception Error: ${error.message}`);
                }
            }
        };
    }

    return securedTools;
}
