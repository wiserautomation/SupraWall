# How to Make Your LangChain Agent EU AI Act Compliant in 5 Minutes

The EU AI Act requires human oversight (Article 14), audit logging (Article 12), and risk management (Article 9) for production AI agents. Most LangChain deployments have none of these. If your agent is touching customer data, sending emails, executing financial transactions, or interacting with any external system, you are likely already non-compliant. Fines can reach €30 million or 6% of global annual turnover. The good news: you can add all three compliance pillars in under 5 minutes with a single middleware integration. Here's exactly how.

---

## The 3-Line Problem

Most LangChain agents in production look something like this:

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")
agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)

result = executor.invoke({"input": "Send a follow-up email to all leads from last quarter"})
```

Clean, functional, and dangerously non-compliant. Here's what's missing:

**No audit trail.** You have no record of what the agent decided, which tools it called, what data it accessed, or when. Article 12 of the EU AI Act mandates automatic logging of all events necessary to trace the AI system's decisions throughout its lifecycle. A plain LangChain executor writes nothing to a compliance-grade log.

**No human oversight.** Article 14 requires that high-risk AI systems allow human operators to monitor and intervene in real time. If your agent decides to bulk-email 10,000 leads at 2 AM, nothing stops it.

**No policy engine.** Article 9 demands a risk management system that identifies, analyzes, and mitigates risks specific to your deployment. There's no mechanism here to evaluate whether a particular tool call is permissible before it executes.

This is the three-line problem: three lines of executor code, three articles of the EU AI Act violated.

---

## The 5-Minute Fix

Install the integration:

```bash
pip install langchain-suprawall
```

Now wrap your executor:

```python
import os
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from langchain_suprawall import SuprawallMiddleware, RiskLevel

llm = ChatOpenAI(model="gpt-4o")
agent = create_openai_functions_agent(llm, tools, prompt)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[
        SuprawallMiddleware(
            api_key=os.environ["SUPRAWALL_API_KEY"],
            risk_level=RiskLevel.HIGH,
            require_human_oversight=True,   # Article 14
            audit_retention_days=730,       # Article 12
        ),
    ],
)

result = executor.invoke({"input": "Send a follow-up email to all leads from last quarter"})
```

That's the entire change. Let's break down what each parameter actually does.

**`api_key`** connects to the SupraWall compliance backend, which is where your audit logs are stored, your policies are evaluated, and your human-in-the-loop notifications are dispatched.

**`risk_level=RiskLevel.HIGH`** tells SupraWall how aggressively to apply its policy engine. `HIGH` maps directly to the EU AI Act's high-risk classification (Annex III), which applies to agents making decisions in HR, credit, critical infrastructure, law enforcement adjacent systems, and customer-facing automation. At this level, every tool call is evaluated against your policy ruleset before execution. If you're unsure which level applies to you, start with `HIGH` — you can always downgrade after a legal review.

**`require_human_oversight=True`** activates Article 14 compliance. Any tool call classified as high-risk by SupraWall's policy engine will pause execution and dispatch a real-time notification to your designated compliance officer (via Slack, email, or webhook — configurable in your SupraWall dashboard). The agent cannot proceed until the oversight action is resolved.

**`audit_retention_days=730`** sets log retention to two years (730 days), which aligns with the EU AI Act's post-market surveillance requirements under Article 72 for general purpose AI systems and is a conservative baseline for high-risk systems. Every tool call, decision, approval, denial, and error is stored with a tamper-evident timestamp and cryptographic chain of custody.

---

## What Happens When a High-Risk Tool Is Called

Let's trace exactly what happens when your agent tries to call `send_email` with the above setup.

1. The agent decides to call `send_email(to="leads@...", subject="Follow-up", body="...")`.
2. SupraWall middleware intercepts the call *before* execution. The tool does not run yet.
3. SupraWall evaluates the call against your policy ruleset. `send_email` is classified as a high-risk tool (external communication, potential PII exposure).
4. Because `require_human_oversight=True`, SupraWall dispatches a Slack message to your compliance officer: *"Agent requested to call `send_email` to 847 recipients. Approve or deny?"*
5. The compliance officer clicks Approve or Deny in Slack. SupraWall logs: the action taken, the timestamp (ISO 8601, UTC), and the approver's identity (pulled from their Slack/SSO profile).
6. If approved, the tool executes normally. If denied, the agent receives a structured error and can respond accordingly.

Compare this to LangChain's built-in `HumanApprovalCallbackHandler`. That approach pauses the agent and prints a prompt to your terminal — whoever is watching the terminal must type `y` or `n`. There's no log of who approved, no timestamp beyond your shell history, no integration with your existing compliance tooling, and no way to reconstruct the audit trail later. That's not Article 14 compliance; that's a debug flag.

SupraWall turns human oversight from a developer convenience into a compliance-grade system of record.

---

## Generating an Audit Report

When your auditor (internal or external) asks for evidence of compliance, this is the two-line answer:

```python
from langchain_suprawall import AuditReporter

reporter = AuditReporter(api_key=os.environ["SUPRAWALL_API_KEY"])
report = reporter.generate(
    start_date="2025-01-01",
    end_date="2025-03-31",
    format="pdf"
)
report.save("q1_audit.pdf")
```

The generated PDF includes: a full chronological log of every tool call made by your agent, the policy evaluation result for each call, the human oversight decisions (with approver identities and timestamps), any policy violations or near-misses flagged by the risk engine, and a summary attestation table mapping your deployment to the specific EU AI Act articles it satisfies.

This is what you hand to an auditor. It answers the three questions every EU AI Act auditor will ask: *What did the system do? Who approved it? Can you prove it?*

---

## Next Steps

The `langchain-suprawall` package is available now on PyPI (`pip install langchain-suprawall`). The full tutorial — including how to configure your policy ruleset, set up Slack/webhook notifications, and handle multi-agent deployments where multiple executors share a single compliance context — is at [suprawall.ai/blog/eu-ai-act-langchain](https://suprawall.ai/blog/eu-ai-act-langchain).

The EU AI Act's high-risk provisions have enforcement teeth. The compliance window is narrower than most teams realize. Five minutes and one middleware import is a reasonable place to start.

---

*Tags: python, langchain, ai, compliance*
