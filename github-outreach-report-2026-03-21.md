# SupraWall GitHub Outreach — Automated Research Report
**Date:** 2026-03-21
**Status:** ⏸ PAUSED — Awaiting user confirmation before opening any issues
**GitHub account:** wiserautomation
**PyPI package:** `langchain-suprawall 0.1.0` ✅ verified

---

## Pre-flight Checks

| Check | Status | Notes |
|-------|--------|-------|
| `langchain-suprawall` on PyPI | ✅ Pass | v0.1.0 released, MIT license |
| GitHub login | ✅ Pass | Logged in as `wiserautomation` |
| EU AI Act / SupraWall issues already open | ✅ Pass | 0 existing issues on any of the 5 repos |

---

## Repos Skipped

| Repo | Stars | Reason |
|------|-------|--------|
| BCG-X-Official/agentkit | 1,946 | **Archived March 18, 2026** — read-only, cannot open issues |

---

## The 5 Target Repos

### Repo 1 — `wassim249/fastapi-langgraph-agent-production-ready-template`
- **Stars:** ~2,100 ⭐
- **Language:** Python
- **Last commit:** December 2025 (active)
- **Description:** Production-ready FastAPI template for building AI agent applications with LangGraph integration
- **HITL present:** No
- **Issue template:** **Template A**
- **Issues URL:** https://github.com/wassim249/fastapi-langgraph-agent-production-ready-template/issues/new
- **Existing EU AI Act / SupraWall issues:** 0

---

### Repo 2 — `vstorm-co/full-stack-ai-agent-template`
- **Stars:** ~854 ⭐
- **Language:** Python + TypeScript
- **Last commit:** March 20, 2026 (very active — updated yesterday)
- **Description:** Production-ready Full-Stack AI Agent Template — FastAPI + Next.js with 5 AI frameworks (PydanticAI, LangChain, LangGraph, CrewAI, DeepAgent)
- **HITL present:** No
- **Issue template:** **Template A**
- **Issues URL:** https://github.com/vstorm-co/full-stack-ai-agent-template/issues/new
- **Existing EU AI Act / SupraWall issues:** 0

---

### Repo 3 — `lancedb/vectordb-recipes`
- **Stars:** ~933 ⭐
- **Language:** Jupyter Notebook (Python)
- **Last commit:** March 5, 2026 (active)
- **Description:** Resources, examples & tutorials for multimodal AI, RAG and agents using vector search and LLMs — includes several LangChain agent examples
- **HITL present:** No
- **Issue template:** **Template A**
- **Issues URL:** https://github.com/lancedb/vectordb-recipes/issues/new
- **Existing EU AI Act / SupraWall issues:** 0

---

### Repo 4 — `huangjia2019/ai-agents`
- **Stars:** ~483 ⭐
- **Language:** Jupyter Notebook (Python)
- **Last commit:** November 2025 (active)
- **Description:** Introductory examples for building LLM-based AI agents with LangChain (companion repo to a published book on AI agents)
- **HITL present:** No
- **Issue template:** **Template A**
- **Issues URL:** https://github.com/huangjia2019/ai-agents/issues/new
- **Existing EU AI Act / SupraWall issues:** 0

---

### Repo 5 — `agentailor/fullstack-langgraph-nextjs-agent`
- **Stars:** ~89 ⭐
- **Language:** TypeScript (LangGraph.js)
- **Last commit:** February 2026 (active)
- **Description:** Production-ready Next.js template for building AI agents with LangGraph.js. Features MCP integration for dynamic tool loading, human-in-the-loop tool approval, persistent conversation memory with PostgreSQL.
- **HITL present:** ✅ Yes — custom LangGraph.js interrupt-based tool approval (approve/deny/modify UI)
- **Issue template:** **Template B** ⚠️ (with adaptation — this is TypeScript/LangGraph.js, not Python)
- **Issues URL:** https://github.com/agentailor/fullstack-langgraph-nextjs-agent/issues/new
- **Existing EU AI Act / SupraWall issues:** 0

> **⚠️ Note for Repo 5:** The `langchain_suprawall` PyPI package is Python-only. The Template B code snippet references Python. If you open an issue on this TypeScript repo, consider adapting the message to acknowledge the TypeScript ecosystem and mention that a JS/TS SDK is on the roadmap, rather than showing the Python snippet directly.

---

## Issue Content Ready to Post

### Repos 1–4: Template A

