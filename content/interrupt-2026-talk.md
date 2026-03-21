# Interrupt 2026 — Lightning Talk Submission

**Conference:** Interrupt 2026 by LangChain
**Date:** May 13–14, 2026, San Francisco
**Format:** Lightning talk (typically 5–10 minutes)
**Submission URL:** Check interrupt.langchain.com for the CFP form

---

## Talk Title (Options — pick one or mix)

**Option A (direct):**
"Making LangChain Agents EU AI Act Compliant with One Line of Middleware"

**Option B (problem-first):**
"Your LangChain Agent Isn't Ready for Production in Europe — Here's the Fix"

**Option C (contrast angle):**
"Built-in HITL vs. Enterprise Compliance: What the EU AI Act Actually Requires"

*Recommendation: Option A is the clearest for a talk title and directly references both LangChain and the EU AI Act — good for search discoverability in the conference program.*

---

## Abstract (for CFP submission)

```
The EU AI Act imposes specific technical requirements on AI agents — human oversight
(Article 14), audit logging (Article 12), and risk management controls (Article 9) —
that LangChain's built-in guardrails don't fully address. HumanInTheLoopMiddleware is
great for development, but it routes approval requests to the terminal with no audit
trail. That's not production-ready, and it's not compliant.

This talk shows how to implement all three requirements as composable LangChain
middleware using langchain-suprawall: a before_agent() hook that evaluates policy and
routes high-risk actions to Slack/dashboard for human approval, and an after_agent()
hook that writes Article 12-compliant audit logs. The full implementation is a drop-in
middleware alongside PIIMiddleware and ContentFilterMiddleware — one addition to the
middleware list, no changes to your existing agent logic.

Attendees will leave with working code they can use immediately and a clear map of
which EU AI Act requirements map to which parts of the LangChain middleware stack.
```

*(280 words — trim to the CFP's word limit if needed)*

---

## Short Abstract (if CFP has a word limit)

```
The EU AI Act requires human oversight (Article 14), audit logging (Article 12), and
risk management (Article 9) for production agent deployments — but LangChain's
built-in guardrails don't cover these. This talk shows how to implement all three as
composable middleware: a before_agent() policy hook that routes high-risk actions for
Slack/dashboard approval, and an after_agent() hook that writes tamper-evident audit
logs. One middleware addition. No changes to existing agent logic.
```

---

## Speaker Bio (for CFP submission)

```
Alejandro Peghin is the founder of Suprawall, an EU AI Act compliance layer for
production AI agents. He's been building AI automation systems for e-commerce and
agency clients, and became obsessed with the compliance gap after realizing how many
production deployments are missing the basic runtime controls the EU AI Act requires.
Suprawall implements those controls as middleware for LangChain and the Vercel AI SDK.
```

*(Adjust as needed — add any relevant prior speaking, community contributions, etc.)*

---

## Talk Outline (5-minute version)

**0:00–0:45 — The problem**
LangChain's built-in HITL is terminal-based. No audit trail. No production path.
The EU AI Act says that's not good enough for high-risk systems.

**0:45–2:00 — What the EU AI Act actually requires**
Quick map of Articles 9/12/14 to engineering concepts: policy engine, audit log, logged human approval. Not abstract law — concrete things your code needs to do.

**2:00–3:30 — Live code demo**
30 seconds: the "before" — `HumanInTheLoopMiddleware` with terminal prompt.
90 seconds: the "after" — `SuprawallMiddleware` with Slack approval + audit log.
Same agent. One middleware swap. Show what the Slack notification looks like and what gets written to the audit log.

**3:30–4:30 — The composable stack**
Show the full middleware stack: `PIIMiddleware` → `ContentFilterMiddleware` → `SuprawallMiddleware`. Each layer handles a different concern. They all compose naturally.

**4:30–5:00 — Takeaway + call to action**
`pip install langchain-suprawall`. The LangChain guardrails page is missing a compliance section — here's what it should say (reference the open PR if merged by May).

---

## 10-Minute Expansion (if given a full slot)

Add a section after the demo:

**Audit report generation**
Show the PDF audit report output — this is what a regulator or DPA actually asks for. Two lines of Python. Covers the full quarter of agent executions.

**The middleware pattern beyond compliance**
`before_agent()` and `after_agent()` hooks are general-purpose. Show one non-compliance use case (e.g., cost tracking, rate limiting) to position Suprawall as part of the broader middleware ecosystem, not just a compliance tool.

---

## Slide Deck Outline

1. **"Is your LangChain agent legal in Europe?"** — title slide, rhetorical hook
2. **EU AI Act in 30 seconds** — three boxes: Art. 9 (risk), Art. 12 (logs), Art. 14 (oversight)
3. **Built-in HITL: what it does** — code snippet + terminal screenshot
4. **Built-in HITL: what's missing** — same code, but highlight the three gaps
5. **The fix** — `SuprawallMiddleware` drop-in code snippet
6. **Demo: Slack approval notification** — screenshot of what the approver sees
7. **Demo: Audit log entry** — JSON snippet of a logged execution
8. **The compliant middleware stack** — diagram: PII → Content → Suprawall
9. **PDF audit report** — screenshot of generated report
10. **`pip install langchain-suprawall`** — repo link, docs link, thanks

---

## Submission Notes

- The CFP for Interrupt 2026 typically opens 3–4 months before the event — watch interrupt.langchain.com for announcements
- Lightning talks are often less competitive than full sessions — submit early
- If rejected for a talk slot, offer to run a 30-minute workshop or demo table instead
- The compliance angle is genuinely unique in the LangChain conference ecosystem — nobody else is pitching this
- Having a published PyPI package and live documentation before submitting significantly strengthens the submission
