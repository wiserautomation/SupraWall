// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const pool = new Pool({
    connectionString,
    // Note: Vercel Postgres requires rejectUnauthorized: false by default unless custom CA is provided
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, 
});

pool.on("error", (err) => {
    console.error(`[DB] Pool Error:`, err.message);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
