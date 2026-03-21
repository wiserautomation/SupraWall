# SEO Weekly Plan — March 20, 2026

**Planning date:** Friday, March 20, 2026
**Execution windows:** Wednesday Mar 25 / Friday Mar 27
**Monthly goal:** Build programmatic SEO foundation + capitalize on EU AI Act timeline shift + respond to competitor moves

---

## 1. Metrics Snapshot

| Metric | Status |
|---|---|
| **Google indexation (site:supra-wall.com)** | ~1 result visible in search (homepage). Deep pages not yet surfacing in site: query — indexation is still early-stage. |
| **Total content pages (app)** | ~80 page.tsx files across /learn (22), /blog (5), /vs (6), /integrations (6), /docs (10), /eu-ai-act (2), /features (2), /tools (1), /use-cases (2), /compliance (1) |
| **Key term rankings** | No SupraWall pages observed ranking for competitive queries yet. Focus remains on getting indexed and building topical authority. |

**Assessment:** We are in the crawl/index phase. Priority this week is increasing indexable page count (especially programmatic/glossary pages) and ensuring existing pages have proper structured data.

---

## 2. Hot Topics This Week (March 17–20, 2026)

### 🔥 Time-Sensitive Opportunities

1. **EU AI Act High-Risk Deadline Delay Proposed (March 18)**
   - The EU Council published proposals to push the August 2, 2026 high-risk AI deadline to December 2027 (standalone) / August 2028 (embedded in products).
   - Transparency obligations for AI-generated content still target August 2, 2026.
   - **Content opportunity:** Urgent explainer article — "EU AI Act High-Risk Deadline Delayed: What It Means for AI Agent Security" — this is breaking regulatory news that few AI security companies will cover quickly.

2. **Galileo Releases Open Source Agent Control Plane (March 11)**
   - Direct competitor launched an open-source control plane for governing AI agents at scale.
   - **Content opportunity:** Update the /vs/galileo comparison page to address Agent Control. Also create a blog post: "Galileo Agent Control vs SupraWall: Open Source vs Runtime Security."

3. **OWASP Top 10 for Agentic AI Published**
   - Straiker is already creating content around this. We need to cover it too.
   - **Content opportunity:** "/learn/owasp-top-10-agentic-ai" — comprehensive guide mapping OWASP risks to SupraWall capabilities.

4. **Arcjet Prompt Injection Protection Launch (March 19)**
   - New entrant offering inline prompt injection defense for JavaScript/Python.
   - **Content opportunity:** Could warrant a /vs/arcjet comparison page later. For now, reference in prompt injection content.

5. **Token Security Intent-Based AI Agent Security (March 18)**
   - New approach to agent security based on intent alignment.
   - **Content opportunity:** Potential comparison page. Monitor for traction.

6. **Entro Security AGA Launch (March 19)**
   - Agentic Governance & Administration for identity/access management of AI agents.
   - **Content opportunity:** Complementary positioning — Entro covers identity, SupraWall covers runtime.

### 📊 Key Stats for Content (cite in articles)
- 80% of organizations report risky agent behaviors (unauthorized access, data exposure)
- Only 21% of executives have complete visibility into agent permissions
- 1 in 8 AI breaches now linked to agentic systems
- Prompt injection appears in 73% of production AI deployments; 84% attack success rate in agentic systems
- Machine-to-human identity ratios reaching 100:1 in cloud environments
- Gartner predicts 80% of enterprises will deploy AI agents in production by end of 2026

---

## 3. Competitor Activity Summary

| Competitor | Recent Activity | Threat Level |
|---|---|---|
| **Galileo** | Released open-source Agent Control plane (March 11). Blog: "8 Best AI Agent Guardrails Solutions in 2026" — SupraWall NOT listed. | 🔴 High |
| **Straiker** | Named EMA Visionary at RSAC 2026. Active blog: OWASP Top 10 for Agentic AI breakdown, RSAC preview, Attack & Defense Agents product launch. Claims "fastest-growing agentic-first AI security company." | 🔴 High |
| **Arcjet** | New entrant — inline prompt injection protection for JS/Python apps (March 19). | 🟡 Medium |
| **Token Security** | Intent-based AI agent security launch (March 18). | 🟡 Medium |
| **Entro Security** | AGA platform for agent identity governance (March 19). | 🟡 Medium |
| **Guardrails AI** | No significant new content detected this week. | 🟢 Low |
| **NVIDIA NeMo** | OpenShell runtime announced at GTC-adjacent event. | 🟡 Medium |

