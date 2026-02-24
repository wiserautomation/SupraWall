export interface AgentGuardResponse {
    decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    reason?: string;
}

export interface AgentInstance {
    executeTool: (toolName: string, args: any) => Promise<any> | any;
    [key: string]: any;
}

/**
 * Wraps an AI Agent instance with AgentGuard security authorization.
 * Overrides `executeTool` to intercept action attempts.
 * 
 * @param agentInstance The AI agent object (e.g. LangChain agent wrapper) containing an `executeTool` method.
 * @param apiKey The AgentGuard Key generated from the dashboard.
 * @param cloudFunctionUrl The URL of the AgentGuard Cloud Function (e.g., evaluateAction).
 * @returns The wrapped agent instance.
 */
export function withAgentGuard<T extends AgentInstance>(
    agentInstance: T,
    apiKey: string,
    cloudFunctionUrl: string
): T {
    const originalExecuteTool = agentInstance.executeTool.bind(agentInstance);

    agentInstance.executeTool = async (toolName: string, args: any) => {
        try {
            // 1. Intercept the call and query AgentGuard
            const response = await fetch(cloudFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey,
                    toolName,
                    args,
                }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    return "ERROR: Action blocked by security policy.";
                }
                return `ERROR: AgentGuard Internal Error (${response.status})`;
            }

            const data = (await response.json()) as AgentGuardResponse;

            // 2. Evaluate the decision
            switch (data.decision) {
                case "ALLOW":
                    // Secure path executed
                    return await originalExecuteTool(toolName, args);

                case "DENY":
                    console.warn(`[AgentGuard] Security policy blocked tool execution '${toolName}'.`);
                    return "ERROR: Action blocked by security policy.";

                case "REQUIRE_APPROVAL":
                    console.warn(`[AgentGuard] Tool execution '${toolName}' paused. Human approval required.`);
                    return "ACTION PAUSED: Human approval required.";

                default:
                    return "ERROR: Unknown AgentGuard decision.";
            }
        } catch (e) {
            console.error("[AgentGuard] Network error trying to reach control plane.", e);
            return "ERROR: Network failure communicating with AgentGuard.";
        }
    };

    return agentInstance;
}
