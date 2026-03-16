
const { Pool } = require('./node_modules/pg');
require('dotenv').config({ path: './.env' });

async function seed() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    const tenantId = '00000000-0000-0000-0000-000000000001';
    const agentId = '00000000-0000-0000-0000-000000000002';
    const apiKey = 'ag_test_simulation_key_321';

    console.log("Cleaning up...");
    await pool.query("DELETE FROM policies WHERE tenantid = $1", [tenantId]);
    await pool.query("DELETE FROM agents WHERE id = $1", [agentId]);
    await pool.query("DELETE FROM tenants WHERE id = $1", [tenantId]);

    console.log("Inserting tenant...");
    await pool.query(
        "INSERT INTO tenants (id, name, master_api_key) VALUES ($1, $2, $3)",
        [tenantId, 'Test Workspace', 'master_key']
    );

    console.log("Inserting agent...");
    await pool.query(
        "INSERT INTO agents (id, tenantid, name, apikey) VALUES ($1, $2, $3, $4)",
        [agentId, tenantId, 'Simulation Agent', apiKey]
    );

    console.log("Inserting policy...");
    await pool.query(
        "INSERT INTO policies (tenantid, toolname, ruletype, description) VALUES ($1, $2, $3, $4)",
        [tenantId, 'send_funds', 'REQUIRE_APPROVAL', 'Test policy for simulation']
    );

    console.log("Seed complete.");
    await pool.end();
}

seed().catch(console.error);