---

## 4. Wednesday Execution Plan (March 25)

### 4A. New Content — Blog Post (High Priority)
**Title:** "EU AI Act High-Risk Deadline Delayed to 2027: What AI Agent Teams Must Do Now"
**Path:** `/blog/eu-ai-act-high-risk-deadline-delayed-2027/page.tsx`
**Target keywords:** EU AI Act delay 2027, EU AI Act high-risk deadline extension, AI Act compliance timeline changes
**Word count:** 2,000+ words
**Content outline:**
1. Breaking news: EU Council proposes pushing high-risk deadline from Aug 2026 to Dec 2027
2. What obligations still apply on August 2, 2026 (transparency, AI-generated content)
3. Why this doesn't mean you can delay preparation (companies that prepare early gain competitive advantage)
4. How SupraWall's runtime compliance features map to both timelines
5. Checklist: 5 steps to take now regardless of the timeline shift
6. FAQ schema with 5+ Q&As

**Internal links to add:**
- /learn/eu-ai-act-compliance-ai-agents
- /learn/eu-ai-act-article-14-human-oversight
- /learn/eu-ai-act-article-9-risk-management
- /learn/eu-ai-act-high-risk-ai-assessment
- /eu-ai-act/article-12
- /eu-ai-act/article-14
- /compliance

### 4B. New Content — Learn Article (Tier 1 Programmatic)
**Title:** "OWASP Top 10 for Agentic AI: Complete Security Guide"
**Path:** `/learn/owasp-top-10-agentic-ai/page.tsx`
**Target keywords:** OWASP top 10 agentic AI, OWASP AI agent security risks, agentic AI security risks
**Word count:** 3,000+ words
**Content outline:**
1. What is the OWASP Top 10 for Agentic AI?
2. Risk-by-risk breakdown (all 10 risks with examples)
3. For each risk: how SupraWall mitigates it (with code snippets where applicable)
4. Comparison table: OWASP risk → SupraWall feature mapping
5. Implementation checklist
6. FAQ schema with 8+ Q&As

**Internal links:**
- /learn/prompt-injection-credential-theft
- /learn/ai-agent-security-best-practices
- /learn/zero-trust-ai-agents
- /learn/human-in-the-loop-ai-agents
- /learn/ai-agent-audit-trail-logging
- /learn/ai-agent-pii-protection

### 4C. Technical SEO Improvements
1. **Update /vs/galileo page** — Add section addressing Galileo's new Agent Control open-source launch. Differentiate: open-source policy engine vs. full runtime security platform.
2. **Add FAQ schema** to the following pages that likely lack it (check and add if missing):
   - /learn/ai-agent-firewall
   - /learn/zero-trust-ai-agents
   - /learn/runtime-ai-governance
3. **Internal linking pass** — Add links from existing /learn articles to the new OWASP article (reverse links from at least 5 existing pages).

---

## 5. Friday Execution Plan (March 27)

### 5A. New Content — Comparison Page
**Title:** "SupraWall vs Token Security: Runtime Security vs Intent-Based Controls"
**Path:** `/vs/token-security/page.tsx`
**Target keywords:** Token Security alternative, AI agent security comparison, intent-based vs runtime security
**Word count:** 1,500+ words
**Content outline:**
1. Overview of both approaches
2. Feature comparison table
3. When to choose each
4. Integration and deployment differences
5. Pricing model comparison (if available)
6. FAQ schema with 5+ Q&As

**Internal links:**
- /learn/what-is-agent-runtime-security
- /learn/ai-agent-security-best-practices
- /vs/galileo, /vs/straiker (cross-link other comparisons)

