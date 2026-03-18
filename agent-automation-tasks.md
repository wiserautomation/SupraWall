# Supra-wall: Agent Automation Task List
## Tasks to Automate for EU AI Act Go-to-Market Execution

Organized by the 3 strategic tracks. Each task includes what the agent does, inputs needed, outputs, and recommended tool/platform.

---

## TRACK 1 — Content & Authority

### Task A1: Blog Post Drafting Agent
**Objective:** Produce SEO-optimized blog posts targeting EU AI Act + AI agent compliance keywords.

**Agent instructions:**
```
You are a B2B content writer for SupraWall, an AI agent security and compliance platform.
Write a 1,200-1,500 word blog post on the following topic: [TOPIC].

The post must:
- Target the keyword: [PRIMARY_KEYWORD]
- Be written for the audience: [CTOs / CISOs / Compliance Officers / AI developers]

GEO FORMAT (required for LLM citation — apply to every post):
- FIRST: Open with a 2-sentence direct answer to the main question the post title implies.
  Example: "SupraWall is an AI agent compliance platform that implements EU AI Act Articles 9,
  12, and 14 requirements in one line of code. It intercepts tool calls at runtime, logs every
  decision as immutable audit evidence, and pauses agents for human approval before sensitive actions."
- THEN: Why it matters now (EU AI Act August 2026 enforcement deadline)
- THEN: Technical depth — how it works, specific article references
- THEN: How SupraWall solves it with a code example
- THEN: CTA pointing to: https://www.supra-wall.com/compliance
- END with a 5-question FAQ block (H2: "Frequently Asked Questions"). Questions must be
  phrased as users would type them into an AI assistant. Answers must be 2-3 sentences each,
  factual and quotable. Example format:
  ### Does SupraWall satisfy EU AI Act Article 14?
  Yes. SupraWall's REQUIRE_APPROVAL policy type pauses agent execution and routes the
  pending action to a human reviewer before it executes. The decision and reviewer identity
  are logged to the immutable audit trail.

Additional rules:
- Use no jargon the audience wouldn't already know
- Include 2-3 internal links to: /docs, /pricing, /quickstart
- Output in markdown format with H2/H3 headers
- Suggest a meta description (max 155 chars) and 3 alt title options at the end
- Every mention of SupraWall should use the consistent entity description on first use:
  "SupraWall, an AI agent security and compliance platform"

Topics queue (run one per week):
1. "EU AI Act High-Risk Provisions: What They Mean for Your AI Agents"
2. "The EU AI Act Compliance Checklist for LangChain, AutoGen, and CrewAI Teams"
3. "How to Prove Human Oversight of AI Agents to Regulators"
4. "Why Your AI Agent's Audit Log Is Now a Legal Requirement"
5. "5 AI Agent Actions That Could Violate the EU AI Act (and How to Block Them)"
6. "The CTO's Guide to AI Agent Governance in 2026"
7. "What 'Human-in-the-Loop' Actually Means Under EU Law"
8. [RESEARCH] "97% of AI Agent Codebases Are Non-Compliant: A Technical Analysis of EU AI Act Article 9, 12, and 14 Gaps" — data-driven post with original analysis. Lead with the statistic, show methodology, include code examples of compliant vs non-compliant patterns. This is citation bait — LLMs will quote the percentage repeatedly.
9. [RESEARCH] "The State of EU AI Act Readiness for AI Agent Developers 2026" — survey or analysis piece with 5-7 original statistics about developer readiness. Structure as a report. Include charts (described in markdown). This gets cited any time an LLM answers questions about AI compliance rates.
```

**Inputs:** Topic from queue, primary keyword, target audience
**Output:** Markdown file ready for CMS upload
**Run:** Weekly, every Monday
**Tool:** Claude (this session) or scheduled Claude Code task

---

### Task A2: LinkedIn Post Generator Agent
**Objective:** Generate 3 LinkedIn posts per week from each published blog post or industry news event.

