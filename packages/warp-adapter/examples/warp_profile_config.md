# Wiring suprawall-warp-adapter into a Warp AIExecutionProfile

This document describes how to configure a Warp Agent Profile to use the
SupraWall adapter as a policy hook.

> **Requirement:** Warp PR #9957 (`Add agent policy hooks enforcement`) must
> be merged and available in your Warp build before this configuration does
> anything. The adapter binary runs but no events will be dispatched by a
> stock Warp build.

## Step 1 — Install the adapter

```bash
pip install suprawall-warp-adapter
# or editable install from the repo:
pip install -e packages/warp-adapter
```

Verify:

```bash
echo '{}' | python -m suprawall_warp --help
```

## Step 2 — Write a policy file

Copy `examples/policy.suprawall.yaml` from this repo to a local path, e.g.
`~/.config/suprawall/policy.yaml`. Edit the rules to match your team's policy.

## Step 3 — Configure the Warp profile

In your Warp Agent Profile JSON (location TBD pending PR merge — expected to
be `~/.warp/profiles/<name>.json` or a project-level `.warp/profile.json`):

```json
{
  "agent_policy_hooks": {
    "enabled": true,
    "before_action": [
      {
        "name": "suprawall-warp-adapter",
        "transport": "stdio",
        "command": "python",
        "args": [
          "-m", "suprawall_warp",
          "--policy-file", "/Users/you/.config/suprawall/policy.yaml",
          "--log-level", "INFO",
          "--timeout-ms", "5000",
          "--on-unavailable", "ask"
        ],
        "timeout_ms": 5000,
        "on_unavailable": "ask"
      }
    ]
  }
}
```

### Transport notes

- `transport: "stdio"` — Warp spawns `python -m suprawall_warp` as a subprocess.
  Events arrive as newline-delimited JSON on its stdin; responses are read from stdout.
- Logs from the adapter go to **stderr only** — stdout is reserved for the protocol.
- The adapter process is long-lived; Warp keeps it alive for the session.

## Step 4 — Test with a dry run

```bash
cat packages/warp-adapter/tests/fixtures/shell_exec_dangerous.json \
  | python -m suprawall_warp \
      --policy-file examples/policy.suprawall.yaml \
      --log-level DEBUG
```

Expected stdout (one line):

```json
{"schema_version":"warp.agent_policy_hook.v1","decision":"deny","reason":"Shell commands with destructive patterns (rm -rf, dd, mkfs, etc.) are blocked.","external_audit_id":"<uuid>"}
```

## Step 5 — Enable in Warp and run an agent session

With the profile active, start a Warp Agent session. Any shell command, file
write, or MCP tool call matching your policy will be intercepted before
execution. Audit records are written to the adapter's stderr.
