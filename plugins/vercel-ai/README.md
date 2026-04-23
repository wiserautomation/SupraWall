# suprawall-vercel-ai

Official [SupraWall](https://supra-wall.com) security integration for the **Vercel AI SDK**.

Wraps your `tools` object so every tool execution is policy-checked by SupraWall before the underlying tool runs — auth, rate-limits, destructive-action approvals, and tamper-proof audit logs in one line.

## Install

```bash
npm install suprawall-vercel-ai
```

## Quick start

Get a free API key at [supra-wall.com](https://supra-wall.com).

```typescript
import { withSupraWall } from "suprawall-vercel-ai";
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const tools = {
  refund: tool({
    description: "Refund a customer order",
    parameters: z.object({ orderId: z.string(), amount: z.number() }),
    execute: async ({ orderId, amount }) => {
      return await processRefund(orderId, amount);
    },
  }),
};

// One line — every tool call is now policy-checked
const secured = withSupraWall(tools, {
  apiKey: process.env.SUPRAWALL_API_KEY,
  agentId: "support-agent",
});

await generateText({
  model: openai("gpt-4o"),
  tools: secured,
  prompt: "Refund order #4821 for $120",
});
```

## Policy decisions

| Decision           | Behavior                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `ALLOW`            | Tool executes normally                                            |
| `DENY`             | Tool throws; the model sees the error and can retry or escalate   |
| `REQUIRE_APPROVAL` | Tool throws and a human-approval request opens in your dashboard  |

## Environment variables

| Variable               | Default                                  | Purpose                  |
| ---------------------- | ---------------------------------------- | ------------------------ |
| `SUPRAWALL_API_KEY`    | _(required)_                             | Your account API key     |
| `SUPRAWALL_API_URL`    | `https://api.supra-wall.com/v1/evaluate` | Policy server endpoint   |

## Links

- Docs: [docs.supra-wall.com](https://docs.supra-wall.com)
- Dashboard: [app.supra-wall.com](https://app.supra-wall.com)
- GitHub: [wiserautomation/SupraWall](https://github.com/wiserautomation/SupraWall)
- Issues: [github.com/wiserautomation/SupraWall/issues](https://github.com/wiserautomation/SupraWall/issues)

Licensed under Apache-2.0.