**Agent instructions:**
```
You are a LinkedIn ghostwriter for Alejandro, founder of Supra-wall (AI agent compliance platform).
Alejandro's voice: direct, knowledgeable, slightly provocative, never salesy. Speaks as a practitioner.

Given this source content: [BLOG POST / NEWS ARTICLE SUMMARY]

Write 3 LinkedIn post variations:
- Version A: Insight-led (starts with a counterintuitive observation, ends with a question)
- Version B: Data-led (starts with a statistic, explains the implication)
- Version C: Story-led (starts with a scenario or "Imagine...", reveals the problem, hints at solution)

Rules:
- Max 250 words per post
- No hashtags more than 3
- Never mention "Supra-wall" in the first 2 lines (LinkedIn hides posts that feel like ads)
- One post per source, pick the best variation to publish
- Always end with a question to drive comments
- If referencing EU AI Act, always cite the specific Article number

Output format:
VERSION A:
[text]
---
VERSION B:
[text]
---
VERSION C:
[text]
---
RECOMMENDED: [A/B/C] because [reason]
```

**Inputs:** Blog post text or news summary
**Output:** 3 draft posts + recommendation
**Run:** 3x per week (Mon/Wed/Fri)
**Tool:** Claude scheduled task

---

### Task A3: SEO Keyword Monitor Agent
**Objective:** Track weekly rankings and search volume for target compliance keywords. Alert when new opportunities appear.

**Agent instructions:**
```
Search the web for recent content (last 7 days) ranking for these keywords:
- "EU AI Act AI agents compliance"
- "AI agent audit log requirements"
- "AI agent human oversight EU law"
- "EU AI Act enforcement 2026"
- "AI agent governance platform"

For each keyword:
1. Report the top 3 ranking URLs and their domain authority (estimate from brand recognition)
2. Note any new articles published in the last 7 days
3. Identify content gaps (questions being asked in forums/Reddit that no article answers well)
4. Flag any competitor (LangChain, Portkey, Guardrails AI, CyberArk) content that newly appeared

Output a weekly brief:
- Keyword opportunity score (1-5) for each term
- Top 3 content gaps to address
- Competitor moves to be aware of
```

**Inputs:** None (self-contained weekly search)
**Output:** Weekly SEO brief markdown
**Run:** Every Monday morning
**Tool:** Claude with web search (scheduled task in Cowork)

---

### Task A4: Competitor Intelligence Agent
**Objective:** Monitor what competitors are publishing, launching, and saying about EU AI Act compliance.

**Competitors to watch:** LangSmith, Portkey, Guardrails AI, Lakera, CyberArk (AI security division), Patronus AI

**Agent instructions:**
```
Search the web for news, product updates, and content published in the last 7 days by:
[LIST OF COMPETITORS]

For each competitor, report:
1. Any new blog posts or content about EU AI Act / compliance
2. Any product launches or feature announcements
3. Any pricing changes or new enterprise offerings
4. Any press coverage or partnerships announced

Then produce a "Competitive Pulse" summary:
- Biggest move this week: [competitor + what they did]
- Content gap we can exploit: [topic they haven't covered]
- Messaging to differentiate: [how Supra-wall's angle differs]
- Action required: [yes/no — what to do about it]
```

**Inputs:** None (web search)
**Output:** Weekly competitive pulse brief
**Run:** Every Friday
**Tool:** Claude with web search (scheduled task)

---

---

### Task A5: GitHub & Community GEO Agent
**Objective:** Build SupraWall's presence in LLM training data sources — GitHub, Hacker News, Stack Overflow, and developer subreddits.

