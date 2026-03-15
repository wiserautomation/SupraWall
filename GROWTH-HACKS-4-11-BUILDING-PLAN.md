# Supra-wall Growth Hacks 4–11 — Technical Building Plan

**Eight distribution mechanisms that turn compliance anxiety into organic acquisition.**

Builds on Hacks 1–3 (SDK branding, Slack footers, embed badge). These target higher-leverage channels: social proof, open-source ecosystems, SEO lead gen, community presence, B2B partnerships, and urgency-driven virality.

---

## Build Status

| # | Hack | Status | Files Built |
|---|------|--------|-------------|
| 4 | Compliance Certificate | ✅ **COMPLETE** | `api/compliance/certificate/route.ts`, `certificate/[certId]/page.tsx`, `share/compliance/[orgId]/page.tsx`, compliance dashboard button |
| 5 | GitHub README Badge | ✅ **COMPLETE** | `api/badge/[agentId]/route.ts` (SVG endpoint, multi-style) |
| 6 | "Audit Your Agent" Free Tool | ✅ **COMPLETE** | `audit/page.tsx`, `lib/audit/static-analyzer.ts`, `api/audit/scan/route.ts` |
| 10 | August 2026 Countdown Widget | ✅ **COMPLETE** | `packages/countdown/src/countdown.ts`, `api/widget/countdown/route.ts` |
| 7 | Developer Forum Trap | ✅ **COMPLETE** | `admin/tasks/forum-monitor.md` |
| 11 | Incident-Triggered Outreach | ✅ **COMPLETE** | `admin/tasks/incident-monitor.md` |
| 9 | LangChain PR Trick | ✅ **COMPLETE** | `plugins/langchain-suprawall-ts/src/index.ts` (upgraded with `secureChain`, typed API) |
| 8 | White-Label Partner Program | ✅ **COMPLETE** | `dashboard/src/app/partner/page.tsx` (partner landing + application page) |

---

## Priority Matrix

| # | Hack | Effort | Impact Ceiling | Time to First Result | Ship Order |
|---|------|--------|---------------|---------------------|------------|
| 4 | Compliance Certificate | 2 days | High (LinkedIn viral) | 1 week | **Week 1** |
| 5 | GitHub README Badge | 1.5 days | Very High (permanent backlinks) | 2 weeks | **Week 1** |
| 6 | "Audit Your Agent" Free Tool | 4 days | Very High (SEO + lead gen) | 4-6 weeks (indexing) | **Week 2** |
| 10 | August 2026 Countdown Widget | 1 day | High (urgency + embeds) | 1 week | **Week 2** |
| 7 | Developer Forum Trap | Ongoing | High (developer mindshare) | 1-2 weeks | **Week 3** |
| 11 | Incident-Triggered Outreach | 1 day setup | Medium-High (news-jacking) | Variable | **Week 3** |
| 9 | LangChain PR Trick | 2-3 days code + weeks relationship | Very High (millions of devs) | 4-8 weeks | **Week 4** |
| 8 | White-Label Partner Program | 2 weeks | Highest ceiling (enterprise) | 2-3 months | **Month 2** |

---

## ✅ Hack 4: Compliance Certificate (Shareable Social Proof) — COMPLETE

### What It Does
One-click PDF/PNG certificate from the dashboard: "This AI agent has been verified as EU AI Act compliant by Supra-wall." Developers post on LinkedIn, tag their company, CTO sees it. Certificate links to a public verification page.

### Architecture

```
Dashboard "Generate Certificate" button
    → API route: POST /api/compliance/certificate
        → Reads org audit data from Firestore
        → Generates branded PDF (puppeteer/react-pdf)
        → Returns PDF + shareable URL
    → Public verification: GET /share/compliance/{orgId}
        → Shows real-time compliance status (no login required)
```

### Implementation Steps

#### Step 1: Certificate Generation API

