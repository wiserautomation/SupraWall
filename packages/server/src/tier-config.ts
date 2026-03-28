// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Tier Configuration — Single source of truth for all plan limits
// ---------------------------------------------------------------------------

export type Tier = 'open_source' | 'developer' | 'team' | 'business' | 'enterprise';

export interface TierLimits {
    maxEvaluationsPerMonth: number;
    overageRatePerEval: number | null;  // null = blocked (hard stop)
    maxAgents: number;
    maxVaultSecrets: number;
    auditRetentionDays: number;
    maxSeats: number;
    ssoEnabled: boolean;
    policyEngine: 'regex' | 'ai' | 'advanced';
    threatDetectionPatterns: number | 'full-regex' | 'ml' | 'advanced';
    complianceReports: 'none' | 'json' | 'pdf' | 'branded';
    approvals: 'none' | 'api-polling' | 'slack-dashboard' | 'teams-advanced';
    dashboard: 'none' | 'cloud' | 'vpc';
    frameworkPlugins: string[] | 'all';
    budgetEnforcement: boolean;
    tokenCostTracking: 'none' | 'basic' | 'full' | 'full-with-forecasting';
    anomalyAlerts: boolean;
    euAiActTemplates: boolean;
    pdfReports: boolean;
    slackApprovals: boolean;
    sla: string | null;
    slaResponseHours: number | null;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
    open_source: {
        maxEvaluationsPerMonth: 5_000,
        overageRatePerEval: null,            // BLOCKED — hard stop
        maxAgents: 2,
        maxVaultSecrets: 3,
        auditRetentionDays: 3,
        maxSeats: 1,
        ssoEnabled: false,
        policyEngine: 'regex',
        threatDetectionPatterns: 3,          // SQLi, XSS, path traversal only
        complianceReports: 'json',
        approvals: 'none',
        dashboard: 'none',
        frameworkPlugins: ['langchain'],
        budgetEnforcement: false,
        tokenCostTracking: 'none',
        anomalyAlerts: false,
        euAiActTemplates: false,
        pdfReports: false,
        slackApprovals: false,
        sla: null,
        slaResponseHours: null,
    },
    developer: {
        maxEvaluationsPerMonth: 25_000,
        overageRatePerEval: 0.003,
        maxAgents: 5,
        maxVaultSecrets: 15,
        auditRetentionDays: 30,
        maxSeats: 1,                         // SOLO tier
        ssoEnabled: false,
        policyEngine: 'regex',
        threatDetectionPatterns: 'full-regex',
        complianceReports: 'json',
        approvals: 'api-polling',
        dashboard: 'cloud',
        frameworkPlugins: ['langchain', 'vercel-ai', 'crewai'],
        budgetEnforcement: false,
        tokenCostTracking: 'basic',
        anomalyAlerts: false,
        euAiActTemplates: false,
        pdfReports: false,
        slackApprovals: false,
        sla: null,
        slaResponseHours: 48,
    },
    team: {
        maxEvaluationsPerMonth: 250_000,
        overageRatePerEval: 0.002,
        maxAgents: 25,
        maxVaultSecrets: 100,
        auditRetentionDays: 90,
        maxSeats: 3,
        ssoEnabled: false,
        policyEngine: 'ai',
        threatDetectionPatterns: 'ml',
        complianceReports: 'pdf',
        approvals: 'slack-dashboard',
        dashboard: 'cloud',
        frameworkPlugins: 'all',
        budgetEnforcement: true,
        tokenCostTracking: 'full',
        anomalyAlerts: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.9%',
        slaResponseHours: 24,
    },
    business: {
        maxEvaluationsPerMonth: 2_000_000,
        overageRatePerEval: 0.001,
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 365,
        maxSeats: 10,
        ssoEnabled: true,
        policyEngine: 'ai',
        threatDetectionPatterns: 'ml',
        complianceReports: 'pdf',
        approvals: 'slack-dashboard',
        dashboard: 'cloud',
        frameworkPlugins: 'all',
        budgetEnforcement: true,
        tokenCostTracking: 'full',
        anomalyAlerts: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.99%',
        slaResponseHours: 4,
    },
    enterprise: {
        maxEvaluationsPerMonth: Infinity,
        overageRatePerEval: null,            // Custom contract rate
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 2555,
        maxSeats: Infinity,
        ssoEnabled: true,
        policyEngine: 'advanced',
        threatDetectionPatterns: 'advanced',
        complianceReports: 'branded',
        approvals: 'teams-advanced',
        dashboard: 'vpc',
        frameworkPlugins: 'all',
        budgetEnforcement: true,
        tokenCostTracking: 'full-with-forecasting',
        anomalyAlerts: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.99%',
        slaResponseHours: 1,
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
 * Returns a friendly upgrade message for tier limit errors.
 */
export function upgradeMessage(feature: string, current: number | string, limit: number | string): string {
    return `${feature} limit reached (${current}/${limit}). Upgrade your plan to continue: https://www.supra-wall.com/pricing`;
}
