# Supra-wall Vault: JIT Secret Injection — Complete Implementation Plan

## Overview

This document is a step-by-step implementation guide for the Supra-wall Vault feature: Just-In-Time (JIT) secret injection for AI agents. The agent never knows the real secret — Supra-wall intercepts the tool call, replaces symbolic tokens with real credentials, executes the tool, scrubs the response, and returns a clean result.

**Estimated total dev time:** 5–7 days solo.

---

## Architecture Summary

```
Agent generates tool call with $SUPRAWALL_VAULT_* tokens
        │
        ▼
┌─────────────────────────┐
│  Supra-wall SDK         │  ← Existing middleware intercepts
│  Detects vault tokens   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Policy Engine          │  ← Existing: ALLOW / DENY / REQUIRE_APPROVAL
│  + Vault permission     │  ← NEW: check vault_access_rules
└────────┬────────────────┘
         │
    ┌────┼────────────────┐
    │    │                │
  DENY  REQUIRE_APPROVAL  ALLOW + INJECT
    │    │                │
 Block  Pause for human   │
         │                │
         ▼                │
    Human approves?       │
    No → Block            │
    Yes ──────────────────┤
                          │
                          ▼
              ┌───────────────────────┐
              │  Vault Resolution     │  ← NEW
              │  1. Check rate limits │
              │  2. Check expiry      │
              │  3. Decrypt secret    │
              │  4. Replace tokens    │
              │  5. Log access        │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Execute tool call    │  ← With real secrets (in-memory only)
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Response Scrubber    │  ← NEW
              │  Strip secret traces  │
              │  from response        │
              └───────────┬───────────┘
                          │
                          ▼
              Agent receives clean response
```

---

## Implementation Order

| Phase | What | Est. Time | Dependencies |
|-------|------|-----------|-------------|
| 1 | Database schema + encryption | 3 hrs | None |
| 2 | Vault CRUD API routes | 4 hrs | Phase 1 |
| 3 | JIT injection in policy engine | 6 hrs | Phase 1, 2 |
| 4 | Response scrubber | 3 hrs | Phase 3 |
| 5 | Rate limiting | 2 hrs | Phase 1, 3 |
| 6 | TypeScript SDK changes | 4 hrs | Phase 3 |
| 7 | Python SDK changes | 4 hrs | Phase 3 |
| 8 | Dashboard Vault UI | 8 hrs | Phase 2 |
| 9 | Integration tests | 4 hrs | All |
| 10 | Documentation + plugin update | 3 hrs | All |

---

## Phase 1: Database Schema + Encryption

**File:** `/suprawall-server/src/db.ts`

**What to do:** Add the new vault tables to the `initDb()` function alongside the existing tables.

### Step 1.1: Add encryption extension

Add this at the TOP of the `initDb` query string, before the existing CREATE TABLE statements:

```sql
-- Enable encryption (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Step 1.2: Add vault_secrets table

Add this AFTER the existing `agents` table creation in the same query:

```sql
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
```

**Encryption approach:** The `encrypted_value` column stores the secret encrypted with pgcrypto's `pgp_sym_encrypt()` function. The encryption key is stored as an environment variable `VAULT_ENCRYPTION_KEY` on the server — never in the database.

### Step 1.3: Add vault_access_rules table

```sql
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
```

### Step 1.4: Add vault_access_log table

```sql
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

-- Action values: 'INJECTED' | 'DENIED' | 'EXPIRED' | 'RATE_LIMITED' | 'NOT_FOUND'
```

### Step 1.5: Add vault_rate_limits table

```sql
-- Vault: sliding window rate limiting
CREATE TABLE IF NOT EXISTS vault_rate_limits (
    tenant_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    secret_name VARCHAR(255) NOT NULL,
    window_start TIMESTAMP NOT NULL,
    use_count INT DEFAULT 1,
    PRIMARY KEY(tenant_id, agent_id, secret_name, window_start)
);
```

### Step 1.6: Add environment variable

Add to `.env` and document in README:

```
VAULT_ENCRYPTION_KEY=<generate a random 32+ char string>
```

Generate with: `openssl rand -hex 32`

---

## Phase 2: Vault CRUD API Routes

**New file:** `/suprawall-server/src/routes/vault.ts`

### Step 2.1: Create the vault router

Create a new Express router file at `/suprawall-server/src/routes/vault.ts` with these endpoints:

#### `POST /v1/vault/secrets` — Create a secret

```typescript
// Request body:
{
  "tenantId": "tenant_123",
  "secretName": "STRIPE_PROD_KEY",
  "secretValue": "sk_live_...",       // plaintext — encrypted before storage
  "description": "Production Stripe API key"
  "expiresAt": null                    // optional ISO timestamp
}

// What this endpoint does:
// 1. Validate inputs (secretName must match pattern: ^[A-Z][A-Z0-9_]{2,63}$)
// 2. Encrypt secretValue using pgcrypto:
//    INSERT INTO vault_secrets (tenant_id, secret_name, encrypted_value, description, expires_at)
//    VALUES ($1, $2, pgp_sym_encrypt($3, $4), $5, $6)
//    where $4 = process.env.VAULT_ENCRYPTION_KEY
// 3. Return { id, secretName, description, createdAt } — NEVER return the encrypted value

