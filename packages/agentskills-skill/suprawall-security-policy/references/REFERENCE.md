# SupraWall Security Policy — Complete Reference

## Installation

### Hermes Agent
```bash
pip install suprawall-hermes
# Add to ~/.hermes/config.yaml:
# plugins:
#   enabled:
#     - suprawall-security
export SUPRAWALL_API_KEY=sw_your_key_here
```

### LangChain
```bash
pip install langchain-suprawall
```
```python
from langchain_suprawall import SupraWallCallbackHandler
callback = SupraWallCallbackHandler()
agent_executor = AgentExecutor(..., callbacks=[callback])
```

### CrewAI
```bash
pip install suprawall-sdk
```
```python
from suprawall.gate import SupraWallMiddleware
middleware = SupraWallMiddleware(options)
```

## Full Configuration Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SUPRAWALL_API_KEY` | string | — | **Required.** API key starting with `sw_` |
| `SUPRAWALL_URL` | string | `https://www.supra-wall.com/api/v1/evaluate` | Policy engine endpoint |
| `SUPRAWALL_FAIL_MODE` | `fail-closed` \| `fail-open` | `fail-closed` | Behavior when SupraWall is unreachable |
| `SUPRAWALL_MAX_COST_USD` | float | None | Hard budget cap per session |
| `SUPRAWALL_ALERT_USD` | float | None | Soft alert threshold |
| `SUPRAWALL_MAX_ITERATIONS` | int | None | Max tool calls before circuit breaker |
| `SUPRAWALL_LOOP_DETECTION` | bool | `true` | Block identical consecutive tool calls |
| `SUPRAWALL_TENANT_ID` | string | `default-tenant` | Tenant ID for vault and policies |

## Policy Decisions

| Decision | Meaning | Agent Action |
|----------|---------|--------------|
| `ALLOW` | Action permitted | Execute the tool |
| `DENY` | Action blocked | Do not execute; report to user |
| `REQUIRE_APPROVAL` | Human must approve | Pause; notify user to approve in dashboard |

## PII Types Scrubbed Automatically

The `post_tool_call` hook scrubs these from all tool results before they reach the LLM:
- Email addresses (`user@example.com` → `[EMAIL_REDACTED]`)
- Phone numbers (`+1 555-123-4567` → `[PHONE_REDACTED]`)
- US SSNs (`123-45-6789` → `[SSN_REDACTED]`)
- Credit card numbers (`4111 1111 1111 1111` → `[CC_REDACTED]`)

## Dashboard Links

- Policy management: https://app.supra-wall.com/dashboard/policies
- Vault management: https://app.supra-wall.com/dashboard/vault
- Audit logs: https://app.supra-wall.com/dashboard/audit
- Budget settings: https://app.supra-wall.com/dashboard/settings

## Support

- Documentation: https://supra-wall.com/docs
- GitHub: https://github.com/wiserautomation/SupraWall
- Discord: https://discord.gg/suprawall
