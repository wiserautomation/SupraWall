import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

export class AgentGateCallbackHandler extends BaseCallbackHandler {
    name = "AgentGateCallbackHandler";
    private apiKey: string;
    private apiUrl: string;

    constructor(options?: { apiKey?: string; apiUrl?: string }) {
        super();
        this.apiKey = options?.apiKey || process.env.AGENTGATE_API_KEY || "";
        if (!this.apiKey) {
            throw new Error("AGENTGATE_API_KEY is required");
        }
        this.apiUrl = options?.apiUrl || process.env.AGENTGATE_API_URL || "https://api.agentgate.io/v1/evaluate";
    }

    async handleToolStart(tool: any, input: string) {
        const toolName = tool.name || "unknown";
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": \`Bearer \${this.apiKey}\`
            },
            body: JSON.stringify({
                agentId: "langchain_ts_agent",
                toolName,
                arguments: input
            })
        });

        if (!response.ok) {
            throw new Error("AgentGate: Network error, failing closed.");
        }

        const data = await response.json();
        if (data.decision === "DENY") {
            throw new Error(\`AgentGate Policy Violation: Tool '\${toolName}' is explicitly denied.\`);
        } else if (data.decision === "REQUIRE_APPROVAL") {
            throw new Error(\`AgentGate: Tool '\${toolName}' requires human approval.\`);
        }
    }
}
