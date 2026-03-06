export function withagentgate(tools: Record<string, any>, options?: { apiKey?: string; apiUrl?: string }) {
    const apiKey = options?.apiKey || process.env.AGENTGATE_API_KEY || "";
    if (!apiKey) {
        throw new Error("AGENTGATE_API_KEY is required");
    }
    const apiUrl = options?.apiUrl || process.env.agentgate_API_URL || "https://api.agentgate.io/v1/evaluate";

    const securedTools: Record<string, any> = {};

    for (const [toolName, tool] of Object.entries(tools)) {
        securedTools[toolName] = {
            ...tool,
            execute: async (args: any, ...rest: any[]) => {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": \`Bearer \${apiKey}\`
                    },
                    body: JSON.stringify({
                        agentId: "vercel_ai_agent",
                        toolName,
                        arguments: args
                    })
                });

                if (!response.ok) {
                    throw new Error("agentgate: Network error, failing closed.");
                }

                const data = await response.json();
                if (data.decision === "DENY") {
                    throw new Error(\`agentgate Policy Violation: Tool '\${toolName}' is explicitly denied.\`);
                } else if (data.decision === "REQUIRE_APPROVAL") {
                    throw new Error(\`agentgate Policy Violation: Tool '\${toolName}' requires human approval.\`);
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
