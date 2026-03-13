import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

export interface SupraWallOptions {
    /** Your Supra-wall API key (sw_...) */
    apiKey?: string;
    /** Override the default API endpoint */
    apiUrl?: string;
    /** Agent identifier shown in audit logs */
    agentId?: string;
    /** Whether to throw on REQUIRE_APPROVAL decisions (default: true) */
    blockOnApproval?: boolean;
}

/**
 * SupraWallCallbackHandler — LangChain EU AI Act compliance integration.
 *
 * Adds to every LangChain agent:
 * - Article 12: Tamper-evident audit logging of all tool calls
 * - Article 14: Human oversight gates (REQUIRE_APPROVAL blocks destructive tools)
 * - Article 9:  Policy enforcement and fail-closed safety
 *
 * @example
 * ```typescript
 * import { SupraWallCallbackHandler, secureChain } from "@suprawall/langchain";
 *
 * // Option 1: Callback handler
 * const handler = new SupraWallCallbackHandler({ apiKey: "sw_..." });
 * const chain = yourChain.withConfig({ callbacks: [handler] });
 *
 * // Option 2: One-line wrapper
 * const secured = secureChain(yourChain, "sw_...");
 * ```
 */
export class SupraWallCallbackHandler extends BaseCallbackHandler {
    name = "SupraWallCallbackHandler";
    private apiKey: string;
    private apiUrl: string;
    private agentId: string;
    private blockOnApproval: boolean;

    constructor(options?: SupraWallOptions) {
        super();
        this.apiKey = options?.apiKey || process.env.SUPRAWALL_API_KEY || "";
        if (!this.apiKey) {
            throw new Error(
                "[Supra-wall] SUPRAWALL_API_KEY is required. Get yours at supra-wall.com"
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

        let response: Response;
        try {
            response = await fetch(this.apiUrl, {
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
        } catch {
            // Fail closed on network errors — never allow agents to run without policy checks
            throw new Error(
                "[Supra-wall] Could not reach policy server. Failing closed for safety."
            );
        }

        if (!response.ok) {
            throw new Error(
                `[Supra-wall] Policy server returned ${response.status}. Failing closed.`
            );
        }

        const data = (await response.json()) as { decision: string; reason?: string };

        if (data.decision === "DENY") {
            throw new Error(
                `[Supra-wall] Policy violation: tool '${toolName}' is denied. ${data.reason || ""}`
            );
        }

        if (data.decision === "REQUIRE_APPROVAL" && this.blockOnApproval) {
            throw new Error(
                `[Supra-wall] Tool '${toolName}' requires human approval. ` +
                    `Approve in the Supra-wall dashboard or configure the approval webhook.`
            );
        }

        // ALLOW — continue normally
    }
}

/**
 * One-line LangChain security wrapper.
 * Wraps the chain with Supra-wall policy enforcement.
 */
export function secureChain<T extends { withConfig: (config: { callbacks: unknown[] }) => T }>(
    chain: T,
    apiKey: string,
    options?: Omit<SupraWallOptions, "apiKey">
): T {
    const handler = new SupraWallCallbackHandler({ apiKey, ...options });
    return chain.withConfig({ callbacks: [handler] });
}

// Legacy export
export { SupraWallCallbackHandler as suprawallCallbackHandler };