// Response:
{
  "id": "uuid-here",
  "secretName": "STRIPE_PROD_KEY",
  "description": "Production Stripe API key",
  "expiresAt": null,
  "createdAt": "2026-03-12T..."
}
```

#### `GET /v1/vault/secrets?tenantId=<id>` — List secrets (metadata only)

```typescript
// Query: SELECT id, tenant_id, secret_name, description, expires_at, last_rotated_at, created_at
//        FROM vault_secrets WHERE tenant_id = $1
// NEVER select encrypted_value in list queries
// Response: array of secret metadata objects (no values)
```

#### `PUT /v1/vault/secrets/:id/rotate` — Rotate a secret

```typescript
// Request body:
{
  "newValue": "sk_live_new_value..."
}

// What this endpoint does:
// 1. UPDATE vault_secrets
//    SET encrypted_value = pgp_sym_encrypt($1, $2), last_rotated_at = NOW()
//    WHERE id = $3 AND tenant_id = $4
// 2. Return { id, secretName, lastRotatedAt }
// 3. Log rotation event to vault_access_log with action = 'ROTATED'
```

#### `DELETE /v1/vault/secrets/:id` — Delete a secret

```typescript
// 1. DELETE FROM vault_secrets WHERE id = $1 AND tenant_id = $2
//    (CASCADE will also delete vault_access_rules referencing this secret)
// 2. Log deletion event to vault_access_log with action = 'DELETED'
```

#### `POST /v1/vault/rules` — Create an access rule

```typescript
// Request body:
{
  "tenantId": "tenant_123",
  "agentId": "agent_payments",
  "secretId": "uuid-of-secret",
  "allowedTools": ["process_payment", "refund_payment"],
  "maxUsesPerHour": 50,
  "requiresApproval": false
}

// INSERT INTO vault_access_rules (tenant_id, agent_id, secret_id, allowed_tools, max_uses_per_hour, requires_approval)
// VALUES ($1, $2, $3, $4, $5, $6)
```

#### `GET /v1/vault/rules?tenantId=<id>&agentId=<id>` — List rules for an agent

```typescript
// Query: SELECT r.*, s.secret_name FROM vault_access_rules r
//        JOIN vault_secrets s ON r.secret_id = s.id
//        WHERE r.tenant_id = $1 AND (r.agent_id = $2 OR $2 IS NULL)
```

#### `DELETE /v1/vault/rules/:id` — Remove an access rule

```typescript
// DELETE FROM vault_access_rules WHERE id = $1 AND tenant_id = $2
```

#### `GET /v1/vault/log?tenantId=<id>` — View vault access log

```typescript
// Query: SELECT * FROM vault_access_log
//        WHERE tenant_id = $1
//        ORDER BY created_at DESC
//        LIMIT $2 OFFSET $3
// Supports pagination with ?limit=50&offset=0
// Supports filters: ?agentId=X&action=INJECTED&from=ISO&to=ISO
```

### Step 2.2: Register the vault router

**File:** `/suprawall-server/src/index.ts`

Add this import and route registration:

```typescript
import vaultRouter from "./routes/vault";

// Add after the existing compliance router registration:
app.use("/v1/vault", vaultRouter);
```

---

## Phase 3: JIT Injection in Policy Engine

**File:** `/suprawall-server/src/policy.ts`

This is the core of the feature. Modify the existing `evaluatePolicy` function to detect vault tokens and inject secrets.

### Step 3.1: Create vault resolver module

**New file:** `/suprawall-server/src/vault.ts`

```typescript
// This module handles:
// 1. Detecting $SUPRAWALL_VAULT_* tokens in tool call arguments
// 2. Checking permissions (vault_access_rules)
// 3. Checking rate limits
// 4. Checking expiry
// 5. Decrypting and injecting secrets
// 6. Logging access

import { pool } from "./db";

// ── Constants ────────────────────────────────────────────────────────
const VAULT_TOKEN_PATTERN = /\$SUPRAWALL_VAULT_([A-Z][A-Z0-9_]{2,63})/g;

// ── Types ────────────────────────────────────────────────────────────
export interface VaultResolutionResult {
  success: boolean;
  resolvedArgs: any;                    // arguments with secrets injected
  injectedSecrets: string[];            // names of secrets that were injected (for scrubbing)
  secretValues: string[];               // actual secret values (for response scrubbing ONLY — never log these)
  errors: VaultError[];
}

export interface VaultError {
  secretName: string;
  reason: "NOT_FOUND" | "ACCESS_DENIED" | "TOOL_NOT_ALLOWED" | "EXPIRED" | "RATE_LIMITED";
  message: string;
}