**Title:** `EU AI Act compliance gap — missing human oversight and audit logging for agent actions`

**Body:**
```markdown
## Summary

This starter is missing compliance controls required by the EU AI Act for agents deployed to EU users. High-risk obligations apply from August 2025.

## What's Missing

**Article 14 — Human oversight**
No mechanism for a human to review and approve consequential tool calls (e.g., sending emails, modifying data, financial actions) before they execute.

**Article 12 — Audit logging**
Agent executions aren't logged. High-risk AI systems must maintain logs sufficient to reconstruct events after the fact, with a defined retention period.

**Article 9 — Risk management**
No risk classification for the tools this agent can call. A compliant implementation needs a policy layer that evaluates action risk before execution.

## Suggested Fix

Adding `langchain-suprawall` as middleware implements all three requirements:

```python
from langchain_suprawall import SuprawallMiddleware, RiskLevel

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[
        SuprawallMiddleware(
            api_key=os.environ["SUPRAWALL_API_KEY"],
            risk_level=RiskLevel.HIGH,
            require_human_oversight=True,   # Article 14
            audit_retention_days=730,       # Article 12: 2-year retention
        ),
    ],
)
```

This routes high-risk tool calls for human approval (to Slack or a dashboard — not just a terminal prompt), logs every execution to a tamper-evident audit trail, and generates PDF audit reports for regulatory submissions.

## Reference

- Full tutorial: [EU AI Act Compliance for LangChain Agents](https://supra-wall.com/blog/eu-ai-act-langchain)
- `langchain-suprawall` on PyPI: [pypi.org/project/langchain-suprawall](https://pypi.org/project/langchain-suprawall)

Happy to contribute a PR adding a compliance section to the README if that would be useful.
```

---

### Repo 5: Template B (adapted for TypeScript)

**Title:** `Human-in-the-loop approval present but doesn't satisfy EU AI Act Article 14 in production`

**Body:**
```markdown
## Summary

This repo has a great human-in-the-loop tool approval flow — that's a strong start. However, the current implementation has a gap relative to EU AI Act Article 14 for production deployments.

## The Gap

The current HITL implementation routes approval requests to a UI dialog. Article 14 requires approvals to be **logged** with approver identity and timestamp — a UI dialog that doesn't write to a tamper-evident audit trail doesn't satisfy this. Additionally, Article 12 requires a defined log retention period.

## What's Needed for Full Compliance

- Approver identity + timestamp persisted for every approval decision (not just execution logs)
- Tamper-evident audit trail (append-only, cryptographically verifiable)
- Defined retention period (≥ 2 years for high-risk systems)
- Ability to generate audit reports for regulatory submissions

## Suggested Fix (Python equivalent — JS/TS SDK on the SupraWall roadmap)

```python
# After: Slack/dashboard approval with full audit logging (Articles 12 + 14)
from langchain_suprawall import SuprawallMiddleware
hitl = SuprawallMiddleware(
    api_key=os.environ["SUPRAWALL_API_KEY"],
    require_human_oversight=True,
    notification_channel="slack",
    audit_retention_days=730,
)
```

## Reference
- [Built-in HITL vs. Enterprise Compliance Middleware](https://supra-wall.com/blog/hitl-comparison)
- `langchain-suprawall`: [pypi.org/project/langchain-suprawall](https://pypi.org/project/langchain-suprawall)
- A TypeScript / LangGraph.js SDK is on the SupraWall roadmap — happy to discuss early access.
```

---

## Next Steps

To proceed, Alejandro needs to confirm each issue one by one in the chat:

1. ✅ "Open issue on **wassim249/fastapi-langgraph-agent-production-ready-template**?" → 2,100-star Python production template
2. ✅ "Open issue on **vstorm-co/full-stack-ai-agent-template**?" → 854-star very-active full-stack template
3. ✅ "Open issue on **lancedb/vectordb-recipes**?" → 933-star LangChain/RAG examples repo
4. ✅ "Open issue on **huangjia2019/ai-agents**?" → 483-star introductory AI agents examples (book companion)
5. ✅ "Open issue on **agentailor/fullstack-langgraph-nextjs-agent**?" → 89-star LangGraph.js TypeScript template (HITL present, Template B adapted)

Issues will be spaced ≥30 seconds apart to avoid GitHub rate limiting.

---

*Report generated automatically by the suprawall-github-outreach scheduled task.*
