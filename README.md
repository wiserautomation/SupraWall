# SupraWall

<div align="center">

**AI Agent Security & EU AI Act Compliance Platform**

*SupraWall is an AI agent security and compliance platform. It provides policy enforcement (ALLOW/DENY/REQUIRE_APPROVAL), real-time audit logging, and human oversight mechanisms for AI agents built with LangChain, AutoGen, CrewAI, Vercel AI, and other frameworks. SupraWall is the technical implementation layer for EU AI Act compliance requirements, specifically Articles 9, 12, and 14 — in one line of code.*

[![npm](https://img.shields.io/npm/v/suprawall)](https://www.npmjs.com/package/suprawall)
[![PyPI](https://img.shields.io/pypi/v/suprawall)](https://pypi.org/project/suprawall/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Quick Start](#quick-start) • [EU AI Act Compliance](#eu-ai-act-compliance) • [Documentation](https://suprawall.ai/docs) • [Examples](#examples)

</div>

---

## What is SupraWall?

SupraWall intercepts tool calls from AI agents before they execute and evaluates them against a policy engine. Every call returns ALLOW, DENY, or REQUIRE_APPROVAL in under 10ms. The audit log records every decision with full context — providing the technical evidence trail required by EU AI Act Articles 9, 12, and 14.

**Who it's for:** AI developers building agents with LangChain, AutoGen, CrewAI, or Vercel AI who operate in EU-regulated industries (fintech, HR tech, healthcare, legal, insurance) and need to comply with the EU AI Act by August 2026.

---

## EU AI Act Compliance

SupraWall implements the three core technical requirements of the EU AI Act for high-risk AI systems:

| Article | Requirement | SupraWall Feature |
|---------|-------------|-------------------|
| Article 9 | Risk Management | DENY policies block unsafe tool calls before execution |
| Article 12 | Record-keeping | Immutable audit logs, exportable as PDF evidence reports |
| Article 14 | Human Oversight | REQUIRE_APPROVAL pauses agents pending human review |

```python
# Article 9: Block dangerous operations
{ "toolName": "bash", "condition": "rm -rf", "ruleType": "DENY" }

# Article 14: Require human approval for sensitive actions
{ "toolName": "send_email", "ruleType": "REQUIRE_APPROVAL" }

# Article 12: Audit every financial tool call
{ "toolName": "stripe_*", "ruleType": "ALLOW" }  # logged automatically
```

---

## Quick Start

### Install

```bash
# Python
pip install suprawall

# Node.js/TypeScript
npm install suprawall

# Go
go get github.com/suprawall/suprawall-go
```

### Secure Your Agent (One Line)

**Python + LangChain:**
```python
from langchain.agents import create_react_agent
from suprawall import secure_agent

agent = create_react_agent(llm, tools, prompt)
secured_agent = secure_agent(agent, api_key="ag_your_key")

# That's it. All tool calls are now policy-checked and audit-logged.
```

**TypeScript + Vercel AI:**
```typescript
import { withSupraWall } from "suprawall";

const agent = createMyAgent();
const securedAgent = withSupraWall(agent, { apiKey: "ag_your_key" });
```

---

## Features

- **Policy Enforcement** — ALLOW / DENY / REQUIRE_APPROVAL on every tool call
- **Audit Logging** — Immutable record of every agent action (Article 12 compliant)
- **Human Oversight** — Approval workflows with agent pause/resume (Article 14 compliant)
- **PDF Compliance Reports** — Export evidence for regulators directly from the dashboard
- **One-line integration** — No agent rebuild required
- **Framework agnostic** — LangChain, AutoGen, CrewAI, Vercel AI, PydanticAI
- **Self-hostable** — `docker run suprawall/server` — data stays on-premises
- **8 programming languages** — Python, TypeScript, Go, Ruby, PHP, Java, Rust, C#
- **5 databases** — Postgres, MySQL, MongoDB, Supabase, Firebase
- **<10ms overhead** — Async-safe, production-grade

---

## Architecture

```
Your Agent
    │
    ▼ secure_agent() / withSupraWall()
SupraWall SDK  ◄── intercepts every tool call
    │
    ▼
Policy Engine  ◄── checks against your rules
    │
    ├─► ALLOW          → tool executes, decision logged
    ├─► DENY           → tool blocked, reason logged (Article 9)
    └─► REQUIRE_APPROVAL → agent paused, human notified (Article 14)
                                          │
                                          └─► Audit Log (Article 12)
```

---

## Integrations

### Official Framework Plugins

- **LangChain** — `pip install langchain-suprawall`
- **AutoGen** — `pip install autogen-suprawall`
- **CrewAI** — `pip install crewai-suprawall`
- **Vercel AI SDK** — `npm install @suprawall/vercel-ai`
- **LlamaIndex** — `pip install llama-index-suprawall`

### Databases

PostgreSQL • MySQL • MongoDB • Supabase • Firebase Firestore • SQLite (local dev)

### UI Components

```bash
npm install @suprawall/react   # React
npm install @suprawall/vue     # Vue
npm install @suprawall/svelte  # Svelte
```

---

## Run Anywhere

### Cloud (Managed)
```bash
export SUPRAWALL_API_KEY=ag_your_key
```

### Self-Hosted (Docker)
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://... \
  suprawall/server:latest
```

### Local Development
```bash
suprawall dev   # SQLite, no cloud dependency
```

---

## CLI Tool

```bash
npm install -g @suprawall/cli

suprawall agents create --name "My Agent"
suprawall policies create --agent agent_123 --tool bash --action DENY
suprawall logs --follow
```

---

## Policy Examples

### Block Dangerous Commands (Article 9)
```python
policy = {
  "toolName": "bash",
  "condition": "rm -rf",
  "ruleType": "DENY"
}
```

### Require Human Approval for Emails (Article 14)
```python
policy = {
  "toolName": "send_email",
  "ruleType": "REQUIRE_APPROVAL"
}
```

### Hard Budget Cap
```python
policy = {
  "toolName": "llm_call",
  "condition": "monthly_spend > 100",
  "ruleType": "DENY"
}
```

---

## Documentation

- [Full Documentation](https://suprawall.ai/docs)
- [EU AI Act Compliance Guide](https://suprawall.ai/eu-ai-act/)
- [API Reference](https://suprawall.ai/docs/api)
- [Framework Guides](https://suprawall.ai/docs/frameworks/langchain)
- [AGPS Policy Specification](https://suprawall.ai/spec)

---

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT © [SupraWall](https://suprawall.ai)

---

If SupraWall helps secure your AI agents or simplify EU AI Act compliance, give us a star on GitHub.