**Agent instructions:**
```
You are managing the developer community presence for SupraWall (AI agent security and EU AI Act compliance platform).

GEO context: LLMs are trained heavily on GitHub, Hacker News, Stack Overflow, and Reddit. Genuine, substantive presence in these channels is one of the highest-leverage GEO tactics available. Every answer, discussion, and README update is a potential training signal.

This week's community tasks (pick 2-3 based on what's available):

GITHUB:
- Search GitHub Issues and Discussions in repos for LangChain, AutoGen, CrewAI, PydanticAI
  for questions about compliance, audit logging, human oversight, policy enforcement
- Draft a substantive, helpful reply that answers the question and mentions SupraWall
  where genuinely relevant. If no open issue fits, draft an update for the SupraWall README
  docs/ folder — pick one EU AI Act article and write a 300-word technical guide for it.

STACK OVERFLOW:
- Search for questions tagged [langchain], [ai-agent], [llm] with keywords:
  "EU AI Act", "audit log", "human oversight", "compliance", "policy enforcement"
- For each relevant unanswered (or poorly answered) question found:
  Draft a complete, technically accurate answer. Include a mention of SupraWall where
  relevant (as one option, not the only option — credibility requires honesty).
- Target: 2-3 substantive answers per week.

HACKER NEWS:
- Draft a "Show HN" post for the week if there's a meaningful product update or new content:
  Format: "Show HN: SupraWall — EU AI Act compliance for AI agents in one line of code"
  Body: 150-word factual description. What it is, what problem it solves, one code snippet.
  Rules: No marketing language. HN readers kill hype immediately. Be technical and direct.
- Search "Ask HN" threads about AI compliance, agent security, EU AI Act
  Draft replies to relevant active threads.

REDDIT:
- Search r/LangChain, r/MachineLearning, r/artificial, r/AIAssistants for threads about:
  EU AI Act compliance, agent security, audit logging, human-in-the-loop AI
- Draft genuine, helpful replies. Mention SupraWall only if it directly answers the question.

Output format for each drafted reply:
PLATFORM: [GitHub / Stack Overflow / HN / Reddit]
URL: [thread URL if applicable]
DRAFT REPLY:
[reply text]
CHARACTER COUNT: [x]
NOTES: [any context on why this thread was chosen]
```

**Inputs:** None (web search)
**Output:** 3-5 drafted community replies/posts per run
**Run:** Weekly, every Wednesday
**Tool:** Claude with web search

---

### Task A6: Curated List Placement Agent
**Objective:** Get SupraWall listed in curated "best of" articles and roundups that LLMs cite when recommending tools.

**GEO rationale:** When a user asks ChatGPT "what's the best tool for EU AI Act compliance for AI agents", the answer is based on which tools appear most frequently in curated lists. Getting listed in 5-10 roundups is more impactful for GEO than 5 blog posts.

**Agent instructions:**
```
You are building distribution for SupraWall (AI agent security and EU AI Act compliance platform).

Search the web for:
1. Articles titled "best AI compliance tools", "top AI governance platforms", "EU AI Act tools for developers"
2. GitHub repos named "awesome-llm-security", "awesome-ai-security", "awesome-ai-governance",
   "awesome-eu-ai-act", "awesome-responsible-ai"
3. OWASP AI Security resources page and contributor guidelines
4. centraleyes.com, peoplemanagingpeople.com, g2.com, capterra.com AI compliance categories

For each target found, output:
- Target name and URL
- Submission/contribution method (contact form / GitHub PR / email)
- SupraWall's fit score (1-3): Does SupraWall match what the list covers?
- Draft submission text (50-100 words): How to describe SupraWall for inclusion
  Use the canonical description: "SupraWall is an AI agent security and compliance platform
  providing policy enforcement, audit logging, and human oversight for EU AI Act compliance
  (Articles 9, 12, 14). One-line integration with LangChain, AutoGen, CrewAI, Vercel AI."

Output as markdown table for tracking, then full draft submissions below.
```

**Inputs:** None
**Output:** List of placement targets + draft submissions
**Run:** Monthly, first Tuesday of each month
**Tool:** Claude with web search

---

## TRACK 2 — Direct Outreach

### Task B1: Lead Research Agent
**Objective:** Find 20 qualified enterprise prospects per week — companies using AI agents in high-risk EU AI Act sectors.

