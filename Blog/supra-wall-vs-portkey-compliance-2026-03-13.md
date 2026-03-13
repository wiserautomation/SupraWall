# Your AI Gateway Isn't Your Compliance Layer (And Why That Distinction Matters in 2026)

**Primary keyword:** AI agent compliance vs AI gateway
**Secondary keywords:** Portkey governance, EU AI Act compliance tool, AI policy enforcement
**URL slug:** /blog/ai-gateway-vs-compliance-layer
**Meta description:** Portkey just made enterprise AI governance free. But governance and EU AI Act compliance aren't the same thing. Here's the gap — and why it matters before August 2026.
**Published:** March 13, 2026
**Author:** Alejandro (Supra-wall)

---

## Introduction

Portkey just raised $15M, made its enterprise AI gateway free, and is now processing 500 billion tokens a day across 24,000 organizations. This week they signalled that governance features — permissions, identity, access boundaries, budget controls — are coming later in 2026.

If you're building AI agents, this is genuinely useful infrastructure. A unified gateway for routing, caching, rate limiting, and observability across model providers is a real problem Portkey solves well.

But there is a conflation happening in the market that is worth naming directly: gateway governance and EU AI Act compliance are not the same thing. The distinction will matter considerably when enforcement begins in August 2026.

Here is precisely where the gap is — and why it exists.

---

## What an AI Gateway Does

An AI gateway sits between your application and your model providers. Portkey, and tools like it, give you:

- **Routing and load balancing** — spread requests across providers, fall back on failures
- **Cost controls** — set token budgets, track spend by team or project
- **Observability** — log prompts and completions, trace latency, monitor error rates
- **Rate limiting and access control** — define which teams can call which models
- **Caching** — reduce redundant calls, lower cost

These are infrastructure-level capabilities. They operate at the API call layer: request goes in, response comes out, the gateway logs and routes it.

For AI agent deployments specifically, Portkey is also building permission frameworks and access boundaries. This means you will be able to define which agents can call which tools, and set limits on what they can do within your Portkey-managed infrastructure.

This is useful. And it is not what the EU AI Act requires.

---

## What the EU AI Act Actually Requires

The EU AI Act's compliance obligations for high-risk AI systems are not about infrastructure management. They are about legal accountability and demonstrable human control. Let's look at the specific requirements that a gateway cannot fulfill.

### Article 9 — Risk Management System

Before deploying a high-risk AI system, you must establish, implement, document, and maintain a risk management system throughout the entire lifecycle of the system. This is not a runtime control — it is a pre-deployment process requirement.

A gateway logs what happens. Article 9 requires documented evidence that you identified and evaluated risks *before* it happened. These are different disciplines: observability vs. governance documentation.

### Article 14 — Human Oversight

Article 14 requires that high-risk AI systems be designed to enable human oversight — specifically, the ability for natural persons to understand the system's capabilities, detect anomalous behavior, and intervene or override before the system's output influences real-world outcomes.

A gateway's access controls can restrict which agents call which tools. That is not the same as ensuring a human can intercept and review an action before it completes. Article 14 demands the latter — a human-in-the-loop decision point at the action level, not just at the infrastructure level.

### Article 13 — Traceability

Article 13 requires that high-risk AI systems maintain logs sufficient to ensure traceability of results. Specifically, these logs must enable post-hoc determination of what inputs the system processed, what decisions it made, and what actions it took.

Gateway observability logs prompt/completion pairs and latency. Article 13 compliance requires you to log the agent's reasoning context, the specific tool calls it attempted, the policy state at the time of each decision, and a chain-of-custody sufficient to answer a regulatory inquiry.

Gateway logs are built for engineers debugging performance. Compliance audit trails are built for regulators investigating accountability.

---

## The Feature-by-Feature Comparison

| Capability | Portkey (Gateway) | Supra-wall (Compliance) |
|---|---|---|
| Route requests across model providers | ✅ Core feature | ❌ Not in scope |
| Track cost and token usage | ✅ Core feature | ❌ Not in scope |
| Log prompts and completions | ✅ Observability | ⚠️ Partial (action-level only) |
| Define which agents access which tools | ✅ Permission framework | ✅ Policy rules |
| Require human approval before high-stakes actions | ❌ Not offered | ✅ REQUIRE_APPROVAL policy |
| Block specific action categories by policy | ❌ Not offered | ✅ DENY policy |
| Produce EU AI Act Article 13 audit evidence | ❌ Not designed for this | ✅ Built-in structured audit trail |
| Map to specific EU AI Act articles | ❌ Not offered | ✅ Policy mapped to Article 9, 13, 14 |
| Generate compliance report for auditors | ❌ Not offered | ✅ Exportable compliance evidence |
| Article 9 risk documentation support | ❌ Not offered | ✅ Guided risk documentation flow |

The table above is not a criticism of Portkey. It is doing what a gateway is supposed to do — infrastructure management and observability — with exceptional execution. The point is that the compliance obligations your AI agents face in 2026 require a different layer entirely.

---

## Where They Complement Each Other

The good news: these are not competing products. They are different layers in the same stack, and the strongest agent deployments will use both.

A reasonable architecture for an AI agent that must comply with the EU AI Act looks like this:

```
[Your AI Agent]
       ↓
[Supra-wall — Policy enforcement, human-in-the-loop, compliance audit trail]
       ↓
[Portkey — Model routing, observability, cost control, caching]
       ↓
[Model Providers — OpenAI, Anthropic, Mistral, etc.]
```

Supra-wall operates at the *action* layer — intercepting tool calls before they execute and enforcing policy rules. Portkey operates at the *inference* layer — managing how model API calls are made and observed. Neither replaces the other.

If you are currently using Portkey (or considering adopting it given the free enterprise tier), you should also be asking: what handles my Article 14 human oversight requirement? What generates my Article 13 audit trail? What enforces the policies that keep my agent within the boundaries I've documented for my Article 9 risk assessment?

Those questions don't have answers in the Portkey product. They have answers in Supra-wall.

---

## The Timing Argument

Portkey's governance features are on the roadmap for *later in 2026*. EU AI Act enforcement begins August 2, 2026. That gap matters.

If you wait for your gateway to add compliance features, you are betting that:

1. The governance features ship on time
2. They cover EU AI Act requirements specifically (not just internal access control)
3. You have enough runway to implement and document them before enforcement begins

That is a significant risk concentration. And it ignores the fact that Article 9 requires your risk documentation to exist *before* deployment — not before enforcement.

The compliance layer is not something you add when the regulator asks for it. It is something you build into your agent architecture from the start.

---

## Conclusion

Portkey is excellent infrastructure for building production AI agents at scale. Making the enterprise gateway free is a genuinely positive development for the industry — lower barriers to observability and cost management benefit everyone building on LLMs.

But observability is not compliance. Access controls are not human oversight. Token budgets are not risk documentation.

The EU AI Act asks a different set of questions than your gateway answers. Before August 2026, you need both layers covered.

[See how Supra-wall adds the compliance layer to your existing agent stack → Get started in under 5 minutes]

---

*Related reading: [Agent-to-Agent Commerce Meets the EU AI Act: What Palo Alto's Threat Report Missed](/blog/agent-to-agent-commerce-eu-ai-act)*
