// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export function withsuprawall(tools: Record<string, any>, options?: { apiKey?: string; apiUrl?: string }) {
    const apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
    if (!apiKey) {
        throw new Error("SUPRAWALL_API_KEY is required");
    }
    const apiUrl = options?.apiUrl || process.env.suprawall_API_URL || "https://api.suprawall.io/v1/evaluate";

    const securedTools: Record<string, any> = {};

    for (const [toolName, tool] of Object.entries(tools)) {
        securedTools[toolName] = {
            ...tool,
            execute: async (args: any, ...rest: any[]) => {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        agentId: "vercel_ai_agent",
                        toolName,
                        arguments: args
                    })
                });

                if (!response.ok) {
                    throw new Error("suprawall: Network error, failing closed.");
                }

                const data = await response.json();
                if (data.decision === "DENY") {
                    throw new Error(`suprawall Policy Violation: Tool '${toolName}' is explicitly denied.`);
                } else if (data.decision === "REQUIRE_APPROVAL") {
                    throw new Error(`suprawall Policy Violation: Tool '${toolName}' requires human approval.`);
                }

                // Call the original Vercel AI SDK tool execute logic
                if (typeof tool.execute === "function") {
                    return tool.execute(args, ...rest);
                }
            }
        };
    }

    return securedTools;
}
