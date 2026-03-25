# 🛡️ suprawall for OpenClaw

Secure your autonomous browser bots with a single line of code.

## Quickstart

### 1. Install

```bash
npm install @suprawall/claw
```

### 2. Secure your Agent

suprawall wraps your `OpenClaw` instance to intercept every click, type, and navigation action.

```typescript
import { secureClaw } from "@suprawall/claw";
import { Clawbot } from "openclaw";

// Initialize your agent
const agent = new Clawbot(browser);

// 🛡️ Attach suprawall Security
const secured = secureClaw(agent, {
  apiKey: "ag_your_api_key",
  onNetworkError: "fail-closed"
});

// Now, dangerous actions are automatically blocked based on your cloud policies
await secured.execute("Click 'Delete Project'"); 
// ❌ Error: Action blocked by suprawall policy.
```

## Key Features

- **DOM Guard**: Block interaction with specific selectors (e.g., `.delete-btn`, `input[type="password"]`).
- **Session Protection**: Prevent agents from accessing `document.cookie` or `localStorage` via the console.
- **Egress Control**: Whitelist allowed domains (e.g., only allow browsing on `*.github.com`).
- **Human-in-the-loop**: Pause navigation if a high-risk transaction is detected.

---
[Get your API Key](https://suprawall-rho.vercel.app/login) | [View Docs](https://suprawall-rho.vercel.app/docs/frameworks/openclaw)
