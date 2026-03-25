// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "@langchain/core/load/serializable";

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
        tool: Serialized,
        input: string,
        _runId: string,
        _parentRunId?: string,
        _tags?: string[],
        _metadata?: Record<string, unknown>,
        _runName?: string,
        _toolCallId?: string
    ): Promise<void> {
        const toolName = (tool.id?.[tool.id.length - 1] as string) || "unknown";

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
    }
}

/**
 * One-line LangChain security wrapper.
 */
export function secureChain<T extends { withConfig: (config: { callbacks: any[] }) => T }>(
    chain: T,
    apiKey: string,
    options?: Omit<SupraWallOptions, "apiKey">
): T {
    const handler = new SupraWallCallbackHandler({ apiKey, ...options });
    return chain.withConfig({ callbacks: [handler] });
}
