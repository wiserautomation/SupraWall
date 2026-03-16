import { Pool } from "pg";
import dotenv from "dotenv";

if (!process.env.VERCEL) {
    dotenv.config();
}

const rawUrl = process.env.DATABASE_URL || "";
// Mask password for safe logging
const maskedUrl = rawUrl.replace(/(postgresql?:\/\/)([^:]+):([^@]+)(@)/, "$1$2:****$4");
console.log(`[DB] Using Connection: ${maskedUrl}`);

let dbUrl = rawUrl.trim();

// Transform direct Supabase URLs for Vercel IPv6 compatibility if not using pooler
if (process.env.VERCEL && dbUrl.includes(".supabase.co") && !dbUrl.includes("pooler.supabase.com")) {
    try {
        const projectRef = dbUrl.split(".")[1];
        dbUrl = dbUrl
            .replace(`db.${projectRef}.supabase.co`, "aws-0-eu-west-1.pooler.supabase.com")
            .replace(":5432", ":6543")
            .replace(/(postgresql?:\/\/)([^:]+)(:)/, `$1$2.${projectRef}$3`);
        console.log(`[DB] Supavisor Workaround -> Project: ${projectRef}`);
    } catch (e) {
        console.error("[DB] Workaround error:", e);
    }
}

export const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, 
});

pool.on("error", (err) => {
    console.error(`[DB] Pool Error:`, err.message);
});

export const initDb = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS policies (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            agentid VARCHAR(255),
            toolname VARCHAR(255) NOT NULL,
            condition TEXT,
            ruletype VARCHAR(50) NOT NULL,
            priority INTEGER DEFAULT 100,
            isdryrun BOOLEAN DEFAULT FALSE,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            toolname VARCHAR(255),
            decision VARCHAR(50),
            riskscore INTEGER,
            cost_usd FLOAT DEFAULT 0,
            reason TEXT,
            arguments TEXT,
            timestamp TIMESTAMP DEFAULT NOW(),
            parameters JSONB,
            metadata JSONB
        );
        CREATE TABLE IF NOT EXISTS agents (
            id VARCHAR(255) PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            apikeyhash VARCHAR(255),
            scopes TEXT[] DEFAULT '{}',
            status VARCHAR(50) DEFAULT 'active',
            slack_webhook VARCHAR(255),
            max_cost_usd FLOAT DEFAULT 10,
            budget_alert_usd FLOAT DEFAULT 8,
            max_iterations INTEGER DEFAULT 50,
            loop_detection BOOLEAN DEFAULT FALSE,
            createdat TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tenants (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            master_api_key VARCHAR(255),
            slack_webhook_url TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Enable encryption (pgcrypto)
        CREATE EXTENSION IF NOT EXISTS pgcrypto;

        -- Vault: encrypted secret storage
        CREATE TABLE IF NOT EXISTS vault_secrets (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id VARCHAR(255) NOT NULL,
            secret_name VARCHAR(255) NOT NULL,
            encrypted_value BYTEA NOT NULL,
            description TEXT,
            expires_at TIMESTAMP,
            last_rotated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(tenant_id, secret_name)
        );

        -- Vault: access rules
        CREATE TABLE IF NOT EXISTS vault_access_rules (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id VARCHAR(255) NOT NULL,
            agent_id VARCHAR(255) NOT NULL,
            secret_id UUID REFERENCES vault_secrets(id) ON DELETE CASCADE,
            allowed_tools TEXT[] NOT NULL DEFAULT '{}',
            max_uses_per_hour INT DEFAULT 100,
            requires_approval BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Threat Intel
        CREATE TABLE IF NOT EXISTS threat_events (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            event_type VARCHAR(100) NOT NULL,
            severity VARCHAR(50) DEFAULT 'medium',
            details JSONB,
            timestamp TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS threat_summaries (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            entity_id VARCHAR(255) NOT NULL, 
            entity_type VARCHAR(50) NOT NULL,
            threat_score FLOAT DEFAULT 0,
            total_events INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT NOW(),
            UNIQUE(tenantid, entity_id, entity_type)
        );

        -- Approval Queue
        CREATE TABLE IF NOT EXISTS approval_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255) NOT NULL,
            toolname VARCHAR(255) NOT NULL,
            parameters JSONB,
            status VARCHAR(50) DEFAULT 'PENDING',
            decision_by VARCHAR(255),
            decision_at TIMESTAMP,
            decision_comment TEXT,
            metadata JSONB,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;
    await pool.query(query);
};