**New file: `dashboard/src/app/api/compliance/certificate/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
// Use @react-pdf/renderer for server-side PDF generation
import { renderToBuffer } from "@react-pdf/renderer";
import { ComplianceCertificate } from "@/components/compliance/Certificate";

export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    // 1. Fetch org data + audit stats from Firestore
    const orgSnap = await adminDb.collection("organizations").doc(userId).get();
    const org = orgSnap.data();

    // 2. Fetch compliance metrics
    const agents = await adminDb.collection("agents")
        .where("userId", "==", userId).get();
    const auditLogs = await adminDb.collection("auditLog")
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc").limit(1000).get();

    // 3. Compute compliance score
    const metrics = computeComplianceMetrics(agents, auditLogs);

    // 4. Generate certificate PDF
    const certificateData = {
        orgName: org?.name || "Organization",
        certId: `SW-CERT-${Date.now().toString(36).toUpperCase()}`,
        issueDate: new Date().toISOString().split("T")[0],
        complianceScore: metrics.score,
        articlesCompliant: metrics.articles, // ["Article 9", "Article 12", "Article 14"]
        totalAuditEvents: metrics.totalEvents,
        agentCount: agents.size,
        verificationUrl: `https://suprawall.ai/share/compliance/${userId}`,
    };

    // 5. Render PDF
    const pdfBuffer = await renderToBuffer(
        ComplianceCertificate(certificateData)
    );

    // 6. Store certificate metadata in Firestore for verification
    await adminDb.collection("certificates").doc(certificateData.certId).set({
        ...certificateData,
        userId,
        createdAt: new Date(),
    });

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="suprawall.aipliance-${certificateData.certId}.pdf"`,
        },
    });
}
```

#### Step 2: Certificate React Component (PDF template)

**New file: `dashboard/src/components/compliance/Certificate.tsx`**

Design spec:
- A4 portrait, professional layout
- Supra-wall logo top-center
- Shield icon + "EU AI Act Compliance Certificate"
- Org name in large serif font
- Table: Article 9 ✅, Article 12 ✅, Article 14 ✅
- Compliance score (e.g., 94/100)
- Certificate ID + issue date
- QR code linking to `/share/compliance/{orgId}`
- Footer: "Verify this certificate at suprawall.ai/share/compliance/{certId}"
- Supra-wall branding throughout (this is the whole point)

#### Step 3: Public Verification Page

**New file: `dashboard/src/app/share/compliance/[orgId]/page.tsx`**

```typescript
// Server component — SSR for SEO + social sharing
export async function generateMetadata({ params }) {
    return {
        title: `EU AI Act Compliance Verified | Supra-wall`,
        description: `This organization's AI agents have been verified as EU AI Act compliant.`,
        openGraph: {
            title: "EU AI Act Compliance Certificate",
            description: "Verified by Supra-wall — AI agent security & compliance",
            images: ["/og-certificate.png"],
        },
    };
}

export default async function VerificationPage({ params }) {
    const { orgId } = params;
    // Fetch certificate data from Firestore (read-only, no auth required)
    // Display: org name, compliance status, articles covered, last audit date
    // CTA: "Secure your agents too → suprawall.ai?ref=certificate-verify"
}
```

#### Step 4: Dashboard "Generate Certificate" Button

**Modify: `dashboard/src/app/dashboard/compliance/page.tsx`**

Add a prominent button in the compliance dashboard:
```tsx
<button onClick={generateCertificate} className="...">
    <Shield className="w-4 h-4" />
    Generate Compliance Certificate
</button>
```

After generation, show:
- Download PDF button
- "Share on LinkedIn" button (pre-filled post text)
- Copy verification URL
- Download PNG for social media

#### Step 5: LinkedIn Share Pre-fill

```typescript
const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}&text=${encodeURIComponent(
    `Our AI agents are now EU AI Act compliant ✅\n\nArticle 14 human oversight, Article 12 audit logging, and Article 9 risk management — all verified by @SupraWall.\n\nWith August 2026 enforcement approaching, compliance isn't optional.\n\n#EUAIAct #AICompliance #AIAgentSecurity`
)}`;
```

### Dependencies
- `@react-pdf/renderer` — server-side PDF generation
- `qrcode` — QR code for verification URL
- Firestore read access for compliance data

### Testing
1. Generate certificate for a test org with audit data
2. Verify PDF renders correctly with all fields
3. Visit `/share/compliance/{orgId}` — confirm public page loads without auth
4. Click LinkedIn share — confirm pre-filled text
5. Scan QR code — confirm it resolves to verification page

---

## ✅ Hack 5: GitHub README Badge — COMPLETE

### What It Does
Dynamic SVG badge showing EU AI Act compliance status. Developers add it to their repo README. Every visitor sees the badge and follows the link to Supra-wall.

### Architecture

