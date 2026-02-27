const DEFAULT_CLOUD_FUNCTION_URL =
    "https://us-central1-suprawall-prod.cloudfunctions.net/evaluateAction";
const SDK_VERSION = "0.1.0";

// ---------------------------------------------------------------------------
// Cost estimation — model token costs (USD per 1k tokens)
// ---------------------------------------------------------------------------

const MODEL_COSTS_PER_1K: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 0.005, output: 0.015 },
    "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
    "gpt-4-turbo": { input: 0.01, output: 0.03 },
    "claude-3-5-sonnet": { input: 0.003, output: 0.015 },
    "claude-3-5-haiku": { input: 0.0008, output: 0.004 },
    "gemini-1.5-pro": { input: 0.00125, output: 0.005 },
    "gemini-1.5-flash": { input: 0.000075, output: 0.0003 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
    const key = Object.keys(MODEL_COSTS_PER_1K).find(k => model.toLowerCase().startsWith(k));
    const rates = key ? MODEL_COSTS_PER_1K[key] : { input: 0.001, output: 0.002 };
    return (inputTokens / 1000 * rates.input) + (outputTokens / 1000 * rates.output);
}

function formatCost(usd: number): string {
    if (usd < 0.0001) return `$${usd.toFixed(6)}`;
    if (usd < 0.01) return `$${usd.toFixed(4)}`;
    return `$${usd.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Budget control
// ---------------------------------------------------------------------------

export class BudgetExceededError extends Error {
    public readonly limitUsd: number;
    public readonly actualUsd: number;

    constructor(limitUsd: number, actualUsd: number) {
        super(
            `[SupraWall] Budget cap of ${formatCost(limitUsd)} exceeded ` +
            `(session spend: ${formatCost(actualUsd)}). Agent halted.`
        );
        this.name = "BudgetExceededError";
        this.limitUsd = limitUsd;
        this.actualUsd = actualUsd;
    }
}

export class BudgetTracker {
    private sessionCost = 0;
    private alertFired = false;

    constructor(
        private readonly maxCostUsd?: number,
        private readonly alertUsd?: number,
        private readonly logger: Pick<Console, "warn"> = console,
    ) { }

    /**
     * Record a call and enforce the budget cap.
     * Pass costUsd directly, or model+tokens for auto-estimation.
     * Throws BudgetExceededError if the hard cap is breached.
     */
    record(opts: { model?: string; inputTokens?: number; outputTokens?: number; costUsd?: number } = {}): number {
        const cost = opts.costUsd ?? estimateCost(
            opts.model ?? "gpt-4o-mini",
            opts.inputTokens ?? 0,
            opts.outputTokens ?? 0,
        );
        this.sessionCost += cost;

        if (this.alertUsd && !this.alertFired && this.sessionCost >= this.alertUsd) {
            this.alertFired = true;
            this.logger.warn(
                `[SupraWall] Budget alert: session spend ${formatCost(this.sessionCost)} ` +
                `>= alert threshold ${formatCost(this.alertUsd)}.`
            );
        }

        if (this.maxCostUsd !== undefined && this.sessionCost >= this.maxCostUsd) {
            throw new BudgetExceededError(this.maxCostUsd, this.sessionCost);
        }

        return cost;
    }

    reset(): void {
        this.sessionCost = 0;
        this.alertFired = false;
    }

    get summary(): string {
        const limit = this.maxCostUsd !== undefined ? formatCost(this.maxCostUsd) : "unlimited";
        return `Session spend: ${formatCost(this.sessionCost)} / ${limit}`;
    }
}

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
    /**
     * Hard cost cap per agent session in USD.
     * When the accumulated LLM spend reaches this limit, BudgetExceededError is thrown.
     * Example: maxCostUsd: 5.00  →  agent auto-stops at $5
     */
    maxCostUsd?: number;
    /**
     * Soft alert threshold in USD. Logs a warning when spend reaches this amount.
     * Must be lower than maxCostUsd to be useful.
     * Example: budgetAlertUsd: 4.00
     */
    budgetAlertUsd?: number;
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
        maxCostUsd,
        budgetAlertUsd,
    } = options;

    const budget = new BudgetTracker(maxCostUsd, budgetAlertUsd, logger);

    return async function agentGateMiddleware(
        toolName: string,
        args: any,
        next: () => Promise<any>
    ): Promise<any> {
        // Budget check — throws BudgetExceededError if over cap
        budget.record();

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
            if (e instanceof BudgetExceededError) throw e; // re-throw — don't swallow budget errors
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

/**
 * Automatically detects and protects any AI agent framework.
 * 
 * Supports:
 * - LangChain (via Callbacks)
 * - Vercel AI SDK (via Tool wrapping)
 * - Generic agents with executeTool
 * 
 * @example
 * import { protect } from "suprawall";
 * const secured = protect(myAgent, { apiKey: "ag_..." });
 */
export function protect(agentOrTools: any, options: SupraWallOptions): any {
    if (!agentOrTools) return agentOrTools;

    // 1. Detect Vercel AI SDK Tools (Object where values have 'execute' or 'parameters')
    if (typeof agentOrTools === 'object' && !Array.isArray(agentOrTools)) {
        const values = Object.values(agentOrTools);
        const looksLikeVercel = values.length > 0 && values.every(v =>
            v && typeof v === 'object' && ('execute' in v || 'parameters' in v)
        );

        if (looksLikeVercel) {
            return wrapVercelTools(agentOrTools, options);
        }
    }

    // 2. Detect LangChain (has withConfig, invoke, or metadata/callbacks)
    if (typeof agentOrTools.withConfig === 'function' || 'callbacks' in agentOrTools) {
        return wrapLangChain(agentOrTools, options);
    }

    // 3. Detect OpenClaw / Browser Agents (has browser property and execute method)
    if (agentOrTools.browser && typeof agentOrTools.execute === 'function') {
        return wrapOpenClaw(agentOrTools, options);
    }

    // 4. Fallback: Generic executeTool wrapper
    if (typeof agentOrTools.executeTool === 'function') {
        return withSupraWall(agentOrTools, options);
    }

    return agentOrTools;
}

function wrapOpenClaw(agent: any, options: SupraWallOptions) {
    const { apiKey, cloudFunctionUrl = DEFAULT_CLOUD_FUNCTION_URL } = options;

    const interceptAction = async (toolName: string, args: any, originalFn: Function) => {
        const response = await fetch(cloudFunctionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-SupraWall-SDK": `js-claw-${SDK_VERSION}`,
            },
            body: JSON.stringify({ apiKey, toolName, args }),
        });

        if (response.ok) {
            const data = (await response.json()) as SupraWallResponse;
            if (data.decision === "DENY") {
                throw new Error(`[SupraWall] Policy Denied: ${toolName}. ${data.reason ?? ""}`);
            }
            if (data.decision === "REQUIRE_APPROVAL") {
                throw new Error(`[SupraWall] Action '${toolName}' requires human approval.`);
            }
        } else if (options.onNetworkError === "fail-closed") {
            throw new Error("[SupraWall] Security check failed: network error (fail-closed).");
        }

        return await originalFn();
    };

    // 1. Wrap the high-level execute method
    if (typeof agent.execute === 'function') {
        const originalExecute = agent.execute.bind(agent);
        agent.execute = async (command: string, ...args: any[]) =>
            interceptAction("browser_execute", { command, args }, () => originalExecute(command, ...args));
    }

    // 2. Wrap granular browser methods if exposed
    const methodsToWrap = ['click', 'type', 'navigate', 'press', 'screenshot'];
    methodsToWrap.forEach(method => {
        if (typeof agent[method] === 'function') {
            const original = agent[method].bind(agent);
            agent[method] = async (...args: any[]) =>
                interceptAction(`browser_${method}`, { args }, () => original(...args));
        }
    });

    return agent;
}

function wrapVercelTools(tools: Record<string, any>, options: SupraWallOptions) {
    const { apiKey, cloudFunctionUrl = DEFAULT_CLOUD_FUNCTION_URL } = options;
    const securedTools: Record<string, any> = {};

    for (const [toolName, tool] of Object.entries(tools)) {
        securedTools[toolName] = {
            ...tool,
            execute: async (args: any, ...rest: any[]) => {
                const response = await fetch(cloudFunctionUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-SupraWall-SDK": `js-vercel-${SDK_VERSION}`,
                    },
                    body: JSON.stringify({ apiKey, toolName, args })
                });

                if (response.ok) {
                    const data = await response.json() as SupraWallResponse;
                    if (data.decision === "DENY") {
                        throw new Error(`[SupraWall] Policy Violation: Tool '${toolName}' is denied. ${data.reason ?? ""}`);
                    }
                    if (data.decision === "REQUIRE_APPROVAL") {
                        throw new Error(`[SupraWall] Tool '${toolName}' requires human approval.`);
                    }
                } else if (options.onNetworkError === "fail-closed") {
                    throw new Error("[SupraWall] Network error, failing closed.");
                }

                return tool.execute ? tool.execute(args, ...rest) : undefined;
            }
        };
    }
    return securedTools;
}

function wrapLangChain(runnable: any, options: SupraWallOptions) {
    const handler = {
        name: "SupraWallCallbackHandler",
        handleToolStart: async (tool: any, input: string) => {
            const toolName = tool.name || "unknown";
            const res = await fetch(options.cloudFunctionUrl || DEFAULT_CLOUD_FUNCTION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-SupraWall-SDK": `js-lc-${SDK_VERSION}`,
                },
                body: JSON.stringify({
                    apiKey: options.apiKey,
                    toolName,
                    args: input
                })
            });

            if (res.ok) {
                const data = await res.json() as SupraWallResponse;
                if (data.decision === "DENY") throw new Error(`[SupraWall] Denied: ${data.reason ?? ""}`);
                if (data.decision === "REQUIRE_APPROVAL") throw new Error(`[SupraWall] Approval Required.`);
            } else if (options.onNetworkError === "fail-closed") {
                throw new Error("[SupraWall] Unreachable, failing closed.");
            }
        }
    };

    if (typeof runnable.withConfig === 'function') {
        return runnable.withConfig({ callbacks: [handler] });
    }

    if (Array.isArray(runnable.callbacks)) {
        runnable.callbacks.push(handler);
    } else {
        runnable.callbacks = [handler];
    }

    return runnable;
}

export type { SupraWallOptions as SupraWallOptions };
