# Programmatic Agent Management API Guide | SupraWall

Secure, govern, and audit your AI agents programmatically. This API allows AI Engineers and Platform Teams to bootstrap secured agents with built-in guardrails, vault access, and cost controls—directly from CI/CD, Terraform, or internal scripts.

## Overview

The SupraWall Programmatic API (Admin SDK) follows a dual-key model:
- **Master API Key (`sw_admin_...`)**: Tenant-level key used to create/revoke agents and manage policies.
- **Agent API Key (`ag_...`)**: Scoped key used by the agent at runtime to evaluate security policies.

## 🚀 Quick Start

### 1. Identify your Master API Key
Get your `sw_admin_xxxx` key from the SupraWall Dashboard settings.

### 2. Create a Secured Agent
Deploy an agent with budget limits and tool restrictions in a single `POST` request.

**Endpoint**: `POST /v1/agents`  
**Auth**: `Authorization: Bearer sw_admin_your_key`

```json
{
  "name": "content-writer-prod",
  "scopes": ["read:*", "write:content"],
  "guardrails": {
    "budget": { 
      "limitUsd": 5.00, 
      "resetPeriod": "monthly" 
    },
    "blockedTools": ["bash", "delete_all"],
    "policies": [
      {
        "name": "Human Approval for High Cost",
        "toolName": "gpt-4-research",
        "ruleType": "REQUIRE_APPROVAL",
        "description": "Any research task over $1 needs human sign-off."
      }
    ],
    "vault": [
      {
        "secretName": "API_KEY_EXAMPLE",
        "allowedTools": ["processor"],
        "requiresApproval": true
      }
    ]
  }
}
```

**Response**:
```json
{
  "id": "agt_8fK2mN...",
  "apiKey": "ag_xxxxxxxxxxx",
  "name": "content-writer-prod",
  "createdAt": "2024-03-22T20:00:00Z"
}
```

## 🛡️ Key Features

### Programmatic Guardrails
Stop agent loops and prevent budget overruns before they happen.
- **Budget Limits**: Set hard caps on LLM spend per agent.
- **Tool Level Policies**: Block dangerous tools (`DENY`) or insert human-in-the-loop gates (`REQUIRE_APPROVAL`).

### Secure Vault Injection
Inject secrets into your agents without the agent (or your logs) ever seeing the raw credential.
- **Least Privilege**: Grant access to specific secrets only for specific tools.
- **Zero-Trust**: Use `$SUPRAWALL_VAULT_NAME` placeholders in your tool calls.

### Batch Management
- **List Agents**: `GET /v1/agents`
- **Revoke Access**: `DELETE /v1/agents/:id`
- **Update Limits**: `PATCH /v1/agents/:id/guardrails`

## 💻 Integration Example (Node.js)

```javascript
const response = await fetch('https://api.supra-wall.com/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sw_admin_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "autonomous-researcher",
    guardrails: { budget: { limitUsd: 10 } }
  })
});

const { apiKey } = await response.json();
// Use this apiKey in your LangGraph/CrewAI agent!
```

## ☁️ AWS Marketplace Integration

SupraWall supports native AWS Marketplace SaaS and Container fulfillment.

### 1. Registration
When a customer subscribes via AWS Marketplace, they are redirected to:
`POST /v1/aws/register?x-amzn-marketplace-token=...`

This endpoint exchanges the token for an AWS `CustomerIdentifier` and provisions a new SupraWall tenant with either `developer` or `business` tier defaults based on the offer.

### 2. Entitlement Logic
Entitlements are automatically managed via SNS notifications:
`POST /v1/aws/sns`

Handles:
- `subscribe-success`: Activate tenant
- `unsubscribe-success`: Downgrade to `open_source` tier
- `entitlement-updated`: Upgrade/Downgrade based on new plan selection

### 3. Metering
Usage-based billing is reported via the `BatchMeterUsage` API. Every `ALLOW` decision on the `/v1/evaluate` endpoint counts towards the monthly metered dimension.

---

*SupraWall - The Security Layer for Autonomous AI.*
*Keywords: AI Agent Security, LLM Guardrails, Programmatic AI Governance, Agent Audit Logs, Secure Tool Use, AWS Marketplace AI Guardrail.*
