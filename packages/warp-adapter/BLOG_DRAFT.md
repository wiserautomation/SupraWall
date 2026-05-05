# BLOG DRAFT — For Alejandro to review and publish

**Target URL:** `supra-wall.com/en/blog/warp-agent-policy-hooks-adapter`
**Target length:** ~900 words
**Tone:** technical practitioner, not marketing
**Do not publish until:** SupraWall PR is merged to main AND Alejandro has reviewed the Warp PR comment draft

---

# Building a reference adapter for Warp's Agent Policy Hooks

Warp recently proposed a new capability in [PR #9957](https://github.com/warpdotdev/warp/pull/9957): **Agent Policy Hooks** — a vendor-neutral integration point that lets an external policy engine intercept Warp Agent actions before they execute. Shell commands, file writes, MCP tool calls — all of them, with a structured JSON protocol and three possible decisions: `allow`, `deny`, or `ask`.

We built a reference adapter for it. Here's what we learned.

## Why this matters

Warp already has strong local controls — command allowlists, denylists, MCP allowlists, "Run until completion" settings. But those are user-level controls. They don't provide a first-class integration point for teams that need **deterministic policy enforcement** independent of the agent model's reasoning.

The policy hook spec fills that gap. It's a host-enforced preflight check: the agent proposes an action, Warp sends a structured event to your policy process, your process responds with a decision, and Warp enforces it. The agent model cannot bypass it.

This is exactly what SupraWall's local policy engine is for.

## The contract

The v1 event schema (`warp.agent_policy_hook.v1`) is clean. Each event carries:

```json
{
  "schema_version": "warp.agent_policy_hook.v1",
  "event_id": "<uuid>",
  "action_kind": "execute_command",
  "warp_permission": { "decision": "ask" },
  "action": {
    "command": "rm -rf /home/user/project/dist",
    "normalized_command": "rm -rf /home/user/project/dist",
    "is_risky": true
  }
}
```

Your adapter responds with:

```json
{
  "schema_version": "warp.agent_policy_hook.v1",
  "decision": "deny",
  "reason": "Shell commands with destructive patterns are blocked.",
  "external_audit_id": "<your-audit-uuid>"
}
```

Transport: **newline-delimited JSON over stdio**. Warp spawns your process, writes events to its stdin, reads decisions from its stdout. Your stderr is captured for debugging but never parsed. Simple, robust, easy to test.

## What we built

The adapter ([`packages/warp-adapter/`](https://github.com/wiserautomation/SupraWall/tree/main/packages/warp-adapter)) maps all six Warp action surfaces to SupraWall's `LocalPolicyEngine`:

| Warp surface | Adapter maps to |
|---|---|
| `execute_command` | `engine.check("shell_exec", normalized_command)` |
| `write_to_long_running_shell_command` | `engine.check("shell_exec", input)` |
| `read_files` | `engine.check("file_read", path)` for each path |
| `write_files` | `engine.check("write_file", path)` for each path |
| `call_mcp_tool` | `engine.check(tool_name, argument_keys)` |
| `read_mcp_resource` | `engine.check("mcp_resource", uri)` |

Each mapper is a small, explicit function — five action surfaces, five functions. No generic dispatch that obscures what's happening.

The policy engine already ships with rules that block `rm -rf`, system path writes, and credential exfiltration. For the `ask` decision (Warp's human-in-the-loop path), we added a single YAML field: `action: ask`. A rule with `action: ask` routes the action to Warp's confirmation UI with the rule's reason attached, rather than hard-blocking.

```yaml
- name: ask-production-writes
  description: Production config changes require human confirmation.
  tool_pattern: '(?i)\b(write_file)\b'
  args_pattern: 'production'
  action: ask
```

The SDK change was 20 lines. Non-breaking — existing rules without `action:` still default to `deny`.

## What we learned from the spec

A few things stood out while building against commit `97c11d3`:

**The decision composition logic is well-designed.** Deny wins over everything, then ask escalates, then hook allow can optionally auto-approve a Warp ask (when `hook_autoapproval_enabled` is true). The precedence is explicit in `decision.rs` and matches the product spec's invariants.

**The `external_audit_id` field is underrated.** It lets your policy engine correlate Warp events to your own audit trail without Warp needing to know your audit schema. Our adapter generates a UUID per evaluation and logs a JSONL record to stderr. In v0.2, that'll route to the SupraWall audit pipeline.

**The `ask` + pending interaction is worth watching.** The product spec says the hook's reason should appear in Warp's confirmation UI "even if the user clicked while the hook was still pending." That requires threading the hook result into the UI layer while Warp is already showing a prompt. It's a subtle race condition — worth verifying that path is covered in the implementation.

## Running the adapter

```bash
pip install suprawall-warp-adapter

# Test against a fixture event
python -c "
import json, pathlib
event = json.loads(pathlib.Path('tests/fixtures/shell_exec_dangerous.json').read_text())
print(json.dumps(event))
" | python -m suprawall_warp --policy-file examples/policy.suprawall.yaml
```

Output:
```
{"schema_version":"warp.agent_policy_hook.v1","decision":"deny","reason":"Shell commands with destructive patterns (rm -rf, dd, mkfs, etc.) are blocked.","external_audit_id":"f6c576ab-..."}
```

## What's next

The adapter is spec-complete for stdio transport. HTTP transport and a TypeScript version are planned for v0.2. Phase 4 (live Warp session testing) is waiting on PR #9957 moving out of Draft status.

If you're building with Warp and want deterministic policy enforcement on agent actions, the adapter is ready to test today. The policy format is the same one SupraWall uses everywhere else — no new DSL to learn.

---

*SupraWall is the open-source deterministic firewall for AI agents. [supra-wall.com](https://supra-wall.com)*