// ── Main resolver function ───────────────────────────────────────────
export async function resolveVaultTokens(
  tenantId: string,
  agentId: string,
  toolName: string,
  args: any
): Promise<VaultResolutionResult> {
  const argsString = JSON.stringify(args);
  const tokenMatches = [...argsString.matchAll(VAULT_TOKEN_PATTERN)];

  // No vault tokens found — pass through unchanged
  if (tokenMatches.length === 0) {
    return { success: true, resolvedArgs: args, injectedSecrets: [], secretValues: [], errors: [] };
  }

  const secretNames = [...new Set(tokenMatches.map(m => m[1]))];
  const errors: VaultError[] = [];
  const injectedSecrets: string[] = [];
  const secretValues: string[] = [];
  let resolvedArgsString = argsString;

  for (const secretName of secretNames) {
    const token = `$SUPRAWALL_VAULT_${secretName}`;

    // ── 1. Look up the secret ─────────────────────────────────────
    const secretResult = await pool.query(
      `SELECT id, secret_name, expires_at,
              pgp_sym_decrypt(encrypted_value, $1) as decrypted_value
       FROM vault_secrets
       WHERE tenant_id = $2 AND secret_name = $3`,
      [process.env.VAULT_ENCRYPTION_KEY, tenantId, secretName]
    );

    if (secretResult.rows.length === 0) {
      errors.push({ secretName, reason: "NOT_FOUND", message: `Secret '${secretName}' not found in vault` });
      await logVaultAccess(tenantId, agentId, secretName, toolName, "NOT_FOUND");
      continue;
    }

    const secret = secretResult.rows[0];

    // ── 2. Check expiry ───────────────────────────────────────────
    if (secret.expires_at && new Date(secret.expires_at) < new Date()) {
      errors.push({ secretName, reason: "EXPIRED", message: `Secret '${secretName}' has expired` });
      await logVaultAccess(tenantId, agentId, secretName, toolName, "EXPIRED");
      continue;
    }

    // ── 3. Check access rules ─────────────────────────────────────
    const ruleResult = await pool.query(
      `SELECT * FROM vault_access_rules
       WHERE tenant_id = $1 AND agent_id = $2 AND secret_id = $3`,
      [tenantId, agentId, secret.id]
    );

    if (ruleResult.rows.length === 0) {
      errors.push({ secretName, reason: "ACCESS_DENIED", message: `Agent '${agentId}' has no access to secret '${secretName}'` });
      await logVaultAccess(tenantId, agentId, secretName, toolName, "DENIED");
      continue;
    }

    const rule = ruleResult.rows[0];

    // ── 4. Check tool is allowed ──────────────────────────────────
    const allowedTools: string[] = rule.allowed_tools || [];
    const toolAllowed = allowedTools.length === 0 || allowedTools.some(pattern => {
      try { return new RegExp(pattern).test(toolName); }
      catch { return pattern === toolName; }
    });

    if (!toolAllowed) {
      errors.push({
        secretName,
        reason: "TOOL_NOT_ALLOWED",
        message: `Secret '${secretName}' cannot be used with tool '${toolName}'. Allowed: ${allowedTools.join(", ")}`
      });
      await logVaultAccess(tenantId, agentId, secretName, toolName, "DENIED");
      continue;
    }

    // ── 5. Check rate limit ───────────────────────────────────────
    const rateLimitOk = await checkRateLimit(tenantId, agentId, secretName, rule.max_uses_per_hour);
    if (!rateLimitOk) {
      errors.push({
        secretName,
        reason: "RATE_LIMITED",
        message: `Secret '${secretName}' rate limit exceeded (${rule.max_uses_per_hour}/hour)`
      });
      await logVaultAccess(tenantId, agentId, secretName, toolName, "RATE_LIMITED");
      continue;
    }

    // ── 6. All checks passed — inject the secret ──────────────────
    const decryptedValue = secret.decrypted_value;
    resolvedArgsString = resolvedArgsString.split(token).join(decryptedValue);
    injectedSecrets.push(secretName);
    secretValues.push(decryptedValue);

    // ── 7. Log successful injection ───────────────────────────────
    await logVaultAccess(tenantId, agentId, secretName, toolName, "INJECTED");

    // ── 8. Increment rate limit counter ───────────────────────────
    await incrementRateLimit(tenantId, agentId, secretName);
  }

  // If any secret failed to resolve, fail the entire call (fail-closed)
  if (errors.length > 0) {
    return { success: false, resolvedArgs: args, injectedSecrets: [], secretValues: [], errors };
  }

  return {
    success: true,
    resolvedArgs: JSON.parse(resolvedArgsString),
    injectedSecrets,
    secretValues,
    errors: []
  };
}


// ── Rate limiting helpers ────────────────────────────────────────────

async function checkRateLimit(
  tenantId: string,
  agentId: string,
  secretName: string,
  maxPerHour: number
): Promise<boolean> {
  const windowStart = getHourWindow();

  const result = await pool.query(
    `SELECT use_count FROM vault_rate_limits
     WHERE tenant_id = $1 AND agent_id = $2 AND secret_name = $3 AND window_start = $4`,
    [tenantId, agentId, secretName, windowStart]
  );

  if (result.rows.length === 0) return true; // No usage yet this window
  return result.rows[0].use_count < maxPerHour;
}

async function incrementRateLimit(
  tenantId: string,
  agentId: string,
  secretName: string
): Promise<void> {
  const windowStart = getHourWindow();

  await pool.query(
    `INSERT INTO vault_rate_limits (tenant_id, agent_id, secret_name, window_start, use_count)
     VALUES ($1, $2, $3, $4, 1)
     ON CONFLICT (tenant_id, agent_id, secret_name, window_start)
     DO UPDATE SET use_count = vault_rate_limits.use_count + 1`,
    [tenantId, agentId, secretName, windowStart]
  );
}

function getHourWindow(): Date {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now;
}


// ── Vault access log ─────────────────────────────────────────────────