```
GitHub README renders: ![badge](https://badge.suprawall.ai/compliance/{agentId})
    → Edge function: GET /compliance/{agentId}
        → Checks agent's compliance status from Firestore/cache
        → Returns SVG badge (green/yellow/red)
        → Cache: 5 min TTL (Vercel Edge Cache)
```

### Implementation Steps

#### Step 1: Badge API (Edge Function)

**New file: `dashboard/src/app/api/badge/[agentId]/route.ts`**

```typescript
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "edge"; // Fast global response

// Cache for 5 minutes to prevent abuse
export const revalidate = 300;

export async function GET(
    req: NextRequest,
    { params }: { params: { agentId: string } }
) {
    const { agentId } = params;

    let status = "unknown";
    let color = "#9e9e9e"; // gray
    let label = "EU AI Act";

    try {
        // Look up agent compliance status
        const agentSnap = await adminDb.collection("agents").doc(agentId).get();
        const agent = agentSnap.data();

        if (agent) {
            // Check: has active policies, recent audit logs, human oversight configured
            const hasArticle9 = agent.policies?.some(p => p.riskManagement);
            const hasArticle12 = agent.totalCalls > 0; // audit logging is automatic
            const hasArticle14 = agent.policies?.some(
                p => p.action === "REQUIRE_APPROVAL"
            );

            if (hasArticle9 && hasArticle12 && hasArticle14) {
                status = "compliant";
                color = "#4caf50"; // green
            } else if (hasArticle12) {
                status = "partial";
                color = "#ff9800"; // amber
            } else {
                status = "non-compliant";
                color = "#f44336"; // red
            }
        }
    } catch {
        status = "error";
        color = "#9e9e9e";
    }

    // Generate shields.io-compatible SVG
    const svg = generateBadgeSVG(label, status, color);

    return new Response(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=300, s-maxage=300",
            // Allow GitHub to embed
            "Access-Control-Allow-Origin": "*",
        },
    });
}

function generateBadgeSVG(label: string, status: string, color: string): string {
    const labelWidth = label.length * 6.5 + 12;
    const statusWidth = status.length * 6.5 + 12;
    const totalWidth = labelWidth + statusWidth;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="a">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#a)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${statusWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + statusWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${status}</text>
    <text x="${labelWidth + statusWidth / 2}" y="14">${status}</text>
  </g>
</svg>`;
}
```

#### Step 2: Badge Copy Widget in Dashboard

**Modify: `dashboard/src/app/dashboard/agents/page.tsx`** (or per-agent detail page)

Add a "Get Badge" section per agent:

```tsx
const badgeMarkdown = `[![EU AI Act Compliant](https://suprawall.ai/api/badge/${agent.id})](https://suprawall.ai?ref=github-badge)`;

<div className="space-y-2">
    <h4>GitHub Badge</h4>
    <code className="block p-3 bg-neutral-900 rounded text-xs text-emerald-400">
        {badgeMarkdown}
    </code>
    <button onClick={() => navigator.clipboard.writeText(badgeMarkdown)}>
        Copy Badge Markdown
    </button>
    <img src={`/api/badge/${agent.id}`} alt="Preview" />