### 5B. Glossary Expansion (Tier 1 Programmatic SEO)
Create 5 new glossary term pages under a new `/glossary/` section:
1. `/glossary/agentic-governance/page.tsx` — "What is Agentic Governance?"
2. `/glossary/ai-agent-control-plane/page.tsx` — "What is an AI Agent Control Plane?"
3. `/glossary/intent-based-ai-security/page.tsx` — "What is Intent-Based AI Security?"
4. `/glossary/ai-agent-red-teaming/page.tsx` — "What is AI Agent Red Teaming?"
5. `/glossary/zero-click-ai-attack/page.tsx` — "What is a Zero-Click AI Attack?"

**Each page:**
- 800–1,200 words
- Definition, examples, relevance to enterprise security
- How SupraWall addresses the concept
- FAQ schema with 3+ Q&As
- Internal links to relevant /learn and /blog content

### 5C. Structured Data Expansion
1. **Add HowTo schema** to tutorial-style learn articles:
   - /learn/how-to-set-token-limits-ai-agents
   - /learn/protect-api-keys-from-ai-agents
2. **Verify and fix** existing FAQ schema across all /learn articles (spot-check at least 5)
3. **Update llms.txt** with paths to the new OWASP article, EU AI Act blog post, glossary pages, and Token Security comparison

### 5D. Internal Linking Push
- Link new glossary pages from at least 3 existing /learn articles each
- Add "Related articles" sections to the 2 new Wednesday articles
- Cross-link the new /vs/token-security page from /vs/galileo and /vs/straiker

---

## 6. Weekly Objectives

| # | Objective | Success Metric | Priority |
|---|---|---|---|
| 1 | Publish EU AI Act deadline delay blog post | Live at /blog/eu-ai-act-high-risk-deadline-delayed-2027 with FAQ schema | 🔴 Critical — time-sensitive |
| 2 | Publish OWASP Top 10 for Agentic AI guide | Live at /learn/owasp-top-10-agentic-ai, 3,000+ words, 8+ FAQ Q&As | 🔴 Critical — competitors already covering |
| 3 | Launch glossary section with 5 initial terms | 5 new pages live under /glossary/ with structured data | 🟡 High — foundational for programmatic SEO |
| 4 | Update /vs/galileo to address Agent Control launch | Existing page updated with new comparison section | 🟡 High — competitive response |
| 5 | Add Token Security comparison page | Live at /vs/token-security with FAQ schema | 🟢 Medium — new competitor coverage |

---

## 7. Content Calendar (Next 4 Weeks View)

| Week | Focus | Key Deliverables |
|---|---|---|
| **Mar 20–27 (this week)** | EU AI Act news + OWASP coverage + glossary launch | 2 articles, 5 glossary pages, 1 comparison update, 1 new comparison |
| **Mar 28–Apr 3** | Expand EU AI Act article-by-article section | 3–4 new /eu-ai-act/ pages (Articles 9, 13, 15, 17) |
| **Apr 4–10** | Prompt injection deep-dive series | 2–3 new /learn articles on advanced prompt injection topics |
| **Apr 11–17** | Industry use-case pages | Financial services, healthcare, legal AI agent security |

---

## 8. Notes & Decisions

- **Indexation concern:** Only the homepage appears in site: search results. This suggests either very recent deployment or potential crawl/index issues. Wednesday task should include checking robots.txt, sitemap.xml, and Google Search Console status if accessible.
- **Galileo threat:** Their "8 Best AI Agent Guardrails Solutions" blog post does NOT list SupraWall. Increasing topical authority and backlink signals is essential to get included in future listicles.
- **EU AI Act timeline shift:** The proposed delay to 2027 is a double-edged sword. On one hand, it reduces urgency for some buyers. On the other hand, the transparency obligations still hit August 2026, and companies that prepare early gain competitive advantage. Content should emphasize the "prepare now" angle.
- **Glossary strategy:** Starting with 5 terms this week. Target is 20+ by end of April, 50+ by June, 100+ by August. Each term page is a long-tail keyword opportunity.
- **OWASP content is urgent:** Straiker is already publishing OWASP-related content. We need the SupraWall perspective out this week.

---

*This plan was auto-generated by the SEO Weekly Planning task on March 20, 2026.*
