// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Tier Configuration — Single source of truth for all plan limits.
//
// Canonical tier names used across the entire monorepo:
//   open_source | developer | team | business | enterprise
//
// These names match the DB column `tenants.tier`, all route enforcement,
// the Stripe webhook handlers, and the pricing page UI.
// ---------------------------------------------------------------------------

export type Tier = 'open_source' | 'developer' | 'team' | 'business' | 'enterprise';

export type SemanticLayerMode = 'none' | 'semantic' | 'behavioral' | 'custom';

export interface TierLimits {
    // Core resource caps
    maxAgents: number;
    maxVaultSecrets: number;
    maxSeats: number;
    auditRetentionDays: number;

    // Evaluation metering
    maxEvaluationsPerMonth: number;
    overageRatePerEval: number | null; // null = hard stop (no overage)

    // Security engine
    policyEngine: 'regex' | 'ai' | 'advanced';
    threatDetection: 'regex' | 'ml' | 'advanced';
    semanticLayer: SemanticLayerMode;
    maxSemanticCallsPerHour: number;

    // Access & integrations
    frameworkPlugins: string[] | 'all';
    databaseAdapters: string[] | 'all';
    dashboard: 'self-host' | 'full' | 'white-label';
    ssoEnabled: boolean;
    approvals: 'none' | 'api-polling' | 'slack-dashboard' | 'advanced';

    // Compliance & reporting
    complianceReports: 'json' | 'pdf' | 'full-suite';
    euAiActTemplates: boolean;
    pdfReports: boolean;

    // Budget & spend
    budgetEnforcement: boolean;

    // Notifications
    slackApprovals: boolean;

    // SLA
    sla: string | null;
    slaResponseHours: number | null;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
    open_source: {
        maxAgents: 2,
        maxVaultSecrets: 3,
        maxSeats: 1,
        auditRetentionDays: 3,

        maxEvaluationsPerMonth: 5_000,
        overageRatePerEval: null,            // Hard stop — no overage allowed

        policyEngine: 'regex',
        threatDetection: 'regex',
        semanticLayer: 'none',
        maxSemanticCallsPerHour: 0,

        frameworkPlugins: ['langchain'],
        databaseAdapters: ['postgres'],
        dashboard: 'self-host',
        ssoEnabled: false,
        approvals: 'none',

        complianceReports: 'json',
        euAiActTemplates: false,
        pdfReports: false,

        budgetEnforcement: false,
        slackApprovals: false,

        sla: null,
        slaResponseHours: null,
    },

    developer: {
        maxAgents: 5,
        maxVaultSecrets: 15,
        maxSeats: 1,
        auditRetentionDays: 30,

        maxEvaluationsPerMonth: 25_000,
        overageRatePerEval: 0.003,

        policyEngine: 'regex',
        threatDetection: 'regex',
        semanticLayer: 'none',
        maxSemanticCallsPerHour: 0,

        frameworkPlugins: ['langchain', 'vercel-ai', 'crewai'],
        databaseAdapters: ['postgres', 'mysql'],
        dashboard: 'full',
        ssoEnabled: false,
        approvals: 'api-polling',

        complianceReports: 'json',
        euAiActTemplates: false,
        pdfReports: false,

        budgetEnforcement: false,
        slackApprovals: false,

        sla: null,
        slaResponseHours: 48,
    },

    team: {
        maxAgents: 25,
        maxVaultSecrets: 100,
        maxSeats: 3,
        auditRetentionDays: 90,

        maxEvaluationsPerMonth: 250_000,
        overageRatePerEval: 0.002,

        policyEngine: 'ai',
        threatDetection: 'ml',
        semanticLayer: 'semantic',
        maxSemanticCallsPerHour: 500,

        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        dashboard: 'full',
        ssoEnabled: false,
        approvals: 'slack-dashboard',

        complianceReports: 'pdf',
        euAiActTemplates: true,
        pdfReports: true,

        budgetEnforcement: true,
        slackApprovals: true,

        sla: '99.9%',
        slaResponseHours: 24,
    },

    business: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        maxSeats: 10,
        auditRetentionDays: 365,

        maxEvaluationsPerMonth: 2_000_000,
        overageRatePerEval: 0.001,

        policyEngine: 'ai',
        threatDetection: 'ml',
        semanticLayer: 'behavioral',
        maxSemanticCallsPerHour: 5_000,

        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        dashboard: 'full',
        ssoEnabled: true,
        approvals: 'slack-dashboard',

        complianceReports: 'pdf',
        euAiActTemplates: true,
        pdfReports: true,

        budgetEnforcement: true,
        slackApprovals: true,

        sla: '99.99%',
        slaResponseHours: 4,
    },

    enterprise: {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        maxSeats: Infinity,
        auditRetentionDays: 2_555,           // 7 years

        maxEvaluationsPerMonth: Infinity,
        overageRatePerEval: null,            // Custom contract rate

        policyEngine: 'advanced',
        threatDetection: 'advanced',
        semanticLayer: 'custom',
        maxSemanticCallsPerHour: Infinity,

        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        dashboard: 'white-label',
        ssoEnabled: true,
        approvals: 'advanced',

        complianceReports: 'full-suite',
        euAiActTemplates: true,
        pdfReports: true,

        budgetEnforcement: true,
        slackApprovals: true,

        sla: '99.99% (SLA with penalties)',
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
 * Returns a friendly upgrade message for limit errors.
 */
export function upgradeMessage(feature: string, current: number | string, limit: number | string): string {
    return `${feature} limit reached (${current}/${limit}). Upgrade at https://www.supra-wall.com/pricing`;
}
