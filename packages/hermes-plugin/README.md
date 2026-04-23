# SupraWall × Hermes Agent Plugin 🛡️🧱

Deterministic security enforcement for [Hermes Agent](https://github.com/NousResearch/Hermes-Agent).

This plugin wraps the [SupraWall Python SDK](https://github.com/wiserautomation/SupraWall/tree/main/packages/sdk-python) to provide production-grade guardrails, budget protection, and secret management for your autonomous agent.

## Features

- **Audit Trails**: Logs every tool call and result preview for full observability.
- **PII Scrubbing**: Automatically redacts emails, phone numbers, and SSNs from tool results.
- **Budget Caps**: Enforces hard USD limits per session to prevent runaway agent costs.
- **Vault Injection**: Allows Hermes to retrieve secrets securely via `suprawall_vault_get`.
- **Pre-execution Gating**: Blocks dangerous actions (DENY) or pauses for human approval (HITL).
- **Slash Commands**: `/suprawall status` visibility directly in CLI/Discord/Telegram.

## Installation

### Method 1: Hermes Skills Hub (Recommended)
```bash
hermes skills install suprawall/security
```

### Method 2: Manual Installation
1. Clone this repository.
2. Link or copy the `suprawall_hermes` folder into your Hermes plugins directory:
```bash
cp -r packages/hermes-plugin/suprawall_hermes ~/.hermes/plugins/
```

## Configuration

Enable the plugin in your `~/.hermes/config.yaml`:

```yaml
plugins:
  enabled:
    - suprawall-security
```

Set your environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPRAWALL_API_KEY` | Your SupraWall API key (sw_...) | **Required** |
| `SUPRAWALL_MAX_COST_USD` | Hard budget cap per session | `None` |
| `SUPRAWALL_FAIL_MODE` | `fail-open` or `fail-closed` | `fail-closed` |
| `SUPRAWALL_TENANT_ID` | Tenant ID for vault lookups | `default-tenant` |

## Usage

### Slash Commands
- `/suprawall status` - Show current shield and budget status.
- `/suprawall audit` - Show the last 10 tool calls.
- `/suprawall budget` - Show current session spend.

### Tools for Hermes
Hermes can automatically use these tools if policies require them:
- `suprawall_vault_get`: Retrieve secrets (e.g., "Get my GITHUB_TOKEN from vault").
- `suprawall_check`: Proactively check a dangerous action before execution.

## License
Apache-2.0
