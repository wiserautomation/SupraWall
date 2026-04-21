// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

// --- TYPES MIGRATED FROM TIER-CONFIG (OSS STUB) ---

export type Tier = 'open_source' | 'developer' | 'team' | 'business' | 'enterprise';
export type SemanticLayerMode = 'none' | 'semantic' | 'behavioral' | 'custom';

export interface TierLimits {
    maxAgents: number;
    maxVaultSecrets: number;
    maxSeats: number;
    auditRetentionDays: number;
    maxEvaluationsPerMonth: number;
    overageRatePerEval: number | null;
    policyEngine: 'regex' | 'ai' | 'advanced';
    threatDetection: 'regex' | 'ml' | 'advanced';
    semanticLayer: SemanticLayerMode;
    maxSemanticCallsPerHour: number;
    frameworkPlugins: string[] | 'all';
    databaseAdapters: string[] | 'all';
    dashboard: 'self-host' | 'full' | 'white-label';
    ssoEnabled: boolean;
    approvals: 'none' | 'api-polling' | 'slack-dashboard' | 'advanced';
    complianceReports: 'json' | 'pdf' | 'full-suite';
    euAiActTemplates: boolean;
    pdfReports: boolean;
    budgetEnforcement: boolean;
    slackApprovals: boolean;
    sla: string | null;
    slaResponseHours: number | null;
}

// Permissive TIER_LIMITS: All features enabled for self-hosters
export const TIER_LIMITS: Record<Tier, TierLimits> = {
    open_source: createPermissiveLimits(),
    developer: createPermissiveLimits(),
    team: createPermissiveLimits(),
    business: createPermissiveLimits(),
    enterprise: createPermissiveLimits(),
};

function createPermissiveLimits(): TierLimits {
    return {
        maxAgents: Infinity,
        maxVaultSecrets: Infinity,
        maxSeats: Infinity,
        auditRetentionDays: 365,
        maxEvaluationsPerMonth: Infinity,
        overageRatePerEval: 0,
        policyEngine: 'ai',
        threatDetection: 'ml',
        semanticLayer: 'semantic',
        maxSemanticCallsPerHour: Infinity,
        frameworkPlugins: 'all',
        databaseAdapters: 'all',
        dashboard: 'self-host',
        ssoEnabled: true,
        approvals: 'slack-dashboard',
        complianceReports: 'full-suite',
        euAiActTemplates: true,
        pdfReports: true,
        budgetEnforcement: true,
        slackApprovals: true,
        sla: 'Self-hosted',
        slaResponseHours: null,
    };
}

export function currentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function retentionCutoff(tier: Tier): Date {
    const days = TIER_LIMITS[tier].auditRetentionDays;
    return new Date(Date.now() - days * 86_400_000);
}

// --- MIDDLEWARE STUBS ---

export interface TieredRequest extends Request {
    tier?: Tier;
    tierLimits?: TierLimits;
    tenantId?: string;
}

/**
 * Permissive resolveTier: Always grants PRO/Enterprise access for self-hosters.
 * No Stripe, no billing lookups.
 */
export async function resolveTier(req: TieredRequest, res: Response, next: NextFunction) {
    req.tenantId = (req as any).tenantId || (req as any).agent?.tenantId || "default";
    req.tier = "enterprise"; // Permissive default for OSS
    req.tierLimits = TIER_LIMITS["enterprise"];
    next();
}

/**
 * Permissive checkEvaluationLimit: Always allows.
 */
export async function checkEvaluationLimit(
    tenantId: string,
    limits: TierLimits
): Promise<{ allowed: boolean; current: number; dbError?: boolean }> {
    return { allowed: true, current: 0 };
}

/**
 * Permissive recordEvaluation: No-op or basic logging.
 */
export async function recordEvaluation(tenantId: string, limits: TierLimits): Promise<void> {
    // OSS doesn't meter evaluations for billing
}

/**
 * Permissive enforceSSO: Always allows.
 */
export async function enforceSSO(req: TieredRequest, res: Response, next: NextFunction) {
    next();
}

/**
 * Stub for tierLimitError: Should theoretically never be called in permissive mode.
 */
export function tierLimitError(
    feature: string,
    current: number | string,
    limit: number | string,
    currentTier?: string
) {
    return {
        error: `${feature} limit reached.`,
        currentTier: currentTier || "enterprise",
        message: "Limit reached in self-hosted mode.",
        code: "TIER_LIMIT_EXCEEDED",
    };
}
