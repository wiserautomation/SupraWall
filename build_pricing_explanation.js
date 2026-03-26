const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
        WidthType, ShadingType, PageNumber, PageBreak } = require('docx');

const accentColor = "1B3A5C";
const accentLight = "E8F0F8";
const accentMid = "D0E2F0";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: accentColor, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })]
  });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 20, ...opts })] })]
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun({ text, font: "Arial", bold: true })] });
}

function para(text, opts = {}) {
  return new Paragraph({ spacing: { line: 360 },
    children: [new TextRun({ text, font: "Arial", size: 22, ...opts })] });
}

function boldPara(label, text) {
  return new Paragraph({ spacing: { line: 360 },
    children: [
      new TextRun({ text: label, font: "Arial", size: 22, bold: true }),
      new TextRun({ text, font: "Arial", size: 22 })
    ]});
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: accentColor },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: accentColor },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: 0x2022, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: 0x0001, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "SupraWall: Free vs. Paid & User Conversion Funnel", font: "Arial", size: 18, color: "999999", italics: true })] })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", font: "Arial", size: 18, color: "999999" }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "999999" })] })] })
    },
    children: [
      // TITLE PAGE
      new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "SUPRAWALL", font: "Arial", size: 56, bold: true, color: accentColor })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [
        new TextRun({ text: "Free vs. Paid Model & Conversion Funnel", font: "Arial", size: 44, color: "4A9BD9" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Clear User Journey. 3-Tier Monetization. Open Source to Enterprise.", font: "Arial", size: 24, color: "666666" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [
        new TextRun({ text: "March 26, 2026", font: "Arial", size: 22, color: "999999" })
      ]}),
      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 1: THE 3-TIER MODEL
      heading("The 3-Tier Model: Free → Paid → Enterprise"),
      para("SupraWall uses a 3-column pricing strategy: Self-Host Free (Apache 2.0 open source), SupraWall Cloud (usage-based SaaS), and Enterprise (custom contracts)."),
      para(""),

      // TABLE: 3-TIER COMPARISON
      heading("Tier Comparison", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1600, 2550, 2550, 2660],
        rows: [
          new TableRow({ children: [
            headerCell("Feature", 1600),
            headerCell("Self-Host Free", 2550),
            headerCell("SupraWall Cloud", 2550),
            headerCell("Enterprise", 2660)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Price", bold: true })], 1600, { shading: accentLight }),
            cell("$0 forever", 2550, { shading: accentLight, bold: true }),
            cell("Usage-based ($0–$500+/mo)", 2550, { shading: accentLight }),
            cell("Custom contract", 2660, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "SDKs", bold: true })], 1600),
            cell("Full (TS, Python, Go, all frameworks)", 2550),
            cell("Full (same)", 2550),
            cell("Full (same) + dedicated support", 2660)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Policy Engine", bold: true })], 1600, { shading: accentLight }),
            cell("Full (self-hosted)", 2550, { shading: accentLight }),
            cell("Managed (SupraWall runs it)", 2550, { shading: accentLight }),
            cell("Dedicated + custom rules", 2660, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Vault (Secrets)", bold: true })], 1600),
            cell("Self-managed encryption", 2550),
            cell("HSM-backed, auto-rotation", 2550),
            cell("Dedicated HSM, custom KMS", 2660)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Dashboard", bold: true })], 1600, { shading: accentLight }),
            cell("Self-hosted UI", 2550, { shading: accentLight }),
            cell("Managed cloud dashboard (app.suprawall.com)", 2550, { shading: accentLight }),
            cell("White-label + SSO", 2660, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Approvals", bold: true })], 1600),
            cell("API-based (you build the UI)", 2550),
            cell("Slack + Dashboard", 2550),
            cell("Teams, mobile app, escalation", 2660)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Compliance Reports", bold: true })], 1600, { shading: accentLight }),
            cell("Status endpoint only", 2550, { shading: accentLight }),
            cell("PDF export, branded", 2550, { shading: accentLight }),
            cell("Auditor-ready, certified exports", 2660, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Audit Retention", bold: true })], 1600),
            cell("You manage (database)", 2550),
            cell("90 days – 1 year (automatic)", 2550),
            cell("7+ years, legal-grade", 2660)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Threat Intelligence", bold: true })], 1600, { shading: accentLight }),
            cell("Basic patterns (SQL, prompts)", 2550, { shading: accentLight }),
            cell("Cross-tenant ML insights", 2550, { shading: accentLight }),
            cell("Custom threat models + alerts", 2660, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "Support", bold: true })], 1600),
            cell("Community (GitHub, Discord)", 2550),
            cell("Email + priority", 2550),
            cell("Dedicated + SLA", 2660)
          ]}),
        ]
      }),
      para(""),

      // SECTION 2: WHAT'S FREE
      heading("What's Free (Self-Host / Apache 2.0)"),
      para("Anyone can download and self-host SupraWall for $0. Forever. This is the entire open-source core:"),
      para(""),

      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "SDKs: TypeScript, Python, Go, plus 7 framework plugins (LangChain, CrewAI, AutoGen, LlamaIndex, Vercel AI, etc.)", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Policy Engine: Full logic (ALLOW/DENY/REQUIRE_APPROVAL, wildcard matching, priority resolution)", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Vault: Credential management protocol + token format. You provide the encryption key.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Threat Detection: SQL injection + prompt injection pattern matching", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Audit Logging: Full API for recording and querying actions", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Dashboard: Complete web UI for policies, approvals, vault, audit logs", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Compliance Status: Checks for EU AI Act Articles 9, 12, 14", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "CLI + Docker: One-command self-hosting", font: "Arial", size: 22 })
      ]}),
      para(""),
      boldPara("Why give all this away free? ", "Because open source drives adoption. Developers try SupraWall for free, build it into their projects, and become invested in the product. When they hit a pain point (managing the server themselves, sharing Vault across teams, compliance audits), they upgrade to the cloud."),
      para(""),

      new Paragraph({ children: [new PageBreak()] }),

      heading("What's Paid: SupraWall Cloud (Usage-Based SaaS)"),
      para("The cloud tier removes all operational burden. SupraWall hosts, scales, and manages everything. You just integrate and use."),
      para(""),

      heading("Pricing Model", HeadingLevel.HEADING_2),
      para("Graduated tier based on monthly \"guarded operations\" (every policy evaluation):"),
      para(""),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3000, 3180, 3180],
        rows: [
          new TableRow({ children: [
            headerCell("Monthly Operations", 3000),
            headerCell("Cost Per Op", 3180),
            headerCell("Example Cost", 3180)
          ]}),
          new TableRow({ children: [
            cell("0 – 10,000", 3000, { shading: accentLight }),
            cell("FREE", 3180, { shading: accentLight, bold: true, color: "2E7D32" }),
            cell("$0 (free tier)", 3180, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell("10K – 500K", 3000),
            cell("$0.002/op", 3180),
            cell("~$1,000/mo at 500K", 3180)
          ]}),
          new TableRow({ children: [
            cell("500K – 2M", 3000, { shading: accentLight }),
            cell("$0.0015/op", 3180, { shading: accentLight }),
            cell("~$3,000/mo at 2M", 3180, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell("2M – 10M", 3000),
            cell("$0.001/op", 3180),
            cell("~$10,000/mo at 10M", 3180)
          ]}),
          new TableRow({ children: [
            cell("10M+", 3000, { shading: accentLight }),
            cell("$0.0005/op", 3180, { shading: accentLight }),
            cell("Custom discount", 3180, { shading: accentLight })
          ]}),
        ]
      }),
      para(""),

      boldPara("Example: ", "A startup running 100K operations/month pays: (10K × $0) + (90K × $0.002) = $180/mo."),
      para(""),

      boldPara("What You Get with Cloud: ", "Managed hosting, auto-scaling, HSM-backed Vault, cross-tenant threat intelligence, compliance reports (PDF), Slack integration, 24/7 uptime SLA, 90-day audit retention."),
      para(""),

      heading("What's Paid: Enterprise (Custom Contracts)"),
      para("Large companies with compliance, scale, or integration needs get custom contracts: $2K–$10K/month, negotiated by Alejandro."),
      para(""),

      boldPara("Includes: ", "White-label dashboard, SSO (Okta, Azure AD), dedicated account manager, custom threat models, 7+ year audit retention, mobile approval app, Teams integration, SLA with guaranteed response times."),
      para(""),

      new Paragraph({ children: [new PageBreak()] }),

      // SECTION 3: THE USER JOURNEY
      heading("The User Conversion Funnel: Free → Paid"),
      para("Users don't jump straight to paid. They follow a clear progression:"),
      para(""),

      heading("Stage 1: Awareness → Self-Host (Free)", HeadingLevel.HEADING_2),
      heading("Entry Point: GitHub Stars", HeadingLevel.HEADING_3),
      para("User searches: 'AI agent security', 'prompt injection prevention', 'LangChain compliance'"),
      para("Finds SupraWall blog post or GitHub repo → Stars the repo → Reads README"),
      para(""),

      heading("Quick Start: 5-Line Integration", HeadingLevel.HEADING_3),
      para("README shows:\n"),
      new Paragraph({ spacing: { line: 200 },
        children: [new TextRun({ text: "npm install suprawall\n\nconst sw = new SupraWall({apiKey: 'local'});\nconst result = await sw.guard('send_email', {to: 'user@example.com'});\nif (result.allowed) { /* proceed */ }", font: "Courier New", size: 20 })]
      }),
      para(""),
      para("User self-hosts locally. No credit card. Tests it out."),
      para(""),

      heading("Stage 2: Friction Points → Cloud Upgrade", HeadingLevel.HEADING_2),
      para("As the user builds out, they hit pain points with self-hosting:"),
      para(""),

      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "\"I want to share my Vault across 3 developers but don't want to manage encryption\" → Cloud Vault solves this", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "\"My company asks for compliance reports, audit logs, and 7-year retention\" → Cloud compliance features", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "\"I don't want to run another server. I want SupraWall to just work\" → Cloud hosting", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "\"I have 500K operations/month but need approval workflows and Slack integration\" → Cloud approvals", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "\"We're using SupraWall in production on 10 agents; I need better threat detection and anomaly alerts\" → Cloud threat intelligence", font: "Arial", size: 22 })
      ]}),
      para(""),

      heading("The Upgrade Trigger", HeadingLevel.HEADING_3),
      para("SupraWall's agent army watches for these signals and sends personalized upgrade emails:"),
      para(""),

      new Paragraph({ spacing: { line: 360 },
        children: [new TextRun({
          text: '"Hey [Name], we noticed you\'re running SupraWall on 10 agents with 50K+ operations/month. Self-hosting scales linearly (you manage servers, upgrades, backups). SupraWall Cloud scales automatically and gives you compliance reports for free. Try it free for 7 days."',
          font: "Arial", size: 22, italics: true
        })]
      }),
      para(""),

      heading("Stage 3: Cloud Usage → Enterprise", HeadingLevel.HEADING_2),
      para("A cloud user becomes an enterprise candidate when:"),
      para(""),

      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [
        new TextRun({ text: "They hit >$500/month in cloud costs (200K+ ops) and want a fixed price → negotiate enterprise contract", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [
        new TextRun({ text: "They're a regulated company (fintech, healthcare, government) needing SOC 2, HIPAA, custom compliance → enterprise features", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [
        new TextRun({ text: "They want SSO, white-label, dedicated support, and have purchasing power → enterprise contract", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [
        new TextRun({ text: "They're a strategic partner (platform company, integrator) → custom deal", font: "Arial", size: 22 })
      ]}),
      para(""),

      boldPara("Value Trigger: ", "Cloud user reaches 100K operations/month (~$200/mo). At that scale, they care about:"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Predictable costs (enterprise contract with fixed price)", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Compliance certification (auditor asks for HIPAA/SOC 2 proof)", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "White-label (selling SupraWall as part of their own product)", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Dedicated support (SLA, fast response times)", font: "Arial", size: 22 })
      ]}),
      para(""),

      new Paragraph({ children: [new PageBreak()] }),

      heading("The Conversion Funnel (Numbers)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 2800, 1780, 1780],
        rows: [
          new TableRow({ children: [
            headerCell("Stage", 2800),
            headerCell("User Segment", 2800),
            headerCell("Volume", 1780),
            headerCell("% Converting", 1780)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "1. GitHub Awareness", bold: true })], 2800, { shading: accentLight }),
            cell("Developers searching for AI security", 2800, { shading: accentLight }),
            cell("~100K/mo", 1780, { shading: accentLight }),
            cell("10%", 1780, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "2. Self-Host Users", bold: true })], 2800),
            cell("Developers who starred + installed npm package", 2800),
            cell("~10K/mo stars × 30% = 3K install", 1780),
            cell("30%", 1780)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "3. Cloud Trial", bold: true })], 2800, { shading: accentLight }),
            cell("Self-hosters who hit friction, try 7-day free trial", 2800, { shading: accentLight }),
            cell("~900/mo trials", 1780, { shading: accentLight }),
            cell("5%", 1780, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "4. Paid Cloud Subscriber", bold: true })], 2800),
            cell("Trials that convert (payment info entered)", 2800),
            cell("~45/mo new subscribers", 1780),
            cell("—", 1780)
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "5. Enterprise Candidate", bold: true })], 2800, { shading: accentLight }),
            cell("Cloud users hitting $500+/mo or compliance needs", 2800, { shading: accentLight }),
            cell("~2–3/mo qualified", 1780, { shading: accentLight }),
            cell("50%", 1780, { shading: accentLight })
          ]}),
          new TableRow({ children: [
            cell([new TextRun({ text: "6. Enterprise Contract", bold: true })], 2800),
            cell("Negotiated custom deals", 2800),
            cell("~1–2/mo closed", 1780),
            cell("—", 1780)
          ]}),
        ]
      }),
      para(""),

      new Paragraph({ children: [new PageBreak()] }),

      heading("User Experience: Free vs. Paid (Side by Side)"),
      para(""),

      heading("The Free Experience (Self-Host)", HeadingLevel.HEADING_2),
      boldPara("Day 1: ", "Developer downloads npm package, reads docs, runs 5-line example. Policy engine + Vault work locally. \"This is solid.\""),
      para(""),
      boldPara("Week 1: ", "Integrates into their LangChain app. Policies defined (no send_email without approval, budget limits). Local dashboard shows everything."),
      para(""),
      boldPara("Month 1: ", "Running in production. Blocks a prompt injection attack. Audits show exactly what happened. Developer impressed."),
      para(""),
      boldPara("Month 3: ", "Team of 3 developers. Sharing Vault across the team is a pain (manual encryption key management). Approvals require polling the API; they want Slack notifications. Compliance officer asks for audit retention > 90 days."),
      para(""),
      boldPara("Decision: ", "\"Should we self-host longer or try SupraWall Cloud?\" — They try the cloud."),
      para(""),

      heading("The Paid Experience (SupraWall Cloud)", HeadingLevel.HEADING_2),
      boldPara("Trial Day 1: ", "Click \"Deploy Now\" on supra-wall.com. Create account. 2-minute setup wizard (pick environment, create first policy). Dashboard instantly available at app.suprawall.com. No servers to run."),
      para(""),
      boldPara("Trial Day 3: ", "Slack integration enabled. Team gets instant notifications when an approval is needed. Mobile app shows pending approvals. Vault rotation happens automatically."),
      para(""),
      boldPara("Trial Day 5: ", "Compliance officer runs the 'EU AI Act Readiness' report. PDF export shows: ✅ Article 9 (Risk Management), ✅ Article 12 (Audit Logs), ✅ Article 14 (Human Approval). Audit logs auto-retained for 1 year."),
      para(""),
      boldPara("Trial Day 7: ", "Team votes. \"Cloud is 10x better than self-hosting. We're going paid.\" ($180/mo at 100K ops)."),
      para(""),
      boldPara("Month 1–6: ", "SupraWall Cloud runs in the background. No server maintenance. Operations grow to 300K/month ($540/mo). Still way cheaper than paying someone to manage the self-hosted version."),
      para(""),
      boldPara("Month 12: ", "Operations hit 2M/month ($3K/mo). Sales team reaches out: \"For $5K/month, we'll give you a fixed-price enterprise contract, white-label dashboard, and SOC 2 certification.\" They upgrade."),
      para(""),

      new Paragraph({ children: [new PageBreak()] }),

      heading("Why This Model Works"),
      para(""),
      heading("For Users", HeadingLevel.HEADING_2),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Start free. No credit card. Try the product with real data.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Self-host forever if you want. Open source means no vendor lock-in.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Cloud when you're ready. Pay only for what you use (graduated tiers mean cost stays reasonable even at 1M ops).", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Enterprise for serious companies. Custom contracts align SupraWall's success with customer success.", font: "Arial", size: 22 })
      ]}),
      para(""),

      heading("For Alejandro (Revenue)", HeadingLevel.HEADING_2),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Free tier drives adoption without CAC (customer acquisition cost). Every GitHub star is a potential customer.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Self-hosters give feedback, find bugs, submit PRs. They become invested in SupraWall's success.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Usage-based cloud pricing is fair. Companies pay more as they grow. The agent army monitors upsell signals automatically.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Enterprise contracts have high margins. Custom contracts at $5K+/mo with sales team handling negotiations.", font: "Arial", size: 22 })
      ]}),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
        new TextRun({ text: "Aggregate data: free users generate threat intelligence that makes the paid product better. The entire ecosystem becomes more defensible.", font: "Arial", size: 22 })
      ]}),
      para(""),

      para(""),
      para([new TextRun({ text: "This is the open-core playbook. Trade free users for adoption. Monetize the managed service. Build a moat around the enterprise tier.", font: "Arial", size: 22, italics: true })])
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/sleepy-affectionate-hawking/mnt/SupraWall/SupraWall_Free_vs_Paid_Explained.docx", buffer);
  console.log(`Document created: ${buffer.length} bytes`);
});
