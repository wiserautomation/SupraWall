-- Agents
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenantid TEXT NOT NULL,
    name TEXT NOT NULL,
    apikey TEXT UNIQUE NOT NULL,
    scopes TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    max_cost_usd DECIMAL(10,4) DEFAULT 10.0,
    budget_alert_usd DECIMAL(10,4) DEFAULT 8.0,
    max_iterations INTEGER DEFAULT 50,
    loop_detection BOOLEAN DEFAULT true,
    slack_webhook TEXT,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tenants / Workspaces
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY, -- Firebase UID
    name TEXT,
    master_api_key TEXT,
    slack_webhook_url TEXT,
    notification_email TEXT,
    webhook_url TEXT,
    webhook_secret TEXT,
    db_type TEXT DEFAULT 'postgres',
    db_string TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Policies
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenantid TEXT NOT NULL,
    agentid TEXT, -- optional, if null apply to all agents in tenant
    toolname TEXT NOT NULL,
    condition TEXT,
    ruletype TEXT NOT NULL, -- ALLOW, DENY, REQUIRE_APPROVAL
    priority INTEGER DEFAULT 100,
    isdryrun BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Approval Requests
CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenantid TEXT NOT NULL,
    agentid TEXT NOT NULL,
    toolname TEXT NOT NULL,
    parameters TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    decision_by TEXT,
    decision_at TIMESTAMP WITH TIME ZONE,
    decision_comment TEXT,
    metadata TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenantid TEXT NOT NULL,
    agentid TEXT NOT NULL,
    toolname TEXT NOT NULL,
    arguments TEXT,
    riskscore INTEGER,
    parameters JSONB,
    metadata JSONB,
    decision TEXT NOT NULL,
    reason TEXT,
    sessionid TEXT,
    agentrole TEXT,
    cost_usd DECIMAL(10,6),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Threat Events
CREATE TABLE IF NOT EXISTS threat_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenantid TEXT NOT NULL,
    agentid TEXT NOT NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vault Secrets
CREATE TABLE IF NOT EXISTS vault_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL,
    secret_name TEXT NOT NULL,
    encrypted_value BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, secret_name)
);
