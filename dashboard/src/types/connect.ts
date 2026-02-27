export interface Platform {
    platformId: string;
    ownerId: string;
    name: string;
    plan: "starter" | "growth" | "enterprise";
    createdAt: any;
    connectEnabled: boolean;
    totalSubKeys: number;
    totalCalls: number;
    basePolicy?: BasePolicy;
}

export interface BasePolicy {
    rules: PolicyRule[];
    rateLimit: RateLimitConfig;
    updatedAt: any;
}

export interface PolicyRule {
    toolPattern: string;
    action: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    conditions?: Record<string, any>;
}

export interface RateLimitConfig {
    requestsPerMinute: number;
    requestsPerDay: number;
}

export interface ConnectKey {
    subKeyId: string;
    customerId: string;
    customerLabel: string;
    active: boolean;
    totalCalls: number;
    createdAt: string | null;
    lastUsedAt: string | null;
    hasPolicyOverrides: boolean;
    hasRateLimitOverride: boolean;
}

export interface ConnectEvent {
    eventId: string;
    customerId: string;
    subKeyId: string;
    toolName: string;
    args: any;
    decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    reason: string | null;
    latencyMs: number;
    timestamp: string | null;
    cost_usd?: number;
}

export interface ConnectAnalytics {
    totalEvents: number;
    byDecision: {
        ALLOW: number;
        DENY: number;
        REQUIRE_APPROVAL: number;
    };
    topCustomers: { customerId: string; calls: number }[];
    topTools: { toolName: string; calls: number }[];
    avgLatencyMs: number;
    periodDays: number;
    since: string;
    totalCostUsd?: number;
    costPreventedUsd?: number;
}
