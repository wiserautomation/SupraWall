// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { pool } from "./db";
import { TIER_LIMITS, Tier, TierLimits } from "./tier-config";

export interface TieredRequest extends Request {
    tier?: Tier;
    tierLimits?: TierLimits;
    tenantId?: string;
}

/**
 * Middleware that resolves the tenant's billing tier and injects
 * `req.tier` and `req.tierLimits` for downstream enforcement.
 *
 * Falls back to 'free' if tenant has no subscription or if resolution fails.
 */
export async function resolveTier(req: TieredRequest, res: Response, next: NextFunction) {
    // Extract tenantId from various sources
    const tenantId =
        (req as any).tenantId ||
        (req as any).agent?.tenantId ||
        req.body?.tenantId ||
        (req.query?.tenantId as string) ||
        "default-tenant";

    req.tenantId = tenantId;

    try {
        const result = await pool.query(
            "SELECT tier FROM tenants WHERE id = $1",
            [tenantId]
        );

        const tier: Tier = (result.rows[0]?.tier as Tier) || "free";
        req.tier = tier;
        req.tierLimits = TIER_LIMITS[tier];
    } catch (err) {
        // Fail-open: default to free tier if DB resolution fails
        console.warn("[TierGuard] Failed to resolve tier, defaulting to free:", err);
        req.tier = "free";
        req.tierLimits = TIER_LIMITS["free"];
    }

    next();
}

/**
 * Returns a standard tier-limit upgrade error response body.
 */
export function tierLimitError(feature: string, current: number | string, limit: number | string) {
    return {
        error: `${feature} limit reached (${current}/${limit}). Upgrade to Cloud for unlimited access.`,
        upgradeUrl: "https://www.supra-wall.com/pricing",
        code: "TIER_LIMIT_EXCEEDED",
    };
}
