# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-26

### Initial Open-Source Release

SupraWall is now open source under the Apache 2.0 license. This is the first public release of the complete AI agent security platform.

### Added

- **Policy Engine** — ALLOW / DENY / REQUIRE_APPROVAL evaluation on every tool call with wildcard matching, priority-based resolution, and dry-run mode
- **Credential Vault** — JIT secret injection via `$SUPRAWALL_VAULT_*` tokens with PGP encryption at rest, per-agent access rules, rate limiting, TTL expiration, and multi-format response scrubbing (Base64, hex, URL-encoded, partial match)
- **Human-in-the-Loop Approvals** — REQUIRE_APPROVAL pauses agent execution, sends Slack notifications, SDK polls for decision with 5-minute timeout
- **Audit Logging** — Immutable audit trail with risk scores, cost estimates, and full parameter context for every decision
- **Compliance Reports** — EU AI Act Articles 9, 12, 14 compliance status check and PDF evidence export
- **Threat Detection** — SQL injection and prompt injection pattern matching with severity scoring and per-entity threat aggregation
- **Budget Enforcement** — Per-agent hard caps with per-model token cost tracking (GPT-4o, Claude 3.5, Gemini, Llama, etc.)
- **Loop Detection** — Circuit breaker stops infinite tool call loops
- **TypeScript SDK** (`@suprawall/sdk-ts`) — `withSupraWall()`, `protect()`, `createSupraWallMiddleware()` for MCP
- **Python SDK** (`suprawall`) — `secure_agent()`, `with_suprawall()`, `protect()`, `AgentIdentity`
- **Go SDK** (`suprawall-go`) — Policy evaluation client with fail-safe networking
- **Framework Plugins** — LangChain (Python + TypeScript), AutoGen, CrewAI, LlamaIndex, Vercel AI SDK, OpenClaw
- **CLI Tool** (`@suprawall/cli`) — Agent management, policy creation, vault operations, compliance checks, log streaming
- **Dashboard** — Next.js 16 administration UI with policy editor, approval queue, audit viewer, vault management, and compliance dashboard
- **MCP Server** — Native Model Context Protocol integration with `check_policy` and `request_approval` tools
- **Database Adapters** — PostgreSQL (primary), MySQL, MongoDB, Supabase, Firebase Firestore
- **Self-Hosted PostgreSQL Auth** — `PostgresAuthProvider` for fully Firebase-independent deployment
- **Docker Support** — Multi-stage Dockerfile and docker-compose.yml for one-command self-hosting
- **Monorepo** — Turborepo-managed workspace with 11 packages building cleanly under `@suprawall` namespace

### Infrastructure

- Monorepo managed by Turborepo with workspace dependency resolution
- All packages namespaced under `@suprawall/*`
- Apache 2.0 license for all open-source components
- CI/CD with GitHub Actions (build, test, lint on every PR)
- Automated npm and PyPI publishing on release tags

[1.0.0]: https://github.com/wiserautomation/SupraWall/releases/tag/v1.0.0
