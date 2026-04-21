-- AWS Marketplace integration columns — add to tenants table
-- Run this migration after deploying aws-marketplace.ts route.
--
-- aws_customer_id        : stable identifier from ResolveCustomer API
-- aws_product_code       : product code from AMMP (validated on register)
-- aws_account_id         : buyer's AWS Account ID (for audit)
-- aws_subscription_status: tracks the full SNS lifecycle state

ALTER TABLE tenants
    ADD COLUMN IF NOT EXISTS aws_customer_id        TEXT,
    ADD COLUMN IF NOT EXISTS aws_product_code       TEXT,
    ADD COLUMN IF NOT EXISTS aws_account_id         TEXT,
    ADD COLUMN IF NOT EXISTS aws_subscription_status TEXT DEFAULT NULL;

-- Index for fast lookup by aws_customer_id (used in every SNS notification handler)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_aws_customer_id
    ON tenants (aws_customer_id)
    WHERE aws_customer_id IS NOT NULL;

-- Optional: view for monitoring AWS subscription states
CREATE OR REPLACE VIEW aws_subscriptions AS
SELECT
    id             AS tenant_id,
    name,
    tier,
    aws_customer_id,
    aws_product_code,
    aws_account_id,
    aws_subscription_status,
    created_at,
    updated_at
FROM tenants
WHERE aws_customer_id IS NOT NULL
ORDER BY created_at DESC;
