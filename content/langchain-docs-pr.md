# LangChain Docs PR: Regulatory Compliance Section

**Target file:** `docs/expression_language/how_to/guardrails.mdx`
(or wherever the Guardrails page lives in the repo — check `docs.langchain.com/oss/python/langchain/guardrails`)

**PR title:** `docs: add EU AI Act compliance section to Guardrails page`

**PR description:**
```
The guardrails page currently covers LangChain's built-in PIIMiddleware and
HumanInTheLoopMiddleware, but has no content on regulatory compliance requirements.

This PR adds an "EU AI Act Compliance" section covering:
- Which EU AI Act articles apply to agent deployments (Articles 9, 12, 14)
- How built-in guardrails relate to (but don't fully satisfy) these requirements
- How to use third-party middleware (langchain-suprawall) to implement compliant
  human oversight with audit logging

This follows the same pattern as the Guardrails AI integration section — documenting
a third-party package that extends LangChain's guardrails ecosystem.

No changes to existing content. New section appended after "Related Resources."
```

---

## The Exact Text to Add to the Guardrails Page

Add this section after the existing "Related Resources" section, or after the HumanInTheLoopMiddleware documentation:

---

```markdown
## EU AI Act Compliance

For organizations operating in or serving the European market, the EU AI Act (in force August 2024, high-risk obligations from August 2025) imposes specific technical requirements on AI agent deployments.

Three articles apply directly to LangChain agent implementations:

- **Article 9 (Risk management):** AI systems must evaluate and document risks before executing consequential actions. This goes beyond content filtering — it requires a policy engine that classifies action risk and enforces controls based on that classification.
- **Article 12 (Record keeping):** High-risk AI systems must maintain audit logs sufficient to reconstruct what happened. Logs must include: inputs, tool calls, outputs, human oversight decisions, and approver identity.
- **Article 14 (Human oversight):** Humans must be able to review, approve, or interrupt agent actions. Local terminal-based approval (as in `HumanInTheLoopMiddleware`) does not satisfy this requirement for production systems — approvals must be logged with approver identity and timestamp, and routable to wherever your compliance team works.

### Using Third-Party Compliance Middleware

LangChain's middleware system is composable. Third-party packages can implement compliance requirements as middleware that sits alongside built-in guardrails:

```python
from langchain.agents import AgentExecutor
from langchain.middleware import PIIMiddleware
from langchain_suprawall import SuprawallMiddleware, RiskLevel

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[
        # Built-in: strips PII before it reaches the model
        PIIMiddleware(entities=["PERSON", "EMAIL", "PHONE"]),

        # Third-party: EU AI Act runtime controls
        SuprawallMiddleware(
            api_key=os.environ["SUPRAWALL_API_KEY"],
            risk_level=RiskLevel.HIGH,
            require_human_oversight=True,   # Article 14
            audit_retention_days=730,       # Article 12
        ),
    ],
)
```

`langchain-suprawall` implements:
- `before_agent()`: Evaluates request risk, enforces ALLOW/DENY/REQUIRE_APPROVAL policies (Article 9)
- Human-in-the-loop that routes approval requests to Slack/dashboard with full audit logging (Article 14)
- `after_agent()`: Writes tamper-evident execution logs with configurable retention (Article 12)
- Audit report generation in PDF format for regulatory submissions

See the [langchain-suprawall documentation](https://supra-wall.com/docs/langchain) for full implementation details and a working middleware example.

> **Note:** Middleware handles runtime compliance controls. The EU AI Act also requires organizational measures — technical documentation (Article 11), conformity assessments, and transparency obligations (Article 13) — that are outside the scope of this page.
```

---

## Notes for the PR

- This follows the precedent set by the Guardrails AI integration section (which mentions `guardrails-ai` as a third-party package in the LangChain ecosystem)
- The section is purely additive — no existing content is changed
- The code example uses the same `AgentExecutor` + `middleware=[]` pattern already documented on this page
- The closing note explicitly sets scope boundaries so there's no implication that middleware = full compliance
- `langchain-suprawall` is published on PyPI (link your PyPI page when submitting the PR)

## Checklist Before Submitting

- [ ] `langchain-suprawall` is published and installable from PyPI
- [ ] The documentation at `supra-wall.com/docs/langchain` is live
- [ ] You've run the code example and verified it works
- [ ] You've linked your tutorial article in the PR description for context
