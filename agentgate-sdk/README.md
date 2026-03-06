# agentgate

The security gateway for AI agents.
Enforce authentication, rate limiting, and policy controls between
users and AI agents — in one line of code.

## Install

```bash
npm install agentgate-sdk
```

## Quickstart

Get your free API key at https://agentgate.ai/

```typescript
import { withAgentGate } from "agentgate-sdk";

const secured = withAgentGate(myAgent, {
  apiKey: "ag_your_key_here",
});

// Use exactly like before — every tool call is now policy-checked
await secured.executeTool("delete_file", { path: "/etc/passwd" });
```

## MCP middleware

```typescript
import { createAgentGateMiddleware } from "agentgate";

const gate = createAgentGateMiddleware({ apiKey: "ag_your_key_here" });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  return gate(req.params.name, req.params.arguments, () =>
    myToolHandler(req)
  );
});
```

## Fail-open vs Fail-closed

```typescript
// Development default — allow if AgentGate unreachable
withAgentGate(agent, { apiKey: "ag_xxx", onNetworkError: "fail-open" });

// Production recommended — block if AgentGate unreachable
withAgentGate(agent, { apiKey: "ag_xxx", onNetworkError: "fail-closed" });
```

## Policy decisions

| Decision | Behaviour |
| -------- | --------- |
| ALLOW    | Tool executes normally |
| DENY     | Tool blocked, error returned to agent |
| REQUIRE_APPROVAL | Tool paused, human approves in dashboard |

## AgentGate Connect (multi-tenant)

If you are a SaaS platform managing agents for your customers,
use Connect sub-keys (`agc_` prefix) to enforce per-customer policies.

## Links

Dashboard: https://agentgate.ai/
GitHub: https://github.com/wiserautomation/agentgate
Issues: https://github.com/wiserautomation/agentgate/issues
