
const { Pool } = require('./node_modules/pg');
require('dotenv').config({ path: './.env' });

async function approve() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    console.log("Checking for PENDING approval requests...");
    const res = await pool.query("SELECT id FROM approval_requests WHERE status = 'PENDING' ORDER BY created_at DESC LIMIT 1");
    
    if (res.rows.length === 0) {
        console.log("No pending requests found.");
    } else {
        const id = res.rows[0].id;
        console.log(`Approving request: ${id}`);
        await pool.query("UPDATE approval_requests SET status = 'APPROVED', decision_by = 'local_simulation_admin', decision_at = NOW() WHERE id = $1", [id]);
        console.log("Approval confirmed.");
    }

    await pool.end();
}

approve().catch(console.error);
