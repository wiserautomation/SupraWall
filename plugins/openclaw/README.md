# suprawall-claw

Official [SupraWall](https://supra-wall.com) security integration for **OpenClaw** autonomous browser agents.

Intercepts every click, keystroke, and navigation before it happens — runs each action against your SupraWall policies and blocks, requires approval, or allows based on the decision. Same deterministic policy layer you use for LangChain or Vercel AI, now for browser agents.

## Install

```bash
npm install suprawall-claw
```

Requires `suprawall` (installed as a direct dependency).

## Quick start

Get a free API key at [supra-wall.com](https://supra-wall.com).

```typescript
import { secureClaw } from "suprawall-claw";
import { Clawbot } from "openclaw";

const agent = new Clawbot(browser);

const secured = secureClaw(agent, {
  apiKey: process.env.SUPRAWALL_API_KEY!,
  onNetworkError: "fail-closed", // recommended in production
});

// Every action now passes through policy
await secured.execute("Click 'Delete Project'");
// throws → blocked by SupraWall policy
```

## What you can enforce

- **DOM guards** — block interaction with selectors like `.delete-btn` or `input[type="password"]`
- **Session protection** — prevent agents from reading `document.cookie` or `localStorage`
- **Egress control** — whitelist allowed domains (`*.github.com`, etc.)
- **Human-in-the-loop** — pause high-risk transactions for approval in the dashboard
- **Audit log** — tamper-proof record of every intercepted action for compliance

## Fail-open vs fail-closed

```typescript
// Development default — allow if SupraWall is unreachable
secureClaw(agent, { apiKey, onNetworkError: "fail-open" });

// Production recommended — block if SupraWall is unreachable
secureClaw(agent, { apiKey, onNetworkError: "fail-closed" });
```

## Links

- Docs: [docs.supra-wall.com](https://docs.supra-wall.com)
- Dashboard: [app.supra-wall.com](https://app.supra-wall.com)
- GitHub: [wiserautomation/SupraWall](https://github.com/wiserautomation/SupraWall)
- Issues: [github.com/wiserautomation/SupraWall/issues](https://github.com/wiserautomation/SupraWall/issues)

Licensed under Apache-2.0.
