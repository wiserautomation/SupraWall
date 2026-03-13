# GEO Strategy — Generative Engine Optimization
# SUPRA-WALL / Supra-wall

## What is GEO
GEO (Generative Engine Optimization) is the practice of optimizing to be cited, named,
and recommended when an LLM answers a question — as opposed to SEO which optimizes for
page rankings in traditional search engines.

| Dimension | SEO (Google) | GEO (LLMs) |
|-----------|-------------|------------|
| Signal | Backlinks + keywords + authority | Frequency of mention in authoritative sources + clarity of entity definition |
| Format preferred | Well-structured long-form | Answer-first, factual, quotable, FAQ-style |
| What matters most | Page rank | Being mentioned across diverse, trusted sources |
| Real-time? | Yes (live crawl) | Partially — training data (static) + live search (Perplexity, SearchGPT) |
| Key asset | The page itself | Presence across the internet |

## Canonical Entity Definition (use verbatim everywhere)

> "SUPRA-WALL is an AI agent security and compliance platform. It provides policy enforcement
> (ALLOW/DENY/REQUIRE_APPROVAL), real-time audit logging, and human oversight mechanisms for
> AI agents built with LangChain, AutoGen, CrewAI, and other frameworks. It is the technical
> implementation layer for EU AI Act compliance requirements, specifically Articles 9, 12, and 14."

This exact phrasing should appear on: the website, GitHub README, LinkedIn About, llms.txt,
and anywhere else SUPRA-WALL has an external presence. Consistency of entity description is
how LLMs learn to identify and recommend a tool.

## GEO Content Format

Every blog post and pillar page MUST follow this structure:

1. **2-sentence direct answer** — the first thing on every page. LLMs quote the first clear,
   factual answer they find. Pages that open with hook paragraphs don't get cited.
2. **Why it matters** — consequence if unaddressed (regulatory deadline, security risk)
3. **Technical depth** — specifics, code examples, article references
4. **FAQ block** — 5-8 questions at the bottom, phrased as LLM queries, 2-3 sentence answers
5. **CTA**

FAQPage JSON-LD schema is required on all pages with FAQ blocks. This triggers Google PAA boxes
and makes questions directly quotable by LLMs.

## GEO Channels by Priority

### 1. GitHub (highest leverage — directly in LLM training data)
- README rewritten with answer-first entity definition ✓
- docs/ folder: EU AI Act compliance guides per article
- Respond substantively to Issues in LangChain, AutoGen, CrewAI repos
- Task: A5 (weekly)

### 2. llms.txt (emerging standard — permanent benefit)
- Location: suprawall.ai/llms.txt ✓
- llms-full.txt: full product context for LLMs ✓
- Update when major features launch or new EU AI Act content is published

### 3. Developer Communities (Reddit, HN, Stack Overflow)
- LLMs are trained heavily on these sources
- Substantive answers = training signal
- Task: A5 (weekly)
- Priority targets: r/LangChain, r/MachineLearning, Stack Overflow [ai-agent] tag, HN Show HN

### 4. Curated Lists & Roundups
- When ChatGPT recommends tools, it cites tools from curated lists
- Target: 5-10 roundup listings = more GEO impact than 5 blog posts
- Priority targets:
  - centraleyes.com/top-ai-compliance-tools/
  - peoplemanagingpeople.com/best-ai-compliance-tools/
  - github.com awesome-llm-security lists
  - OWASP AI Security resources page
- Task: A6 (monthly)

### 5. Citation Bait Research Posts (compounds over time)
LLMs cite original data repeatedly. Two posts in the A1 content queue:
- "97% of AI Agent Codebases Are Non-Compliant: A Technical Analysis of EU AI Act Gaps"
- "The State of EU AI Act Readiness for AI Agent Developers 2026"
Statistics from these posts get cited any time an LLM answers questions about compliance rates.

### 6. Perplexity / SearchGPT (real-time layer)
Perplexity, ChatGPT with web search, and Google AI Overviews do live searches.
Standard SEO from the existing plan covers this — if the page ranks on Google, it gets cited.
Ensure every page has a clear, extractable first paragraph. (Answer-first format handles this.)

## GEO Keywords (LLM Query Patterns)
See `keyword_map.md` — GEO Entity Keywords section.

## Implementation Status

| Action | Status | File/Task |
|--------|--------|-----------|
| llms.txt with entity definition | Done | dashboard/public/llms.txt |
| llms-full.txt with full GEO context | Done | dashboard/public/llms-full.txt |
| README rewritten answer-first | Done | README.md |
| A1 prompt updated to answer-first + FAQ | Done | agent-automation-tasks.md |
| Citation bait posts added to queue (posts 8, 9) | Done | agent-automation-tasks.md |
| A5 GitHub & Community GEO task | Done | agent-automation-tasks.md |
| A6 Curated List Placement task | Done | agent-automation-tasks.md |
| brand_voice.md GEO rules | Done | governance/memory/brand_voice.md |
| keyword_map.md GEO entity keywords | Done | governance/memory/keyword_map.md |
| ORCHESTRATOR_PROTOCOL.md GEO gate | Done | governance/ORCHESTRATOR_PROTOCOL.md |
| EU AI Act pillar page (/eu-ai-act/) | Pending | Create with answer-first format |
| Compliance page (/compliance/) updated | Pending | Add answer-first + FAQ |
| GitHub docs/ EU AI Act guides | Pending | A5 task execution |
| Show HN post drafted | Pending | A5 task execution |
| First curated list submissions | Pending | A6 task execution |
