import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

export interface SupraWallOptions {
    /** Your SupraWall API key (sw_...) */
    apiKey?: string;
    /** Override the default API endpoint */
    apiUrl?: string;
    /** Agent identifier shown in audit logs */
    agentId?: string;
    /** Whether to throw on REQUIRE_APPROVAL decisions (default: true) */
    blockOnApproval?: boolean;
}

/**
 * SupraWallLangChainCallback — LangChain security integration.
 *
 * Adds deterministic governance and audit logging to any LangChain agent.
 */
export class SupraWallLangChainCallback extends BaseCallbackHandler {
    name = "SupraWallLangChainCallback";
    private apiKey: string;
    private apiUrl: string;
    private agentId: string;
    private blockOnApproval: boolean;

    constructor(options?: SupraWallOptions) {
        super();
        this.apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
        if (!this.apiKey) {
            throw new Error(
                "[SupraWall] SUPRAWALL_API_KEY is required. Get yours at https://www.supra-wall.com"
            );
        }
        this.apiUrl =
            options?.apiUrl ||
            process.env.SUPRAWALL_API_URL ||
            "https://api.supra-wall.com/v1/evaluate";
        this.agentId = options?.agentId || "langchain_agent";
        this.blockOnApproval = options?.blockOnApproval !== false;
    }

    async handleToolStart(
        tool: { name?: string; [key: string]: unknown },
        input: string
    ): Promise<void> {
        const toolName = (tool.name as string) || "unknown";

        try {
            const response = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    agentId: this.agentId,
                    toolName,
                    arguments: input,
                }),
            });

            if (!response.ok) {
                // Fail closed on network/server errors
                throw new Error(
                    `[SupraWall] Policy server returned ${response.status}. Failing closed for safety.`
                );
            }

            const data = (await response.json()) as { decision: string; reason?: string };

            if (data.decision === "DENY") {
                throw new Error(
                    `[SupraWall] Policy violation: tool '${toolName}' is denied. ${data.reason || ""}`
                );
            }

            if (data.decision === "REQUIRE_APPROVAL" && this.blockOnApproval) {
                throw new Error(
                    `[SupraWall] Tool '${toolName}' requires human approval. Approve in the SupraWall dashboard.`
                );
            }

        } catch (error: any) {
            // Re-throw SupraWall errors, wrap others
            if (error.message.includes("[SupraWall]")) {
                throw error;
            }
            throw new Error(`[SupraWall] Interception error: ${error.message}`);
        }
    }
}

/**
 * One-line LangChain security wrapper.
 * Wraps the chain with SupraWall policy enforcement.
 */
export function secureChain<T extends { withConfig: (config: { callbacks: any[] }) => T }>(
    chain: T,
    options?: SupraWallOptions
): T {
    const handler = new SupraWallLangChainCallback(options);
    return chain.withConfig({ callbacks: [handler] });
}
