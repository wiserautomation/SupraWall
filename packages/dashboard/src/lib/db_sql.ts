// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const pool = new Pool({
    connectionString,
    // Neon's pooler endpoint uses a proxy cert that isn't in the Node default CA bundle.
    // Vercel's own Postgres integration sets rejectUnauthorized:false in their driver.
    // We must do the same — the connection is still TLS-encrypted in transit.
    ssl: connectionString ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
    console.error(`[DB] Pool Error:`, err.message);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
