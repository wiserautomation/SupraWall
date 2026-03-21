# EU AI Act Compliance for LangChain Agents: A Complete Middleware Implementation Guide

*Published on DEV Community · LangChain Forum*

---

LangChain ships excellent built-in guardrails: `PIIMiddleware` strips sensitive data before it reaches the model, and `HumanInTheLoopMiddleware` pauses execution for human review. For a prototype or internal tool, these are great.

But if you're building agents that touch EU users — or if your organization is subject to the EU AI Act — these built-in tools solve the wrong problem. They protect your model from bad inputs. The EU AI Act requires something different: *documented evidence that humans are overseeing your AI systems*, with audit logs that survive a regulatory inspection.

This guide shows you how to implement EU AI Act compliance as LangChain middleware using `langchain-suprawall`. Everything here is composable with LangChain's existing middleware stack.

---

## What the EU AI Act Actually Requires from an Agent Perspective

The EU AI Act creates obligations based on risk level, but three articles apply to almost every AI agent deployment:

**Article 9 — Risk management system.** You must have a documented, ongoing process for identifying and mitigating risks. For an agent, this means: every action the agent can take should have a defined risk level, and higher-risk actions need additional controls.

**Article 12 — Record keeping.** High-risk AI systems must log enough information to reconstruct what happened after the fact. The logs must be stored for a defined retention period and be retrievable for audits.

**Article 14 — Human oversight.** You must implement technical measures that allow humans to oversee, interrupt, and correct the AI system. "Human in the loop" is not optional for high-risk use cases — it's a legal requirement.

The gap in LangChain's current tooling is not capability, it's architecture. `HumanInTheLoopMiddleware` routes approval requests to the terminal. That's fine for a single developer testing locally. It's not suitable for a production system where the approver is a compliance officer in Berlin, the agent is running on a cloud server, and the approval decision needs to be logged with a timestamp, approver identity, and reasoning.

---

## Architecture: What Compliant Middleware Looks Like

```
Agent Request
     │
     ▼
┌─────────────────────────────┐
│   SuprawallMiddleware        │
│                             │
│  before_agent():            │
│  ├─ Evaluate request risk   │
│  ├─ Check policy rules      │
│  └─ ALLOW / DENY /          │
│     REQUIRE_APPROVAL ──────►│──► Slack/Dashboard notification
│                             │    Awaits human decision
│  after_agent():             │
│  ├─ Log decision + output   │
│  ├─ Attach Article 12 audit │
│  └─ Store with retention    │
└─────────────────────────────┘
     │
     ▼
  Agent executes (or not)
```

The key difference from built-in HITL: approval requests route to wherever your compliance team actually works — Slack, a web dashboard, email — and the approval is logged alongside the decision with full traceability.

---

## Installation

```bash
pip install langchain-suprawall
```

Set your Suprawall API key:

```bash
export SUPRAWALL_API_KEY=sw_your_key_here
```

---

## Basic Implementation

Here's the minimal setup — wrapping an existing agent with compliance middleware:

```python
from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain_suprawall import SuprawallMiddleware, RiskLevel

# Your existing agent setup (unchanged)
llm = ChatOpenAI(model="gpt-4o")
tools = [search_tool, database_tool, email_tool]
agent = create_openai_tools_agent(llm, tools, prompt)

# Add Suprawall compliance middleware
compliance_middleware = SuprawallMiddleware(
    api_key=os.environ["SUPRAWALL_API_KEY"],
    risk_level=RiskLevel.HIGH,          # EU AI Act risk classification
    require_human_oversight=True,        # Article 14
    audit_retention_days=730,           # Article 12: 2-year retention
    notification_channel="slack",        # Where approvals are routed
)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[compliance_middleware],  # Drop-in alongside existing middleware
)
```

That's the one-line version. The middleware intercepts every agent run, evaluates it against your policy rules, routes high-risk actions for human approval, and logs everything to Suprawall's audit trail.

---

