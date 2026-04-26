// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
// Log the database name on module load so operators can confirm the dashboard
// and the Express telemetry server point at the same Postgres instance.
if (connectionString) {
    const _dbName = connectionString.split("/").pop()?.split("?")[0] ?? "unknown";
    console.log(`[DB] Dashboard connecting to database: ${_dbName}`);
}

const sslConfig = connectionString
    ? {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
        ...(process.env.DATABASE_CA_CERT ? { ca: process.env.DATABASE_CA_CERT } : {}),
    }
    : false;

export const pool = new Pool({
    connectionString,
    ssl: sslConfig,
    max: parseInt(process.env.DATABASE_POOL_SIZE || "20", 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
    console.error(`[DB] Pool Error:`, err.message);
});

export const query = async (text: string, params?: any[]) => {
    try {
        return await pool.query(text, params);
    } catch (err: any) {
        console.error(`[DB Query Error]:`, err.message, { text });
        if (!connectionString) {
            console.error("[DB] CRITICAL: DATABASE_URL is not defined in the environment.");
        }
        throw err;
    }
};

// Schema initialization — runs once on first call, not on every request.
let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
    if (schemaReady) return schemaReady;
    schemaReady = (async () => {
        try {
            await pool.query(`
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
                    loop_detection BOOLEAN DEFAULT FALSE
                );
                
                CREATE TABLE IF NOT EXISTS tenants (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255),
                    master_api_key VARCHAR(255),
                    db_type VARCHAR(50) DEFAULT 'firebase',
                    db_string TEXT,
                    webhook_url TEXT,
                    webhook_secret VARCHAR(255),
                    slack_webhook_url TEXT,
                    notification_email VARCHAR(255),
                    openrouter_app_url TEXT,
                    openrouter_app_title VARCHAR(255),
                    openrouter_categories TEXT,
                    tier VARCHAR(20) DEFAULT 'open_source',
                    stripe_customer_id TEXT,
                    stripe_subscription_id TEXT,
                    billing_cycle_start TIMESTAMP DEFAULT NOW(),
                    tier_expires_at TIMESTAMP,
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

                CREATE TABLE IF NOT EXISTS approval_requests (
                    id VARCHAR(255) PRIMARY KEY,
                    tenantid VARCHAR(255) NOT NULL,
                    agentid VARCHAR(255),
                    agentname VARCHAR(255),
                    toolname VARCHAR(255),
                    arguments TEXT,
                    parameters TEXT,
                    status VARCHAR(50) DEFAULT 'pending',
                    estimated_cost_usd FLOAT DEFAULT 0,
                    decision_by VARCHAR(255),
                    decision_at TIMESTAMP,
                    decision_comment TEXT,
                    metadata JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    timestamp TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS semantic_analysis_log (
                    id SERIAL PRIMARY KEY,
                    tenant_id VARCHAR(255) NOT NULL,
                    agent_id VARCHAR(255),
                    tool_name VARCHAR(255),
                    semantic_score INTEGER,
                    anomaly_score INTEGER,
                    confidence VARCHAR(50),
                    decision_override VARCHAR(50),
                    reasoning TEXT,
                    model_used VARCHAR(100),
                    latency_ms INTEGER,
                    timestamp TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS agent_behavioral_baselines (
                    id SERIAL PRIMARY KEY,
                    tenant_id VARCHAR(255) NOT NULL,
                    agent_id VARCHAR(255) NOT NULL,
                    tool_name VARCHAR(255) NOT NULL,
                    avg_args_length INTEGER DEFAULT 0,
                    avg_calls_per_hour INTEGER DEFAULT 0,
                    common_arg_patterns JSONB DEFAULT '[]',
                    total_samples INTEGER DEFAULT 0,
                    last_updated TIMESTAMP DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS public_traces (
                    id VARCHAR(20) PRIMARY KEY,
                    trace_json JSONB NOT NULL,
                    audit_hash VARCHAR(64) NOT NULL,
                    public BOOLEAN DEFAULT TRUE,
                    secret_token VARCHAR(128),
                    flagged BOOLEAN DEFAULT FALSE,
                    deleted BOOLEAN DEFAULT FALSE,
                    upload_ip VARCHAR(45),
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );

                CREATE TABLE IF NOT EXISTS global_stats (
                    key VARCHAR(64) PRIMARY KEY,
                    value_int BIGINT DEFAULT 0,
                    last_updated TIMESTAMPTZ DEFAULT NOW()
                );
                INSERT INTO global_stats (key, value_int) VALUES ('total_blocks', 0) ON CONFLICT DO NOTHING;

                CREATE INDEX IF NOT EXISTS idx_agents_tenantid ON agents(tenantid);
                CREATE INDEX IF NOT EXISTS idx_audit_logs_tenantid_ts ON audit_logs(tenantid, timestamp DESC);
                CREATE INDEX IF NOT EXISTS idx_threat_events_tenantid_ts ON threat_events(tenantid, timestamp DESC);
                CREATE INDEX IF NOT EXISTS idx_threat_summaries_tenantid ON threat_summaries(tenantid);
                CREATE INDEX IF NOT EXISTS idx_approval_requests_tenantid ON approval_requests(tenantid);
                CREATE INDEX IF NOT EXISTS idx_semantic_log_tenant ON semantic_analysis_log(tenant_id);
                CREATE INDEX IF NOT EXISTS idx_baselines_tenant_agent ON agent_behavioral_baselines(tenant_id, agent_id);
                CREATE INDEX IF NOT EXISTS idx_public_traces_created ON public_traces(created_at DESC);
            `);
            console.log("[DB] Schema initialized successfully");
        } catch (err) {
            schemaReady = null; // Allow retry on failure
            throw err;
        }
    })();
    return schemaReady;
}
