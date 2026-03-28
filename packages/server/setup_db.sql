-- SupraWall Database Schema
-- This file mirrors what db.ts creates dynamically.
-- Use for documentation and fresh installs.
-- db.ts remains authoritative for migrations.

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants / Workspaces
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(255) PRIMARY KEY,         -- Firebase UID
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

-- Agents
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

-- Policies
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

-- Approval Queue
CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenantid VARCHAR(255) NOT NULL,
    agentid VARCHAR(255) NOT NULL,
    toolname VARCHAR(255) NOT NULL,
    parameters JSONB,
    status VARCHAR(50) DEFAULT 'PENDING',   -- PENDING | APPROVED | REJECTED
    decision_by VARCHAR(255),
    decision_at TIMESTAMP,
    decision_comment TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
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

-- Threat Events
CREATE TABLE IF NOT EXISTS threat_events (
    id SERIAL PRIMARY KEY,
    tenantid VARCHAR(255) NOT NULL,
    agentid VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'medium',
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Threat Summaries (per-entity risk scores)
CREATE TABLE IF NOT EXISTS threat_summaries (
    id SERIAL PRIMARY KEY,
    tenantid VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,   -- agent | tenant
    threat_score FLOAT DEFAULT 0,
    total_events INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenantid, entity_id, entity_type)
);

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

-- Vault: per-agent access rules
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

-- Usage Metering (usage-based billing)
CREATE TABLE IF NOT EXISTS tenant_usage (
    tenant_id VARCHAR(255) NOT NULL,
    month VARCHAR(7) NOT NULL,           -- YYYY-MM
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
    user_id VARCHAR(255),                -- Firebase UID
    role VARCHAR(50) NOT NULL DEFAULT 'member',  -- owner | admin | member | viewer
    status VARCHAR(50) DEFAULT 'pending',        -- pending | active | removed
    invited_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    UNIQUE(tenant_id, user_email)
);

-- SSO Configuration (Business+ tiers)
CREATE TABLE IF NOT EXISTS sso_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(255) NOT NULL UNIQUE REFERENCES tenants(id),
    provider VARCHAR(100) NOT NULL,      -- okta | azure-ad | google
    client_id TEXT,
    client_secret_encrypted BYTEA,
    domain TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