## Side-by-Side: Built-in HITL vs. Suprawall

To understand the difference, here's the same scenario implemented both ways: an agent that can send emails on behalf of the user.

### Built-in `HumanInTheLoopMiddleware`

```python
from langchain.middleware import HumanInTheLoopMiddleware

hitl = HumanInTheLoopMiddleware(
    interrupt_on=["send_email", "delete_record"],
)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[hitl],
)
```

**What happens:** When the agent wants to call `send_email`, execution pauses and a prompt appears in the terminal:

```
[HITL] Agent wants to call: send_email
Args: {"to": "client@example.com", "subject": "Contract update"}
Approve? (y/n): _
```

This works perfectly for local development. In production, there is no terminal. There is no log. If a regulator asks "who approved this email?" there is no answer.

### Suprawall Middleware

```python
from langchain_suprawall import SuprawallMiddleware, ToolPolicy

compliance_middleware = SuprawallMiddleware(
    api_key=os.environ["SUPRAWALL_API_KEY"],
    tool_policies=[
        ToolPolicy(
            tool_name="send_email",
            risk_level=RiskLevel.HIGH,
            requires_approval=True,
            approver_role="compliance_officer",   # Routes to the right person
            eu_ai_act_article="Article 14",
        ),
        ToolPolicy(
            tool_name="delete_record",
            risk_level=RiskLevel.CRITICAL,
            requires_approval=True,
            approver_role="senior_manager",
            min_approvers=2,                      # Dual approval for critical actions
        ),
    ],
)
```

**What happens:**
1. Agent wants to call `send_email`
2. Suprawall evaluates the request against your policy rules
3. A Slack notification goes to your compliance officer with full context: what the agent wants to do, why, with what arguments
4. The compliance officer approves or denies from Slack (or the web dashboard)
5. The decision — including timestamp, approver identity, and optional reasoning — is written to the audit log
6. The agent proceeds or is blocked accordingly

If a regulator asks "who approved this email?" you have a complete record.

---

## The `before_agent()` Hook: Policy Enforcement

The `before_agent()` hook runs before the agent executes any step. This is where risk evaluation and policy enforcement happen:

```python
from langchain_suprawall import SuprawallMiddleware
from langchain_suprawall.policies import PolicyResult

class CustomComplianceMiddleware(SuprawallMiddleware):

    def before_agent(self, inputs: dict) -> dict:
        """
        Called before each agent step.
        Returns modified inputs, or raises SuprawallDenyException to block.
        """

        # Evaluate the request against your policy engine
        policy_result: PolicyResult = self.policy_engine.evaluate(
            inputs=inputs,
            context={
                "user_id": inputs.get("user_id"),
                "session_id": inputs.get("session_id"),
                "timestamp": datetime.utcnow().isoformat(),
            }
        )

        if policy_result.decision == "DENY":
            # Log the denial (Article 12)
            self.audit_logger.log_denial(
                inputs=inputs,
                reason=policy_result.reason,
                eu_article="Article 9",
            )
            raise SuprawallDenyException(
                message=policy_result.reason,
                audit_id=policy_result.audit_id,
            )

        elif policy_result.decision == "REQUIRE_APPROVAL":
            # Route to human oversight (Article 14)
            approval = self.request_human_approval(
                inputs=inputs,
                risk_level=policy_result.risk_level,
                approver_role=policy_result.required_approver,
                timeout_hours=24,
            )

            if not approval.approved:
                raise SuprawallDenyException(
                    message=f"Human oversight denied: {approval.reason}",
                    audit_id=approval.audit_id,
                    approver_id=approval.approver_id,
                )

        # ALLOW: pass through with audit context attached
        inputs["_suprawall_audit_id"] = policy_result.audit_id
        return inputs
```

---

## The `after_agent()` Hook: Audit Logging

The `after_agent()` hook runs after every agent step, regardless of outcome. This is your Article 12 implementation:

