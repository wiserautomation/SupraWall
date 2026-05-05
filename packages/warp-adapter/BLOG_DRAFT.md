# BLOG DRAFT — For Alejandro to review and publish

**Target URL:** `supra-wall.com/en/blog/warp-agent-policy-hooks-adapter`
**Target length:** ~900 words
**Do not publish until:**
- [ ] SupraWall PR is merged to `main`
- [ ] Alejandro has reviewed this draft
- [ ] All internal links verified live (check items marked ⚠️ below)
- [ ] Phase 4 live-testing done OR title updated to reflect spec-only state

**Current framing:** spec-complete against commit `97c11d3`. All claims about behavior are grounded in spec-testing against fixtures, not a live Warp build. If Phase 4 completes before publication, update the "Status" section and any framing around "pending live integration."

---

# Building a reference adapter against Warp's Agent Policy Hooks spec

[@etherman-os](https://github.com/etherman-os) proposed something useful in [Warp PR #9957](https://github.com/warpdotdev/warp/pull/9957): a vendor-neutral integration point that lets an external policy engine intercept Warp Agent actions before they execute. Shell commands, file writes, MCP tool calls — all of them, with a structured JSON protocol and three possible decisions: `allow`, `deny`, or `ask`.

We built a reference adapter against that spec. Here's what the implementation looked like, and what we found.

## Status

The adapter is spec-complete against PR #9957 commit `97c11d3`. All behavior described below was tested against the v1 schema using fixture events; live integration testing against an actual Warp build is pending the PR moving out of Draft status. We'll update this post when Phase 4 is complete.

## Why Warp's hook design is the right approach

Warp already has strong local controls — command allowlists, denylists, MCP allowlists. But those are user-level controls that influence what the agent is allowed to do based on Warp's built-in rules. They don't give teams a first-class integration point for external policy enforcement.

The hook spec solves this differently: it's a **host-enforced preflight check**. The agent proposes an action, Warp builds a redacted event and sends it to your policy process via stdin, your process responds with a decision, and Warp enforces it — before any action executes. The agent model cannot bypass it. "Run until completion" still invokes the hooks; that's an explicit invariant in the spec.

## The contract

The v1 event schema is clean. Each event is a newline-delimited JSON object on stdin:

```json
{
  "schema_version": "warp.agent_policy_hook.v1",
  "event_id": "11111111-...",
  "action_kind": "execute_command",
  "warp_permission": { "decision": "ask" },
  "action": {
    "command": "rm -rf /home/user/project/dist",
    "normalized_command": "rm -rf /home/user/project/dist",
    "is_risky": true
  }
}
```

Your adapter writes one response per event to stdout:

```json
{
  "schema_version": "warp.agent_policy_hook.v1",
  "decision": "deny",
  "reason": "Shell commands with destructive patterns are blocked.",
  "external_audit_id": "<your-audit-uuid>"
}
```

Transport: **newline-delimited JSON over stdio**. Warp spawns your process, pipes events to stdin, reads decisions from stdout, captures stderr for debugging. Your stdout is the protocol channel — nothing else goes there.

## What we built

The adapter ([`packages/warp-adapter/`](https://github.com/wiserautomation/SupraWall/tree/main/packages/warp-adapter)) maps all six Warp action surfaces to SupraWall's `LocalPolicyEngine`:

| Warp surface | Policy check |
|---|---|
| `execute_command` | `check("shell_exec", normalized_command)` |
| `write_to_long_running_shell_command` | `check("shell_exec", input)` |
| `read_files` | `check("file_read", path)` per path |
| `write_files` | `check("write_file", path)` per path |
| `call_mcp_tool` | `check(tool_name, argument_keys)` |
| `read_mcp_resource` | `check("mcp_resource", uri)` |

The policy engine ships with rules that block `rm -rf`, system path writes, and credential patterns. Each action surface gets its own explicit mapper — no single generic dispatch that obscures what's happening.

## Implementing `ask`

The spec supports three decisions: `allow`, `deny`, and `ask`. `ask` routes the action to Warp's confirmation UI with your reason attached, rather than hard-blocking. The existing SupraWall rule format only had `allow` (no match) and `deny` (match), so we added one YAML field:

```yaml
- name: ask-production-writes
  description: Production config changes require human confirmation.
  tool_pattern: '(?i)\b(write_file)\b'
  args_pattern: 'production'
  action: ask
```

Rules without `action:` default to `deny` — no existing rules break. The SDK change was about 20 lines.

## What we noticed in the spec

**The decision composition is well-designed.** In `decision.rs`, deny wins over everything, ask escalates, and a hook `allow` can optionally auto-approve a Warp `ask` when `hook_autoapproval_enabled` is set. The precedence matches the product spec's invariants precisely.

**`external_audit_id` is underrated.** It lets your policy engine correlate Warp events to your own audit trail without Warp needing to know your audit schema. The adapter generates a UUID per evaluation and emits a JSONL record to stderr.

**One path worth verifying:** The product spec says an `ask` decision's reason should appear in Warp's confirmation UI "even if the user clicked while the hook was still pending" (§ Testable Behavior Invariants, point 4). That requires threading the hook result back into a UI prompt that may already be visible — a subtle concurrency path that we didn't see covered in the test fixtures. Worth a targeted test before merge.

## Try it

```bash
# Install from source (not yet on PyPI — published after live integration verification)
git clone https://github.com/wiserautomation/SupraWall.git
cd SupraWall/packages/warp-adapter
pip install -e .

# Test against a fixture — compacts the JSON to a single line per the protocol
python -c "import json,pathlib; print(json.dumps(json.loads(pathlib.Path('tests/fixtures/shell_exec_dangerous.json').read_text())))" \
  | python -m suprawall_warp --policy-file examples/policy.suprawall.yaml
```

Expected output:
```
{"schema_version":"warp.agent_policy_hook.v1","decision":"deny","reason":"Shell commands with destructive patterns...","external_audit_id":"<uuid>"}
```

The full adapter is at [github.com/wiserautomation/SupraWall/tree/main/packages/warp-adapter](https://github.com/wiserautomation/SupraWall/tree/main/packages/warp-adapter). ⚠️ Verify this link resolves after merging the PR to main.

---

*SupraWall is the open-source deterministic firewall for AI agents. [supra-wall.com](https://supra-wall.com)* ⚠️ Confirm this URL is live before publishing.
