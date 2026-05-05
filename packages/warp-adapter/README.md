# suprawall-warp-adapter

Reference adapter connecting [Warp's `warp.agent_policy_hook.v1`](https://github.com/warpdotdev/warp/pull/9957) to [SupraWall's local policy engine](https://supra-wall.com). When Warp's agent proposes a shell command, file write, or MCP tool call, this adapter intercepts it — evaluating it against your policy rules before any action executes.

> **Status:** Requires [Warp PR #9957](https://github.com/warpdotdev/warp/pull/9957) to be merged into a stable Warp build before hook dispatch is active. The adapter itself is fully spec-complete and tested against the v1 schema today.

---

## Quickstart

1. **Install the adapter**

   ```bash
   pip install suprawall-warp-adapter
   # or from source:
   pip install -e packages/warp-adapter
   ```

2. **Write a policy file**

   Copy [`examples/policy.suprawall.yaml`](examples/policy.suprawall.yaml) to a local path and edit the rules. Rules support `action: deny` (default) and `action: ask` (routes to Warp's confirmation UI).

   ```yaml
   rules:
     - name: no-destructive-shell
       description: Destructive shell commands are blocked.
       tool_pattern: '(?i)\b(shell_exec|bash|terminal)\b'
       args_pattern: '(?i)(rm\s+-[rfRF]+|mkfs|dd\s+if=)'

     - name: ask-production-writes
       description: Production config changes require human confirmation.
       tool_pattern: '(?i)\b(write_file|file_write)\b'
       args_pattern: 'production'
       action: ask
   ```

3. **Configure the Warp Agent Profile**

   Add the adapter to your profile's `agent_policy_hooks` block (see [`examples/warp_profile_config.md`](examples/warp_profile_config.md) for the full JSON):

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

4. **Test locally**

   ```bash
   python -c "import json,pathlib; print(json.dumps(json.loads(pathlib.Path('packages/warp-adapter/tests/fixtures/shell_exec_dangerous.json').read_text())))" \
     | python -m suprawall_warp --policy-file examples/policy.suprawall.yaml
   # → {"schema_version":"warp.agent_policy_hook.v1","decision":"deny","reason":"...","external_audit_id":"<uuid>"}
   ```

5. **Enable in Warp and run an agent session**

   With the profile active and PR #9957 merged, Warp spawns the adapter automatically. Audit records (JSONL) are written to the adapter's stderr.

---

## Supported action surfaces

| Surface | Warp `action_kind` | Example deny |
|---|---|---|
| Shell command | `execute_command` | `rm -rf /` → denied by `no-destructive-shell` |
| Long-running shell input | `write_to_long_running_shell_command` | Input containing `dd if=/dev/zero` |
| File write | `write_files` | Write to `/etc/passwd` → denied by `no-write-outside-cwd` |
| File read | `read_files` | Configurable via custom rules |
| MCP tool call | `call_mcp_tool` | Tool args with `sk-…` key → denied by `no-secret-exfil` |
| MCP resource read | `read_mcp_resource` | Configurable via custom rules |

---

## Decision semantics

The adapter returns one of three decisions per the `warp.agent_policy_hook.v1` spec:

| Decision | Meaning | How to configure |
|---|---|---|
| `allow` | No rule matched — proceed | Default when no rule fires |
| `deny` | Hard block — action does not execute | Rule with no `action:` field, or `action: deny` |
| `ask` | Route to Warp's confirmation UI | Rule with `action: ask` |

Warp composes the adapter's decision with its own permission model. A hook `allow` cannot override a hard Warp denial.

---

## CLI reference

```
python -m suprawall_warp [OPTIONS]

Options:
  --policy-file PATH      Path to YAML policy file (default: built-in safe policy)
  --log-level LEVEL       DEBUG | INFO | WARNING | ERROR (default: INFO)
  --timeout-ms MS         Max ms per evaluation, 1–60000 (default: 5000)
  --on-unavailable BEHAVIOR  allow | deny | ask on timeout/error (default: ask)
```

All output goes to stderr. Stdout is the protocol channel (newline-delimited JSON).

---

## Known limitations

- **HTTP transport not supported.** Stdio only. HTTP planned for v0.2.
- **Requires Warp PR #9957 to be merged** before hooks are dispatched by a stock Warp build.
- **Policy file loaded at startup.** Hot-reload planned for v0.2.
- **Audit records go to stderr.** Configurable audit sinks (SIEM, SupraWall pipeline) planned for v0.2.

---

## Related

- [SupraWall](https://supra-wall.com) — AI agent security and compliance
- [Warp PR #9957](https://github.com/warpdotdev/warp/pull/9957) — Agent Policy Hooks spec
- [SupraWall SDK](../sdk-python/) — The underlying policy engine this adapter wraps
