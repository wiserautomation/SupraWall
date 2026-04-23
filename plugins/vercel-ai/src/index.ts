// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export interface SupraWallOptions {
    /** Your SupraWall API key (sw_...) */
    apiKey?: string;
    /** Override the default API endpoint */
    apiUrl?: string;
    /** Agent identifier shown in audit logs */
    agentId?: string;
}

/**
 * withSupraWall — wrap a Vercel AI SDK `tools` object so every tool execution
 * is policy-checked by the SupraWall gateway before the underlying tool runs.
 *
 * @example
 * import { withSupraWall } from "suprawall-vercel-ai";
 * import { generateText } from "ai";
 *
 * const secured = withSupraWall(myTools, { apiKey: process.env.SUPRAWALL_API_KEY });
 *
 * await generateText({
 *   model,
 *   tools: secured,
 *   prompt: "...",
 * });
 */
export function withSupraWall(
    tools: Record<string, any>,
    options?: SupraWallOptions
): Record<string, any> {
    const apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
    if (!apiKey) {
        throw new Error(
            "[SupraWall] SUPRAWALL_API_KEY is required. Get yours at supra-wall.com"
        );
    }
    const apiUrl =
        options?.apiUrl ||
        process.env.SUPRAWALL_API_URL ||
        "https://api.supra-wall.com/v1/evaluate";
    const agentId = options?.agentId || "vercel_ai_agent";

    const securedTools: Record<string, any> = {};

    for (const [toolName, tool] of Object.entries(tools)) {
        securedTools[toolName] = {
            ...tool,
            execute: async (args: any, ...rest: any[]) => {
                let response: Response;
                try {
                    response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            agentId,
                            toolName,
                            arguments: args,
                        }),
                    });
                } catch {
                    throw new Error(
                        "[SupraWall] Could not reach policy server. Failing closed for safety."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        `[SupraWall] Policy server returned ${response.status}. Failing closed.`
                    );
                }

                const data = (await response.json()) as {
                    decision: string;
                    reason?: string;
                };

                if (data.decision === "DENY") {
                    throw new Error(
                        `[SupraWall] Policy violation: tool '${toolName}' is denied. ${data.reason || ""}`
                    );
                }

                if (data.decision === "REQUIRE_APPROVAL") {
                    throw new Error(
                        `[SupraWall] Tool '${toolName}' requires human approval. ` +
                            `Approve in the SupraWall dashboard or configure the approval webhook.`
                    );
                }

                // ALLOW — call the original Vercel AI SDK tool execute
                if (typeof tool.execute === "function") {
                    return tool.execute(args, ...rest);
                }
            },
        };
    }

    return securedTools;
}

/** @deprecated renamed to `withSupraWall`. Kept for backwards compatibility. */
export const withsuprawall = withSupraWall;
