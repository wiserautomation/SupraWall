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
            name VARCHAR(255) NOT NULL,
            description TEXT,
            toolname VARCHAR(255),
            ruletype VARCHAR(50),
            createdat TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS auditlogs (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            toolname VARCHAR(255),
            decision VARCHAR(50),
            riskscore INTEGER,
            createdat TIMESTAMP DEFAULT NOW(),
            parameters JSONB,
            metadata JSONB
        );
        -- Migration for existing systems
        DO $$ 
        BEGIN 
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auditlogs' AND column_name='timestamp') THEN
                ALTER TABLE auditlogs RENAME COLUMN timestamp TO createdat;
            END IF;
        END $$;
        CREATE TABLE IF NOT EXISTS agents (
            id VARCHAR(255) PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            apikeyhash VARCHAR(255),
            status VARCHAR(50) DEFAULT 'active',
            createdat TIMESTAMP DEFAULT NOW()
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

        -- Vault: which agent + tool combos can access which secrets
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

        -- Vault: audit trail for every secret access (NEVER stores the secret itself)
        CREATE TABLE IF NOT EXISTS vault_access_log (
            id SERIAL PRIMARY KEY,
            tenant_id VARCHAR(255) NOT NULL,
            agent_id VARCHAR(255) NOT NULL,
            secret_name VARCHAR(255) NOT NULL,
            tool_name VARCHAR(255) NOT NULL,
            action VARCHAR(50) NOT NULL,
            request_metadata JSONB,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Vault: sliding window rate limiting
        CREATE TABLE IF NOT EXISTS vault_rate_limits (
            tenant_id VARCHAR(255) NOT NULL,
            agent_id VARCHAR(255) NOT NULL,
            secret_name VARCHAR(255) NOT NULL,
            window_start TIMESTAMP NOT NULL,
            use_count INT DEFAULT 1,
            PRIMARY KEY(tenant_id, agent_id, secret_name, window_start)
        );
    `;
    await pool.query(query);
};
