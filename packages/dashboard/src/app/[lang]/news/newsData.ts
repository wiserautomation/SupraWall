// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export type NewsCategory = "REGULATION" | "THREAT INTEL" | "INDUSTRY" | "FRAMEWORKS";

export interface NewsArticle {
    slug: string;
    title: string;
    excerpt: string;
    date: string; // ISO date string
    category: NewsCategory;
    readingTime: number; // minutes
    published: boolean;
    supraWallAngle: string;
    relatedLinks: { href: string; label: string }[];
    summaryTable?: { key: string; value: string }[];
    definitions?: { term: string; definition: string }[];
    faq?: { question: string; answer: string }[];
    sources?: { name: string; url?: string }[];
    body: {
        paragraphs: string[];
    };
}

export const newsArticles: NewsArticle[] = [
    {
        slug: "eu-commission-misses-guidance-deadline-august-enforcement-stands",
        title: "EU Commission Misses Its Own Deadline — But August 2026 Enforcement Is Not Moving",
        excerpt: "The European Commission failed to publish its promised guidance on high-risk AI obligations by February 2, 2026, leaving operators scrambling — while confirming the August enforcement deadline remains fixed.",
        date: "2026-03-18",
        category: "REGULATION",
        readingTime: 4,
        published: true,
        supraWallAngle: "SupraWall's compliance dashboard generates audit-ready evidence exports mapped directly to Articles 9, 10, 12, and 14 — no regulatory guidance document required.",
        relatedLinks: [
            { href: "/en/learn/eu-ai-act-compliance-ai-agents", label: "EU AI Act Compliance for AI Agents" },
            { href: "/en/learn/eu-ai-act-article-14-human-oversight", label: "EU Act Article 14: Human Oversight" },
            { href: "/en/learn/ai-agent-audit-trail-logging", label: "AI Agent Audit Trail Logging" },
        ],
        summaryTable: [
            { key: "Status", value: "Guidance Missed" },
            { key: "Enforcement Date", value: "August 2, 2026" },
            { key: "Scope", value: "High-Risk AI Systems" },
            { key: "Admin Progress", value: "8/27 Member States Ready" }
        ],
        definitions: [
            { term: "High-Risk AI System", definition: "AI systems used in domains like HR, critical infrastructure, and law enforcement that must meet strict auditing and oversight standards." },
            { term: "Article 6", definition: "The section of the EU AI Act defining the classification criteria for high-risk AI." }
        ],
        faq: [
            { question: "Will the enforcement deadline be delayed?", answer: "No, the European Commission has confirmed that the August 2, 2026 deadline remains fixed despite guidance delays." }
        ],
        sources: [
            { name: "European Commission AI Act Progress Tracker", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" }
        ],
        body: {
            paragraphs: [
                "The European Commission committed to publishing detailed guidance on high-risk AI system compliance by February 2, 2026, to help operators meet their obligations under Article 6 of the EU AI Act. That deadline has passed [SOURCE NEEDED] without the guidance being released — leaving enterprises, legal teams, and AI developers in a state of uncertainty with fewer than five months until enforcement begins.",
                "The August 2, 2026 enforcement date has not moved. Every high-risk AI system — including autonomous agents operating in HR, recruitment, credit scoring, law enforcement, and critical infrastructure — must be in full compliance by that date, regardless of whether operators received the promised regulatory guidance.",
                "Compounding the uncertainty: as of mid-March 2026, only 8 of 27 EU Member States have formally designated their national competent authorities. The enforcement infrastructure is still being built while the deadline approaches at full speed.",
                "A second draft Code of Practice was published March 5, covering transparency obligations for AI-generated content. Public feedback closes March 30, with finalization expected in June — after many enterprises will need to have already deployed their compliance solutions.",
                "For AI teams deploying agents in European contexts, the message is clear: waiting for official guidance is not a strategy. The obligations under Articles 9, 10, 12, and 14 — risk management, data governance, logging, and human oversight — are already defined in the Act itself.",
            ],
        },
    },
    {
        slug: "80-percent-organizations-risky-ai-agent-behaviors-2026-report",
        title: "80% of Organizations Report Risky AI Agent Behaviors — Only 21% Have Full Visibility",
        excerpt: "New research from the Cloud Security Alliance reveals most enterprises deploying AI agents have already experienced unauthorized system access or improper data exposure — and most can't see it happening.",
        date: "2026-03-13",
        category: "THREAT INTEL",
        readingTime: 4,
        published: true,
        supraWallAngle: "SupraWall's SDK-level interception provides the tool-call visibility the 79% of organizations are missing — logging every action, enforcing policies in real time, and generating the audit trails required for both internal governance and EU AI Act compliance.",
        relatedLinks: [
            { href: "/en/learn/ai-agent-audit-trail-logging", label: "AI Agent Audit Trail & Logging" },
            { href: "/en/learn/ai-agent-security-best-practices", label: "AI Agent Security Best Practices" },
            { href: "/en/learn/zero-trust-ai-agents", label: "Zero Trust for AI Agents" },
        ],
        body: {
            paragraphs: [
                "New research published by the Cloud Security Alliance in March 2026 paints a stark picture of enterprise AI agent deployments: 80% of organizations surveyed reported risky agent behaviors, including unauthorized system access and improper data exposure, while only 21% of executives report complete visibility into agent permissions, tool usage, or data access patterns.",
                "The findings highlight the gap between how enterprises think their agents are behaving and what is actually happening at the tool-call level. Agents operating with administrative-level privileges — accessing databases, calling external APIs, executing code — are doing so largely unmonitored. When something goes wrong, most organizations have no audit trail to reconstruct what happened.",
                "The rise of agentic AI has driven an explosion in machine-to-machine interactions that traditional security tools were never designed to monitor. Standard identity and access management systems track human logins; they have no mechanism for governing which tools an AI agent is allowed to call, under what conditions, and with what parameters.",
                "Threat actors have noticed. Researchers documented espionage campaigns using AI coding agents to scan systems for weaknesses and generate exploit scripts — marking a shift from AI as a tool for defenders to AI as an active component of offensive operations.",
            ],
        },
    },
    {
        slug: "token-security-launches-intent-based-ai-agent-controls",
        title: "Token Security Enters the AI Agent Security Market with Intent-Based Controls",
        excerpt: "The identity security company is expanding into AI agent governance, adding a new entrant to the rapidly crowding agentic AI security space.",
        date: "2026-03-18",
        category: "INDUSTRY",
        readingTime: 3,
        published: true,
        supraWallAngle: "Identity-level governance and SDK-level enforcement are complementary, not competing — Token Security prevents the wrong agent from having credentials; SupraWall prevents the right agent from misusing them. Runtime interception catches what identity controls miss.",
        relatedLinks: [
            { href: "/en/learn/what-are-ai-agent-guardrails", label: "What Are AI Agent Guardrails?" },
            { href: "/en/learn/zero-trust-ai-agents", label: "Zero Trust for AI Agents" },
            { href: "/en/learn/protect-api-keys-from-ai-agents", label: "Protect API Keys from AI Agents" },
        ],
        body: {
            paragraphs: [
                "Token Security, an identity security company, announced this week an expansion into AI agent protection with a new intent-based controls approach. The system governs autonomous agents by aligning their permissions with their declared intended purpose — if an agent was provisioned to handle customer support, it should not have access to financial records, regardless of what an LLM decides to request.",
                "The approach is identity-native: Token Security builds on the observation that AI agents interact with enterprise systems through service accounts, API credentials, and cloud roles — the same infrastructure identity security already manages. Rather than building a new enforcement layer, the company argues that governing agent identity is sufficient to govern agent behavior.",
                "The announcement reflects a broader trend of established security vendors expanding into the agentic AI space. Alongside Token Security, Kore.ai launched its Agent Management Platform this week, and NVIDIA announced the Agent Toolkit with the OpenShell open-source runtime as a safety and security component.",
                "The AI agent security market is consolidating quickly. What was a niche space in early 2025 now has entrants from identity security (Token Security), observability (Galileo), enterprise AI platforms (Kore.ai), and dedicated runtime security (SupraWall, Jozu, Straiker).",
            ],
        },
    },
    {
        slug: "openai-aardvark-ai-security-agent-research-preview",
        title: "OpenAI Launches Aardvark: An AI Agent That Hunts Security Vulnerabilities",
        excerpt: "OpenAI's new Codex Security agent uses deep project context to find complex vulnerabilities — and raises new questions about what happens when security tools themselves become autonomous agents.",
        date: "2026-03-10",
        category: "FRAMEWORKS",
        readingTime: 4,
        published: true,
        supraWallAngle: "Any autonomous agent operating in a production environment — including security agents — benefits from a deterministic guardrail layer. The trust assumptions that apply to Aardvark are the same ones that apply to every agent: don't give it more authority than it needs, and verify what it does.",
        relatedLinks: [
            { href: "/en/learn/prompt-injection-credential-theft", label: "Prompt Injection & Credential Theft" },
            { href: "/en/learn/what-is-agent-runtime-security", label: "What Is Agent Runtime Security?" },
            { href: "/en/learn/mcp-server-security", label: "MCP Server Security" },
        ],
        body: {
            paragraphs: [
                "OpenAI launched Aardvark this month — rebranded as Codex Security — an application security agent designed to build deep context about software projects and identify complex vulnerabilities with minimal false positives. The tool is currently in research preview and represents OpenAI's first direct entry into the security tooling market.",
                "Aardvark operates as an autonomous agent: it reads codebases, understands dependencies, traces data flows, and surfaces potential vulnerabilities without continuous human direction. Unlike traditional SAST tools that pattern-match against known vulnerability signatures, Aardvark reasons about code semantics — making it capable of identifying novel vulnerability classes that static analysis misses.",
                "The launch carries a notable irony for the AI agent security space: an AI agent designed to find security vulnerabilities is itself an AI agent, subject to the same risks — prompt injection, tool misuse, scope creep, and runaway execution — that SupraWall and its competitors are built to prevent. An attacker who can manipulate a security agent's inputs could potentially redirect its capabilities.",
                "For developers building agentic pipelines, the Aardvark launch is a reminder that the agent threat surface is expanding in both directions: agents are being deployed for security purposes while simultaneously becoming security targets themselves.",
            ],
        },
    },
];

export function getArticle(slug: string): NewsArticle | undefined {
    return newsArticles.find((a) => a.slug === slug && a.published);
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export const CATEGORIES: Array<"ALL" | NewsCategory> = [
    "ALL",
    "REGULATION",
    "THREAT INTEL",
    "INDUSTRY",
    "FRAMEWORKS",
];

export const CATEGORY_COLORS: Record<NewsCategory, string> = {
    "REGULATION": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "THREAT INTEL": "bg-rose-500/10 text-rose-400 border-rose-500/20",
    "INDUSTRY": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "FRAMEWORKS": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};
