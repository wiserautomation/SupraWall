# SupraWall Policy Reference

Policies are JSON (or YAML) files that define deterministic ALLOW / DENY / REQUIRE_APPROVAL rules for AI agent tool calls. The policy engine runs in under 2 ms, offline, with no LLM in the loop.

## Quickstart

```bash
npx suprawall init   # interactive bootstrap — generates a policy for your stack
```

Or load a built-in starter:

```python
from suprawall import wrap_with_firewall
safe_agent = wrap_with_firewall(agent, policy="policies/langchain-safe.json")
```

## Policy file format

```json
{
  "$schema": "https://schema.supra-wall.com/v1/policy.schema.json",
  "name": "My Policy",
  "version": "1.0.0",
  "rules": [
    {
      "name":         "rule-id",
      "description":  "Human-readable explanation shown in SupraWallBlocked.reason",
      "tool_pattern": "regex matched against the tool name (omit to match all tools)",
      "args_pattern": "regex matched against the serialised tool arguments",
      "action":       "DENY | REQUIRE_APPROVAL"
    }
  ]
}
```

### Fields

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Unique rule identifier. Appears in `SupraWallBlocked.policy`. |
| `description` | ✅ | Human-readable reason. Appears in `SupraWallBlocked.reason`. |
| `tool_pattern` | — | Regex against the tool name. Omit (or `null`) to match every tool. |
| `args_pattern` | — | Regex against the JSON-serialised arguments. |
| `action` | ✅ | `DENY` raises `SupraWallBlocked`. `REQUIRE_APPROVAL` pauses and notifies. |

Both `tool_pattern` and `args_pattern` must match for the rule to fire. If `tool_pattern` is omitted, only `args_pattern` is checked.

## Built-in policies

| File | Protects against |
|---|---|
| [`langchain-safe.json`](../policies/langchain-safe.json) | `rm -rf`, `.env` reads, unwhitelisted shell |
| [`pii-protection.json`](../policies/pii-protection.json) | SSN, CC, email exfiltration |
| [`eu-ai-act-audit.json`](../policies/eu-ai-act-audit.json) | Human-in-the-loop for high-risk tools |
| [`budget-guardrail.json`](../policies/budget-guardrail.json) | Token + cost circuit breakers |
| [`role-based-access.json`](../policies/role-based-access.json) | Per-agent budgets, role-scoped tool access |

## Writing a custom rule

Block any tool from reading `.env` files:

```json
{
  "name": "no-env-reads",
  "description": "Agents may not read .env or credentials files.",
  "tool_pattern": "(?i)\\b(read_file|open_file|cat)\\b",
  "args_pattern": "(?i)(\\.env|credentials\\.json|\\.aws/credentials)",
  "action": "DENY"
}
```

Require human approval before sending email:

```json
{
  "name": "approve-outbound-email",
  "description": "All outbound emails require human sign-off.",
  "tool_pattern": "(?i)\\b(send_email|smtp_send|mail)\\b",
  "args_pattern": ".*",
  "action": "REQUIRE_APPROVAL"
}
```

## YAML format

```yaml
name: My Policy
version: "1.0.0"
rules:
  - name: no-destructive-shell
    description: Block rm -rf and other destructive shell patterns.
    tool_pattern: '(?i)\b(shell|bash|terminal)\b'
    args_pattern: 'rm\s+-[rfRF]'
    action: DENY
```

Requires `pip install pyyaml`. Pass the path:

```python
safe_agent = wrap_with_firewall(agent, policy="my-policy.yaml")
```

## dry_run mode

Log violations without raising — useful for tuning a policy before enforcing it:

```python
safe_agent = wrap_with_firewall(agent, dry_run=True)
```

Violations appear as `WARNING` log lines prefixed `[SupraWall] [DRY-RUN]`.