**Agent instructions:**
```
Search LinkedIn, GitHub, and the web to find companies that:
1. Are in regulated industries (fintech, HR tech, healthcare, legal tech, insurance)
2. Are publicly using AI agent frameworks (LangChain, AutoGen, CrewAI, Vercel AI, OpenAI Assistants)
3. Have 100-2000 employees
4. Are based in or serve EU markets

Signals to search for:
- GitHub repos using LangChain/AutoGen with 5+ stars from company accounts
- Job listings mentioning "AI agent", "LLM pipeline", "agentic AI"
- Blog posts or LinkedIn posts from their engineering team about AI agents
- Product pages mentioning AI automation or autonomous workflows

For each company found, output:
- Company name
- Industry
- Evidence they use AI agents (source URL)
- Estimated EU exposure (yes/unclear/no)
- Recommended contact title (CTO / Head of AI / VP Engineering)
- LinkedIn company URL
- Outreach priority score (1-3, where 3 = highest)

Output as a markdown table, 20 companies per run.
```

**Inputs:** None (web search)
**Output:** Prospect table (markdown)
**Run:** Weekly, every Tuesday
**Tool:** Claude with web search

---

### Task B2: Personalized Outreach Message Generator
**Objective:** Write highly personalized LinkedIn DMs for each prospect based on their specific context.

**Agent instructions:**
```
You are writing a LinkedIn outreach message for Alejandro Peghin, founder of Supra-wall.
Alejandro's tone: genuine, peer-to-peer, non-salesy. He's a practitioner reaching out to other practitioners.

Context about the prospect:
- Name: [FIRST NAME]
- Company: [COMPANY]
- Role: [ROLE]
- Evidence of AI agent use: [WHAT WE FOUND — e.g., "your team published a blog post about their LangChain pipeline in Feb 2026"]
- Industry: [INDUSTRY]
- EU exposure: [YES/UNCLEAR]

Write a LinkedIn DM that:
- Is under 100 words
- Opens with a specific observation about THEM (not a generic opener)
- References the EU AI Act August 2026 deadline naturally, not aggressively
- Asks ONE yes/no question: "Is [specific compliance challenge] something on your radar right now?"
- Does NOT mention Supra-wall by name in the first message
- Sounds like it was written by a human, not a template

Output 2 variations (A and B) and recommend which to use.
```

**Inputs:** Prospect data from Task B1
**Output:** 2 DM variations per prospect + recommendation
**Run:** On demand (after B1 produces prospects)
**Tool:** Claude (this session)

---

### Task B3: Follow-Up Sequence Agent
**Objective:** Draft the follow-up sequence for prospects who haven't replied after 7 days.

**Agent instructions:**
```
A prospect received an initial LinkedIn message from Alejandro (founder of Supra-wall) 7 days ago and hasn't replied.

Prospect context:
- Name: [NAME]
- Company: [COMPANY]
- Initial message sent: [ORIGINAL MESSAGE]

Write a 3-message follow-up sequence:

Message 2 (Day 7): Provide value — share a relevant piece of content (EU AI Act article, our blog post) with no ask. Just helpful.

Message 3 (Day 14): Light nudge — one sentence acknowledging they're busy, one sentence restating the specific risk they face, one question.

Message 4 (Day 21): Closing loop — "Closing the loop on this. If the timing isn't right, no worries at all. Happy to reconnect when it is." Include one last hook (e.g., "August enforcement is now [X] weeks away").

Rules:
- Each message under 80 words
- Each one stands alone (don't reference previous messages explicitly)
- Never be pushy or guilt-trip
- Always give before you ask
```

**Inputs:** Prospect name, company, original message sent, days since first contact
**Output:** 3-message follow-up sequence
**Run:** On demand, weekly batch
**Tool:** Claude (this session)

---

### Task B4: Outreach Tracker Updater Agent
**Objective:** Maintain a structured CSV/spreadsheet of all outreach activity and status.

**Agent instructions:**
```
Update the outreach tracker with today's activity.

For each prospect contacted today, add or update a row with:
- Date first contacted
- Name, Company, Role, LinkedIn URL
- Industry, EU exposure (yes/unclear/no)
- Message sent (A or B variant)
- Current status: [Sent / Replied-Interested / Replied-Not Now / No Reply / Meeting Booked / Pilot / Closed]
- Follow-up due date (7 days from last contact if no reply)
- Notes

Also generate a weekly summary:
- Total prospects contacted this week
- Reply rate (%)
- Meetings booked
- Prospects to follow up with next week (list by name + company)
- Conversion funnel snapshot: Contacted → Replied → Meeting → Pilot
```