```python
    def after_agent(self, inputs: dict, outputs: dict) -> dict:
        """
        Called after each agent step.
        Writes to the audit trail regardless of success or failure.
        """

        self.audit_logger.log_execution(
            # What was requested
            inputs=inputs,

            # What happened
            outputs=outputs,
            agent_steps=outputs.get("intermediate_steps", []),
            tools_called=[step[0].tool for step in outputs.get("intermediate_steps", [])],

            # Compliance metadata (Article 12)
            audit_id=inputs.get("_suprawall_audit_id"),
            session_id=inputs.get("session_id"),
            user_id=inputs.get("user_id"),
            timestamp=datetime.utcnow().isoformat(),
            eu_ai_act_articles=["Article 12"],

            # Retention policy
            retain_until=datetime.utcnow() + timedelta(days=self.audit_retention_days),
        )

        return outputs
```

Every execution — approved, denied, or completed — produces a log entry with enough context to reconstruct what happened. These logs are queryable via Suprawall's dashboard and exportable as PDF audit reports for regulatory submissions.

---

## Composing with LangChain's Built-in Middleware

Suprawall works alongside, not instead of, LangChain's built-in middleware. A production-ready stack might look like:

```python
from langchain.middleware import PIIMiddleware, ContentFilterMiddleware
from langchain_suprawall import SuprawallMiddleware

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[
        # Layer 1: Strip PII before it reaches the model (LangChain built-in)
        PIIMiddleware(entities=["PERSON", "EMAIL", "PHONE"]),

        # Layer 2: Filter harmful content (LangChain built-in)
        ContentFilterMiddleware(threshold=0.8),

        # Layer 3: EU AI Act compliance (Suprawall)
        SuprawallMiddleware(
            api_key=os.environ["SUPRAWALL_API_KEY"],
            risk_level=RiskLevel.HIGH,
            require_human_oversight=True,
            audit_retention_days=730,
        ),
    ],
)
```

Each layer handles a different concern. PII and content filtering protect your model. Suprawall creates the compliance record that protects your organization.

---

## Generating Audit Reports

When you need to demonstrate compliance — for a DPIA, a regulatory audit, or an internal review — Suprawall can generate Article 12-compliant audit reports directly from your logged data:

```python
from langchain_suprawall import AuditReporter

reporter = AuditReporter(api_key=os.environ["SUPRAWALL_API_KEY"])

# Generate a report for a specific time period
report = reporter.generate(
    start_date="2025-01-01",
    end_date="2025-03-31",
    format="pdf",                    # PDF for regulatory submissions
    include_articles=["Article 9", "Article 12", "Article 14"],
    include_human_decisions=True,    # Full HITL decision log
)

report.save("q1_2025_eu_ai_act_audit.pdf")
```

The resulting PDF documents every agent execution, every human oversight decision, and maps each control to its corresponding EU AI Act article. It's designed to be handed directly to an auditor.

---

## What This Doesn't Cover

This guide focuses on the middleware layer. EU AI Act compliance is broader — it also involves:

- **Conformity assessments** before deploying high-risk AI systems
- **Technical documentation** (Article 11) describing your system's purpose, architecture, and training data
- **Transparency obligations** (Article 13) for informing users they're interacting with an AI
- **Fundamental rights impact assessments** for certain use cases

`langchain-suprawall` covers the runtime controls (Articles 9, 12, 14) that every agentic deployment needs. The broader compliance program is a legal and organizational effort that middleware alone can't replace.

---

## Getting Started

```bash
pip install langchain-suprawall
```

Full documentation and official Claude Code listing: [Claude MCP Directory — SupraWall](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/suprawall)

If you're building LangChain agents that operate in the EU or serve EU users, the middleware layer is the most concrete, technical step you can take toward compliance today. Everything else — assessments, documentation, organizational processes — is easier when you have a reliable audit trail to point to.

---

*Questions? Find SupraWall on the [LangChain Ecosystem Page](https://python.langchain.com/docs/integrations/providers/suprawall) or open an issue on the `langchain-suprawall` repo.*
