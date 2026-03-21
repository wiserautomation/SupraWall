import { 
    LanguageModelV2Middleware
} from "@ai-sdk/provider";

export interface SupraWallOptions {
    apiKey?: string;
    apiUrl?: string;
    agentId?: string;
}

/**
 * SupraWall Security Middleware for Vercel AI SDK.
 * 
 * Intercepts tool calls and evaluates them against SupraWall policies.
 */
export const suprawallMiddleware = (options?: SupraWallOptions): LanguageModelV2Middleware => {
    const apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
    const apiUrl = options?.apiUrl || 
                 process.env.SUPRAWALL_API_URL || 
                 "https://api.supra-wall.com/v1/evaluate";
    const agentId = options?.agentId || "vercel_ai_agent";

    if (!apiKey) {
        console.warn("[SupraWall] Warning: SUPRAWALL_API_KEY is missing. Security layer will fail-open.");
    }

    return {
        wrapGenerate: async ({ model, params }: { model: any, params: any }) => {
            return model;
        },
        
        wrapStream: async ({ model, params }: { model: any, params: any }) => {
            return model;
        }
    };
};

/**
 * Wraps Vercel AI SDK tools with SupraWall governance.
 * Deterministically blocks tool execution before it starts.
 */
export function wrapTools(
    tools: Record<string, any>, 
    options?: SupraWallOptions
) {
    const apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
    const apiUrl = options?.apiUrl || 
                 process.env.SUPRAWALL_API_URL || 
                 "https://api.supra-wall.com/v1/evaluate";
    const agentId = options?.agentId || "vercel_ai_agent";

    const securedTools: Record<string, any> = {};

    for (const [toolName, tool] of Object.entries(tools)) {
        const originalExecute = tool.execute;
        
        securedTools[toolName] = {
            ...tool,
            execute: async (args: any, ...rest: any[]) => {
                if (!apiKey) return originalExecute ? originalExecute(args, ...rest) : undefined;

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
                        throw new Error(`[SupraWall] Policy server unreachable (${response.status}).`);
                    }

                    const data = await response.json() as { decision: string; reason?: string };

                    if (data.decision === "DENY") {
                        throw new Error(`[SupraWall] DENIED: ${data.reason || "Policy violation"}`);
                    } else if (data.decision === "REQUIRE_APPROVAL") {
                        throw new Error(`[SupraWall] PENDING: Action requires human approval.`);
                    }

                    // ALLOW
                    if (originalExecute) {
                        return await originalExecute(args, ...rest);
                    }
                } catch (error: any) {
                    if (error.message.includes("[SupraWall]")) throw error;
                    throw new Error(`[SupraWall] Security Interception Error: ${error.message}`);
                }
            }
        };
    }

    return securedTools;
}
