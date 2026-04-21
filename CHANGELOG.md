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
- **TypeScript SDK** (`suprawall-ts`) — `withSupraWall()`, `protect()`, `createSupraWallMiddleware()` for MCP
- **Python SDK** (`suprawall`) — `secure_agent()`, `with_suprawall()`, `protect()`, `AgentIdentity`
- **Go SDK** (`suprawall-go`) — Policy evaluation client with fail-safe networking
- **Framework Plugins** — LangChain (Python + TypeScript), Vercel AI SDK, OpenClaw
- **CLI Tool** (`suprawall`) — Policy creation, local validation, and agent identity management
- **MCP Server** — Native Model Context Protocol integration for secure tool execution
- **Database Adapters** — PostgreSQL (primary) with SQLite fallback for local development
- **Self-Hosted Auth** — Fully portable authentication core independent of cloud providers
- **Docker Support** — One-command self-hosting via Docker Compose
- **Monorepo** — Turborepo-managed workspace for high-performance builds and testing

### Infrastructure

- Monorepo managed by Turborepo with workspace dependency resolution
- All packages namespaced under `@suprawall/*`
- Apache 2.0 license for all open-source components
- CI/CD with GitHub Actions (build, test, lint on every PR)
- Automated npm and PyPI publishing on release tags

[1.0.0]: https://github.com/wiserautomation/SupraWall/releases/tag/v1.0.0