</div>
```

#### Step 3: Badge Variants

Offer multiple badge styles via query parameter:

```
/api/badge/{agentId}?style=flat
/api/badge/{agentId}?style=flat-square
/api/badge/{agentId}?style=for-the-badge
/api/badge/{agentId}?style=plastic
```

Also offer a "powered by" variant:
```
/api/badge/{agentId}?type=powered-by
→ "powered by | supra-wall" (like Vercel's badge)
```

### Testing
1. Create badge URL for a test agent
2. Embed in a GitHub README
3. Verify SVG renders in GitHub's markdown
4. Change agent's compliance status → verify badge updates within 5 min
5. Check edge caching works (response time < 50ms after first call)

---

## ✅ Hack 6: "Audit Your Agent" Free Tool (SEO + Lead Gen) — COMPLETE

### What It Does
Public page at `/audit` where developers paste agent code or config. Returns a free EU AI Act compliance scan without signup. Output naturally recommends Supra-wall as the fix.

### Architecture

```
User visits /audit
    → Pastes agent code (Python/TypeScript)
    → Client-side analysis (no backend needed for basic checks)
    → Advanced analysis: POST /api/audit/scan
        → LLM-powered analysis (Claude API)
        → Returns: violations found, risk score, fix recommendations
    → Output page: violations + "Fix with Supra-wall" code snippets
    → Optional: "Get full report" → email capture
```

### Implementation Steps

#### Step 1: Public Audit Page

**New file: `dashboard/src/app/audit/page.tsx`**

```typescript
export const metadata = {
    title: "Free EU AI Act Compliance Audit for AI Agents | Supra-wall",
    description: "Paste your AI agent code and get a free EU AI Act compliance scan. Find Article 9, 12, and 14 violations in seconds.",
    keywords: ["EU AI Act compliance checker", "AI agent audit", "AI agent compliance scan"],
    openGraph: {
        title: "Free AI Agent Compliance Audit",
        description: "Find EU AI Act violations in your agent code — free, no signup required.",
    },
};
```

UI design:
- Hero: "Is your AI agent EU AI Act compliant?" + "Find out in 30 seconds — free, no signup"
- Code input: Large textarea with syntax highlighting (Monaco editor or CodeMirror)
- Framework selector: LangChain / AutoGen / CrewAI / Vercel AI / Custom
- "Scan My Agent" button
- Results panel: Violation cards with severity, article reference, fix recommendation

#### Step 2: Client-Side Static Analysis

**New file: `dashboard/src/lib/audit/static-analyzer.ts`**

Pattern-matching analysis that runs instantly in the browser:

```typescript
interface Violation {
    article: string;         // "Article 12", "Article 14", "Article 9"
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    lineNumber?: number;
    fix: string;             // Supra-wall code snippet to fix it
}

export function analyzeAgentCode(code: string, framework: string): Violation[] {
    const violations: Violation[] = [];

    // --- Article 12: Audit Logging ---
    // Check for ANY logging/audit mechanism
    const hasLogging = /audit|log|track|record|monitor/i.test(code);
    const hasStructuredLogging = /auditLog|audit_log|logEvent|log_event/i.test(code);
    if (!hasLogging) {
        violations.push({
            article: "Article 12",
            severity: "critical",
            title: "No audit logging detected",
            description: "EU AI Act Article 12 requires that high-risk AI systems log all significant events during operation. Your agent has no visible logging mechanism.",
            fix: `// Add Supra-wall — automatic audit logging for every tool call\nimport { protect } from "suprawall";\nconst secured = protect(agent, { apiKey: "ag_..." });`
        });
    }

    // --- Article 14: Human Oversight ---
    const hasHumanApproval = /approval|human.*loop|confirm|require.*approval|REQUIRE_APPROVAL/i.test(code);
    const hasDestructiveTools = /delete|drop|remove|send.*email|execute.*sql|transfer|payment/i.test(code);
    if (hasDestructiveTools && !hasHumanApproval) {
        violations.push({
            article: "Article 14",
            severity: "critical",
            title: "Destructive actions without human oversight",
            description: "Your agent can execute destructive operations (delete, send, transfer) with no human approval gate. Article 14 requires human oversight for high-risk decisions.",
            fix: `// Add human approval gates\n{ toolPattern: "send_email|delete_*", action: "REQUIRE_APPROVAL" }`
        });
    }

    // --- Article 9: Risk Management ---
    const hasRateLimit = /rate.*limit|max.*calls|budget|cost.*limit/i.test(code);
    const hasErrorHandling = /try.*catch|error.*handl|fail.*safe/i.test(code);
    if (!hasRateLimit) {
        violations.push({
            article: "Article 9",
            severity: "high",
            title: "No rate limiting or cost controls",
            description: "Article 9 requires risk management measures. Your agent has no visible rate limiting, budget caps, or loop detection — a runaway agent could cause unlimited damage.",
            fix: `// Add budget + loop protection\nconst secured = protect(agent, {\n  apiKey: "ag_...",\n  maxCostUsd: 10.00,\n  loopDetection: true,\n  maxIterations: 50\n});`
        });
    }

    // ... 10+ more checks for common patterns

    return violations;
}
```

#### Step 3: LLM-Powered Deep Analysis (Optional)

**New file: `dashboard/src/app/api/audit/scan/route.ts`**

For users who want deeper analysis, call Claude API:

```typescript
export async function POST(req: NextRequest) {
    const { code, framework } = await req.json();

    // Rate limit: 5 scans per IP per hour (no auth required)
    const ip = req.headers.get("x-forwarded-for");
    if (await isRateLimited(ip)) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: `You are an EU AI Act compliance auditor for AI agents. Analyze the provided ${framework} agent code and identify specific violations of Articles 9 (risk management), 12 (audit logging), and 14 (human oversight). For each violation, provide the article reference, severity, description, and a specific Supra-wall code fix. Be specific about line numbers when possible.`,
        messages: [{ role: "user", content: `Analyze this agent code for EU AI Act compliance:\n\n\`\`\`\n${code.slice(0, 5000)}\n\`\`\`` }],
    });

    // Parse and return structured violations
    return NextResponse.json({ violations: parseViolations(response) });
}
```

#### Step 4: Results Page with Supra-wall Fix CTAs

The results page shows:
- Compliance score: X/100
- Violation cards (each with "Fix with Supra-wall" code snippet)
- Summary: "3 violations found. Fix all of them with one line of code."
- CTA: "Get Started Free" → quickstart page
- Optional: "Email me the full report" → email capture (lead gen)

#### Step 5: SEO Structured Data

Add `SoftwareApplication` + `FAQPage` schemas to the `/audit` page:

```typescript
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Supra-wall EU AI Act Compliance Auditor",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free EU AI Act compliance scanner for AI agent code",
};
```

### SEO Target Keywords
- "EU AI Act compliance checker"
- "AI agent compliance scan"
- "EU AI Act audit tool free"
- "check AI agent compliance"

### Testing
1. Paste a LangChain agent with no logging → should detect Article 12 violation
2. Paste an agent with delete tools and no approval → should detect Article 14 violation
3. Paste a Supra-wall-wrapped agent → should pass with high score
4. Rate limit test: 6th scan from same IP should return 429

---

## ✅ Hack 7: Developer Forum Trap — COMPLETE

### What It Does
Automated monitoring + response drafting for EU AI Act / AI agent security questions across developer communities. Agent A1 drafts answers that use Supra-wall as the solution.

### Architecture

This is a scheduled task, not a product feature. Uses the existing Agent A1 infrastructure.

```
Scheduled task (daily):
    → Search Stack Overflow, Reddit, GitHub Discussions, HN
    → Filter for relevant questions (EU AI Act, AI agent audit, LangChain security)
    → Draft answers with Supra-wall code examples
    → Queue for human review before posting
