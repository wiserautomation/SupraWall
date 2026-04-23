# suprawall-langchain

Official [SupraWall](https://supra-wall.com) security integration for **LangChain.js** and **LangGraph** (TypeScript).

Deterministic policy enforcement for AI agents — auth, rate-limits, destructive-action approvals, and tamper-proof audit logs. Built for teams shipping autonomous agents that must stay compliant with **EU AI Act (Art. 9, 12, 14)**, SOC2, and ISO27001.

## Install

```bash
npm install suprawall-langchain
```

## Quick start

Get a free API key at [supra-wall.com](https://supra-wall.com).

```typescript
import { SupraWallCallbackHandler } from "suprawall-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";

const sw = new SupraWallCallbackHandler({
  apiKey: process.env.SUPRAWALL_API_KEY,
  agentId: "support-agent",
});

const llm = new ChatOpenAI({ model: "gpt-4o" });
const agent = await createReactAgent({ llm, tools, prompt });

const executor = new AgentExecutor({
  agent,
  tools,
  callbacks: [sw],
});

await executor.invoke({ input: "refund customer #4821" });
```

## One-line wrapper

```typescript
import { secureChain } from "suprawall-langchain";

const secured = secureChain(chain, process.env.SUPRAWALL_API_KEY!);
```

## Policy decisions

| Decision           | Behavior                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `ALLOW`            | Tool executes normally                                            |
| `DENY`             | Tool throws; the agent sees the error and can retry or escalate   |
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
