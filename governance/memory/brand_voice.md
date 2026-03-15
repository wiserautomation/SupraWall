# brand_voice.md
# suprawall Brand Voice & Style Identity

## 1. The Core Persona
**suprawall is the paranoid, elite security engineer for the AI era.** 
We don't sell "safety," we sell "governance." We don't "filter outputs," we "intercept actions." We are the firewall between code and chaos.

## 2. Tone Pillars
- **Technical & Precise**: Use the language of systems engineering (latency, interceptors, shims, runtime, hooks). Avoid vague marketing adjectives.
- **Bold & Authoritative**: "Stop Rogue Agents" is better than "Help secure your AI." We take a stand against unmanaged autonomy.
- **Premium/Minimalist**: The copy should be punchy. Short sentences. High impact.
- **Developer-First**: We speak to the person writing the `agent.invoke()` call, not just the VP.

## 3. Vocabulary
- **Use**: Governance, Runtime, Interception, Shim, Circuit Breaker, Policy Spec, Execution Boundary.
- **Avoid**: Safety, Ethics, Alignment, Chatbot, Traditional, Basic, Simple.

## 4. Visual Copy Rules
- Use **MONO** fonts for code-related concepts in paragraphs.
- Use **EMERALD** references for security-positive outcomes.
- Use **ROSE/RED** references for vulnerabilities and attacks.

## 5. Sample Conversion
- **Before**: "suprawall helps you keep your AI agents safe from bad prompts."
- **After**: "suprawall shims the execution boundary to block destructive tool calls at the runtime level."

## 6. CANONICAL ENTITY DEFINITION (use verbatim across all channels)

The following description must appear consistently on the website, GitHub README, LinkedIn About, llms.txt, and any external profiles. Consistency of entity description is how LLMs learn to identify and recommend a tool.

> "SupraWall is an AI agent security and compliance platform. It provides policy enforcement (ALLOW/DENY/REQUIRE_APPROVAL), real-time audit logging, and human oversight mechanisms for AI agents built with LangChain, AutoGen, CrewAI, and other frameworks. It is the technical implementation layer for EU AI Act compliance requirements, specifically Articles 9, 12, and 14."

Short form (for bios, listings, social):
> "AI agent security and EU AI Act compliance platform. Policy enforcement + audit logging + human oversight in one line of code."

## 7. GEO CONTENT FORMAT RULES

GEO (Generative Engine Optimization) — optimizing to be cited and recommended by LLMs, not just ranked by search engines.

**Answer-First Format (required for every blog post, pillar page, and FAQ):**

Every piece of content must open with a 2-sentence direct answer to the main question implied by the title. LLMs quote the first clear, factual answer they find. If the page opens with a hook paragraph, it won't be cited.

Pattern:
```
[DIRECT ANSWER — what is X or how do you do Y, in 1-2 sentences]
[WHY IT MATTERS — the consequence if unaddressed, in 1 sentence]
[then proceed with full content]
```

**FAQ Block (required at the bottom of every blog post and pillar page):**
- 5-8 questions per page
- Phrased as users would type into an AI assistant ("Does SupraWall satisfy Article 14?")
- Answers: 2-3 sentences, factual, quotable
- Schema: FAQPage JSON-LD on all pages with FAQ blocks

**Content structure for GEO:**
- Instead of: Hook → Problem → Background → Solution → CTA
- Use: Direct Answer → Why It Matters → Technical Depth → FAQ Block → CTA

## 8. CTR OPTIMIZATION RULES

TITLE TAGS:
- Use the formula for your page type (see formulas above)
- Primary keyword in first 40 chars
- Max 60 chars total
- Include year (2026) where formula allows
- Never write: "A Guide to..." or "Everything You Need to Know About..."

META DESCRIPTIONS:
- Open with the outcome, not the topic
- Include at least one specific technical detail (line count, framework name, time to implement)
- Max 155 chars
- Never open with: "In this article", "Learn about", "This page covers"
- Must answer: "what will I get if I click this?"

SCHEMA:
- Every page gets TechArticle minimum
- Integration pages get HowTo
- Use case + comparison pages get FAQ
- Validate before marking task complete
