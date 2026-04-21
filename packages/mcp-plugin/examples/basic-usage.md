# Basic Usage of SupraWall MCP Plugin

This guide shows how to manually use the tools provided by the SupraWall MCP plugin.

## 1. Check Policy
Before executing a tool, you should check if it's allowed:

```json
{
  "name": "check_policy",
  "arguments": {
    "agent_id": "my_claude_agent",
    "tool_name": "execute_shell_command",
    "parameters": { "command": "rm -rf /" }
  }
}
```

## 2. Request Approval
If a policy check returns `REQUIRE_APPROVAL`, use this tool:

```json
{
  "name": "request_approval",
  "arguments": {
    "agent_id": "my_claude_agent",
    "action_description": "Execute dangerous shell command: rm -rf /",
    "risk_level": "critical"
  }
}
```

## 3. Log Action
Finally, log the outcome for auditability:

```json
{
  "name": "log_action",
  "arguments": {
    "agent_id": "my_claude_agent",
    "action": "execute_shell_command",
    "outcome": "denied"
  }
}
```
