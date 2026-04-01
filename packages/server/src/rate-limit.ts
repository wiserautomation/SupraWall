// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";
import { pool } from "./db";

// ---------------------------------------------------------------------------
// DB-Backed Distributed Rate Limiter
// ---------------------------------------------------------------------------

interface RateLimitOptions {
    /** Maximum requests per window */
    max: number;
    /** Window duration in milliseconds */
    windowMs: number;
    /** Key extractor — defaults to IP address */
    keyGenerator?: (req: Request) => string;
    /** Custom message */
    message?: string;
}

/**
 * Creates an Express rate limiter middleware backed by PostgreSQL.
 */
export function rateLimit(opts: RateLimitOptions) {
    const {
        max,
        windowMs,
        keyGenerator = (req) => req.ip || req.socket.remoteAddress || "unknown",
        message = "Too many requests. Please try again later.",
    } = opts;

    return async (req: Request, res: Response, next: NextFunction) => {
        const key = keyGenerator(req);
        
        try {
            // Ensure table exists (optimistic approach: setup script usually handles this, 
            // but we do it gracefully here or assume it's created, we will create it if not exists)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS api_rate_limits (
                    key TEXT PRIMARY KEY,
                    count INTEGER NOT NULL,
                    reset_at BIGINT NOT NULL
                );
            `);

            const now = Date.now();
            const resetAt = now + windowMs;

            // Delete expired first to handle cleanup
            await pool.query(`DELETE FROM api_rate_limits WHERE reset_at < $1`, [now]);

            // Upsert the limit key — on conflict, ONLY increment count.
            // The reset_at is NEVER updated so the window is fixed and cannot
            // be extended indefinitely by timing requests before expiry.
            const upsertResult = await pool.query(`
                INSERT INTO api_rate_limits (key, count, reset_at)
                VALUES ($1, 1, $2)
                ON CONFLICT (key) DO UPDATE SET
                    count = api_rate_limits.count + 1
                RETURNING count, reset_at;
            `, [key, resetAt]);

            const row = upsertResult.rows[0];
            const currentCount = row.count;
            const currentResetAt = Number(row.reset_at);

            // Set standard rate-limit headers
            res.setHeader("X-RateLimit-Limit", max);
            res.setHeader("X-RateLimit-Remaining", Math.max(0, max - currentCount));
            res.setHeader("X-RateLimit-Reset", Math.ceil(currentResetAt / 1000));

            if (currentCount > max) {
                res.setHeader("Retry-After", Math.ceil((currentResetAt - now) / 1000));
                return res.status(429).json({
                    error: message,
                    code: "RATE_LIMIT_EXCEEDED",
                    retryAfter: Math.ceil((currentResetAt - now) / 1000),
                });
            }

            next();
        } catch (error) {
            console.error("[Rate Limit] DB Error:", error);
            // Fail open on DB error so we don't break the API completely if the DB is momentarily slow for rate limiting
            next();
        }
    };
}
