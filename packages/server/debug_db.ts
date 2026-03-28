
import { pool } from "./src/db";

async function debug() {
    try {
        console.log("--- TENANTS ---");
        const tenants = await pool.query("SELECT id, name, tier FROM tenants");
        console.table(tenants.rows);

        console.log("--- AGENTS ---");
        const agents = await pool.query("SELECT id, tenantid, name, apikeyhash FROM agents");
        console.table(agents.rows);

        console.log("--- VAULT SECRETS ---");
        const secrets = await pool.query("SELECT id, tenant_id, secret_name FROM vault_secrets");
        console.table(secrets.rows);

        console.log("--- VAULT ACCESS RULES ---");
        const rules = await pool.query("SELECT * FROM vault_access_rules");
        console.table(rules.rows);

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

debug();
