<div align="center">***

<img src="assets/logo.jpg" alt="SupraWall Logo" width="120">

# SupraWall

**The deterministic security layer for AI agents. Open-source (Apache 2.0)**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-private%20beta-orange)](https://www.supra-wall.com/beta)
[![AWS Marketplace](https://img.shields.io/badge/AWS%20Marketplace-Guardrail-232f3e.svg?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/marketplace/pp/prodview-suprawall)
[![One-Command Setup](https://img.shields.io/badge/Run-npx%20suprawall%20init-emerald.svg)](https://www.supra-wall.com/docs)

</div>

---

<div align="center">

### Your AI agent will go rogue. SupraWall makes sure it can't.

<img src="assets/demo.gif" alt="SupraWall intercepting a dangerous tool call" width="700">

</div>

---

## What We're Building

AI agents execute tool calls autonomously. They can delete databases, leak credentials, exfiltrate PII, generate unbounded costs, and fail EU AI Act audits — all without any human knowing until after the damage is done.

SupraWall intercepts every tool call **before it executes**. Not probabilistically. Not after the fact. Deterministically, at the boundary, in under 2ms.

One command setup:

```bash
npx suprawall init
```

```text
  ███████╗██╗   ██╗██████╗ ██████╗  █████╗ ██╗    ██╗ █████╗ ██╗     ██╗
  ██╔════╝██║   ██║██╔══██╗██╔══██╗██╔══██╗██║    ██║██╔══██╗██║     ██║
  ███████╗██║   ██║██████╔╝██████╔╝███████║██║ █╗ ██║███████║██║     ██║
  ╚════██║██║   ██║██╔═══╝ ██╔══██╗██╔══██║██║███╗██║██╔══██║██║     ██║
  ███████║╚██████╔╝██║     ██║  ██║██║  ██║╚███╔███╔╝██║  ██║███████╗███████╗
  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚══════╝
  The Compliance OS for AI Agents

? Detected: my-agent.ts — secure it? (Y/n) y
? How do you want to run SupraWall?
  ❯ Cloud (free account — EU AI Act audit reports)
    Self-hosted (no account needed)
    
  🛡️  Your agent is protected. EU AI Act Article 12 audit trail: ON
```

### Two layers. Seven threats. One SDK.

- 🧠 **AI Semantic Layer** — LLM-powered contextual threat detection (Cloud only)
- 🔐 **Vault** — agents never see real credentials (JIT injection)
- 💸 **Hard budget caps** — deterministic spend limits with circuit breakers
- 🚫 **Policy engine** — ALLOW / DENY / REQUIRE_APPROVAL per tool
- 🧹 **PII Shield** — scrubs sensitive data before execution
- 📋 **Audit Trail** — RSA-signed, EU AI Act Article 9/13/14 ready
- ☁️ **AWS Marketplace** — Integrated SaaS & Container fulfillment (Bedrock ready)
- 🛡️ **Injection Shield** — blocks prompt injection at the runtime boundary

---

## Two-Layer Architecture

SupraWall employs a defense-in-depth strategy:
1. **Layer 1: Deterministic Engine (<2ms)** — Catches known patterns (SQLi, XSS, Prompt Injection) with zero false negatives. Available in all tiers.
2. **Layer 2: AI Semantic Analysis** — Analyzes context, behavioral anomalies, and cross-tool attack sequences. Available on Cloud Team+ tiers.

---

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

**[→ Request early access at supra-wall.com/beta](https://www.supra-wall.com/beta)**

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

[Website](https://www.supra-wall.com) · [Early Access](https://www.supra-wall.com/beta) · [License: Apache 2.0](LICENSE)

</div>
