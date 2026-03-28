// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Pool } from "pg";
import dotenv from "dotenv";
import { logger } from "./logger";
import { TIER_LIMITS, Tier } from "./tier-config";

if (!process.env.VERCEL) {
    dotenv.config();
}

const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
// Mask password for safe logging
const maskedUrl = rawUrl.replace(/(postgresql?:\/\/)([^:]+):([^@]+)(@)/, "$1$2:****$4");
if (maskedUrl) {
    logger.info(`[DB] Initializing connection: ${maskedUrl}`);
}

let dbUrl = rawUrl.trim();

const sslConfig = process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false;

export const pool = new Pool({
    connectionString: dbUrl,
    ssl: sslConfig,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, 
});

pool.on("error", (err) => {
    logger.error(`[DB] Pool Error: ${err.message}`, { error: err });
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
            tier VARCHAR(20) DEFAULT 'open_source',
            stripe_customer_id TEXT,
            stripe_subscription_id TEXT,
            billing_cycle_start TIMESTAMP DEFAULT NOW(),
            tier_expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Ensure modern billing columns exist for existing deployments
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='stripe_customer_id') THEN
                ALTER TABLE tenants ADD COLUMN stripe_customer_id TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='stripe_subscription_id') THEN
                ALTER TABLE tenants ADD COLUMN stripe_subscription_id TEXT;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='billing_cycle_start') THEN
                ALTER TABLE tenants ADD COLUMN billing_cycle_start TIMESTAMP DEFAULT NOW();
            END IF;
            -- Migrate legacy 'free' tier name to 'open_source' if present
            UPDATE tenants SET tier = 'open_source' WHERE tier = 'free';
            ALTER TABLE tenants ALTER COLUMN tier SET DEFAULT 'open_source';
        END $$;

        -- Usage Metering (Usage-based billing)
        CREATE TABLE IF NOT EXISTS tenant_usage (
            tenant_id VARCHAR(255) NOT NULL,
            month VARCHAR(7) NOT NULL, -- YYYY-MM
            evaluation_count INTEGER DEFAULT 0,
            overage_units INTEGER DEFAULT 0,
            overage_billed_usd DECIMAL(10,4) DEFAULT 0,
            last_updated TIMESTAMP DEFAULT NOW(),
            PRIMARY KEY (tenant_id, month)
        );

        -- Seats / Organization Members
        CREATE TABLE IF NOT EXISTS organization_members (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id VARCHAR(255) NOT NULL REFERENCES tenants(id),
            user_email VARCHAR(255) NOT NULL,
            user_id VARCHAR(255), -- Firebase UID
            role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner | admin | member | viewer
            status VARCHAR(50) DEFAULT 'pending', -- pending | active | removed
            invited_at TIMESTAMP DEFAULT NOW(),
            accepted_at TIMESTAMP,
            UNIQUE(tenant_id, user_email)
        );

        -- SSO Configuration
        CREATE TABLE IF NOT EXISTS sso_configs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id VARCHAR(255) NOT NULL UNIQUE REFERENCES tenants(id),
            provider VARCHAR(100) NOT NULL, -- okta | azure-ad | google
            client_id TEXT,
            client_secret_encrypted BYTEA,
            domain TEXT,
            enabled BOOLEAN DEFAULT FALSE,
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
            assigned_agents TEXT[] DEFAULT '{}',
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
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(tenant_id, agent_id, secret_id)
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

        -- Content/SEO Tasks (Migrated from Supabase)
        CREATE TABLE IF NOT EXISTS content_tasks (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            url VARCHAR(555) NOT NULL,
            type VARCHAR(100),
            primary_keyword VARCHAR(255),
            status VARCHAR(50) DEFAULT 'draft',
            published_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        );

        -- Layer 2: AI Semantic Analysis Engine
        CREATE TABLE IF NOT EXISTS agent_behavioral_baselines (
            id SERIAL PRIMARY KEY,
            tenant_id VARCHAR(255) NOT NULL,
            agent_id VARCHAR(255) NOT NULL,
            tool_name VARCHAR(255) NOT NULL,
            avg_args_length FLOAT DEFAULT 0,
            avg_calls_per_hour FLOAT DEFAULT 0,
            common_arg_patterns JSONB DEFAULT '[]',
            total_samples INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT NOW(),
            UNIQUE(tenant_id, agent_id, tool_name)
        );

        CREATE INDEX IF NOT EXISTS idx_baselines_tenant_agent
            ON agent_behavioral_baselines(tenant_id, agent_id);

        CREATE TABLE IF NOT EXISTS semantic_analysis_log (
            id SERIAL PRIMARY KEY,
            tenant_id VARCHAR(255) NOT NULL,
            agent_id VARCHAR(255) NOT NULL,
            tool_name VARCHAR(255) NOT NULL,
            semantic_score FLOAT NOT NULL,
            anomaly_score FLOAT,
            confidence VARCHAR(20) NOT NULL,
            decision_override VARCHAR(20),
            reasoning TEXT,
            model_used VARCHAR(100),
            latency_ms INTEGER,
            parameters JSONB,
            timestamp TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_semantic_log_tenant
            ON semantic_analysis_log(tenant_id, timestamp DESC);

        CREATE TABLE IF NOT EXISTS custom_model_endpoints (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tenant_id VARCHAR(255) NOT NULL UNIQUE,
            endpoint_url VARCHAR(500) NOT NULL,
            auth_header VARCHAR(500),
            model_name VARCHAR(100),
            max_latency_ms INTEGER DEFAULT 500,
            enabled BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;
    await pool.query(query);
};

/**
 * Daily Background Task: Purges logs older than tenant-specific retention limits.
 */
export async function purgeOldLogs(): Promise<void> {
    logger.info("[Purge] Starting daily audit log cleanup...");
    try {
        const tiers = (Object.entries(TIER_LIMITS) as [Tier, typeof TIER_LIMITS[Tier]][]).map(
            ([id, cfg]) => ({ id, days: cfg.auditRetentionDays })
        );

        for (const tier of tiers) {
            const result = await pool.query(
                `DELETE FROM audit_logs WHERE tenantid IN (
                    SELECT id FROM tenants WHERE tier = $1
                 ) AND timestamp < NOW() - ($2 || ' days')::INTERVAL`,
                [tier.id, tier.days]
            );
            if (result.rowCount && result.rowCount > 0) {
                logger.info(`[Purge] Cleared ${result.rowCount} logs for ${tier.id} tier.`);
            }
        }
        logger.info("[Purge] Audit log cleanup complete.");
    } catch (err) {
        logger.error("[Purge] Failed to cleanup logs:", err);
    }
}
