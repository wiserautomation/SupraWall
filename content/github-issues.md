# GitHub Issue Templates: EU AI Act Compliance Gap

Use these on the top LangChain agent starter repos. Suggested targets:
- `langchain-ai/langchain` (main repo)
- `langchain-ai/langgraph`
- `hwchase17/langchain` (original)
- `langchain-ai/langchain-template` (agent templates)
- Any popular community agent starter (search GitHub: "langchain agent starter" sorted by stars)

Adapt the repo name and specific tools/use case in the template to match each repo.

---

## Issue Template A — General Starter Repos

**Title:** `Missing EU AI Act compliance: no human oversight or audit logging for agent actions`

**Body:**
```markdown
## Summary

This starter/template is missing compliance controls required by the EU AI Act for
agents deployed in or serving the EU market. High-risk obligations apply from
August 2025.

## What's Missing

**Article 14 — Human oversight**
There's no mechanism for a human to review and approve consequential tool calls before
they execute (e.g., sending emails, modifying data, making financial actions). The EU AI
Act requires that humans can "effectively oversee" and "interrupt" the AI system.

**Article 12 — Audit logging**
Agent executions aren't logged. There's no record of what the agent was asked to do,
what tools it called, or what it returned. High-risk AI systems must maintain logs
sufficient to reconstruct events after the fact, with a defined retention period.

**Article 9 — Risk management**
There's no risk classification for the tools this agent can call. Not all tool calls
are equal risk — reading data is different from sending an email or deleting records.
A compliant implementation needs a policy layer that evaluates action risk.

## Suggested Fix

Adding `langchain-suprawall` as middleware implements all three requirements without
changing the existing agent logic:

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

This routes high-risk tool calls for human approval (to Slack or a dashboard),
logs every execution to a tamper-evident audit trail, and generates audit reports
for regulatory submissions.

## Reference

- Full tutorial: [EU AI Act Compliance for LangChain Agents](https://supra-wall.com/blog/eu-ai-act-langchain)
- `langchain-suprawall` on PyPI: [pypi.org/project/langchain-suprawall](https://pypi.org/project/langchain-suprawall)
- EU AI Act text: [eur-lex.europa.eu](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)

Happy to contribute a PR adding this to the README or as an optional configuration
in the template. Let me know if that would be useful.
```

---

## Issue Template B — Repos with HITL Already (But No Audit Trail)

**Title:** `HumanInTheLoopMiddleware present but doesn't satisfy EU AI Act Article 14 requirements`

**Body:**
```markdown
## Summary

This repo uses `HumanInTheLoopMiddleware`, which is a good start. But the current
implementation doesn't satisfy EU AI Act Article 14 in production deployments.

## The Gap

`HumanInTheLoopMiddleware` routes approval requests to the terminal:
```
[HITL] Agent wants to call: send_email
Approve? (y/n): _
```

Article 14 requires that human oversight is **logged** with:
- Approver identity (who approved it)
- Timestamp (when they approved it)
- Reasoning (optionally, why)

A terminal prompt produces no log. If a regulator asks "who approved this action?"
there's no answer.

Additionally, production agents run on servers — there's no terminal to route to.

## Suggested Fix

Replace or augment `HumanInTheLoopMiddleware` with a middleware that routes approvals
to a logged channel (Slack, dashboard) and writes the decision to an audit trail:

```python
# Before: local terminal approval, no audit trail
from langchain.middleware import HumanInTheLoopMiddleware
hitl = HumanInTheLoopMiddleware(interrupt_on=["send_email", "delete_record"])

# After: routed approval with full audit logging (Article 14 + Article 12)
from langchain_suprawall import SuprawallMiddleware
hitl = SuprawallMiddleware(
    api_key=os.environ["SUPRAWALL_API_KEY"],
    require_human_oversight=True,
    notification_channel="slack",        # Routes to Slack instead of terminal
    audit_retention_days=730,
)
```

Both work the same way from the agent's perspective. The difference is in
production-readiness and compliance documentation.

## Reference

- Full comparison: [Built-in HITL vs. Enterprise Compliance Middleware](https://supra-wall.com/blog/hitl-comparison)
- `langchain-suprawall`: [pypi.org/project/langchain-suprawall](https://pypi.org/project/langchain-suprawall)
```

---

## Issue Template C — Finance/Healthcare/Legal Agent Repos (Higher Stakes)

**Title:** `[Compliance] This agent requires EU AI Act high-risk controls before production deployment`

**Body:**
```markdown
## Summary

Agents handling [financial data / medical information / legal documents] are likely
classified as high-risk AI systems under the EU AI Act. Deploying this template
to production without additional controls creates regulatory exposure for EU deployments.

## High-Risk Classification

The EU AI Act classifies AI systems in several categories as high-risk by default
(Annex III), including systems used in:
- Credit scoring and financial assessment
- Employment and HR decisions
- Access to essential services
- Law enforcement and legal processes
- Healthcare and medical devices

If this agent touches any of these areas, operators deploying it in the EU must
comply with Chapter III requirements before going live.

## What's Required at the Code Level

| Requirement | Article | Current Status | What's Needed |
|-------------|---------|----------------|---------------|
| Risk management system | Art. 9 | ❌ Missing | Policy engine classifying action risk |
| Audit logging | Art. 12 | ❌ Missing | Tamper-evident execution logs, 2yr retention |
| Human oversight | Art. 14 | ❌ Missing | Logged human approval for high-risk actions |
| Transparency | Art. 13 | ⚠️ Partial | AI disclosure to users |

## Adding Compliance Controls

```python
from langchain_suprawall import SuprawallMiddleware, RiskLevel, ToolPolicy

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[
        SuprawallMiddleware(
            api_key=os.environ["SUPRAWALL_API_KEY"],
            risk_level=RiskLevel.HIGH,
            require_human_oversight=True,
            audit_retention_days=730,
            tool_policies=[
                ToolPolicy(tool_name="assess_credit", requires_approval=True),
                ToolPolicy(tool_name="send_decision", requires_approval=True),
            ],
        ),
    ],
)
```

## Recommended Action

Add a warning to the README noting that this template requires additional compliance
controls for EU production deployments, with a pointer to the relevant guidance.

Happy to draft the README addition if helpful.
```

---

## Tips for Posting

- Customize the tool names in code examples to match the actual tools in each repo
- For well-maintained repos, use Template A (neutral, helpful tone)
- For repos that already have some HITL, use Template B (acknowledges their existing work)
- For domain-specific repos (finance, healthcare, legal), use Template C (higher urgency)
- Post issues 2-3 days apart so it doesn't look like a spam campaign
- If the repo has a Code of Conduct or contributing guide, read it first — some repos have issue templates you should use instead of creating free-form issues
