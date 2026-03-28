<div align="center">

<img src="Marketing/Logo/universal_upscale_0_d36e7b33-b656-4c57-8697-25a28f1f7d40_0.jpg" alt="SupraWall Logo" width="120">

# SupraWall

**The deterministic security layer for AI agents.**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-private%20beta-orange)](https://www.supra-wall.com)

</div>

---

## What We're Building

AI agents execute tool calls autonomously. They can delete databases, leak credentials, exfiltrate PII, generate unbounded costs, and fail EU AI Act audits — all without any human knowing until after the damage is done.

SupraWall intercepts every tool call **before it executes**. Not probabilistically. Not after the fact. Deterministically, at the boundary, in under 2ms.

One line of code:

```python
secured_agent = secure_agent(agent, api_key="ag_your_key")
# Every tool call is now policy-checked, vault-protected, and audit-logged.
```

### Six threats. One SDK.

- 🔐 **Vault** — agents never see real credentials (JIT injection)
- 💸 **Hard budget caps** — deterministic spend limits with circuit breakers
- 🚫 **Policy engine** — ALLOW / DENY / REQUIRE_APPROVAL per tool
- 🧹 **PII Shield** — scrubs sensitive data before execution
- 📋 **Audit Trail** — RSA-signed, EU AI Act Article 9/13/14 ready
- 🛡️ **Injection Shield** — blocks prompt injection at the runtime boundary

Supports: LangChain, CrewAI, AutoGen, Vercel AI · Python, TypeScript, Go, and more.

---

## Status

The codebase is complete and in final review. We are onboarding a small group of design partners before public launch.

**We are looking for:**
- Teams building production AI agents in fintech, healthtech, or SaaS
- Engineering leads who need EU AI Act compliance evidence before August 2026
- Developers who want early access and are willing to give honest feedback

---

## Join the Waitlist

**[→ Request early access at supra-wall.com](https://www.supra-wall.com)**

We will onboard in small batches. Early partners get:
- Free Team tier access during beta ($79/mo value)
- Direct line to the founding team
- Input on the roadmap

---

## Full Documentation

The complete README, architecture docs, and integration guides are available at
**[supra-wall.com/docs](https://www.supra-wall.com/docs)** and in [`README_FULL.md`](README_FULL.md) in this repository.

---

<div align="center">

[Website](https://www.supra-wall.com) · [Early Access](https://www.supra-wall.com) · [License: Apache 2.0](LICENSE)

</div>