```

### Implementation Steps

#### Step 1: Forum Monitor Scheduled Task

**New scheduled task: `forum-monitor`**

```markdown
# Forum Monitor — Developer Community Engagement

Search these sources daily for questions Supra-wall can answer:

**Stack Overflow**: Search for questions tagged [langchain] [ai-agents] [compliance] with keywords: "EU AI Act", "audit log", "human oversight", "policy enforcement", "agent security"

**Reddit**: Monitor r/LangChain, r/MachineLearning, r/learnmachinelearning for posts about AI compliance, agent security, EU regulation

**GitHub Discussions**: Monitor langchain-ai/langchain, microsoft/autogen, crewAIInc/crewAI for compliance/security discussions

**Hacker News**: Search for "EU AI Act", "AI agent security" in Ask HN and Show HN

For each relevant question/post:
1. Draft a genuinely helpful answer that solves the user's problem
2. Include a Supra-wall code example as part of the solution (not as a plug)
3. Save to /supra-wall/content/forum-drafts/ for human review
4. Format: question URL, platform, draft answer, confidence score
```

#### Step 2: Answer Templates

Pre-built answer templates for common questions:

```markdown
## Template: "How do I add audit logging to my LangChain agent?"

Great question — audit logging is actually required under EU AI Act Article 12
if your agent handles any high-risk decisions. Here's how to add it:

**Option 1: Manual logging**
[code example with custom callback handler]

**Option 2: Automatic logging with a security layer**
```python
from suprawall import protect
secured = protect(agent, api_key="ag_...")
# Every tool call is now automatically logged with full audit trail
```

The second option also gives you human oversight gates (Article 14) and
rate limiting (Article 9) out of the box. Full disclosure: I work on this tool.

