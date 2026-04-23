// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { pool } from "./db";
import { TIER_LIMITS, Tier } from "./tier-config";
import { logger } from "./logger";

/**
 * Returns the number of 'active' or 'pending' seats for a tenant.
 */
export async function countActiveSeats(tenantId: string): Promise<number> {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM organization_members WHERE tenant_id = $1 AND status != 'removed'",
            [tenantId]
        );
        return parseInt(result.rows[0].count, 10);
    } catch (err) {
        logger.error("[Seats] Failed to count active seats:", err);
        return 0;
    }
}

/**
 * Validates if the tenant is under their tier's seat limit.
 */
export async function checkSeatLimit(tenantId: string): Promise<boolean> {
    try {
        const tierResult = await pool.query("SELECT tier FROM tenants WHERE id = $1", [tenantId]);
        const tier: Tier = (tierResult.rows[0]?.tier as Tier) || "open_source";
        const limits = TIER_LIMITS[tier];

        const activeSeats = await countActiveSeats(tenantId);
        return activeSeats < limits.maxSeats;
    } catch (err) {
        logger.error("[Seats] Failed to check seat limit:", err);
        return false;
    }
}

/**
 * Logic to invite a new member to an organization.
 * Checks seat limits before persistence.
 */
export async function inviteMember(tenantId: string, email: string, role: string = "member"): Promise<void> {
    // SECURITY: Atomic seat check + insert to prevent race conditions.
    // Uses a single query that only inserts if the count is below the limit.
    const tierResult = await pool.query("SELECT tier FROM tenants WHERE id = $1", [tenantId]);
    const tier: Tier = (tierResult.rows[0]?.tier as Tier) || "open_source";
    const maxSeats = TIER_LIMITS[tier].maxSeats;

    const result = await pool.query(
        `INSERT INTO organization_members (tenant_id, user_email, role, status)
         SELECT $1, $2, $3, 'pending'
         WHERE (SELECT COUNT(*) FROM organization_members WHERE tenant_id = $1 AND status != 'removed') < $4
         ON CONFLICT (tenant_id, user_email) DO UPDATE SET status = 'pending', invited_at = NOW()
         RETURNING id`,
        [tenantId, email, role, maxSeats]
    );

    if (result.rows.length === 0) {
        throw new Error("Seat limit reached for your current plan.");
    }

    logger.info(`[Seats] Invitation sent to ${email} for tenant ${tenantId} (Role: ${role})`);
}

/**
 * Middleware: Enforces maxSeats per tier on invite/login.
 */
export async function enforceSeatLimit(req: Request, res: Response, next: NextFunction) {
    const tenantId = (req as any).tenantId || req.body?.tenantId;
    if (!tenantId) return next();

    const isUnderLimit = await checkSeatLimit(tenantId);
    if (!isUnderLimit) {
        return res.status(402).json({
            error: "Seat limit reached",
            message: "You have reached the maximum number of users for your current plan. Please upgrade to add more members.",
            upgradeUrl: "https://www.supra-wall.com/pricing"
        });
    }

    next();
}
