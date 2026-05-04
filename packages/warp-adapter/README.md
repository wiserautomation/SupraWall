# suprawall-warp-adapter

Reference adapter for [Warp's `warp.agent_policy_hook.v1`](https://github.com/warpdotdev/warp/pull/9957) — connects Warp's agent policy hook system to SupraWall's local policy engine.

## Quickstart

1. **Install:** `pip install suprawall-warp-adapter`
2. **Write a policy:** copy `examples/policy.suprawall.yaml` and edit the rules.
3. **Configure Warp:** add the adapter to your Agent Profile (see `examples/warp_profile_config.md`).
4. **Run:** Warp spawns the adapter automatically when a governed action fires.
5. **Audit:** decisions are logged as JSONL to the adapter's stderr.

## Supported action surfaces

| Action | Example deny |
|---|---|
| `execute_command` | `rm -rf /` blocked by `no-destructive-shell` |
| `write_files` | Write to `/etc/passwd` blocked by `no-write-outside-cwd` |
| `call_mcp_tool` | Tool args containing `sk-…` blocked by `no-secret-exfil` |
| `read_files` | Configurable via custom policy rules |
| `read_mcp_resource` | Configurable via custom policy rules |

## Known limitations

- HTTP transport not yet supported (stdio only). Planned for v0.2.
- Requires Warp PR #9957 to be merged before hooks are dispatched by stock Warp.
- Policy file is loaded at startup; hot-reload planned for v0.2.