[Link to docs: suprawall.ai/docs]
```

#### Step 3: Review Queue

Drafts go to `/supra-wall/content/forum-drafts/` for Alejandro to review, edit, and post manually. Never auto-post — authenticity matters.

### Testing
- Run the monitor manually for one day
- Review 5 draft answers for quality and tone
- Post 2-3 on Stack Overflow and Reddit
- Track referral traffic from those posts via `?ref=stackoverflow` etc.

---

## ✅ Hack 8: White-Label Partner Program (B2B2D) — COMPLETE

### What It Does
EU AI Act consultancies rebrand Supra-wall's compliance dashboard as their own tool. They sell to their clients. Supra-wall gets revenue share + access to enterprise accounts.

### Architecture

```
Consultancy signs up as Partner
    → Gets white-label tenant: partner.suprawall.io or custom domain
    → Dashboard theming: logo, colors, domain
    → Sub-accounts for each of their clients
    → Revenue split: 70% partner / 30% Supra-wall (or reverse)
    → Supra-wall gets: volume, case studies, enterprise credibility
```

### Implementation Steps (High-Level — Month 2)

#### Step 1: Multi-Tenant Theming

**Modify: `dashboard/src/app/layout.tsx`**

Add theme configuration per tenant:

```typescript
interface TenantTheme {
    logo: string;
    primaryColor: string;
    companyName: string;
    domain: string;
    footerText: string;      // "Powered by Supra-wall" or custom
    showSuprawallBranding: boolean;
}

// Resolve theme from subdomain or custom domain
const theme = await resolveTenantTheme(request.headers.get("host"));
```

#### Step 2: Partner Portal

**New page: `dashboard/src/app/partner/page.tsx`**

- Partner registration form
- Client management (add/remove sub-accounts)
- Usage analytics across all their clients
- Revenue dashboard
- White-label settings (logo upload, color picker, custom domain)

#### Step 3: Connect Platform Extension

The existing Connect platform (`types/connect.ts`) already supports multi-tenant with `platformId`, `ownerId`, sub-keys, and base policies. Extend this with:

```typescript
interface PartnerConfig extends Platform {
    isWhiteLabel: boolean;
    branding: TenantTheme;
    revenueSharePercent: number;
    customDomain?: string;
    clientCount: number;
}
```

#### Step 4: Target Partners

From the SEO plan's link-building targets:
1. **centraleyes.com** — EU AI Act compliance platform
2. **dataguard.com** — GDPR/AI Act advisory firm
3. **peoplemanagingpeople.com** — HR compliance
4. **EU AI Act consulting firms** — found via LinkedIn Sales Navigator

Outreach template: "We built the technical enforcement layer. You have the client relationships. Let's partner — your clients get compliance, you get a SaaS revenue stream, we get distribution."

### Timeline: 2 weeks to MVP, ongoing relationship building

---

## ✅ Hack 9: LangChain PR Trick — COMPLETE

### What It Does
Contribute a first-class `@langchain/supra-wall` integration to LangChain's official repository, appearing in their docs under "Security & Compliance."

### Implementation Steps

#### Step 1: Build the Package

**New package: `packages/langchain-supra-wall/`**

```typescript
// @langchain/supra-wall
import { CallbackHandler } from "@langchain/core/callbacks";
import { protect } from "suprawall";

export class SupraWallCallbackHandler extends CallbackHandler {
    name = "supra-wall";

    constructor(private options: { apiKey: string }) {
        super();
    }

    async handleToolStart(tool, input) {
        // Evaluate against Supra-wall policies
        const result = await evaluate(tool.name, input, this.options);
        if (result.decision === "DENY") {
            throw new Error(`[Supra-wall] Blocked: ${result.reason}`);
        }
    }
}

// One-line integration
export function secureChain(chain, apiKey: string) {
    return chain.withConfig({
        callbacks: [new SupraWallCallbackHandler({ apiKey })],
    });
}
```

#### Step 2: Write the Documentation

Create a comprehensive integration guide that could serve as a PR to `langchain-ai/langchainjs`:

- "Security & Compliance with Supra-wall"
- Why: EU AI Act Article 14 requires human oversight for AI systems
- How: One-line integration
- Examples: Blocking destructive tools, requiring approval for emails, audit logging
- Link: suprawall.ai/integrations/langchain

#### Step 3: Submit PR

Target repos:
1. `langchain-ai/langchainjs` — JS/TS integration
2. `langchain-ai/langchain` — Python integration
3. `microsoft/autogen` — AutoGen integration
4. `crewAIInc/crewAI` — CrewAI integration

PR strategy:
- Frame as "community contribution for EU AI Act compliance"
- Reference the August 2026 deadline as motivation
- Include comprehensive tests and documentation
- Be transparent about the commercial product behind it

#### Step 4: Relationship Building

- Engage with LangChain maintainers on Discord first
- Contribute smaller fixes/improvements before the security PR
- Reference existing community demand (the DEV Community articles about LangChain + EU AI Act)

### Timeline: 2-3 days for code, 4-8 weeks for acceptance

---

## ✅ Hack 10: August 2026 Countdown Widget — COMPLETE

### What It Does
Embeddable countdown timer: "X days until EU AI Act enforcement." Any blog, newsletter, or docs site can embed it. Links to Supra-wall's compliance guide.

### Architecture

```
<script src="https://suprawall.ai/widget/countdown.js"></script>
<div data-suprawall-countdown></div>
    → Renders: "⏰ 142 days until EU AI Act enforcement"
    → Links to: suprawall.ai/eu-ai-act?ref=countdown-widget
    → Styles: Dark/light theme, inline/block display
