# Testing Guide for SupraWall Plugin

## Local MCP Validation
Ensure you have the dependencies installed:
```bash
pip install -r requirements.txt
```

Run the MCP server in dev mode using the MCP CLI:
```bash
mcp dev mcp_server.py --env SUPRAWALL_API_KEY=your_test_key
```

## Integration Scenarios to Test
1. **The Fail-Safe**: Unset `SUPRAWALL_API_KEY`. Run `/suprawall-check`. It should return a `BLOCK` and a reason stating the plane is offline.
2. **The Interceptor**: Configure a policy on suprawall.ai to block `DELETE` commands. Attempt to run a tool with a `delete` payload. Verify the sub-agent halts the execution.
3. **The Audit**: After 3-4 calls, run `/suprawall-audit 5`. Verify timestamps and cryptographic hashes are present.
