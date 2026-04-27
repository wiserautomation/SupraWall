# SupraWall Roadmap

This is a living document. Items marked **shipped** are in the current release. Items marked **in progress** have open PRs or active development. Everything else is planned with no committed date — we ship when it's ready, not when it's scheduled.

## Shipped (v1.1.0)

### Core enforcement
- [x] Zero-config `wrap_with_firewall()` one-liner
- [x] Auto-detected framework adapters: LangChain, LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Anthropic
- [x] Local policy engine — offline, <2ms, no API key, no network
- [x] Built-in policy bundle: destructive shell, system-path writes, credential exfiltration
- [x] `dry_run=True` mode for policy tuning without enforcement

### Observability
- [x] Shareable attack traces — `e.share_url()` → `supra-wall.com/trace/X-00847`
- [x] PII redactor: 9 patterns (OpenAI keys, AWS keys, GitHub tokens, Slack, JWT, email, phone, SSN, CC)
- [x] RSA-signed audit log — tamper-evident, EU AI Act Art. 12 / 13 compliant
- [x] Local trace save — `e.save_local()`, no network

### Compliance
- [x] 8 Annex III sector templates (HR, healthcare, education, critical infra, biometrics, law enforcement, migration, justice)
- [x] DORA template for banking & finance
- [x] Human-in-the-loop `REQUIRE_APPROVAL` gates

### Multi-language SDKs
- [x] Python SDK (`suprawall-sdk`)
- [x] TypeScript/Node SDK (`suprawall`)
- [x] Go SDK (`packages/sdk-go`)

### Dashboard
- [x] Real-time audit stream (Firestore + Postgres dual-source)
- [x] Admin health panel — distinguishes "no data" from "misconfigured" from "unreachable"
- [x] OSS metrics page (npm/PyPI/GitHub traffic)
- [x] Public trace gallery (`/traces`)
- [x] Anonymous telemetry with `SUPRAWALL_TELEMETRY=0` kill switch

---

## In progress (v1.2.0 — target: Q2 2026)

### Enforcement
- [ ] **Budget circuit breakers** — hard per-agent token caps with real-time accounting across models
- [ ] **Semantic AI layer** — cloud-optional second layer that catches context-dependent attacks regex can't see
- [ ] **Policy inheritance** — org-level base policy + per-agent overrides

### Integrations
- [ ] **MCP server plugin** — `suprawall-mcp-plugin` for Claude Code / any MCP host
- [ ] **Dify plugin** — published to the Dify marketplace
- [ ] **LlamaIndex first-class adapter** — currently works via generic wrapper
- [ ] **smolagents first-class adapter** — currently works via generic wrapper

### Dashboard
- [ ] Approval queue UI — mobile-friendly human-in-the-loop review screen
- [ ] Compliance report export — PDF with signed log bundle for auditors
- [ ] Multi-tenant org management

---

## Planned (v1.3.0+)

- [ ] **C# / .NET SDK** — community ask
- [ ] **Rust SDK** — for embedded / edge use cases
- [ ] **Policy IDE** — VS Code extension for policy authoring with autocomplete and live preview
- [ ] **Threat intelligence feed** — community-contributed patterns for emerging attack vectors
- [ ] **Automated conformity assessment bundle** — EU AI Act Annex III self-assessment export with everything an auditor needs in one ZIP

---

## Contributing

The best way to move something up the roadmap is to open a PR.

- [Contributing guide](../CONTRIBUTING.md)
- [Good first issues](https://github.com/wiserautomation/SupraWall/labels/good%20first%20issue)
- [Security policy](../SECURITY.md) — vulnerabilities go here, not in issues