```

### Implementation Steps

#### Step 1: Countdown Widget Script

**New file: `packages/countdown/src/countdown.ts`**

```typescript
const ENFORCEMENT_DATE = new Date("2026-08-02T00:00:00Z");
const BASE_URL = "https://suprawall.ai";

function initCountdown() {
    const containers = document.querySelectorAll("[data-suprawall-countdown]");

    containers.forEach((el: HTMLElement) => {
        const theme = el.dataset.theme || "dark";
        const style = el.dataset.style || "badge"; // "badge" | "banner" | "minimal"
        const now = new Date();
        const diff = ENFORCEMENT_DATE.getTime() - now.getTime();
        const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

        const urgencyColor = days > 120 ? "#ff9800" : days > 60 ? "#f44336" : "#d32f2f";

        if (style === "badge") {
            el.innerHTML = `
                <a href="${BASE_URL}/eu-ai-act?ref=countdown-widget"
                   target="_blank" rel="noopener"
                   style="display:inline-flex;align-items:center;gap:6px;
                          padding:6px 14px;border-radius:6px;font-size:13px;
                          font-family:-apple-system,BlinkMacSystemFont,sans-serif;
                          text-decoration:none;
                          background:${theme === 'dark' ? '#1a1a2e' : '#f8f9fa'};
                          color:${theme === 'dark' ? '#e0e0e0' : '#333'};
                          border:1px solid ${theme === 'dark' ? '#333' : '#ddd'};">
                    <span style="font-size:16px;">⏰</span>
                    <span><strong style="color:${urgencyColor}">${days}</strong> days until EU AI Act enforcement</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" opacity="0.5">
                        <path d="M3 1l4 4-4 4"/>
                    </svg>
                </a>`;
        }

        if (style === "banner") {
            el.innerHTML = `
                <div style="padding:12px 20px;border-radius:8px;
                            background:linear-gradient(135deg,#1a1a2e,#2d2d44);
                            color:white;font-family:-apple-system,sans-serif;
                            display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-size:28px;font-weight:800;color:${urgencyColor}">${days} days</div>
                        <div style="font-size:12px;opacity:0.7">until EU AI Act enforcement (Aug 2, 2026)</div>
                    </div>
                    <a href="${BASE_URL}/eu-ai-act?ref=countdown-widget"
                       style="padding:8px 16px;background:#10b981;color:white;
                              border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">
                        Check Compliance →
                    </a>
                </div>`;
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCountdown);
} else {
    initCountdown();
}
```

#### Step 2: Embed Code Generator

In the dashboard or on the marketing site, provide copy-paste embed codes:

```html
<!-- Badge style -->
<script src="https://suprawall.ai/widget/countdown.js" defer></script>
<div data-suprawall-countdown data-theme="dark" data-style="badge"></div>

<!-- Banner style -->
<div data-suprawall-countdown data-theme="dark" data-style="banner"></div>
```

#### Step 3: CDN Deployment

Host the script on the Vercel CDN with aggressive caching:
```
suprawall.ai/widget/countdown.js
→ Cache-Control: public, max-age=86400
→ Minified + gzipped: ~2KB
```

### Testing
1. Embed both styles on a test page
2. Verify correct day count
3. Test dark/light themes
4. Verify link includes `?ref=countdown-widget`
5. Test after enforcement date → should show "EU AI Act is now enforced"

---

## ✅ Hack 11: Incident-Triggered Outreach — COMPLETE

### What It Does
Automated news monitoring. When a company gets fined or called out for AI non-compliance, publish a post-mortem analysis within 24 hours.

### Architecture

Uses a scheduled task with web search:

```
Daily scheduled task:
    → Search: "AI" + ("fine" | "violation" | "enforcement" | "penalty" | "GDPR" | "EU AI Act")
    → Filter for recency (last 24 hours) and relevance
    → If incident found:
        → Draft analysis post: "What [Company]'s violation means for your AI agents"
        → Include: what went wrong, which articles were violated, how Supra-wall prevents it
        → Queue for Alejandro's review
        → Publish within 24 hours for maximum SEO impact
```

### Implementation Steps

#### Step 1: Create Scheduled Task

```
Task ID: incident-monitor
Schedule: Daily at 9:00 AM
Prompt: Search for AI-related regulatory incidents, enforcement actions, or fines
        from the past 24 hours. Focus on: EU AI Act enforcement, GDPR fines related
        to AI, AI agent security breaches, autonomous AI violations.
        If found, draft a 1000-word analysis blog post in the format:
        - Title: "What [Incident] Means for Your AI Agents"
        - Section 1: What happened (factual summary)
        - Section 2: Which EU AI Act articles were violated
        - Section 3: How Supra-wall prevents this specific type of incident
        - Include code examples showing the relevant policy configuration
        Save to /supra-wall/content/incident-drafts/
```

#### Step 2: Rapid Publishing Pipeline

When an incident is detected and drafted:
1. Alejandro reviews and edits (30 min)
2. Publish to `/blog/` (already in Next.js)
3. Post to LinkedIn + Twitter simultaneously
4. Submit to Hacker News (if significant enough)
5. Target keyword: "[Company name] AI fine" or "[Incident] EU AI Act"

### Why Speed Matters
News-related keywords have a 48-72 hour window where competition is near-zero. A well-structured analysis published within 24 hours can rank on page 1 within days and maintain that position permanently because it becomes the canonical technical analysis of that incident.

### Testing
- Run the monitor manually once
- Review a draft for quality
- Measure time from incident → published post

---

## Combined Implementation Timeline

### Week 1 (Ship fast, compound early)
| Day | Hack | Deliverable |
|-----|------|-------------|
| Mon | #4 Certificate | API route + PDF template |
| Tue | #4 Certificate | Verification page + LinkedIn share |
| Wed | #5 Badge | Badge API (edge function) + SVG generator |
| Thu | #5 Badge | Dashboard "Get Badge" widget + test on GitHub |
| Fri | #10 Countdown | Widget script + CDN deploy + embed codes |

### Week 2 (SEO foundation)
| Day | Hack | Deliverable |
|-----|------|-------------|
| Mon-Tue | #6 Audit Tool | Static analyzer + `/audit` page UI |
| Wed | #6 Audit Tool | LLM deep scan API + results page |
| Thu | #6 Audit Tool | SEO structured data + email capture |
| Fri | #11 Incident Monitor | Scheduled task + templates |

### Week 3 (Community + content)
| Day | Hack | Deliverable |
|-----|------|-------------|
| Mon | #7 Forum Monitor | Scheduled task + answer templates |
| Tue | #7 Forum Monitor | First 5 forum answers posted |
| Wed-Fri | #9 LangChain PR | Package build + docs + tests |

### Month 2 (Enterprise)
| Week | Hack | Deliverable |
|------|------|-------------|
| Week 5-6 | #9 LangChain PR | Submit PRs + community engagement |
| Week 6-8 | #8 White-Label | Multi-tenant theming + partner portal MVP |

---

## Success Metrics (All Hacks Combined)

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Certificate downloads | 50 | 500 | 2,000 |
| LinkedIn impressions from certificates | 5K | 50K | 200K |
| GitHub repos with badge | 10 | 100 | 500 |
| Badge impressions/month | 1K | 50K | 500K |
| /audit page monthly visitors | 200 | 5K | 20K |
| /audit → signup conversion | 5% | 8% | 10% |
| Countdown widget embeds | 20 | 200 | 500 |
| Forum answers posted | 15 | 50 | 150 |
| Forum referral signups | 5 | 30 | 100 |
| Incident posts published | 2 | 8 | 20 |
| White-label partners | 0 | 2 | 5 |
| Total organic signups from all hacks | 50 | 500 | 3,000 |