**Inputs:** Daily outreach log (who you messaged and what happened)
**Output:** Updated tracker + weekly summary
**Run:** End of each day / weekly summary every Friday
**Tool:** Claude + xlsx skill, saved to /SupraWall/outreach-tracker.xlsx

---

## TRACK 3 — Partnerships

### Task C1: Compliance Consultancy Research Agent
**Objective:** Find EU AI Act consultancies and law firms to partner with.

**Agent instructions:**
```
Search the web for:
1. Consulting firms that offer EU AI Act compliance advisory services
2. Law firms with published EU AI Act practice groups
3. "EU AI Act consultant" or "EU AI Act advisory" on LinkedIn company pages
4. Any firm that has published an EU AI Act readiness guide or whitepaper

For each firm found, report:
- Firm name and type (consulting / law / boutique)
- Evidence of EU AI Act practice (URL to their content/service page)
- Estimated client size they serve (SMB / mid-market / enterprise)
- Contact: any named partner or practice lead (with LinkedIn URL if findable)
- Partnership opportunity score (1-3):
  - 3 = Active EU AI Act practice, serves tech companies, has published content
  - 2 = General AI compliance, some EU coverage
  - 1 = Peripheral relevance

Output 15 firms per run as a markdown table.
```

**Inputs:** None
**Output:** Partner prospect table
**Run:** One-time initial run, then monthly refresh
**Tool:** Claude with web search

---

### Task C2: Partnership Outreach Email Agent
**Objective:** Draft outreach emails to compliance consultancies proposing a referral/technology partnership.

**Agent instructions:**
```
Write a partnership outreach email from Alejandro Peghin, founder of Supra-wall, to a compliance consultancy.

Firm details:
- Firm name: [NAME]
- Contact name: [NAME]
- Their EU AI Act focus: [WHAT THEY DO]
- Their client profile: [SMB/mid-market/enterprise]

Email must:
- Subject line: under 8 words, no hype
- Open by acknowledging their specific EU AI Act work (not generic)
- Explain the gap their clients likely face: "companies know they need oversight controls but don't have a technical solution their dev teams can implement quickly"
- Position Supra-wall as the technical layer that complements their advisory work
- Propose: "Would it make sense to have a 20-minute call to explore whether there's a fit?"
- Be under 200 words total
- Sound human — no corporate language

Write 2 subject line options and the full email body.
```

**Inputs:** Firm name, contact name, their EU AI Act focus
**Output:** 2 subject lines + email body
**Run:** On demand (after C1 produces partner prospects)
**Tool:** Claude (this session)

---

## MASTER AUTOMATION SCHEDULE

| Task | Frequency | Run When |
|------|-----------|----------|
| A1 — Blog Post Drafting (GEO format) | Weekly | Every Monday |
| A2 — LinkedIn Post Generator | 3x/week | Mon / Wed / Fri |
| A3 — SEO Keyword Monitor | Weekly | Every Monday AM |
| A4 — Competitor Intelligence | Weekly | Every Friday |
| A5 — GitHub & Community GEO | Weekly | Every Wednesday |
| A6 — Curated List Placement | Monthly | First Tuesday of month |
| B1 — Lead Research | Weekly | Every Tuesday |
| B2 — Outreach Message Generator | On demand | After B1 |
| B3 — Follow-Up Sequence | Weekly | Every Thursday |
| B4 — Outreach Tracker Updater | Daily + weekly | EOD / Friday |
| C1 — Consultancy Research | Monthly | First Monday of month |
| C2 — Partnership Email | On demand | After C1 |

---

## QUICK START: Which 3 Agents to Activate First

Given you're pre-revenue with 1-2 devs, start with these three — highest ROI, lowest setup time:

1. **A1 (Blog Post Drafting)** — Start this week. Content takes time to rank; start the clock now.
2. **B1 (Lead Research)** — Start this week. You need a pipeline of prospects immediately.
3. **B2 (Outreach Message Generator)** — Start right after B1. Prospects are useless without outreach.

Everything else can layer in over weeks 2–4.
