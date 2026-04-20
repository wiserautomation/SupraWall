<div align="center">

<img src="assets/logo.jpg" alt="SupraWall" width="120">

# SupraWall

### The rule of law for zero-human companies.

**A deterministic security perimeter for AI agents. One line of code. Open source.**

[![PyPI](https://img.shields.io/pypi/v/suprawall-sdk?label=pypi&color=B8FF00)](https://pypi.org/project/suprawall-sdk/)
[![npm](https://img.shields.io/npm/v/@suprawall/sdk?label=npm&color=B8FF00)](https://www.npmjs.com/package/@suprawall/sdk)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/wiserautomation/SupraWall?style=social)](https://github.com/wiserautomation/SupraWall)
[![AWS Marketplace](https://img.shields.io/badge/AWS%20Marketplace-Guardrail-232f3e.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/marketplace/pp/prodview-suprawall)

[Quickstart](#quickstart) · [How it works](#how-it-works) · [Frameworks](#works-with-any-agent-stack) · [**EU AI Act templates**](#eu-ai-act-compliance--shipped-not-promised) · [Cloud](#self-host-or-cloud) · [Docs](https://www.supra-wall.com/docs)

<!-- LAUNCH VIDEO — MP4 plays inline on github.com; GIF is the fallback for email/RSS/social cards -->
<video src="assets/launch-demo.mp4" autoplay loop muted playsinline width="760">
  <img src="assets/launch-demo.gif" alt="SupraWall intercepting a destructive tool call in real time" width="760">
</video>

*Paperclip gives your agents a company. SupraWall gives them a constitution.*

</div>

---

## Why this exists

AI agents now write code, spend money, query databases, and take real-world actions on your behalf — autonomously. The frameworks that orchestrate them (Paperclip, OpenClaw, LangChain, CrewAI, AutoGen, Claude Code) are excellent at *making them productive*. None of them are responsible for *making them safe*.

So agents do what unconstrained software has always done: leak credentials, run `DROP TABLE users`, exfiltrate PII, burn $40k overnight in OpenAI tokens, and fail every compliance audit you'll ever face under the EU AI Act.

SupraWall is a deterministic perimeter that wraps your agent — any agent — and intercepts every tool call **before it executes**. Not probabilistically. Not via another LLM. Not after the fact. At the boundary, in under 2ms, with a signed audit log.

> **It is not another guardrail model. It is the rule of law.**

And with the EU AI Act enforcement deadline on **August 2, 2026**, we ship [8 pre-built sector templates](#eu-ai-act-compliance--shipped-not-promised) covering every Annex III high-risk category — HR, healthcare, education, critical infrastructure, biometrics, law enforcement, migration, justice — plus a DORA template for financial services. Compliance by `pip install`, not by 200-page PDF.

---

## Quickstart

### Python

```bash
pip install suprawall-sdk
```

```python
from suprawall import secure_agent
from your_framework import build_agent  # LangChain, CrewAI, AutoGen, custom — doesn't matter

agent = secure_agent(build_agent(), policy="policies/langchain-safe.json")

# Dangerous tool call from a prompt-injected user message:
agent.invoke("DROP TABLE users")
# ⚡ SupraWall intercepted. BLOCKED. Audit log #A-00847 signed ✓
```

### TypeScript / Node

```bash
npm install @suprawall/sdk
```

```typescript
import { secureAgent } from "@suprawall/sdk";
import { agent } from "./my-agent";

const safe = secureAgent(agent, { policy: "./policies/langchain-safe.json" });
await safe.invoke("DROP TABLE users"); // BLOCKED — pre-execution
```

That's it. No proxy to deploy. No sidecar. No model fine-tune. The wrapper sits between the agent's reasoning loop and the tool runtime, where deterministic rules belong.

---

## How it works

Three layers, evaluated in order. Local policy always wins.

| # | Layer | Latency | What it does |
|---|---|---|---|
| 1 | **Pre-Execution Interception** | <1ms | Every tool call routed through SupraWall before the runtime sees it. Hard-coded — no LLM in the loop. |
| 2 | **Zero-Trust Policy Enforcement** | <2ms | Budget caps, PII scrubbing, SQL/shell injection blocks, credential vault, allow/deny lists — enforced as code, not as suggestions. |
| 3 | **Compliance Audit Trail** | async | Every decision RSA-signed, timestamped, exportable. Maps to EU AI Act Art. 9, 13, 14 out of the box. |

The semantic AI layer (Layer 2.5, optional, cloud-only) catches context-dependent attacks that regex can't see — but local deterministic policy is always the first and final word.

---

## Works with any agent stack

SupraWall is framework-agnostic. It wraps the *tool boundary*, which every agent has.

| Framework | Status | Plugin |
|---|---|---|
| [Paperclip](https://github.com/paperclipai/paperclip) | ✅ First-class | [`packages/paperclip-plugin`](packages/paperclip-plugin) |
| LangChain (Py + TS) | ✅ First-class | Built into core SDK |
| CrewAI | ✅ First-class | Built into core SDK |
| AutoGen | ✅ First-class | Built into core SDK |
| Claude Code / OpenClaw | ✅ Via MCP | [`suprawall-mcp-plugin`](https://github.com/wiserautomation/suprawall-mcp-plugin) |
| Vercel AI SDK | ✅ First-class | Built into core SDK |
| Custom / homegrown | ✅ | One-line `secure_agent()` wrapper |

Languages: Python, TypeScript, Go, C#. More via the MCP plugin.

---

## What it stops

| Threat | How SupraWall stops it | EU AI Act |
|---|---|---|
| **Credential theft** | Vault injects secrets at runtime. Agents never see real keys. Logs scrubbed in 5+ encodings. | Art. 13 |
| **Runaway costs** | Hard per-agent budget caps, per-model token accounting, circuit breakers. | Art. 9 |
| **Unauthorized actions** | Deterministic ALLOW/DENY policies block tool calls before execution. | Art. 9 |
| **PII exposure** | Response scrubbing redacts SSN, CC, email, custom regex — across encodings. | Art. 13 |
| **No audit trail** | RSA-signed logs with risk scores. Exportable as compliance evidence. | Art. 13 |
| **No human oversight** | `REQUIRE_APPROVAL` pauses the agent and notifies a human before high-risk actions. | Art. 14 |
| **Prompt-injection-driven actions** | Local policy ignores agent intent — only the tool-call signature matters. | Art. 9 |

---

## Built-in policy templates

```bash
npx suprawall init  # interactive policy bootstrap
```

| Policy | Protects against |
|---|---|
| [`langchain-safe.json`](policies/langchain-safe.json) | `rm -rf`, `.env` reads, unwhitelisted shell |
| [`pii-protection.json`](policies/pii-protection.json) | SSN, CC, email exfiltration |
| [`eu-ai-act-audit.json`](policies/eu-ai-act-audit.json) | Human-in-the-loop for high-risk tools |
| [`budget-guardrail.json`](policies/budget-guardrail.json) | Token + cost circuit breakers |
| [`paperclip-company.json`](policies/paperclip-company.json) | Company-scoped budgets, role-based tool access |

[→ All starter policies](policies/) · [→ Write your own](docs/policies.md)

---

## EU AI Act compliance — shipped, not promised

**Enforcement begins August 2, 2026.** Every Annex III high-risk sector needs a documented, enforceable risk management system (Art. 9), a tamper-proof audit trail (Art. 13), and human oversight (Art. 14). Most teams are going to scramble. You don't have to.

SupraWall ships **8 pre-built sector templates** covering every Annex III high-risk category — plus a Banking & Finance template mapped to DORA. Each one is a real enforcement config with DENY rules, REQUIRE_APPROVAL gates, mandatory logging, and a conformity-assessment path built in.

| Sector | Annex III | Risk level | Conformity | What it blocks out of the box |
|---|---|---|---|---|
| [Biometrics](packages/core/templates/sector-templates.ts) | Category 1 | Critical | Third-party | Real-time ID in public spaces, emotion recognition without approval |
| [Critical Infrastructure](packages/core/templates/sector-templates.ts) | Category 2 | Critical | Self | Physical-action tools without human confirm, unsafe disconnection |
| [Education](packages/core/templates/sector-templates.ts) | Category 3 | High | Self | Autonomous admission rejections, scoring without explainability |
| [HR & Employment](packages/core/templates/sector-templates.ts) | Category 4 | High | Self | Autonomous hire/fire, salary changes, performance reviews without sign-off |
| [Healthcare](packages/core/templates/sector-templates.ts) | Category 5 | Critical | Third-party | Diagnosis without human review, PHI exfiltration, unlogged patient actions |
| [Law Enforcement](packages/core/templates/sector-templates.ts) | Category 6 | Critical | Third-party | Predictive policing outputs without review, autonomous evidence decisions |
| [Migration & Border](packages/core/templates/sector-templates.ts) | Category 7 | High | Self | Automated visa denials, risk-scoring without human |
| [Justice & Democracy](packages/core/templates/sector-templates.ts) | Category 8 | High | Self | Autonomous judicial outputs, election-related agent actions |
| [Banking & Finance (DORA)](packages/core/templates/sector-templates.ts) | — | High | Self | Autonomous trading, unlogged client-facing decisions |

Apply a sector template in one line:

```python
from suprawall import secure_agent
agent = secure_agent(build_agent(), template="hr-employment")
```

Every template includes the **baseline controls** every Annex III system needs (risk management log, data-quality gate, human oversight hook, post-market monitoring, incident reporting) and layers sector-specific overrides on top. Every policy decision is RSA-signed and exportable as compliance evidence — the kind your auditor will actually accept.

**Why this matters right now:** August 2, 2026 is months away. The penalty for non-compliance is up to €35M or 7% of global turnover. If your auditor asks "what stopped the agent from terminating an employee autonomously?" — you hand them signed log entry `#A-00847`. Most teams will be hand-waving. You'll be compliant by `pip install`.

[→ Full EU AI Act compliance guide](docs/eu-ai-act.md) · [→ Sector templates source](packages/core/templates/sector-templates.ts)

---

## Self-host or cloud

SupraWall is fully open source under Apache 2.0 — clone it, run it, ship it.

|  | Open Source (Self-Hosted) | Cloud |
|---|---|---|
| Layer 1 deterministic engine | ✅ Free forever | ✅ |
| All built-in policies | ✅ Free forever | ✅ |
| RSA-signed audit log | ✅ Free forever | ✅ |
| Layer 2.5 semantic AI detection | — | ✅ |
| Hosted dashboard + multi-tenant | — | ✅ |
| Compliance report generation | — | ✅ |
| SLA + support | — | ✅ |

```bash
# Self-host the dashboard
docker compose up
```

[→ Deploy on cloud](https://www.supra-wall.com/cloud) · [→ AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-suprawall)

---

## Why "deterministic" matters

The dominant security pattern for agents today is *another LLM judging the first LLM* (guardrail models, classifier filters, etc.). That works ~80% of the time, fails silently the other 20%, costs tokens on every call, and produces unauditable decisions.

SupraWall takes the opposite stance: **rules belong in code, not in prompts.** A deterministic policy either matches or it doesn't. The decision is reproducible, the latency is constant, the audit trail is real, and there's no prompt you can write to talk it out of doing its job.

If you want probabilistic content moderation, use a guardrail model. If you want to stop your agent from wiring funds to the wrong account, use a deterministic perimeter.

---

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=wiserautomation/SupraWall&type=Date)](https://star-history.com/#wiserautomation/SupraWall&Date)

If SupraWall saved you from an incident, please ⭐ the repo — it's how this kind of infrastructure finds the people who need it.

---

## Contributing

We're a small team (Wiser Automation) and we want SupraWall to be a community-owned standard, not a single-vendor tool.

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md) — please report vulnerabilities privately
- [Roadmap](docs/roadmap.md)

Active issues good for first-time contributors are tagged [`good first issue`](https://github.com/wiserautomation/SupraWall/labels/good%20first%20issue).

---

## Links

[Website](https://www.supra-wall.com) · [Docs](https://www.supra-wall.com/docs) · [Cloud](https://www.supra-wall.com/cloud) · [Blog](https://www.supra-wall.com/blog) · [X / @The_real_Peghin](https://x.com/The_real_Peghin) · [License: Apache 2.0](LICENSE)

<div align="center">
<sub>Built by <a href="https://wiserautomation.agency">Wiser Automation</a> · Made for the zero-human company era.</sub>
</div>
