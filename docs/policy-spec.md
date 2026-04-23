# SupraWall Policy Specification (v1.0)

SupraWall policies are deterministic security guardrails that intercept AI agent tool calls at the boundary. They are defined in JSON or YAML.

## Quick Example: `langchain-safe.json`

```json
{
  "$schema": "https://schema.supra-wall.com/v1/policy.schema.json",
  "name": "LangChain Safe",
  "version": "1.0.0",
  "rules": [
    {
      "name": "No rm -rf",
      "tool": "bash",
      "action": "DENY",
      "condition": {
        "type": "regex",
        "pattern": "rm -rf"
      },
      "message": "Destructive bash commands are blocked."
    }
  ]
}
```

## Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `$schema` | `string` | Link to the JSON Schema for IDE support. |
| `name` | `string` | **Required.** Human-readable name of the policy. |
| `version` | `string` | **Required.** SemVer version of the policy. |
| `description` | `string` | Optional summary of the policy's purpose. |
| `rules` | `array` | **Required.** List of security rules to evaluate. |

### Rule Object

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Short name for the rule (e.g., "Block SSN"). |
| `tool` | `string` | **Required.** Pattern to match the tool name. Supports `*` wildcards (e.g., `database:*`, `*`). |
| `action` | `enum` | **Required.** `ALLOW`, `DENY`, or `REQUIRE_APPROVAL`. |
| `condition` | `object` | Optional regex or string match on the tool's JSON arguments. |
| `message` | `string` | Custom error message returned when the rule triggers. |

## Layer 1 vs Layer 2

SupraWall operates in two distinct layers:
- **Layer 1 (Deterministic):** Evaluates local regex/glob rules defined in your policy file. High performance (<1.2ms), zero network, and completely OSS.
- **Layer 2 (Semantic):** AI-powered pattern detection and behavioral analysis. Requires an API key and calls `api.supra-wall.com`.

Local policies (Layer 1) **always take precedence** over cloud policies.

## Validation

Test your policies locally using the SupraWall CLI:

```bash
npx suprawall validate ./my-policy.json --tool "bash" --args '{"query": "ls"}'
```
