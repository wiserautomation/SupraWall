# SPEC_NOTES.md — warp.agent_policy_hook.v1 contract

**Source:** warpdotdev/warp PR #9957 (`Add agent policy hooks enforcement`)
**Branch tip:** `97c11d3`
**PR status as of 2026-05-04:** Draft — awaiting maintainer agreement on design; linked issue #10029 opened by @etherman-os.
**Automated review:** oz-for-oss bot — Approved with 2 minor suggestions; 0 critical / 0 important issues.
**Human review:** @zachbai noted lack of prior design agreement on a 9k-line implementation. No Warp staff member has formally commented beyond this.

---

## Gate 1 — v1 event schema

### Top-level event (`AgentPolicyEvent`)

Source: `app/src/ai/policy_hooks/event.rs`

```json
{
  "schema_version": "warp.agent_policy_hook.v1",
  "event_id": "<uuid>",
  "conversation_id": "<string>",
  "action_id": "<string>",
  "action_kind": "<snake_case enum — see below>",
  "working_directory": "<string | omitted if null>",
  "run_until_completion": true,
  "hook_autoapproval_enabled": false,
  "active_profile_id": "<string | omitted if null>",
  "warp_permission": {
    "decision": "allow | ask | deny",
    "reason": "<string | omitted>"
  },
  "action": { ... }
}
```

`action_kind` enum values (serde `snake_case`):
- `execute_command`
- `write_to_long_running_shell_command`
- `read_files`
- `write_files`
- `call_mcp_tool`
- `read_mcp_resource`

### Action payloads

**execute_command**
```json
{
  "command": "<redacted string>",
  "normalized_command": "<redacted string>",
  "is_read_only": true,
  "is_risky": false
}
```
(`is_read_only` and `is_risky` omitted when null)

**write_to_long_running_shell_command**
```json
{
  "block_id": "<string>",
  "input": "<string>",
  "mode": "<string>"
}
```

**read_files**
```json
{
  "paths": ["<redacted path>", ...],
  "omitted_path_count": 3
}
```
(`omitted_path_count` omitted when 0)

**write_files**
```json
{
  "paths": ["<redacted path>", ...],
  "omitted_path_count": 0,
  "diff_stats": {
    "files_changed": 2,
    "additions": 10,
    "deletions": 4
  }
}
```
(`diff_stats` and `omitted_path_count` omitted when null/0)

**call_mcp_tool**
```json
{
  "server_id": "<uuid | omitted>",
  "tool_name": "<redacted string>",
  "argument_keys": ["key_a", "key_b"],
  "omitted_argument_key_count": 0
}
```

**read_mcp_resource**
```json
{
  "server_id": "<uuid | omitted>",
  "name": "<redacted string>",
  "uri": "<redacted string | omitted>"
}
```

### Response shape (`AgentPolicyHookResponse`)

Source: `app/src/ai/policy_hooks/decision.rs`

```json
{
  "schema_version": "warp.agent_policy_hook.v1",
  "decision": "allow | deny | ask",
  "reason": "<string | omitted>",
  "external_audit_id": "<string | omitted>"
}
```

Decision composition (from `compose_policy_decisions`):
1. First `deny` from any hook wins — overrides everything.
2. Hard Warp `deny` wins over hook allows.
3. First `ask` from hooks elevates to `ask` if no denial.
4. Hook `allow` can auto-approve a Warp `ask` only when `hook_autoapproval_enabled=true` AND all hooks returned clean `allow` with no errors.

---

## Gate 2 — PR status (2026-05-04)

- PR #9957 is **Draft** — @etherman-os converted it to draft pending maintainer agreement.
- Latest commit: `97c11d3` (all security hardening applied).
- Bot review (oz-for-oss): Approved — 2 minor suggestions, all addressed in latest commits.
- @zachbai (maintainer): noted missing prior design agreement, no further action yet.
- **No Warp staff have formally approved or engaged beyond @zachbai's initial note.**
- **No competing third-party adapter has appeared on the thread.**
- **Strategic position: clear.** We can proceed.

---

## Gate 3 — Transport

Source: `app/src/ai/policy_hooks/engine.rs` + `config.rs`

### Stdio (building this first)

Framing: **newline-delimited JSON**
- Warp writes `<json-bytes>\n` to the adapter's **stdin**.
- Adapter must write `<json-bytes>\n` to **stdout**.
- Stderr from the adapter is captured (capped at 64 KB) for debugging — never parsed.
- Max event payload: **128 KB** (enforced by `CappedEventWriter` before dispatch).
- Max response: **64 KB** per stream.
- Timeout: 1–60,000 ms; default **5,000 ms**.
- On timeout/crash/non-zero exit/malformed response → `unavailable_behavior` decision (default: `ask`).

Config shape in AIExecutionProfile:
```json
{
  "agent_policy_hooks": {
    "enabled": true,
    "before_action": [
      {
        "name": "suprawall-warp-adapter",
        "transport": "stdio",
        "command": "python",
        "args": ["-m", "suprawall_warp", "--policy-file", "/path/to/policy.yaml"],
        "timeout_ms": 5000,
        "on_unavailable": "ask"
      }
    ]
  }
}
```

### HTTP (deferred to v0.2)

- POST body: same JSON payload.
- Header: `x-warp-agent-policy-event-id: <event_id>`.
- Content-Type: `application/json`.
- Response capped at 64 KB with content-length pre-flight check.
- HTTPS required for non-localhost targets.
- Credentials via `${ENV_VAR}` references only.

**Decision: Build stdio first.** The test suite and spec are more thoroughly exercised for stdio. HTTP deferred.

---

## Gate 4 — SDK gaps

Source: `packages/sdk-python/suprawall/local_policy.py` + `firewall.py`

### What `LocalPolicyEngine.check()` does

```python
def check(self, tool_name: str, args: Any) -> Optional[dict]:
```
- Returns `None` → **allow**
- Returns rule dict `{"name": str, "description": str, ...}` → **deny**
- No `ask` support — only allow/deny.
- No audit data emitted — violations raise `SupraWallBlocked` in `wrap_with_firewall`, but `check()` itself just returns.

### SDK gaps for this adapter

1. **`ask` semantics missing.** Rules can only `allow` (no match) or `deny` (match). The adapter must add `ask` support: a YAML rule with `action: ask` should return a structured "ask" decision rather than denying.  
   Plan: extend `LocalPolicyEngine` to read an optional `action` field from each rule (default `deny`). When `action: ask`, return the rule with `{"action": "ask", ...}` instead of treating it as a hard block. Change is ~20 lines in `local_policy.py`.

2. **Audit emission missing.** `check()` returns no audit ID. The adapter will generate a UUID audit ID itself and log a JSONL audit record to stderr (per the out-of-scope decision for v0.1).

3. **`check()` takes `tool_name + args` but Warp sends structured action objects.** The `policy_bridge.py` layer will map each Warp action type to a synthetic tool name and args string that the existing rule patterns can match against.

**Scope assessment:** The `ask` extension is ~20 lines, non-breaking (existing rules without `action:` field default to `deny`). Within the ~50-line threshold — safe to proceed without re-scoping.
