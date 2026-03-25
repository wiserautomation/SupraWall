// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


const { Pool } = require('./node_modules/pg');
require('dotenv').config({ path: './.env' });

async function checkDb() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });
    
    const agents = await pool.query("SELECT * FROM agents LIMIT 1");
    console.log(JSON.stringify(agents.rows, null, 2));

    await pool.end();
}

checkDb().catch(console.error);
