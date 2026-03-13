# suprawall

The security gateway for AI agents.
Enforce authentication, rate limiting, and policy controls between
users and AI agents — in one line of code.

## Install

```bash
npm install suprawall-sdk
```

## Quickstart

Get your free API key at https://suprawall.ai/

```typescript
import { withSUPRA_WALL } from "suprawall-sdk";

const secured = withSUPRA_WALL(myAgent, {
  apiKey: "ag_your_key_here",
});

// Use exactly like before — every tool call is now policy-checked
await secured.executeTool("delete_file", { path: "/etc/passwd" });
```

## MCP middleware

```typescript
import { createSUPRA_WALLMiddleware } from "suprawall";

const gate = createSUPRA_WALLMiddleware({ apiKey: "ag_your_key_here" });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  return gate(req.params.name, req.params.arguments, () =>
    myToolHandler(req)
  );
});
```

## Fail-open vs Fail-closed

```typescript
// Development default — allow if SUPRA_WALL unreachable
withSUPRA_WALL(agent, { apiKey: "ag_xxx", onNetworkError: "fail-open" });

// Production recommended — block if SUPRA_WALL unreachable
withSUPRA_WALL(agent, { apiKey: "ag_xxx", onNetworkError: "fail-closed" });
```

## Policy decisions

| Decision | Behaviour |
| -------- | --------- |
| ALLOW    | Tool executes normally |
| DENY     | Tool blocked, error returned to agent |
| REQUIRE_APPROVAL | Tool paused, human approves in dashboard |

## SUPRA_WALL Connect (multi-tenant)

If you are a SaaS platform managing agents for your customers,
use Connect sub-keys (`agc_` prefix) to enforce per-customer policies.

## Links

Dashboard: https://suprawall.ai/
GitHub: https://github.com/wiserautomation/suprawall
Issues: https://github.com/wiserautomation/suprawall/issues
