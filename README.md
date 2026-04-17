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

### One-command setup:

```bash
npx suprawall init
```

### 🔐 Layer 1: Deterministic Security (OSS & Local)

Secure your agents by defining policies in simple JSON files. No API key required.

```bash
# Validate your agent against a local policy
npx suprawall validate ./policies/langchain-safe.json --tool "bash" --args '{"query": "ls"}'
```

### 🧠 Layer 2: Semantic Intelligence (Cloud)

Optional AI-powered threat detection and behavioral analysis. Requires an API key and an account at [supra-wall.com](https://www.supra-wall.com).

---

## Two-Layer Architecture

SupraWall employs a defense-in-depth strategy:
1. **Layer 1: Deterministic Engine (<1.2ms)** — Evaluates local [policy files](policies/) (Regex/Glob). Zero network, zero latency, 100% deterministic. **Local policy always wins.**
2. **Layer 2: AI Semantic Analysis** — Analyzes context and behavioral anomalies. Opt-in via Cloud API.

---

## Built-in Policies

We ship with "batteries included" security templates for major frameworks:

| Policy | What it protects |
|--------|------------------|
| [LangChain Safe](policies/langchain-safe.json) | Bash `rm -rf`, `.env` reads, unwhitelisted shell. |
| [PII Shield](policies/pii-protection.json) | SSN, Credit Card, and Email exfiltration. |
| [EU AI Act](policies/eu-ai-act-audit.json) | Enforces human-in-the-loop for high-risk tools. |
| [Budget Guard](policies/budget-guardrail.json) | Token/cost circuit breakers. |

[→ View all 8 starter policies](policies/)

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
