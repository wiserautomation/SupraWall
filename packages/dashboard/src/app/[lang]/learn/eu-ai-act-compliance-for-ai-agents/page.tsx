// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
    Shield,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Lock,
    ArrowRight,
    Scale,
    Database,
    Eye,
    ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EU AI Act Compliance for AI Agents — August 2026 Requirements",
    description: "Learn how articles 9, 12 & 14 of the EU AI Act apply to autonomous AI agents. Implementation guide for human oversight and mandatory audit trails.",
    keywords: ["EU AI Act AI agents", "EU AI Act compliance 2026", "Article 14 AI agents", "high-risk AI compliance", "AI Act August deadline", "AI agent audit trails", "human oversight AI"],
    alternates: {
        canonical: "https://www.supra-wall.com/learn/eu-ai-act-compliance-for-ai-agents",
    },
    openGraph: {
        title: "EU AI Act Compliance for AI Agents — August 2026 Deadline",
        description: "Learn how articles 9, 12 & 14 of the EU AI Act apply to autonomous AI agents. Implementation guide for human oversight and mandatory audit trails.",
        url: "https://www.supra-wall.com/learn/eu-ai-act-compliance-for-ai-agents",
        siteName: "SupraWall",
        type: "article",
    },
};

export default function EUAIActCompliancePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "EU AI Act Compliance for AI Agents 2026",
        description:
            "The EU AI Act enforcement begins August 2026. Learn which articles apply to autonomous AI agents, what human oversight means in practice, and how to comply.",
        author: {
            "@type": "Organization",
            name: "SupraWall",
        },
        publisher: {
            "@type": "Organization",
            name: "SupraWall",
            url: "https://www.supra-wall.com",
        },
        datePublished: "2026-01-01",
        dateModified: "2026-03-01",
        genre: "Compliance Guide",
        keywords: "EU AI Act, AI agents compliance, Article 14, human oversight, high-risk AI",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Does the EU AI Act apply to AI agents?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Autonomous AI agents that make consequential decisions — especially in high-risk sectors — fall under the EU AI Act as high-risk AI systems. The enforcement date is August 2, 2026.",
                },
            },
            {
                "@type": "Question",
                name: "Which EU AI Act articles apply to AI agents?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Articles 9 (risk management), 11 (technical documentation), 12 (record-keeping/logging), and 14 (human oversight) are the four most critical for autonomous AI agent deployments.",
                },
            },
            {
                "@type": "Question",
                name: "What penalties does the EU AI Act impose?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Non-compliance with high-risk AI rules can result in fines up to €30 million or 6% of global annual turnover — whichever is higher.",
                },
            },
            {
                "@type": "Question",
                name: "How does SupraWall help with EU AI Act compliance?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall implements Articles 9, 12, and 14 through its policy engine (risk management), automatic audit logs (record-keeping), and human-in-the-loop approval queues (human oversight).",
                },
            },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-20">

                    {/* Header */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Compliance Guide • EU AI Act
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            EU AI Act &{" "}
                            <span className="text-emerald-500">AI Agents.</span>
                        </h1>

                        <p className="text-xl text-neutral-300 leading-snug font-medium border-l-8 border-emerald-600 pl-8 py-4 italic">
                            Enforcement begins August 2, 2026. Autonomous AI agents are explicitly classified as high-risk AI systems. Fines reach €30 million. Here is your complete compliance roadmap.
                        </p>
                    </div>

                    {/* TLDR Box */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">TL;DR — Key Takeaways</p>
                        <ul className="space-y-3">
                            {[
                                "High-risk AI enforcement under the EU AI Act begins August 2, 2026. Most deployed autonomous agents qualify as high-risk.",
                                "Articles 9, 11, 12, and 14 are the four pillars every agent deployment must implement: risk management, documentation, logging, and human oversight.",
                                "Fines for non-compliance reach €30 million or 6% of global turnover — whichever is higher.",
                                "SupraWall implements Articles 9, 12, and 14 automatically through its policy engine, audit logs, and approval queues.",
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-300 font-medium leading-snug">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 1: The August 2026 Deadline */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <AlertTriangle className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            The August 2026 Deadline
                        </h2>
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Urgent — Enforcement in Effect</p>
                            <p className="text-neutral-300 font-medium leading-relaxed">
                                The EU AI Act's high-risk AI provisions enter full enforcement on <strong className="text-white">August 2, 2026</strong>. This is not a soft launch — non-compliant organizations face fines from day one. The European AI Office has confirmed no extension mechanism exists for most operators.
                            </p>
                            <p className="text-neutral-300 font-medium leading-relaxed">
                                If you are deploying autonomous AI agents that make consequential decisions — in customer service, finance, HR, legal, or any high-stakes domain — you are almost certainly operating a high-risk AI system under Annex III of the Act. The compliance gap must be closed before August 2, 2026.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <ArrowRight className="w-4 h-4 text-rose-400" />
                                <Link href="/learn/eu-ai-act-august-2026-deadline" className="text-rose-400 hover:text-rose-300 font-black text-sm underline underline-offset-4">
                                    See the Month-by-Month Action Plan →
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Is Your Agent High-Risk */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Shield className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Is Your AI Agent High-Risk?
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Annex III of the EU AI Act lists categories that automatically qualify as high-risk. Any autonomous agent operating within these sectors — or performing these functions — must comply with all high-risk AI obligations.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {highRiskCategories.map((cat, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-black uppercase tracking-wider text-sm">{cat.title}</p>
                                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded-full">High-Risk</span>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed text-sm">{cat.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Quick Self-Assessment</p>
                            <p className="text-neutral-400 font-medium">Does your agent do any of the following? If yes to any item, you are likely operating a high-risk AI system.</p>
                            <div className="space-y-2 mt-4">
                                {[
                                    "Make or influence employment decisions (screening, scoring candidates)",
                                    "Process credit applications or assess creditworthiness",
                                    "Influence access to essential services (insurance, housing, healthcare)",
                                    "Operate in critical infrastructure (energy, water, transport)",
                                    "Process biometric data for identification purposes",
                                    "Make decisions that could affect a person's legal rights",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-4 h-4 border border-rose-500/40 rounded flex-shrink-0 mt-0.5" />
                                        <p className="text-neutral-400 text-sm font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 3: The 4 Critical Articles */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Scale className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            The 4 Critical Articles for AI Agents
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            While the EU AI Act has 113 articles and 13 annexes, four articles contain the core technical obligations for autonomous AI agent deployments. Each maps directly to a technical control you must implement.
                        </p>
                        <div className="space-y-4">
                            {criticalArticles.map((article, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <span className="text-3xl font-black text-emerald-500 italic">{article.number}</span>
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <p className="text-white font-black uppercase tracking-wider">{article.title}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${article.statusColor}`}>
                                                    {article.status}
                                                </span>
                                            </div>
                                            <p className="text-neutral-400 font-medium leading-relaxed">{article.desc}</p>
                                            <div className="bg-black/40 rounded-2xl px-4 py-3">
                                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Technical Implementation</p>
                                                <p className="text-emerald-400 font-medium text-sm">{article.impl}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 4: Article 14 */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Eye className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Article 14: Human Oversight in Practice
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 14 requires that high-risk AI systems be designed to allow natural persons to <strong className="text-white">effectively oversee</strong> the system during its operation. For autonomous agents, this has specific technical implications — it is not enough to claim oversight exists. You must demonstrate it with evidence.
                        </p>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-6">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">What "Meaningful Human Oversight" Requires Technically</p>
                            <div className="space-y-4">
                                {[
                                    {
                                        control: "Approval Queues",
                                        desc: "High-stakes agent actions (emails, payments, deletions, API calls to external systems) must pause and route to a human for explicit approval before execution.",
                                    },
                                    {
                                        control: "Kill Switch",
                                        desc: "A mechanism to immediately halt all agent operations must be available to authorized personnel at all times. SupraWall provides this via dashboard and API.",
                                    },
                                    {
                                        control: "Audit Trail",
                                        desc: "Every agent action must be logged with sufficient detail that a human reviewer can reconstruct exactly what happened, why, and what the outcome was.",
                                    },
                                    {
                                        control: "Override Capability",
                                        desc: "Humans must be able to override any agent decision — not just observe it. Your system must support after-the-fact correction of automated decisions.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 py-3 border-b border-emerald-500/10 last:border-0">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white font-black text-sm mb-1">{item.control}</p>
                                            <p className="text-neutral-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Article 12 */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Database className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Article 12: Logging Requirements
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 12 mandates that high-risk AI systems automatically generate logs that enable post-hoc monitoring and investigation. For AI agents, this means logging at the tool-call level — not just aggregate metrics. The logs must be retained for the period mandated by applicable law (minimum 6 months under most EU sectoral regulations).
                        </p>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                            <p className="text-neutral-500 mb-4"># Article 12-compliant log entry (SupraWall format)</p>
                            <p className="text-neutral-300">{"{"}</p>
                            <p className="text-neutral-300 pl-4">"timestamp": <span className="text-emerald-400">"2026-03-19T14:23:01.847Z"</span>,</p>
                            <p className="text-neutral-300 pl-4">"agent_id": <span className="text-emerald-400">"prod-agent-finance-01"</span>,</p>
                            <p className="text-neutral-300 pl-4">"session_id": <span className="text-emerald-400">"sess_8f2k9..."</span>,</p>
                            <p className="text-neutral-300 pl-4">"tool": <span className="text-emerald-400">"payment.initiate"</span>,</p>
                            <p className="text-neutral-300 pl-4">"args": {"{"}<span className="text-yellow-400">"amount": 2500, "currency": "EUR", "recipient": "[REDACTED]"</span>{"}"}, <span className="text-neutral-500">// PII scrubbed</span></p>
                            <p className="text-neutral-300 pl-4">"decision": <span className="text-yellow-400">"REQUIRE_APPROVAL"</span>,</p>
                            <p className="text-neutral-300 pl-4">"policy_matched": <span className="text-emerald-400">"payment_over_1000_eur"</span>,</p>
                            <p className="text-neutral-300 pl-4">"cost_estimate_usd": <span className="text-emerald-400">0.003</span>,</p>
                            <p className="text-neutral-300 pl-4">"human_approved_by": <span className="text-emerald-400">"user_alice@corp.com"</span>,</p>
                            <p className="text-neutral-300 pl-4">"human_approved_at": <span className="text-emerald-400">"2026-03-19T14:24:15Z"</span></p>
                            <p className="text-neutral-300">{"}"}</p>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            SupraWall generates this log entry automatically for every tool call. Logs are exportable in JSON and CSV formats for compliance submissions.
                        </p>
                    </section>

                    {/* Section 6: Article 9 */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Shield className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Article 9: Risk Management System
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 9 requires an ongoing risk management system — not a one-time assessment. You must continuously identify, evaluate, and mitigate risks throughout your AI agent's operational lifecycle. This is where SupraWall's <strong className="text-white">block-rate dashboards</strong> and policy violation analytics constitute a qualifying risk management system.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { metric: "Block Rate", desc: "% of tool calls denied by policy — your primary risk indicator", value: "Track daily" },
                                { metric: "Approval Rate", desc: "% of calls requiring human review — flags over-reliance on automation", value: "Track weekly" },
                                { metric: "Policy Violations", desc: "Total denied calls by policy type — identifies risk hot spots", value: "Track monthly" },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-6 hover:border-emerald-500/30 transition-all space-y-2">
                                    <p className="text-white font-black uppercase tracking-wider text-sm">{item.metric}</p>
                                    <p className="text-neutral-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 7: Self-Assessment Checklist */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <ClipboardList className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Self-Assessment Checklist
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Use this 10-item checklist to assess your current compliance posture. Each item maps to a specific EU AI Act obligation.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {complianceChecklist.map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 border-2 border-emerald-500/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <span className="text-emerald-500 font-black text-xs">{i + 1}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm mb-1">{item.title}</p>
                                            <p className="text-neutral-500 text-xs font-medium">{item.article}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 8: SupraWall Compliance Evidence */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <FileText className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            How SupraWall Generates Compliance Evidence
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            EU AI Act compliance is not just about having controls in place — you need to <strong className="text-white">demonstrate</strong> those controls to regulators. SupraWall's compliance exports give you audit-ready evidence packages that map directly to Articles 9, 12, and 14.
                        </p>
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Human Oversight Evidence (HOE) Export",
                                    desc: "A structured PDF/JSON report showing every instance where human oversight was invoked, who approved or rejected the action, and the outcome. This is your Article 14 evidence document.",
                                    badge: "Article 14",
                                },
                                {
                                    title: "Audit Log Download",
                                    desc: "Full tool-call-level logs in machine-readable format for any time period. Includes all fields required by Article 12: timestamp, tool, args, decision, cost, agent ID, session ID.",
                                    badge: "Article 12",
                                },
                                {
                                    title: "Compliance Dashboard",
                                    desc: "Real-time risk metrics including block rates, policy violation trends, and budget utilization — constituting the ongoing risk monitoring required by Article 9.",
                                    badge: "Article 9",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="text-white font-black">{item.title}</p>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">{item.badge}</span>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Lock className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "Does the EU AI Act apply to AI agents?",
                                    a: "Yes. Autonomous AI agents that make consequential decisions — especially in high-risk sectors — fall under the EU AI Act as high-risk AI systems. The enforcement date is August 2, 2026.",
                                },
                                {
                                    q: "Which EU AI Act articles apply to AI agents?",
                                    a: "Articles 9 (risk management), 11 (technical documentation), 12 (record-keeping/logging), and 14 (human oversight) are the four most critical for autonomous AI agent deployments.",
                                },
                                {
                                    q: "What penalties does the EU AI Act impose?",
                                    a: "Non-compliance with high-risk AI rules can result in fines up to €30 million or 6% of global annual turnover — whichever is higher. There is no grace period once enforcement begins.",
                                },
                                {
                                    q: "How does SupraWall help with EU AI Act compliance?",
                                    a: "SupraWall implements Articles 9, 12, and 14 through its policy engine (risk management), automatic audit logs (record-keeping), and human-in-the-loop approval queues (human oversight). Compliance evidence is exportable on demand.",
                                },
                            ].map((faq, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                                    <p className="text-white font-black text-lg mb-3">{faq.q}</p>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Related Articles — Part of SEO Cluster */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            Compliance Cluster
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                            {[
                                { title: "EU AI Act Audit Trail Guide", url: "/learn/eu-ai-act-audit-trail", desc: "Technical implementation of Article 12 mandatory logging." },
                                { title: "August 2026 Checklist", url: "/blog/eu-ai-act-august-2026-checklist", desc: "The definitive 5-step roadmap to compliance." },
                                { title: "What are AI Agent Guardrails?", url: "/learn/what-are-ai-agent-guardrails", desc: "The foundation of agentic security and enforcement." },
                                { title: "AI Agent Secrets Management", url: "/learn/ai-agent-vault-secrets-management", desc: "Handling credentials in a compliant manner (Article 10)." },
                                { title: "LangChain Integration", url: "/integrations/langchain", desc: "Secure your LangChain agents for EU audit readiness." },
                                { title: "SupraWall for MCP", url: "/integrations/mcp", desc: "Compliance middleware for Model Context Protocol agents." }
                            ].map((article, i) => (
                                <Link key={i} href={article.url} className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors italic uppercase tracking-tight">{article.title}</h4>
                                    <p className="text-sm text-neutral-500 mt-2 font-medium leading-relaxed">{article.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-8">
                        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em]">August 2026 is closer than you think</p>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-[0.9]">
                            Start Protecting<br />Your Agents.
                        </h2>
                        <p className="text-emerald-100 font-medium text-lg max-w-xl mx-auto">
                            Get EU AI Act Articles 9, 12, and 14 implemented in your AI agent stack before the August 2026 enforcement date.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/beta"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all"
                            >
                                Get Compliant Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/learn/eu-ai-act-august-2026-deadline"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all"
                            >
                                View the Deadline Plan
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em]">
                    SupraWall © 2026 • Real-time Agent Governance
                </p>
            </footer>
        </div>
    );
}

const highRiskCategories = [
    {
        title: "Biometric Identification",
        desc: "AI systems used for real-time or post-remote biometric identification of natural persons in publicly accessible spaces.",
    },
    {
        title: "Critical Infrastructure",
        desc: "AI managing or influencing the safety components of energy, water, transport, and digital infrastructure systems.",
    },
    {
        title: "Education & Vocational Training",
        desc: "AI determining access to educational institutions, assessing learning outcomes, or evaluating exam performance.",
    },
    {
        title: "Employment & HR",
        desc: "AI used in recruitment, candidate screening, promotion decisions, task allocation, or performance monitoring of workers.",
    },
    {
        title: "Essential Private Services",
        desc: "AI evaluating creditworthiness, determining insurance premiums, or making decisions about access to housing or utilities.",
    },
    {
        title: "Law Enforcement",
        desc: "AI assessing individual risk scores, analyzing crime patterns, or evaluating reliability of evidence in criminal proceedings.",
    },
];

const criticalArticles = [
    {
        number: "Art. 9",
        title: "Risk Management System",
        desc: "Requires an ongoing risk management process throughout the AI system's lifecycle — identifying foreseeable risks, evaluating them, and implementing mitigation measures. This is not a one-time audit.",
        impl: "SupraWall block-rate dashboards + policy violation analytics constitute a qualifying ongoing risk management system.",
        status: "In Force Aug 2026",
        statusColor: "text-rose-400 bg-rose-500/10",
    },
    {
        number: "Art. 11",
        title: "Technical Documentation",
        desc: "High-risk AI providers must maintain comprehensive technical documentation covering system design, training data, performance benchmarks, and risk assessment outcomes.",
        impl: "Maintain a model card, architecture diagram, and training data provenance document for each deployed agent.",
        status: "In Force Aug 2026",
        statusColor: "text-rose-400 bg-rose-500/10",
    },
    {
        number: "Art. 12",
        title: "Record-Keeping & Logging",
        desc: "Automatic logging sufficient to enable post-hoc investigation of system behavior. Logs must capture the level of accuracy, robustness, and cybersecurity properties of the system.",
        impl: "SupraWall generates per-tool-call audit logs with timestamp, tool name, arguments, decision, cost, agent ID, and session ID.",
        status: "In Force Aug 2026",
        statusColor: "text-rose-400 bg-rose-500/10",
    },
    {
        number: "Art. 14",
        title: "Human Oversight",
        desc: "High-risk AI must be designed to enable effective oversight by natural persons. Humans must be able to understand, monitor, and intervene in the system's operation.",
        impl: "SupraWall's REQUIRE_APPROVAL policy + dashboard approval queue + kill switch API directly implements Article 14.",
        status: "In Force Aug 2026",
        statusColor: "text-rose-400 bg-rose-500/10",
    },
];

const complianceChecklist = [
    { title: "AI system classified as high-risk or not", article: "Annex III assessment" },
    { title: "Technical documentation created and maintained", article: "Article 11" },
    { title: "Risk management system established", article: "Article 9" },
    { title: "Training data governance documented", article: "Article 10" },
    { title: "Automatic logging implemented for all tool calls", article: "Article 12" },
    { title: "Human oversight mechanism deployed", article: "Article 14" },
    { title: "Kill switch / override capability available", article: "Article 14(4)" },
    { title: "Conformity assessment completed", article: "Article 43" },
    { title: "EU Declaration of Conformity prepared", article: "Article 47" },
    { title: "Compliance evidence exportable on demand", article: "Article 12 + 14" },
];