async function logVaultAccess(
  tenantId: string,
  agentId: string,
  secretName: string,
  toolName: string,
  action: string,
  metadata?: any
): Promise<void> {
  await pool.query(
    `INSERT INTO vault_access_log (tenant_id, agent_id, secret_name, tool_name, action, request_metadata)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [tenantId, agentId, secretName, toolName, action, JSON.stringify(metadata || {})]
  );
}
```

### Step 3.2: Create response scrubber module

**New file:** `/suprawall-server/src/scrubber.ts`

```typescript
// This module removes any trace of injected secrets from tool responses
// before they're returned to the LLM.

export function scrubResponse(response: any, secretValues: string[]): any {
  if (secretValues.length === 0) return response;

  let responseString = typeof response === "string" ? response : JSON.stringify(response);

  for (const secret of secretValues) {
    // ── 1. Exact match replacement ────────────────────────────────
    responseString = responseString.split(secret).join("[REDACTED]");

    // ── 2. Base64-encoded version ─────────────────────────────────
    const base64 = Buffer.from(secret).toString("base64");
    responseString = responseString.split(base64).join("[REDACTED_B64]");

    // ── 3. URL-encoded version ────────────────────────────────────
    const urlEncoded = encodeURIComponent(secret);
    responseString = responseString.split(urlEncoded).join("[REDACTED_URL]");

    // ── 4. Partial match — first 8 chars (catches error messages
    //    that include partial keys like "sk_live_4829..." ) ────────
    if (secret.length > 12) {
      const partialStart = secret.substring(0, 8);
      const partialEnd = secret.substring(secret.length - 8);
      // Only replace if the partial appears AND is longer than a common prefix
      if (partialStart.length >= 6) {
        responseString = responseString.split(partialStart).join("[REDACTED_PARTIAL]");
      }
      if (partialEnd.length >= 6) {
        responseString = responseString.split(partialEnd).join("[REDACTED_PARTIAL]");
      }
    }

    // ── 5. Hex-encoded version (some APIs return keys in hex) ─────
    const hexEncoded = Buffer.from(secret).toString("hex");
    if (hexEncoded !== secret) { // Only if different from original
      responseString = responseString.split(hexEncoded).join("[REDACTED_HEX]");
    }
  }

  // Return in original format
  if (typeof response === "string") return responseString;
  try { return JSON.parse(responseString); }
  catch { return responseString; }
}
```

### Step 3.3: Modify the policy evaluation endpoint

**File:** `/suprawall-server/src/policy.ts`

The existing `evaluatePolicy` function needs to be extended. The modification happens AFTER the ALLOW/DENY/REQUIRE_APPROVAL decision but BEFORE returning the response.

Replace the existing `evaluatePolicy` function body with:

```typescript
import { resolveVaultTokens, VaultResolutionResult } from "./vault";
import { scrubResponse } from "./scrubber";

export const evaluatePolicy = async (req: Request, res: Response) => {
  try {
    const { agentId, toolName, arguments: args } = req.body as EvaluationRequest;
    const tenantId = req.body.tenantId || "default-tenant";

    if (!agentId || !toolName) {
      return res.status(400).json({ error: "Missing agentId or toolName" });
    }

    // ── EXISTING: Fetch and evaluate policies ──────────────────────
    const result = await pool.query(
      "SELECT * FROM policies WHERE toolname = $1 OR toolname IS NULL OR toolname = ''",
      [toolName]
    );
    const policies = result.rows;

    let decision = "ALLOW";
    let matchedRule = "default";

    // Check DENYs first (existing logic — unchanged)
    const denyRules = policies.filter((p) => p.ruletype === "DENY");
    for (const rule of denyRules) {
      try {
        const pattern = rule.toolname || ".*";
        const regex = new RegExp(pattern);
        if (regex.test(toolName)) {
          decision = "DENY";
          matchedRule = rule.name;
          break;
        }
      } catch (e) {
        console.warn("Invalid regex in policy:", rule.name);
      }
    }

    // Check REQUIRE_APPROVAL (existing logic — unchanged)
    if (decision !== "DENY") {
      const approvalRules = policies.filter((p) => p.ruletype === "REQUIRE_APPROVAL");
      for (const rule of approvalRules) {
        try {
          const pattern = rule.toolname || ".*";
          const regex = new RegExp(pattern);
          if (regex.test(toolName)) {
            decision = "REQUIRE_APPROVAL";
            matchedRule = rule.name;
            break;
          }
        } catch (e) {
          console.warn("Invalid regex in policy:", rule.name);
        }
      }
    }

    // ── NEW: Vault token detection and injection ───────────────────
    let resolvedArgs = args;
    let vaultResult: VaultResolutionResult | null = null;
    let hasVaultTokens = false;

    // Check if arguments contain vault tokens
    const argsString = JSON.stringify(args || {});
    hasVaultTokens = /\$SUPRAWALL_VAULT_[A-Z][A-Z0-9_]+/.test(argsString);

    if (hasVaultTokens && decision !== "DENY") {
      // Resolve vault tokens
      vaultResult = await resolveVaultTokens(tenantId, agentId, toolName, args);

      if (!vaultResult.success) {
        // Vault resolution failed — fail closed (DENY)
        decision = "DENY";
        matchedRule = `vault:${vaultResult.errors.map(e => e.reason).join(",")}`;

        // Log to audit
        await pool.query(
          "INSERT INTO auditlogs (tenantid, agentid, toolname, parameters, decision, riskscore, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [tenantId, agentId, toolName, JSON.stringify(args || {}), decision, 95,
           JSON.stringify({ vaultErrors: vaultResult.errors })]
        );

        return res.json({
          decision: "DENY",
          reason: `Vault access denied: ${vaultResult.errors.map(e => e.message).join("; ")}`,
          vaultErrors: vaultResult.errors,
        });
      }

      // Check if any vault rule requires approval
      // (handled by requires_approval flag in vault_access_rules)
      // This check is done inside resolveVaultTokens for individual secrets,
      // but we surface it here for the response
      resolvedArgs = vaultResult.resolvedArgs;
    }

    // ── EXISTING: Log the decision (with vault metadata) ───────────
    await pool.query(
      "INSERT INTO auditlogs (tenantid, agentid, toolname, parameters, decision, riskscore, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [tenantId, agentId, toolName,
       JSON.stringify(args || {}), // Log ORIGINAL args (with tokens, not real secrets)
       decision,
       decision === "DENY" ? 90 : (decision === "REQUIRE_APPROVAL" ? 60 : 10),
       hasVaultTokens ? JSON.stringify({
         vaultSecretsInjected: vaultResult?.injectedSecrets || [],
         vaultTokensDetected: true,
       }) : null
      ]
    );

    // ── Build response ─────────────────────────────────────────────
    const response: any = {
      decision,
      reason: decision === "ALLOW" ? "No restrictions matched" : `Matched rule ${matchedRule}`,
    };

    // If vault tokens were resolved, include the resolved arguments
    // so the SDK can use them for the actual tool execution
    if (hasVaultTokens && vaultResult?.success) {
      response.resolvedArguments = resolvedArgs;
      response.vaultInjected = true;
      response.injectedSecrets = vaultResult.injectedSecrets; // names only, not values
      // The SDK will use resolvedArguments for execution
      // and scrubSecrets list for post-execution response scrubbing
    }

    res.json(response);
  } catch (e) {
    console.error("Evaluation error:", e);
    res.status(500).json({ decision: "DENY", reason: "Internal Server Error" });
  }
};
```

**Critical design notes:**
- The audit log ALWAYS records the ORIGINAL arguments (with `$SUPRAWALL_VAULT_*` tokens), NEVER the decrypted values
- The decrypted values are only passed in the HTTP response to the SDK, which uses them in-memory for the tool call
- The response includes `injectedSecrets` (names) so the SDK knows which secrets to scrub from the tool response

### Step 3.4: Add response scrub endpoint

**File:** `/suprawall-server/src/policy.ts` (add new endpoint)

The SDK calls this after tool execution to scrub the response before returning it to the LLM:

```typescript
// New endpoint: POST /v1/scrub
export const scrubToolResponse = async (req: Request, res: Response) => {
  try {
    const { tenantId, secretNames, toolResponse } = req.body;

    if (!secretNames || secretNames.length === 0) {
      return res.json({ scrubbedResponse: toolResponse });
    }

    // Look up the secret values for scrubbing
    const secretValues: string[] = [];
    for (const name of secretNames) {
      const result = await pool.query(
        `SELECT pgp_sym_decrypt(encrypted_value, $1) as value
         FROM vault_secrets
         WHERE tenant_id = $2 AND secret_name = $3`,
        [process.env.VAULT_ENCRYPTION_KEY, tenantId || "default-tenant", name]
      );
      if (result.rows.length > 0) {
        secretValues.push(result.rows[0].value);
      }
    }

    const scrubbed = scrubResponse(toolResponse, secretValues);
    res.json({ scrubbedResponse: scrubbed });
  } catch (e) {
    console.error("Scrub error:", e);
    res.json({ scrubbedResponse: "[SCRUB_ERROR: Response redacted for safety]" });
  }
};
```

Register in `index.ts`:
```typescript
import { evaluatePolicy, scrubToolResponse } from "./policy";
app.post("/v1/scrub", scrubToolResponse);
```

---

## Phase 4: TypeScript SDK Changes

**File:** `/suprawall-sdk/src/index.ts`

### Step 4.1: Add vault token detection

Add this constant near the top of the file:

```typescript
const VAULT_TOKEN_PATTERN = /\$SUPRAWALL_VAULT_[A-Z][A-Z0-9_]+/;
```

### Step 4.2: Modify the evaluation call flow

Find the existing function that calls the `/v1/evaluate` endpoint (it's in the `withSupraWall()` or middleware wrapper). Modify the flow:

```typescript
// BEFORE (simplified existing flow):
// 1. Agent generates tool call
// 2. SDK calls POST /v1/evaluate with { agentId, toolName, arguments }
// 3. If ALLOW → execute tool with original arguments
// 4. If DENY → return error to agent
// 5. If REQUIRE_APPROVAL → wait for approval

// AFTER (with vault support):
// 1. Agent generates tool call
// 2. SDK calls POST /v1/evaluate with { agentId, toolName, arguments }
// 3. Server returns { decision, resolvedArguments?, vaultInjected?, injectedSecrets? }
// 4. If DENY → return error to agent
// 5. If REQUIRE_APPROVAL → wait for approval, then re-check
// 6. If ALLOW + vaultInjected:
//    a. Execute tool with resolvedArguments (contains real secrets)
//    b. Call POST /v1/scrub with { secretNames, toolResponse }
//    c. Return scrubbed response to agent
// 7. If ALLOW (no vault) → execute tool with original arguments (unchanged)
```

Add this logic after receiving the evaluation response:

```typescript
// After getting evaluation response from server
const evalResponse = await fetch(`${baseUrl}/v1/evaluate`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
  body: JSON.stringify({ agentId, toolName, arguments: args, tenantId })
}).then(r => r.json());

if (evalResponse.decision === "DENY") {
  // Existing deny logic
  return { error: evalResponse.reason };
}

// Determine which arguments to use for execution
const executionArgs = evalResponse.vaultInjected
  ? evalResponse.resolvedArguments  // Use vault-resolved arguments
  : args;                           // Use original arguments

// Execute the tool with the appropriate arguments
const toolResult = await executeTool(toolName, executionArgs);

// If vault secrets were injected, scrub the response
if (evalResponse.vaultInjected && evalResponse.injectedSecrets?.length > 0) {
  const scrubResult = await fetch(`${baseUrl}/v1/scrub`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      tenantId,
      secretNames: evalResponse.injectedSecrets,
      toolResponse: toolResult
    })
  }).then(r => r.json());

  return scrubResult.scrubbedResponse;
}

return toolResult;
```

### Step 4.3: Add client-side scrubbing fallback

If the server scrub endpoint is unreachable, the SDK should have a local fallback that strips the resolved arguments from the response:

```typescript
function localScrub(response: any, resolvedArgs: any, originalArgs: any): any {
  // Extract values that differ between resolved and original args
  const originalStr = JSON.stringify(originalArgs);
  const resolvedStr = JSON.stringify(resolvedArgs);

  if (originalStr === resolvedStr) return response;

  let responseStr = typeof response === "string" ? response : JSON.stringify(response);

  // Find all values in resolvedArgs that contain secret material
  // (values that don't exist in originalArgs)
  const secretValues = extractDiffValues(originalArgs, resolvedArgs);
  for (const sv of secretValues) {
    if (typeof sv === "string" && sv.length > 4) {
      responseStr = responseStr.split(sv).join("[REDACTED]");
    }
  }

  return typeof response === "string" ? responseStr : JSON.parse(responseStr);
}
```

---

## Phase 5: Python SDK Changes

**File:** `/suprawall-python/suprawall/gate.py`

### Step 5.1: Add vault token detection

```python
import re

VAULT_TOKEN_PATTERN = re.compile(r"\$SUPRAWALL_VAULT_[A-Z][A-Z0-9_]+")
```

### Step 5.2: Modify the evaluation flow in `with_agent_gate` / `SupraWallMiddleware`

Apply the same logic as the TypeScript SDK:

```python
# In the middleware check() or intercept() method:

async def check(self, tool_name: str, args: dict, execute_fn):
    """Evaluate policy and handle vault injection."""

    eval_response = await self._call_evaluate(tool_name, args)

    if eval_response["decision"] == "DENY":
        raise PolicyDeniedError(tool_name, eval_response.get("reason", ""))

    if eval_response["decision"] == "REQUIRE_APPROVAL":
        raise ApprovalRequiredError(tool_name, eval_response.get("approvalId"))

    # Determine execution arguments
    execution_args = (
        eval_response["resolvedArguments"]
        if eval_response.get("vaultInjected")
        else args
    )

    # Execute the tool
    result = await execute_fn(tool_name, execution_args)

    # Scrub response if vault secrets were injected
    if eval_response.get("vaultInjected") and eval_response.get("injectedSecrets"):
        result = await self._scrub_response(
            eval_response["injectedSecrets"],
            result
        )

    return result

async def _scrub_response(self, secret_names: list, tool_response):
    """Call server to scrub secret traces from tool response."""
    try:
        resp = await self._http.post(
            f"{self.base_url}/v1/scrub",
            json={
                "tenantId": self.tenant_id,
                "secretNames": secret_names,
                "toolResponse": tool_response,
            },
        )
        return resp.json().get("scrubbedResponse", tool_response)
    except Exception:
        # Fallback: if scrub endpoint fails, return generic redacted response
        log.warning("Vault scrub endpoint unreachable — returning redacted response")
        return "[Response redacted — vault scrub unavailable]"
```

### Step 5.3: Update the LangChain callback

**File:** `/suprawall-python/suprawall/langchain.py`

The `SupraWallLangChainCallback` class hooks into LangChain's `on_tool_start` / `on_tool_end` callbacks. Modify:

```python
# In on_tool_start:
# 1. Call /v1/evaluate
# 2. If vaultInjected, store resolvedArguments and injectedSecrets on the instance
# 3. Replace the tool input with resolvedArguments

# In on_tool_end:
# 1. If injectedSecrets were stored, call /v1/scrub on the tool output
# 2. Replace the tool output with the scrubbed version
# 3. Clear the stored secrets
```

---

## Phase 6: Dashboard Vault UI

**Location:** `/dashboard/src/app/dashboard/vault/`

### Step 6.1: Create the Vault page layout

**New file:** `/dashboard/src/app/dashboard/vault/page.tsx`

This page has 3 tabs: **Secrets**, **Access Rules**, **Access Log**

```
Vault  [Secrets]  [Access Rules]  [Access Log]

┌─────────────────────────────────────────────────┐
│  Your AI agents never see real secrets.          │
│  Supra-wall injects credentials at runtime.     │
└─────────────────────────────────────────────────┘

[+ Create Secret]

┌──────────────────────────────────────────────────────────────┐
│  Secret Name        │ Description          │ Expires │ Last  │
│                     │                      │         │Rotated│
├──────────────────────────────────────────────────────────────┤
│  STRIPE_PROD_KEY    │ Production Stripe key │ Never   │ 2d ago│
│  [Rotate] [Delete]  │                      │         │       │
├──────────────────────────────────────────────────────────────┤
│  SENDGRID_API_KEY   │ Email service key     │ 30 days │ 5d ago│
│  [Rotate] [Delete]  │                      │         │       │
└──────────────────────────────────────────────────────────────┘
```

### Step 6.2: Create Secret modal

When user clicks [+ Create Secret]:

```
┌─ Create Secret ──────────────────────────────────┐
│                                                    │
│  Secret Name: [STRIPE_PROD_KEY____________]       │
│  (Must be UPPER_SNAKE_CASE, letters + numbers)    │
│                                                    │
│  Secret Value: [sk_live_4829342934________]       │
│  (Encrypted at rest — never visible again)        │
│                                                    │
│  Description: [Production Stripe API key__]       │
│                                                    │
│  Expires: [Never ▼] / [Custom date picker]        │
│                                                    │
│  Agent Token:                                     │
│  ┌────────────────────────────────────────┐       │
│  │ $SUPRAWALL_VAULT_STRIPE_PROD_KEY       │ [Copy]│
│  └────────────────────────────────────────┘       │
│  Give this token to your agent's prompt.          │
│  Supra-wall will replace it at runtime.           │
│                                                    │
│  [Cancel]                      [Create Secret]    │
└───────────────────────────────────────────────────┘
```

After creation, show the vault token (`$SUPRAWALL_VAULT_<SECRET_NAME>`) that the developer should put in their agent's system prompt or tool config. This token is safe to expose — it's just a placeholder.

### Step 6.3: Access Rules tab

```
[Access Rules]

┌──────────────────────────────────────────────────────────────┐
│  Agent           │ Secret           │ Allowed Tools │ Rate   │
├──────────────────────────────────────────────────────────────┤
│  Payments Agent  │ STRIPE_PROD_KEY  │ process_payment, │ 50/hr │
│                  │                  │ refund_payment   │       │
│  [Edit] [Delete] │                  │                  │       │
├──────────────────────────────────────────────────────────────┤
│  Email Agent     │ SENDGRID_API_KEY │ send_email       │ 100/hr│
│  [Edit] [Delete] │                  │                  │       │
└──────────────────────────────────────────────────────────────┘

[+ Create Rule]
```

### Step 6.4: Create Access Rule modal

```
┌─ Create Access Rule ─────────────────────────────┐
│                                                    │
│  Agent: [Select agent ▼]                          │
│                                                    │
│  Secret: [Select secret ▼]                        │
│                                                    │
│  Allowed Tools:                                   │
│  [process_payment] [×]  [refund_payment] [×]      │
│  [Add tool pattern...]                            │
│                                                    │
│  Rate Limit: [100] uses per hour                  │
│                                                    │
│  ☐ Require human approval before injecting        │
│    (Combines with REQUIRE_APPROVAL policy)        │
│                                                    │
│  [Cancel]                      [Create Rule]      │
└───────────────────────────────────────────────────┘
```

### Step 6.5: Access Log tab

```
[Access Log]

Filter: [All agents ▼] [All actions ▼] [Last 7 days ▼]

┌──────────────────────────────────────────────────────────────┐
│  Timestamp           │ Agent     │ Secret     │ Tool    │ Act│
├──────────────────────────────────────────────────────────────┤
│  2026-03-12 10:32:14 │ payments  │ STRIPE_KEY │ pay...  │ ✅ │
│  2026-03-12 10:31:58 │ email     │ SENDGRID   │ send    │ ✅ │
│  2026-03-12 10:30:01 │ scraper   │ STRIPE_KEY │ bash    │ ❌ │
│  (DENIED: tool 'bash' not in allowed list)                   │
│  2026-03-12 10:28:44 │ payments  │ STRIPE_KEY │ pay...  │ ⚠️ │
│  (RATE_LIMITED: 51/50 per hour)                              │
└──────────────────────────────────────────────────────────────┘
```

Action icons: ✅ INJECTED, ❌ DENIED, ⚠️ RATE_LIMITED, ⏰ EXPIRED, ❓ NOT_FOUND

### Step 6.6: Add Vault to sidebar navigation

**File:** `/dashboard/src/app/dashboard/layout.tsx`

Add a new sidebar link with a Lock icon:

```tsx
// Add between Compliance and Settings:
{ name: "Vault", href: "/dashboard/vault", icon: Lock }
```

---

## Phase 7: Integration Tests

**New directory:** `/suprawall-server/tests/vault/`

### Test cases to implement:

```
✅ vault-crud.test.ts
  ├── Creates a secret and returns metadata (no value)
  ├── Lists secrets without exposing encrypted values
  ├── Rotates a secret and updates last_rotated_at
  ├── Deletes a secret and cascades to access rules
  ├── Rejects duplicate secret names per tenant
  └── Rejects invalid secret name format

✅ vault-injection.test.ts
  ├── Detects $SUPRAWALL_VAULT_* tokens in tool arguments
  ├── Resolves tokens when agent has access
  ├── Denies when agent lacks access rule
  ├── Denies when tool is not in allowed_tools list
  ├── Denies when secret has expired
  ├── Denies when rate limit is exceeded
  ├── Fails closed (DENY) if any token fails to resolve
  ├── Handles multiple vault tokens in a single call
  ├── Does not modify arguments with no vault tokens
  └── Logs every vault access with correct action

✅ vault-scrubber.test.ts
  ├── Scrubs exact secret value from response string
  ├── Scrubs base64-encoded secret from response
  ├── Scrubs URL-encoded secret from response
  ├── Scrubs partial secret matches (first 8 chars)
  ├── Handles JSON response objects
  ├── Returns original response when no secrets to scrub
  └── Does not corrupt non-secret data in response

✅ vault-ratelimit.test.ts
  ├── Allows calls within rate limit
  ├── Blocks calls exceeding rate limit
  ├── Resets rate limit on new hour window
  └── Tracks rate limits per agent+secret combination

✅ vault-e2e.test.ts
  ├── Full flow: create secret → create rule → evaluate with token → get resolved args
  ├── Full flow: agent without access → DENY
  ├── Full flow: correct tool → INJECT, wrong tool → DENY
  ├── Full flow: secret rotation → next call gets new value
  └── Full flow: response scrubbing removes all traces
```

---

## Phase 8: Documentation + Plugin Update

### Step 8.1: Update the Supra-wall plugin

Add a new command to the plugin: `/vault-setup`

**New file in plugin:** `commands/vault-setup.md`

```yaml
---
name: vault-setup
description: Guide the user through setting up Supra-wall Vault — create secrets, access rules, and configure their agent's system prompt to use vault tokens instead of real credentials.
---
```

### Step 8.2: Update the supra-wall-integration skill

Add a Vault section to `/skills/supra-wall-integration/SKILL.md` covering:
- How to create a secret in the dashboard
- How to write the agent's system prompt with vault tokens
- How to create access rules
- Example: securing a Stripe key with JIT injection
- Example: securing user PII with vault + REQUIRE_APPROVAL

### Step 8.3: Add a blog post topic to the A1 queue

Add to the blog content queue:
- Post 10: *"Why Your AI Agent Should Never Know Your API Keys — JIT Secret Injection Explained"*
- Target keyword: "AI agent secret management" / "AI agent API key security"

### Step 8.4: Update llms.txt and llms-full.txt

Add the Vault capability to the entity description so LLMs learn about it:

```
## Vault: JIT Secret Injection
Supra-wall Vault provides Just-In-Time secret injection for AI agents.
Agents use symbolic tokens ($SUPRAWALL_VAULT_*) instead of real credentials.
Supra-wall replaces tokens with real secrets at execution time and scrubs
all traces from responses. The agent never sees, stores, or can leak
the actual credential.
```

---

## Security Checklist (Before Launch)

- [ ] `VAULT_ENCRYPTION_KEY` is stored in env vars, not in code or database
- [ ] Encrypted values are NEVER returned by any API endpoint (list, get, search)
- [ ] Audit logs NEVER contain decrypted secret values
- [ ] Response scrubber handles: exact match, base64, URL-encoded, partial, hex
- [ ] Rate limiting works correctly per agent per secret per hour window
- [ ] Expired secrets are rejected before decryption
- [ ] Cascade delete: removing a secret removes all associated access rules
- [ ] SDK fallback: if scrub endpoint fails, response is fully redacted (not leaked)
- [ ] All vault API routes require authentication (tenantId verification)
- [ ] Secret creation enforces UPPER_SNAKE_CASE naming pattern
- [ ] Vault access log captures every attempt (successful and failed)
- [ ] No secret value appears in any server log (console.log, error handlers)
- [ ] SQL injection prevention: all queries use parameterized statements (already the case)
- [ ] The encryption key can be rotated (re-encrypt all secrets procedure documented)

---

## Environment Variables Required

```env
# Add to .env for local development:
VAULT_ENCRYPTION_KEY=<generate with: openssl rand -hex 32>

# In production (Vercel/Docker):
# Set VAULT_ENCRYPTION_KEY as an environment secret
# Never commit this value to source control
```

---

## NPM Dependencies to Add

```bash
# Server — no new dependencies needed
# pgcrypto is a PostgreSQL extension, not an npm package
# The existing `pg` package handles all database operations

# If you want to add client-side encryption as a defense-in-depth layer:
cd suprawall-server && npm install tweetnacl tweetnacl-util
# (optional — pgcrypto handles encryption server-side)
```

---

## File Summary

| File | Action | Phase |
|------|--------|-------|
| `suprawall-server/src/db.ts` | MODIFY — add vault tables to initDb() | 1 |
| `suprawall-server/src/vault.ts` | CREATE — vault resolver module | 3 |
| `suprawall-server/src/scrubber.ts` | CREATE — response scrubber module | 3 |
| `suprawall-server/src/policy.ts` | MODIFY — add vault injection to evaluatePolicy | 3 |
| `suprawall-server/src/routes/vault.ts` | CREATE — vault CRUD API routes | 2 |
| `suprawall-server/src/index.ts` | MODIFY — register vault router + scrub endpoint | 2, 3 |
| `suprawall-sdk/src/index.ts` | MODIFY — add vault-aware evaluation flow | 4 |
| `suprawall-python/suprawall/gate.py` | MODIFY — add vault-aware evaluation flow | 5 |
| `suprawall-python/suprawall/langchain.py` | MODIFY — vault support in LangChain callback | 5 |
| `dashboard/src/app/dashboard/vault/page.tsx` | CREATE — Vault dashboard page | 6 |
| `dashboard/src/app/dashboard/layout.tsx` | MODIFY — add Vault to sidebar | 6 |
| `suprawall-server/tests/vault/*.test.ts` | CREATE — 5 test files | 7 |
| `supra-wall-plugin/commands/vault-setup.md` | CREATE — vault setup command | 8 |
| `supra-wall-plugin/skills/supra-wall-integration/SKILL.md` | MODIFY — add vault section | 8 |
| `dashboard/public/llms.txt` | MODIFY — add vault to entity definition | 8 |
| `dashboard/public/llms-full.txt` | MODIFY — add vault technical details | 8 |

**Total new files:** 8
**Total modified files:** 8
**Estimated implementation time:** 5–7 days solo
