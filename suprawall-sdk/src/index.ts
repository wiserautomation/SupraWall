const DEFAULT_CLOUD_FUNCTION_URL =
    "https://us-central1-suprawall-prod.cloudfunctions.net/evaluateAction";
const SDK_VERSION = "0.1.0";

export interface SupraWallResponse {
    decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    reason?: string;
}

export interface SupraWallOptions {
    /**
     * Your SupraWall API key.
     * Get one free at https://supra-wall-rho.vercel.app/
     * Format: ag_xxxxxxxxxxxxxxxx
     */
    apiKey: string;
    /**
     * Override the SupraWall evaluation endpoint.
     * Defaults to the hosted SupraWall cloud function.
     * Set this for self-hosted deployments.
     */
    cloudFunctionUrl?: string;
    /**
     * What to do when SupraWall is unreachable.
     * "fail-open"   → allow the action and log a warning (default, good for dev)
     * "fail-closed" → block the action (recommended for production)
     */
    onNetworkError?: "fail-open" | "fail-closed";
    /**
     * Custom logger. Defaults to console.
     * Pass `{ warn: () => {}, error: () => {}, log: () => {} }` to silence.
     */
    logger?: Pick<Console, "warn" | "error" | "log">;
}

export interface AgentInstance {
    executeTool: (toolName: string, args: any) => Promise<any> | any;
    [key: string]: any;
}

/**
 * Wraps any AI agent with SupraWall security enforcement.
 *
 * Every tool call is intercepted and evaluated against your policies
 * before execution. Zero infrastructure required — just an API key.
 *
 * @example
 * // Works with LangChain, OpenAI Agents SDK, CrewAI, AutoGen, raw MCP
 * import { withSupraWall } from "suprawall";
 *
 * const secured = withSupraWall(myAgent, { apiKey: "ag_your_key" });
 * await secured.executeTool("send_email", { to: "ceo@company.com" }); // checked
 *
 * @param agentInstance - Any agent object with an `executeTool` method
 * @param options - SupraWall configuration (only `apiKey` is required)
 * @returns The same agent instance, now protected by SupraWall
 */
export function withSupraWall<T extends AgentInstance>(
    agentInstance: T,
    options: SupraWallOptions
): T {
    const {
        apiKey,
        cloudFunctionUrl = DEFAULT_CLOUD_FUNCTION_URL,
        onNetworkError = "fail-open",
        logger = console,
    } = options;

    if (!apiKey || !apiKey.startsWith("ag_")) {
        throw new Error(
            `[SupraWall] Invalid API key: "${apiKey}".\n` +
            `  Get your free key at https://supra-wall-rho.vercel.app/\n` +
            `  Expected format: ag_xxxxxxxxxxxxxxxx`
        );
    }

    const originalExecuteTool = agentInstance.executeTool.bind(agentInstance);

    agentInstance.executeTool = async (toolName: string, args: any) => {
        try {
            const response = await fetch(cloudFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-SupraWall-SDK": `js-${SDK_VERSION}`,
                },
                body: JSON.stringify({ apiKey, toolName, args }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        `[SupraWall] Unauthorized. Check your API key at https://supra-wall-rho.vercel.app/`
                    );
                }
                if (response.status === 429) {
                    logger.warn(`[SupraWall] Rate limit exceeded for tool '${toolName}'.`);
                    return "ERROR: SupraWall rate limit exceeded. Try again shortly.";
                }
                if (response.status === 403) {
                    logger.warn(`[SupraWall] Tool '${toolName}' blocked by policy (HTTP 403).`);
                    return "ERROR: Action blocked by SupraWall security policy.";
                }
                throw new Error(`[SupraWall] Server error ${response.status}`);
            }

            const data = (await response.json()) as SupraWallResponse;

            switch (data.decision) {
                case "ALLOW":
                    return await originalExecuteTool(toolName, args);

                case "DENY":
                    logger.warn(
                        `[SupraWall] DENIED '${toolName}'. ${data.reason ? `Reason: ${data.reason}` : ""}`
                    );
                    return `ERROR: Action blocked by SupraWall. ${data.reason ?? ""}`.trim();

                case "REQUIRE_APPROVAL":
                    logger.warn(
                        `[SupraWall] PAUSED '${toolName}'. Human approval required.`
                    );
                    return "ACTION PAUSED: This action requires human approval. Check your SupraWall dashboard at https://supra-wall-rho.vercel.app/";

                default:
                    logger.error("[SupraWall] Unknown decision in response:", data);
                    return "ERROR: Unknown SupraWall decision.";
            }
        } catch (e: any) {
            // Re-throw hard errors (bad API key, etc.) — don't silently swallow them
            if (e instanceof Error && e.message.startsWith("[SupraWall]")) {
                throw e;
            }
            logger.error("[SupraWall] Network error reaching control plane.", e);
            if (onNetworkError === "fail-closed") {
                return "ERROR: SupraWall unreachable. Action blocked (fail-closed mode).";
            }
            logger.warn("[SupraWall] Proceeding without policy check (fail-open mode). Set onNetworkError: 'fail-closed' in production.");
            return await originalExecuteTool(toolName, args);
        }
    };

    return agentInstance;
}

/**
 * MCP-native middleware for Model Context Protocol servers.
 *
 * @example
 * import { createSupraWallMiddleware } from "suprawall";
 *
 * const gate = createSupraWallMiddleware({ apiKey: "ag_your_key" });
 *
 * // In your MCP tool handler:
 * server.setRequestHandler(CallToolRequestSchema, async (req) => {
 *   return gate(req.params.name, req.params.arguments, () => myToolHandler(req));
 * });
 */
export function createSupraWallMiddleware(options: SupraWallOptions) {
    const {
        apiKey,
        cloudFunctionUrl = DEFAULT_CLOUD_FUNCTION_URL,
        onNetworkError = "fail-open",
        logger = console,
    } = options;

    return async function agentGateMiddleware(
        toolName: string,
        args: any,
        next: () => Promise<any>
    ): Promise<any> {
        try {
            const response = await fetch(cloudFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-SupraWall-SDK": `js-${SDK_VERSION}`,
                },
                body: JSON.stringify({ apiKey, toolName, args }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    return { error: "Action blocked by SupraWall security policy." };
                }
                if (response.status === 429) {
                    return { error: "SupraWall rate limit exceeded." };
                }
                throw new Error(`SupraWall server error: ${response.status}`);
            }

            const data = (await response.json()) as SupraWallResponse;

            if (data.decision === "ALLOW") return await next();
            if (data.decision === "DENY") {
                logger.warn(`[SupraWall] MCP tool '${toolName}' denied. ${data.reason ?? ""}`);
                return { error: `Blocked by SupraWall. ${data.reason ?? ""}`.trim() };
            }
            if (data.decision === "REQUIRE_APPROVAL") {
                return { error: "Human approval required. Check https://supra-wall-rho.vercel.app/" };
            }
        } catch (e) {
            logger.error("[SupraWall] Middleware error.", e);
            if (onNetworkError === "fail-closed") {
                return { error: "SupraWall unreachable. Action blocked." };
            }
            return await next();
        }
    };
}

// Backwards compatibility alias for anyone using the old name
export { withSupraWall as withSupraWall };
export type { SupraWallOptions as SupraWallOptions };
