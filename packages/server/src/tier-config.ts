// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Tier Configuration — Single source of truth for all plan limits
// ---------------------------------------------------------------------------

export type Tier = 'free' | 'starter' | 'growth' | 'business' | 'enterprise';

export type SemanticLayerMode = 'none' | 'semantic' | 'behavioral' | 'custom';

export interface TierLimits {
    maxAgents: number;
    maxVaultSecrets: number;
    auditRetentionDays: number;
    maxOpsPerMonth: number;
    policyEngine: 'regex' | 'ai' | 'advanced';
    threatDetection: 'regex' | 'ml' | 'advanced';
    semanticLayer: SemanticLayerMode;
    maxSemanticCallsPerHour: number;
    complianceReports: 'json' | 'pdf' | 'full-suite';
    approvals: 'api-polling' | 'slack-dashboard' | 'advanced';
    dashboard: 'self-host' | 'full' | 'white-label';
    frameworkPlugins: string[] | 'all';
    databaseAdapters: string[] | 'all';
    budgetEnforcement: boolean;
    euAiActTemplates: boolean;
    pdfReports: boolean;
    slackApprovals: boolean;
    sla: string | null;
    legalSupport: boolean;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
    free: { // Developer
        maxAgents: 3,
        maxVaultSecrets: 10,
        auditRetentionDays: 7,
        maxOpsPerMonth: 10_000,
        policyEngine: 'regex',
        threatDetection: 'regex',
        semanticLayer: 'none',
        maxSemanticCallsPerHour: 0,
        complianceReports: 'json',
        approvals: 'api-polling',
        dashboard: 'self-host',
        frameworkPlugins: ['langchain', 'vercel-ai'],
        databaseAdapters: ['postgres'],
        budgetEnforcement: false,
        euAiActTemplates: false,
        pdfReports: false,
        slackApprovals: false,
        sla: null,
        legalSupport: false,
    },
    starter: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 90,
        maxOpsPerMonth: Infinity,
        policyEngine: 'regex',
        threatDetection: 'regex',
        semanticLayer: 'none',
        maxSemanticCallsPerHour: 0,
        complianceReports: 'pdf',
        approvals: 'slack-dashboard',
        dashboard: 'full',
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        budgetEnforcement: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.9%',
        legalSupport: false,
    },
    growth: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 365,
        maxOpsPerMonth: Infinity,
        policyEngine: 'ai',
        threatDetection: 'ml',
        semanticLayer: 'semantic',
        maxSemanticCallsPerHour: 500,
        complianceReports: 'pdf',
        approvals: 'slack-dashboard',
        dashboard: 'full',
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        budgetEnforcement: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.9%',
        legalSupport: true,
    },
    business: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 1095, // 3 years
        maxOpsPerMonth: Infinity,
        policyEngine: 'ai',
        threatDetection: 'ml',
        semanticLayer: 'behavioral',
        maxSemanticCallsPerHour: 5000,
        complianceReports: 'pdf',
        approvals: 'slack-dashboard',
        dashboard: 'full',
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        budgetEnforcement: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.99%',
        legalSupport: true,
    },
    enterprise: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        auditRetentionDays: 2555, // 7 years
        maxOpsPerMonth: Infinity,
        policyEngine: 'advanced',
        threatDetection: 'advanced',
        semanticLayer: 'custom',
        maxSemanticCallsPerHour: Infinity,
        complianceReports: 'full-suite',
        approvals: 'advanced',
        dashboard: 'white-label',
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        budgetEnforcement: true,
        euAiActTemplates: true,
        pdfReports: true,
        slackApprovals: true,
        sla: '99.99% (SLA with penalties)',
        legalSupport: true,
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
    return `${feature} limit reached (${current}/${limit}). Upgrade to Business for unlimited access: https://www.supra-wall.com/pricing`;
}
