// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Tier Configuration — Single source of truth for all plan limits
// ---------------------------------------------------------------------------

export type Tier = 'free' | 'cloud' | 'enterprise';

export interface TierLimits {
    maxAgents: number;
    maxVaultSecrets: number;
    auditRetentionDays: number;
    maxOpsPerMonth: number;
    policyEngine: 'regex' | 'ai';
    threatDetection: 'regex' | 'ml';
    complianceReports: 'json' | 'pdf';
    approvals: 'api-polling' | 'slack-dashboard' | 'advanced';
    dashboard: 'read-only' | 'full' | 'white-label';
    frameworkPlugins: string[] | 'all';
    databaseAdapters: string[] | 'all';
    budgetEnforcement: boolean;
    sla: string | null;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
    free: {
        maxAgents: 3,
        maxVaultSecrets: 5,
        auditRetentionDays: 7,
        maxOpsPerMonth: 10_000,
        policyEngine: 'regex',
        threatDetection: 'regex',
        complianceReports: 'json',
        approvals: 'api-polling',
        dashboard: 'read-only',
        frameworkPlugins: ['langchain', 'vercel-ai'],
        databaseAdapters: ['postgres'],
        budgetEnforcement: false,
        sla: null,
    },
    cloud: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 365,
        maxOpsPerMonth: Infinity,
        policyEngine: 'ai',
        threatDetection: 'ml',
        complianceReports: 'pdf',
        approvals: 'slack-dashboard',
        dashboard: 'full',
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        budgetEnforcement: true,
        sla: '99.9%',
    },
    enterprise: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 365 * 7, // 7 years
        maxOpsPerMonth: Infinity,
        policyEngine: 'ai',
        threatDetection: 'ml',
        complianceReports: 'pdf',
        approvals: 'advanced',
        dashboard: 'white-label',
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        budgetEnforcement: true,
        sla: '99.99%',
    },
};

/**
 * Returns the current month in 'YYYY-MM' format for usage counters.
 */
export function currentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Returns the cutoff date for audit log retention based on tier limits.
 */
export function retentionCutoff(tier: Tier): Date {
    const days = TIER_LIMITS[tier].auditRetentionDays;
    return new Date(Date.now() - days * 86_400_000);
}

/**
 * Returns a friendly upgrade message for free-tier limit errors.
 */
export function upgradeMessage(feature: string, current: number | string, limit: number | string): string {
    return `${feature} limit reached (${current}/${limit}). Upgrade to Cloud for unlimited access: https://www.supra-wall.com/pricing`;
}
