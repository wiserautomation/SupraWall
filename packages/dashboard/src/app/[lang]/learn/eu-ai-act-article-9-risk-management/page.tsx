// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    FileText,
    BarChart3,
    Lock,
    Eye,
    ArrowRight,
    ClipboardList,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EU AI Act Article 9: Risk Management Guide | SupraWall",
    description:
        "Article 9 requires a risk management system for high-risk AI. Learn how to build one for autonomous AI agents and generate the evidence documentation regulators expect.",
    keywords: [
        "Article 9 EU AI Act",
        "AI risk management system",
        "EU AI Act risk assessment",
        "AI agent risk management",
        "Article 9 compliance",
    ],
    alternates: {
        canonical:
            "https://www.supra-wall.com/learn/eu-ai-act-article-9-risk-management",
    },
    openGraph: {
        title: "EU AI Act Article 9: Risk Management Guide | SupraWall",
        description:
            "Article 9 requires a risk management system for high-risk AI. Learn how to build one for autonomous AI agents and generate the evidence documentation regulators expect.",
        url: "https://www.supra-wall.com/learn/eu-ai-act-article-9-risk-management",
        siteName: "SupraWall",
        type: "article",
    },
};

export default function Article9RiskManagementPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "EU AI Act Article 9: Risk Management System for AI Agents",
        description:
            "Article 9 requires a risk management system for high-risk AI. Learn how to build one for autonomous AI agents and generate the evidence documentation regulators expect.",
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
        dateModified: "2026-03-19",
        genre: "Compliance Guide",
        keywords:
            "Article 9 EU AI Act, AI risk management system, EU AI Act risk assessment, AI agent risk management",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What does Article 9 of the EU AI Act require?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Article 9 requires that providers of high-risk AI systems establish, implement, document, and maintain a risk management system throughout the AI system's lifecycle. This includes identifying risks, evaluating them, implementing risk mitigation, and testing residual risks.",
                },
            },
            {
                "@type": "Question",
                name: "What is a 'risk management system' for AI agents?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "For AI agents, a risk management system includes: documented identification of potential harms (data exfiltration, unauthorized actions, budget overruns), technical controls that mitigate those risks, ongoing monitoring of residual risk, and regular review and updates.",
                },
            },
            {
                "@type": "Question",
                name: "How does SupraWall constitute a risk management system?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall's policy engine maps directly to Article 9: DENY policies mitigate identified risks, REQUIRE_APPROVAL controls manage residual risks requiring human judgment, audit logs provide continuous monitoring, and the compliance dashboard generates the required documentation.",
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
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            EU AI Act • Article 9 Deep Dive
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                                Article 9:{" "}
                                <span className="text-emerald-500">Risk Management.</span>
                            </h1>
                            <p className="text-2xl font-black tracking-tighter uppercase italic text-neutral-500 mt-2">
                                Build a System That Satisfies Regulators
                            </p>
                        </div>
                        <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
                            Article 9 is not a one-time risk assessment. It demands a living system that identifies, mitigates, monitors, and documents AI risks throughout your agent's entire operational life. Here is how to build one that actually satisfies the regulation.
                        </p>
                    </div>

                    {/* TLDR */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">TL;DR — Key Takeaways</p>
                        <ul className="space-y-3">
                            {[
                                "Article 9 requires a risk management system — not just a risk assessment. It must be ongoing, not a checkbox.",
                                "You must identify risks, evaluate them, implement controls, monitor residual risk, and document everything.",
                                "The five agent risk categories are: unauthorized tool execution, data exfiltration, budget abuse, prompt injection, and regulatory violations.",
                                "DENY policies eliminate high-likelihood/high-impact risks. REQUIRE_APPROVAL manages residual risks needing human judgment.",
                                "SupraWall's policy engine, audit logs, and compliance dashboard are a ready-made Article 9 risk management system.",
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-300 text-sm font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 1: Article 9 Plain English */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <FileText className="w-6 h-6 text-emerald-500" />
                            Article 9 Plain English
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 9 of the EU AI Act requires that providers of high-risk AI systems establish, implement, document, and <strong className="text-white">maintain</strong> a risk management system. The word "maintain" is doing significant work here — this is not a point-in-time assessment you complete before launch. It is a continuous process with ongoing obligations.
                        </p>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">The 4 Lifecycle Obligations</p>
                            <div className="space-y-4">
                                {[
                                    {
                                        phase: "Establish",
                                        desc: "Before deployment: identify and document all foreseeable risks. Create a risk register. Define your control architecture.",
                                    },
                                    {
                                        phase: "Implement",
                                        desc: "At deployment: technical controls must be active and functioning. Policies configured, monitoring live, approval queues operational.",
                                    },
                                    {
                                        phase: "Document",
                                        desc: "Continuously: maintain records of the risk management system — the risks identified, controls deployed, and test results.",
                                    },
                                    {
                                        phase: "Maintain",
                                        desc: "Post-deployment: review and update the risk management system as the AI system evolves, new risks emerge, or incidents occur.",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full flex-shrink-0 mt-0.5">{item.phase}</span>
                                        <p className="text-neutral-300 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The lifecycle requirement is what catches most teams off guard. You cannot build a risk management system, pass it through legal review, and file it away. Article 9 requires that the system remain current and that you can demonstrate it was <strong className="text-white">active during the period</strong> an authority is investigating.
                        </p>
                    </section>

                    {/* Section 2: Risk Identification */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-emerald-500" />
                            Risk Identification for AI Agents
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 9 requires identification of all <strong className="text-white">reasonably foreseeable risks</strong> associated with your AI system. For autonomous agents, these fall into five categories. Each must be documented in your risk register with a description, affected parties, and potential severity.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Unauthorized Tool Execution",
                                    desc: "Agent calls tools outside its intended scope — accessing unauthorized APIs, executing system commands, or operating on data it should not touch. Can result from prompt injection or planning failures.",
                                    severity: "Critical",
                                    color: "text-rose-400",
                                },
                                {
                                    title: "Data Exfiltration",
                                    desc: "Agent transmits sensitive, proprietary, or personal data to external endpoints. May be deliberate (injected instruction) or accidental (overly broad tool scope).",
                                    severity: "Critical",
                                    color: "text-rose-400",
                                },
                                {
                                    title: "Budget and Resource Abuse",
                                    desc: "Agent enters infinite loops, makes excessive API calls, or consumes tokens at a rate that causes financial harm. Denial-of-wallet attacks exploit agents with no cost controls.",
                                    severity: "High",
                                    color: "text-orange-400",
                                },
                                {
                                    title: "Prompt Injection",
                                    desc: "Malicious content in the agent's environment (documents, emails, web pages) redirects the agent to act against operator instructions. Externally introduced risk.",
                                    severity: "High",
                                    color: "text-orange-400",
                                },
                                {
                                    title: "Regulatory Violations",
                                    desc: "Agent takes actions that violate applicable law — sending unsolicited communications, processing personal data without basis, making discriminatory decisions.",
                                    severity: "Severe",
                                    color: "text-rose-500",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-white font-black uppercase tracking-wider text-sm">{item.title}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.severity}</span>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Risk Assessment Matrix */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-emerald-500" />
                            Risk Assessment: The Likelihood × Impact Matrix
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 9 requires that identified risks be evaluated — not just listed. The standard approach is a likelihood × impact matrix. For each risk, assess how likely it is to occur and how severe the impact would be if it did. This produces a risk level that drives your control selection.
                        </p>

                        {/* 2x2 matrix */}
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6">Risk Level Matrix — Control Selection Guide</p>
                            <div className="grid grid-cols-3 gap-3">
                                {/* Header row */}
                                <div className="flex items-end pb-2">
                                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-wider">Likelihood ↓ / Impact →</p>
                                </div>
                                <div className="text-center pb-2">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Low Impact</p>
                                </div>
                                <div className="text-center pb-2">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">High Impact</p>
                                </div>

                                {/* High likelihood row */}
                                <div className="flex items-center">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">High Likelihood</p>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
                                    <p className="text-yellow-400 font-black text-xs uppercase tracking-wider">Medium Risk</p>
                                    <p className="text-neutral-400 text-[10px] font-medium mt-1">REQUIRE_APPROVAL</p>
                                </div>
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center">
                                    <p className="text-rose-400 font-black text-xs uppercase tracking-wider">Critical Risk</p>
                                    <p className="text-neutral-400 text-[10px] font-medium mt-1">DENY + document</p>
                                </div>

                                {/* Low likelihood row */}
                                <div className="flex items-center">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Low Likelihood</p>
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-center">
                                    <p className="text-emerald-500 font-black text-xs uppercase tracking-wider">Low Risk</p>
                                    <p className="text-neutral-400 text-[10px] font-medium mt-1">ALLOW + log</p>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                                    <p className="text-orange-400 font-black text-xs uppercase tracking-wider">High Risk</p>
                                    <p className="text-neutral-400 text-[10px] font-medium mt-1">REQUIRE_APPROVAL</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The matrix drives your policy selection: <strong className="text-white">Critical risks</strong> (high likelihood + high impact) require DENY policies that prevent the action entirely. <strong className="text-white">High risks</strong> (low likelihood + high impact, or high likelihood + low impact) warrant REQUIRE_APPROVAL. <strong className="text-white">Low risks</strong> can be ALLOW with logging for monitoring.
                        </p>
                    </section>

                    {/* Section 4: Risk Mitigation Controls */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Lock className="w-6 h-6 text-emerald-500" />
                            Risk Mitigation Controls
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 9 requires that identified risks be mitigated by appropriate controls. For AI agents, controls must operate at the action layer — not the language layer. Here is the mapping from risk category to SupraWall control.
                        </p>
                        <div className="space-y-3">
                            {[
                                {
                                    risk: "Unauthorized Tool Execution",
                                    control: "Tool Allowlist (DENY by default)",
                                    implementation: "Define an explicit allowlist. All tools not on the list return DENY automatically.",
                                },
                                {
                                    risk: "Data Exfiltration",
                                    control: "Scope Isolation + PII Scrubbing",
                                    implementation: "Restrict agent to specific data namespaces. Auto-redact PII from log entries and outbound calls.",
                                },
                                {
                                    risk: "Budget / Resource Abuse",
                                    control: "Budget Caps (token + cost limits)",
                                    implementation: "Set hard per-session and per-day limits. Agent halts when cap is reached — not just warned.",
                                },
                                {
                                    risk: "Prompt Injection",
                                    control: "REQUIRE_APPROVAL on sensitive tools",
                                    implementation: "Any tool that could be weaponized by injected instructions (email, file write, external HTTP) requires human sign-off.",
                                },
                                {
                                    risk: "Regulatory Violations",
                                    control: "Tool Blocklist for non-compliant operations",
                                    implementation: "DENY policies on tools that would constitute regulatory violations — e.g., bulk_contact_send, decision_record_write.",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Risk</p>
                                            <p className="text-neutral-300 font-medium text-sm">{item.risk}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Control</p>
                                            <p className="text-neutral-300 font-medium text-sm">{item.control}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Implementation</p>
                                            <p className="text-neutral-400 font-medium text-sm">{item.implementation}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5: Residual Risk Management */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-emerald-500" />
                            Residual Risk Management
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            No control eliminates risk entirely. After implementing your mitigation controls, residual risks remain — and Article 9 requires that these be explicitly documented and managed. The key distinction is between <strong className="text-white">accepted residual risk</strong> (documented, proportionate, with justification) and <strong className="text-white">unmitigated risk</strong> (not addressed, which is non-compliant).
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-3">
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Unmitigated Risk (Non-Compliant)</p>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                                    A risk that has been identified but no control has been implemented. There is no documentation of why it was left unaddressed. Regulators will treat this as negligence — there is no excuse for a documented risk with no corresponding control.
                                </p>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-3">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Accepted Residual Risk (Compliant)</p>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                                    A risk where controls exist but cannot eliminate it fully. The residual risk is explicitly documented, its level is proportionate, the justification is recorded, and it is subject to ongoing monitoring. This is acceptable and expected.
                                </p>
                            </div>
                        </div>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                            <p className="text-neutral-500 mb-4"># Residual risk documentation template</p>
                            <p className="text-neutral-300">{"{"}</p>
                            <p className="text-neutral-300 pl-4">"risk_id": <span className="text-yellow-300">"RISK-003"</span>,</p>
                            <p className="text-neutral-300 pl-4">"name": <span className="text-yellow-300">"Novel prompt injection vectors"</span>,</p>
                            <p className="text-neutral-300 pl-4">"controls_applied": [<span className="text-yellow-300">"REQUIRE_APPROVAL on email.send"</span>, <span className="text-yellow-300">"PII_scrubbing"</span>],</p>
                            <p className="text-neutral-300 pl-4">"residual_level": <span className="text-orange-400">"LOW"</span>,</p>
                            <p className="text-neutral-300 pl-4">"justification": <span className="text-yellow-300">"Approval queue creates human checkpoint before external action. Novel vectors cannot bypass REQUIRE_APPROVAL."</span>,</p>
                            <p className="text-neutral-300 pl-4">"monitoring": <span className="text-yellow-300">"block_rate_dashboard"</span>,</p>
                            <p className="text-neutral-300 pl-4">"review_cycle": <span className="text-yellow-300">"monthly"</span></p>
                            <p className="text-neutral-300">{"}"}</p>
                        </div>
                    </section>

                    {/* Section 6: Continuous Monitoring */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Eye className="w-6 h-6 text-emerald-500" />
                            Continuous Monitoring Requirements
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 9 explicitly requires ongoing monitoring as part of the risk management system. This is not just post-deployment review — the regulation expects that you have <strong className="text-white">active visibility</strong> into whether risks are materializing and whether controls are functioning. SupraWall provides three monitoring mechanisms that together satisfy this requirement.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    title: "Block Rate Dashboard",
                                    desc: "Shows what percentage of tool calls are being denied. A sudden spike in block rate indicates either a policy misconfiguration or an active attack. Review weekly.",
                                    metric: "Block %",
                                },
                                {
                                    title: "Budget Consumption Alerts",
                                    desc: "Tracks per-agent token and cost consumption against caps. Alert thresholds trigger before the cap is hit, giving operators time to investigate anomalous behavior.",
                                    metric: "$ Spent",
                                },
                                {
                                    title: "Monthly Compliance Reports",
                                    desc: "Auto-generated summary of risk events, approval queue activity, and policy hit rates for the period. Provides the ongoing documentation Article 9 requires.",
                                    metric: "Report",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-3">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.metric}</p>
                                    <p className="text-white font-black uppercase tracking-wider text-sm">{item.title}</p>
                                    <p className="text-neutral-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Monitoring Cadence Recommendation</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                {[
                                    { freq: "Daily", action: "Review block rate anomalies and approval queue backlog" },
                                    { freq: "Weekly", action: "Audit budget consumption across all active agents" },
                                    { freq: "Monthly", action: "Generate and archive the full compliance report + HOE export" },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <p className="text-emerald-400 font-black text-sm uppercase tracking-wider">{item.freq}</p>
                                        <p className="text-neutral-400 text-sm font-medium mt-1">{item.action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 7: Evidence Package */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <ClipboardList className="w-6 h-6 text-emerald-500" />
                            Generating the Article 9 Evidence Package
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            When a national AI supervisory authority requests evidence of Article 9 compliance, you need to produce a structured documentation package covering the entire lifecycle of your risk management system. Here is the complete list of what to prepare.
                        </p>
                        <div className="space-y-4">
                            {[
                                {
                                    doc: "Risk Register",
                                    desc: "A complete list of all identified risks, their likelihood and impact ratings, risk level, assigned control, and residual risk assessment. Minimum one page per risk category.",
                                    status: "Required",
                                },
                                {
                                    doc: "Control Descriptions",
                                    desc: "For each control in your risk management system: what it does, how it is configured, and which risk it mitigates. Export your SupraWall policy configuration as evidence.",
                                    status: "Required",
                                },
                                {
                                    doc: "Test Results",
                                    desc: "Evidence that controls were tested and are functioning. For SupraWall: policy evaluation test logs showing DENY responses for blocked tools, kill-switch propagation tests.",
                                    status: "Required",
                                },
                                {
                                    doc: "Monitoring Reports",
                                    desc: "The last 6 months of monthly compliance reports showing block rates, approval queue activity, and budget consumption. Demonstrates the system is being actively monitored.",
                                    status: "Required",
                                },
                                {
                                    doc: "Incident Log",
                                    desc: "Any events where the risk management system was invoked in response to an actual risk materializing — unusual block spikes, blocked injection attempts, approval rejections.",
                                    status: "If applicable",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-black uppercase tracking-wider text-sm">{item.doc}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === "Required" ? "text-emerald-400" : "text-neutral-500"}`}>{item.status}</span>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                            <p className="text-neutral-500 mb-4"># Generate Article 9 evidence package via SupraWall API</p>
                            <p className="text-neutral-300">POST /api/v1/compliance/export</p>
                            <p className="text-neutral-300">{"{"}</p>
                            <p className="text-neutral-300 pl-4">"type": <span className="text-yellow-300">"article_9_risk_management"</span>,</p>
                            <p className="text-neutral-300 pl-4">"period_start": <span className="text-yellow-300">"2026-01-01"</span>,</p>
                            <p className="text-neutral-300 pl-4">"period_end": <span className="text-yellow-300">"2026-03-31"</span>,</p>
                            <p className="text-neutral-300 pl-4">"include": [</p>
                            <p className="text-neutral-300 pl-8"><span className="text-yellow-300">"risk_register"</span>,</p>
                            <p className="text-neutral-300 pl-8"><span className="text-yellow-300">"policy_configuration"</span>,</p>
                            <p className="text-neutral-300 pl-8"><span className="text-yellow-300">"monitoring_reports"</span>,</p>
                            <p className="text-neutral-300 pl-8"><span className="text-yellow-300">"incident_log"</span></p>
                            <p className="text-neutral-300 pl-4">]</p>
                            <p className="text-neutral-300">{"}"}</p>
                            <p className="text-neutral-500 mt-4"># Returns structured JSON + PDF summary</p>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Shield className="w-6 h-6 text-emerald-500" />
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "What does Article 9 of the EU AI Act require?",
                                    a: "Article 9 requires that providers of high-risk AI systems establish, implement, document, and maintain a risk management system throughout the AI system's lifecycle. This includes identifying risks, evaluating them, implementing risk mitigation, and testing residual risks.",
                                },
                                {
                                    q: "What is a 'risk management system' for AI agents?",
                                    a: "For AI agents, a risk management system includes: documented identification of potential harms (data exfiltration, unauthorized actions, budget overruns), technical controls that mitigate those risks, ongoing monitoring of residual risk, and regular review and updates.",
                                },
                                {
                                    q: "How does SupraWall constitute a risk management system?",
                                    a: "SupraWall's policy engine maps directly to Article 9: DENY policies mitigate identified risks, REQUIRE_APPROVAL controls manage residual risks requiring human judgment, audit logs provide continuous monitoring, and the compliance dashboard generates the required documentation.",
                                },
                            ].map((faq, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                                    <p className="text-white font-black text-lg mb-3">{faq.q}</p>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Related Articles */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/learn/eu-ai-act-august-2026-deadline" className="group p-6 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">EU AI Act August 2026 Deadline</h4>
                                <p className="text-sm text-neutral-500 mt-2">5-month compliance roadmap for the August 2, 2026 deadline.</p>
                            </Link>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-6">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Start Compliant.</h2>
                        <p className="text-emerald-100 text-lg font-medium">Generate EU AI Act evidence exports automatically.</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href="/beta" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 inline-flex items-center gap-2">
                                Start Free <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/learn/eu-ai-act-compliance-ai-agents" className="px-10 py-4 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl">
                                Full EU AI Act Guide
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
