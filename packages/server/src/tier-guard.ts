// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { pool } from "./db";
import { TIER_LIMITS, Tier, TierLimits, currentMonth } from "./tier-config";
import { logger } from "./logger";

export interface TieredRequest extends Request {
    tier?: Tier;
    tierLimits?: TierLimits;
    tenantId?: string;
}

/**
 * Middleware that resolves the tenant's billing tier and injects
 * `req.tier` and `req.tierLimits` for downstream enforcement.
 *
 * Falls back to 'open_source' if tenant has no subscription or if resolution fails.
 */
export async function resolveTier(req: TieredRequest, res: Response, next: NextFunction) {
    // SECURITY: tenantId must come from auth middleware, never from client input
    const tenantId =
        (req as any).tenantId ||
        (req as any).agent?.tenantId;

    if (!tenantId) {
        return res.status(401).json({ error: "Unauthorized: No tenant context. Authenticate first." });
    }

    req.tenantId = tenantId;

    // SUPRAWALL_MODE: 'local' forces Open Source tier regardless of DB status
    if (process.env.SUPRAWALL_MODE === "local") {
        req.tier = "open_source";
        req.tierLimits = TIER_LIMITS["open_source"];
        return next();
    }

    try {
        const result = await pool.query(
            "SELECT tier FROM tenants WHERE id = $1",
            [tenantId]
        );

        const tier: Tier = (result.rows[0]?.tier as Tier) || "open_source";
        req.tier = tier;
        req.tierLimits = TIER_LIMITS[tier];
    } catch (err) {
        logger.warn("[TierGuard] Failed to resolve tier, defaulting to open_source:", { tenantId, error: err });
        req.tier = "open_source";
        req.tierLimits = TIER_LIMITS["open_source"];
    }

    next();
}

/**
 * Checks if a tenant has exceeded their monthly evaluation limit.
 * If overage is allowed (metered), it returns true but logs a warning.
 * If overage is blocked (OSS), it returns false (triggers 402).
 */
export async function checkEvaluationLimit(tenantId: string, limits: TierLimits): Promise<{ allowed: boolean; current: number }> {
    const month = currentMonth();
    try {
        const result = await pool.query(
            "SELECT evaluation_count FROM tenant_usage WHERE tenant_id = $1 AND month = $2",
            [tenantId, month]
        );
        const current = result.rows[0]?.evaluation_count || 0;

        // Block if over limit AND overage is not allowed (null = hard stop, 0 = free overage is allowed)
        if (current >= limits.maxEvaluationsPerMonth && limits.overageRatePerEval == null) {
            return { allowed: false, current };
        }
        return { allowed: true, current };
    } catch (err) {
        logger.error("[TierGuard] Error checking evaluation limit:", err);
        return { allowed: true, current: 0 }; // Fail-open for safety
    }
}

/**
 * Increments the evaluation counter for a tenant.
 * Also calculates overage units if the tenant is beyond their base limit.
 */
export async function recordEvaluation(tenantId: string, limits: TierLimits): Promise<void> {
    const month = currentMonth();
    try {
        await pool.query(
            `INSERT INTO tenant_usage (tenant_id, month, evaluation_count)
             VALUES ($1, $2, 1)
             ON CONFLICT (tenant_id, month)
             DO UPDATE SET 
                evaluation_count = tenant_usage.evaluation_count + 1,
                overage_units = CASE 
                    WHEN (tenant_usage.evaluation_count + 1) > $3 THEN (tenant_usage.evaluation_count + 1) - $3
                    ELSE 0
                END,
                last_updated = NOW()`,
            [tenantId, month, limits.maxEvaluationsPerMonth]
        );
    } catch (err) {
        logger.error("[TierGuard] Failed to record evaluation:", { tenantId, error: err });
    }
}

/**
 * Middleware: Enforces SSO enablement for Business+ tiers.
 */
export async function enforceSSO(req: TieredRequest, res: Response, next: NextFunction) {
    if (!req.tierLimits?.ssoEnabled) {
        return res.status(403).json({
            error: "SSO not supported",
            message: "SSO features are only available on Business and Enterprise plans. Upgrade to enable SSO.",
            upgradeUrl: "https://www.supra-wall.com/pricing"
        });
    }
    next();
}

/**
 * Returns a standard tier-limit upgrade error response (402 Payment Required).
 */
export function tierLimitError(feature: string, current: number | string, limit: number | string) {
    return {
        error: `${feature} limit reached (${current}/${limit}). Upgrade your plan to continue without interruption.`,
        upgradeUrl: "https://www.supra-wall.com/pricing",
        code: "TIER_LIMIT_EXCEEDED",
    };
}
