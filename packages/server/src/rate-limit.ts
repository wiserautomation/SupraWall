// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// In-Memory Rate Limiter
// ---------------------------------------------------------------------------
// A lightweight sliding-window rate limiter. For production deployments at
// scale, replace with a Redis-backed implementation (e.g. `rate-limiter-flexible`).
// ---------------------------------------------------------------------------

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
    }
}, 60_000);

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
 * Creates an Express rate limiter middleware.
 *
 * Usage:
 *   app.use("/v1/vault", rateLimit({ max: 60, windowMs: 60_000 }), vaultRouter);
 */
export function rateLimit(opts: RateLimitOptions) {
    const {
        max,
        windowMs,
        keyGenerator = (req) => req.ip || req.socket.remoteAddress || "unknown",
        message = "Too many requests. Please try again later.",
    } = opts;

    return (req: Request, res: Response, next: NextFunction) => {
        const key = keyGenerator(req);
        const now = Date.now();
        let entry = store.get(key);

        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            store.set(key, entry);
        }

        entry.count++;

        // Set standard rate-limit headers
        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, max - entry.count));
        res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

        if (entry.count > max) {
            res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
            return res.status(429).json({
                error: message,
                code: "RATE_LIMIT_EXCEEDED",
                retryAfter: Math.ceil((entry.resetAt - now) / 1000),
            });
        }

        next();
    };
}
