# PR Description: Add SupraWall Callback Handler Integration Guide

## Summary
This PR adds documentation for the **SupraWall** integration, a deterministic security and compliance layer for LangChain agents. SupraWall provides a `SupraWallLangChainCallback` that allows developers to:
- Enforce human-in-the-loop approvals for destructive tools.
- Maintain tamper-evident audit logs (essential for EU AI Act compliance).
- Block prompt injections at the tool-execution level.

## Changes
- Added `docs/integrations/callbacks/suprawall.mdx`
- Updated the callbacks overview page to include SupraWall.

## Documentation Content Preview
### SupraWall
[SupraWall](https://www.supra-wall.com) provides enterprise-grade governance for AI agents.

```typescript
import { SupraWallLangChainCallback } from "@suprawall/langchain";

const callback = new SupraWallLangChainCallback({
  apiKey: process.env.SUPRAWALL_API_KEY,
  agentId: "customer-support-bot"
});

// Attach to agent executor
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  callbacks: [callback]
});
```

## Related Package
The integration relies on the official `@suprawall/langchain` package.
