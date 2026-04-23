# Vault Setup Guide — SupraWall JIT Secret Injection

This guide walks through setting up SupraWall Vault so your AI agents never handle real API keys.

## What is Vault?

Instead of embedding `sk_live_...` in your agent's context, you give the agent a safe placeholder:

```
$SUPRAWALL_VAULT_STRIPE_PROD_KEY
```

When the agent calls a tool with this token, SupraWall:
1. Checks the agent has permission to use this secret for this specific tool
2. Decrypts the real value in-memory
3. Executes the tool with the real credential
4. Scrubs all traces of the secret from the response
5. Returns the clean result to the agent

The agent never sees the real key.

---

## Step 1: Store a Secret

Go to **Dashboard → Vault → Secrets** and click **Create Secret**.

Or via API:

```json
POST /v1/vault/secrets
{
  "tenantId": "your-tenant-id",
  "secretName": "STRIPE_PROD_KEY",
  "secretValue": "sk_live_4829...",
  "description": "Production Stripe API key"
}
```

Response (no value returned):
```json
{
  "id": "uuid-here",
  "secretName": "STRIPE_PROD_KEY",
  "description": "Production Stripe API key",
  "expiresAt": null,
  "createdAt": "2026-03-12T10:00:00Z"
}
```

**Secret name rules:** `UPPER_SNAKE_CASE`, letters/numbers/underscores, 3–64 chars.

---

## Step 2: Create an Access Rule

Define which agent can use which secret for which tools:

```json
POST /v1/vault/rules
{
  "tenantId": "your-tenant-id",
  "agentId": "payments-agent",
  "secretId": "uuid-of-STRIPE_PROD_KEY",
  "allowedTools": ["process_payment", "refund_payment"],
  "maxUsesPerHour": 50,
  "requiresApproval": false
}
```

- `allowedTools`: list of tool names (supports regex patterns). Empty = all tools allowed.
- `maxUsesPerHour`: rate limit per agent per secret per hour.
- `requiresApproval`: if true, combines with `REQUIRE_APPROVAL` policy flow.

---

## Step 3: Give the Token to Your Agent

Put the vault token in your agent's system prompt or tool configuration:

```
You are a payments agent. To process payments, use the Stripe API.
Your Stripe API key is: $SUPRAWALL_VAULT_STRIPE_PROD_KEY

Use this key when calling the process_payment and refund_payment tools.
```

The token `$SUPRAWALL_VAULT_STRIPE_PROD_KEY` is safe to include in prompts — it's just a placeholder.

---

## Step 4: How Tool Calls Work

When the agent calls:
```json
{
  "tool": "process_payment",
  "arguments": {
    "apiKey": "$SUPRAWALL_VAULT_STRIPE_PROD_KEY",
    "amount": 9900,
    "currency": "usd"
  }
}
```

SupraWall intercepts the call at `/v1/evaluate`, resolves the token, and returns:
```json
{
  "decision": "ALLOW",
  "vaultInjected": true,
  "resolvedArguments": {
    "apiKey": "sk_live_4829...",
    "amount": 9900,
    "currency": "usd"
  },
  "injectedSecrets": ["STRIPE_PROD_KEY"]
}
```

The SDK uses `resolvedArguments` for execution, then calls `/v1/scrub` to strip the key from the response.

---

## Step 5: Monitor Access

View the audit trail at **Dashboard → Vault → Access Log**:

| Timestamp | Agent | Secret | Tool | Action |
|-----------|-------|--------|------|--------|
| 10:32:14 | payments-agent | STRIPE_PROD_KEY | process_payment | ✅ INJECTED |
| 10:31:58 | scraper-agent | STRIPE_PROD_KEY | bash | ❌ DENIED |
| 10:28:44 | payments-agent | STRIPE_PROD_KEY | process_payment | ⚠️ RATE_LIMITED |

---

## Rotating a Secret

When you rotate a key, update the vault — no agent prompts need changing:

```json
PUT /v1/vault/secrets/{id}/rotate
{
  "tenantId": "your-tenant-id",
  "newValue": "sk_live_new_value..."
}
```

The next tool call automatically gets the new value.

---

## Security Properties

- Secrets encrypted at rest with AES-256 (pgcrypto)
- Encryption key stored in server env vars — never in the database
- Audit logs never contain decrypted values
- Fail-closed: if a token can't resolve, the entire tool call is DENIED
- Response scrubber handles: exact match, base64, URL-encoded, partial key fragments, hex
- Rate limiting prevents credential abuse even if an agent is compromised
