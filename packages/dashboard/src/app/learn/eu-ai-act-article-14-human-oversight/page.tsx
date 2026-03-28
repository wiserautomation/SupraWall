// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
    Shield,
    Eye,
    Lock,
    FileText,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Users,
    Pause,
    ClipboardList,
    MonitorCheck,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EU AI Act Article 14: Human Oversight for Agents | SupraWall",
    description:
        "Article 14 requires human oversight for high-risk AI systems. Learn exactly what this means for autonomous agents, what technical controls satisfy regulators, and how to document it.",
    keywords: [
        "Article 14 EU AI Act",
        "human oversight EU AI Act",
        "EU AI Act",
        "human in the loop regulation",
        "EU AI oversight requirement",
    ],
    alternates: {
        canonical:
            "https://www.supra-wall.com/learn/eu-ai-act-article-14-human-oversight",
    },
    openGraph: {
        title: "EU AI Act Article 14: Human Oversight for Agents | SupraWall",
        description:
            "Article 14 requires human oversight for high-risk AI systems. Learn exactly what this means for autonomous agents, what technical controls satisfy regulators, and how to document it.",
        url: "https://www.supra-wall.com/learn/eu-ai-act-article-14-human-oversight",
        siteName: "SupraWall",
        type: "article",
    },
};

export default function Article14HumanOversightPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "EU AI Act Article 14: Human Oversight for AI Agents",
        description:
            "Article 14 requires human oversight for high-risk AI systems. Learn exactly what this means for autonomous agents, what technical controls satisfy regulators, and how to document it.",
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
            "Article 14 EU AI Act, human oversight EU AI Act, human in the loop regulation, EU AI oversight requirement",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What does EU AI Act Article 14 require?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Article 14 mandates that high-risk AI systems be designed to enable human oversight during operation. This means real humans must be able to monitor AI outputs, understand agent decisions, intervene or halt operations, and override system decisions when necessary.",
                },
            },
            {
                "@type": "Question",
                name: "Does human oversight mean a human reviews every AI action?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Not necessarily. Article 14 requires 'appropriate human oversight' proportionate to the risk. For most AI agents, this means automated logging with human review capability plus manual approval queues for high-stakes actions.",
                },
            },
            {
                "@type": "Question",
                name: "What technical controls satisfy Article 14?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The regulation requires: the ability to interrupt and halt the system, meaningful monitoring of outputs and behavior, the ability to override AI decisions, and documented evidence of oversight. SupraWall's approval queues, audit logs, and kill-switch satisfy all four.",
                },
            },
            {
                "@type": "Question",
                name: "When must Article 14 compliance be demonstrated?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The EU AI Act's high-risk provisions take full effect August 2, 2026. Documentation of Article 14 compliance must be available to national authorities on request.",
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
                            EU AI Act • Article 14 Deep Dive
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                                Article 14:{" "}
                                <span className="text-emerald-500">Human Oversight.</span>
                            </h1>
                            <p className="text-2xl font-black tracking-tighter uppercase italic text-neutral-500 mt-2">
                                The Technical Implementation Guide
                            </p>
                        </div>
                        <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
                            Article 14 is the most operationally demanding EU AI Act requirement for autonomous agents. It does not ask for a dashboard — it asks for proof that a human can actually stop your agent before damage occurs. Here is exactly what that means and how to build it.
                        </p>
                    </div>

                    {/* TLDR */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">TL;DR — Key Takeaways</p>
                        <ul className="space-y-3">
                            {[
                                "Article 14 requires 'appropriate human oversight' proportionate to risk — not a human reviewing every single action.",
                                "The four technical requirements are: interrupt/halt capability, real-time monitoring, override ability, and documented evidence.",
                                "For AI agents, this means approval queues for high-stakes actions, kill-switch controls, and a real-time audit feed.",
                                "Documentation of compliance must be available to national authorities on request from August 2, 2026.",
                                "SupraWall's REQUIRE_APPROVAL policy, agent status controls, and HOE export directly satisfy all four Article 14 requirements.",
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-300 text-sm font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 1: What Article 14 Actually Says */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <FileText className="w-6 h-6 text-emerald-500" />
                            What Article 14 Actually Says
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 14 of the EU AI Act mandates that high-risk AI systems be designed and developed in such a way that they can be effectively overseen by natural persons during the period in which the AI system is in use. The regulation specifies that oversight measures must be <strong className="text-white">commensurate with the risks, level of autonomy, and context of use</strong>.
                        </p>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Verbatim — Article 14(1)</p>
                            <p className="text-neutral-300 italic text-lg leading-relaxed font-medium border-l-4 border-emerald-500/30 pl-6">
                                "High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which the AI system is in use."
                            </p>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            In plain English for engineers: your AI agent must be built so that a real human can watch what it is doing, understand its decisions, and stop it if needed. This is not a soft recommendation — it is a hard design requirement for any system that falls under the high-risk classification.
                        </p>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 14 breaks down into four concrete sub-requirements, each of which demands a specific technical control:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { num: "1", label: "Interrupt Capability", desc: "The ability to stop the AI system immediately — a kill switch or status control that halts execution." },
                                { num: "2", label: "Monitoring", desc: "Real-time visibility into what the agent is doing — not just post-hoc logs, but a live operational view." },
                                { num: "3", label: "Override Ability", desc: "The ability to reject or reverse an AI decision before it has irreversible consequences." },
                                { num: "4", label: "Documentation", desc: "Evidence that oversight mechanisms exist and were used — available to regulators on demand." },
                            ].map((item) => (
                                <div key={item.num} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-3xl font-black text-emerald-500/30">{item.num}</span>
                                        <p className="text-white font-black uppercase tracking-wider text-sm">{item.label}</p>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Why AI Agents Have Special Challenges */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-emerald-500" />
                            Why AI Agents Have Special Challenges
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 14 was drafted with traditional AI systems in mind — systems that receive an input and produce an output, with a human in the loop between each cycle. Autonomous AI agents break this model entirely. An agent can execute hundreds of tool calls per minute, each with real-world consequences, without any natural pause point for human review.
                        </p>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Traditional oversight assumes <strong className="text-white">human-paced decisions</strong>. A loan officer reviewing an AI recommendation has time to read, think, and decide. An AI agent completing a multi-step task — browsing, summarizing, sending an email, updating a database — can complete all four actions before a human could even open the monitoring dashboard.
                        </p>
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">The Core Problem</p>
                            <p className="text-neutral-300 text-lg font-medium leading-relaxed">
                                A fully autonomous agent with no approval checkpoints does not just make human oversight harder — it makes it <strong className="text-white">structurally impossible</strong>. By the time a human notices a problem in the audit log, the agent has already executed 50 more actions downstream.
                            </p>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The EU AI Act's "appropriate" oversight standard acknowledges this reality. Regulators do not expect a human to approve every single tool call. What they <em>do</em> expect is a system where high-stakes, irreversible, or sensitive actions require human authorization — and where a human can halt all activity the moment something goes wrong. This is exactly what a well-designed approval queue and kill-switch architecture provides.
                        </p>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">What Courts and Regulators Will Look For</p>
                            <div className="space-y-3">
                                {[
                                    "Was there a mechanism to stop the agent before the harmful action completed?",
                                    "Was there a record of what the agent did and why each decision was made?",
                                    "Did a human have the technical ability to intervene — even if they did not act on it?",
                                    "Was the oversight mechanism commensurate with the risk level of the system?",
                                ].map((q, i) => (
                                    <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                                        <span className="text-emerald-500 font-black text-sm flex-shrink-0">Q{i + 1}</span>
                                        <p className="text-neutral-300 font-medium text-sm">{q}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 3: The 4 Technical Requirements */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <MonitorCheck className="w-6 h-6 text-emerald-500" />
                            The 4 Technical Requirements in Detail
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Each Article 14 sub-requirement maps to a concrete engineering deliverable. Here is what each requires and how it is implemented.
                        </p>

                        {/* Req 1 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-4">
                            <div className="flex items-center gap-3">
                                <Pause className="w-5 h-5 text-emerald-500" />
                                <p className="text-white font-black uppercase tracking-wider text-sm">Requirement 1: Interrupt and Halt Capability</p>
                            </div>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                The system must have a mechanism to immediately stop the AI agent's execution. This is the most fundamental requirement — without it, all other oversight is meaningless. For an AI agent, this means a kill-switch that transitions the agent to a suspended or revoked state, causing all in-flight tool calls to be rejected.
                            </p>
                            <div className="bg-black/40 rounded-2xl p-4 font-mono text-sm">
                                <p className="text-neutral-500 mb-2"># SupraWall kill-switch via API</p>
                                <p className="text-neutral-300">PATCH /api/v1/agents/{"{"}<span className="text-emerald-400">agent_id</span>{"}"}</p>
                                <p className="text-neutral-300 pl-4">{"{"} "status": <span className="text-rose-400">"suspended"</span> {"}"}</p>
                                <p className="text-neutral-500 mt-2"># All subsequent tool calls return DENY immediately</p>
                            </div>
                        </div>

                        {/* Req 2 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-4">
                            <div className="flex items-center gap-3">
                                <Eye className="w-5 h-5 text-emerald-500" />
                                <p className="text-white font-black uppercase tracking-wider text-sm">Requirement 2: Meaningful Monitoring of Outputs</p>
                            </div>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                Oversight must be <em>meaningful</em> — not just theoretically possible. A log file that requires SQL queries to read does not satisfy this requirement for operational oversight. You need a real-time audit feed that surfaces what the agent is doing, in human-readable form, with enough context to make oversight decisions. SupraWall's live event feed provides per-call visibility including tool name, arguments, decision, cost, and timestamp.
                            </p>
                        </div>

                        {/* Req 3 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-4">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-emerald-500" />
                                <p className="text-white font-black uppercase tracking-wider text-sm">Requirement 3: Override Ability</p>
                            </div>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                Humans must be able to override AI decisions — not just observe them. For autonomous agents, this means a <strong className="text-white">REQUIRE_APPROVAL</strong> policy that pauses the agent and surfaces the pending action to a human reviewer. The reviewer can approve, reject, or modify the action. If rejected, the agent receives a denial and must plan an alternative path.
                            </p>
                            <div className="bg-black/40 rounded-2xl p-4 font-mono text-sm">
                                <p className="text-neutral-500 mb-2"># Policy definition for Article 14 override</p>
                                <p className="text-emerald-400">{"{"}</p>
                                <p className="text-neutral-300 pl-4">"tool": <span className="text-yellow-300">"email.send"</span>,</p>
                                <p className="text-neutral-300 pl-4">"policy": <span className="text-yellow-300">"REQUIRE_APPROVAL"</span>,</p>
                                <p className="text-neutral-300 pl-4">"reason": <span className="text-yellow-300">"External communication requires human review"</span></p>
                                <p className="text-emerald-400">{"}"}</p>
                            </div>
                        </div>

                        {/* Req 4 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-4">
                            <div className="flex items-center gap-3">
                                <ClipboardList className="w-5 h-5 text-emerald-500" />
                                <p className="text-white font-black uppercase tracking-wider text-sm">Requirement 4: Documented Evidence</p>
                            </div>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                Compliance must be demonstrable. This requires structured documentation: records showing that oversight mechanisms were in place and functioning, samples of approval requests that went through the human queue, and evidence that the interrupt capability was tested. SupraWall's Human Oversight Evidence (HOE) export generates this package automatically.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: What Meaningful Oversight Means */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Eye className="w-6 h-6 text-emerald-500" />
                            What "Meaningful" Oversight Actually Means
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The word "meaningful" in Article 14 is doing a lot of legal work. Regulators are not satisfied by a checkbox. They want to see that a human <em>could have actually intervened</em> — not just that a log existed somewhere. This distinction is critical when designing your oversight architecture.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Does NOT Satisfy Article 14</p>
                                <ul className="space-y-3">
                                    {[
                                        "A dashboard no one monitors in real time",
                                        "Post-hoc logs reviewed days later",
                                        "A kill switch with 5-minute propagation delay",
                                        "Approval queues with no SLA or escalation",
                                        "Oversight documentation written retrospectively",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-neutral-300 text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">DOES Satisfy Article 14</p>
                                <ul className="space-y-3">
                                    {[
                                        "Real-time event feed with alert thresholds",
                                        "Approval queue with defined response SLA",
                                        "Instant kill switch ({"<"}100ms propagation)",
                                        "Structured HOE export for regulators",
                                        "Documented process for oversight operation",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-neutral-300 text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The key test is temporal: could a human have intervened <em>before the harm occurred</em>? If the answer requires reading logs after the fact, your oversight architecture fails the Article 14 standard. The approval queue model — where the agent pauses and waits for human authorization on designated high-risk actions — is the gold standard because it creates a mandatory human checkpoint at the moment of maximum leverage.
                        </p>
                    </section>

                    {/* Section 5: SupraWall's Implementation */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Shield className="w-6 h-6 text-emerald-500" />
                            SupraWall's Article 14 Implementation
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            SupraWall is designed around Article 14. Every feature in the platform maps directly to one or more of its requirements. Here is how the architecture satisfies each obligation.
                        </p>
                        <div className="space-y-4">
                            {[
                                {
                                    article: "Interrupt / Halt",
                                    control: "Agent Status Controls",
                                    detail: "Each agent has an operational status: ACTIVE, SUSPENDED, or REVOKED. Transitioning to SUSPENDED causes the policy engine to return DENY for all tool calls within milliseconds. Revocation is permanent. Both are available via dashboard and API.",
                                },
                                {
                                    article: "Monitoring",
                                    control: "Real-Time Audit Feed",
                                    detail: "Every tool call evaluation is written to the audit log in real time. The dashboard surfaces the live event stream with filters for agent, tool, decision type, and cost. Anomaly thresholds trigger notifications.",
                                },
                                {
                                    article: "Override Ability",
                                    control: "REQUIRE_APPROVAL Policy",
                                    detail: "Any tool can be assigned REQUIRE_APPROVAL. When triggered, the agent execution pauses and a review request appears in the human queue. Reviewers approve or reject with a reason. The agent receives the decision and continues or re-plans accordingly.",
                                },
                                {
                                    article: "Documentation",
                                    control: "HOE Export (Human Oversight Evidence)",
                                    detail: "The compliance dashboard generates a structured JSON export of all oversight activity: approval requests, decisions, audit samples, and agent status events. This is your Article 14 evidence package.",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">{item.article}</span>
                                        <p className="text-white font-black text-sm uppercase tracking-wider">{item.control}</p>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                            <p className="text-neutral-500 mb-4"># HOE Export sample — Article 14 evidence package</p>
                            <p className="text-neutral-300">{"{"}</p>
                            <p className="text-neutral-300 pl-4">"export_type": <span className="text-yellow-300">"human_oversight_evidence"</span>,</p>
                            <p className="text-neutral-300 pl-4">"period": <span className="text-yellow-300">"2026-02-01/2026-03-01"</span>,</p>
                            <p className="text-neutral-300 pl-4">"agent_id": <span className="text-yellow-300">"agent-prod-42"</span>,</p>
                            <p className="text-neutral-300 pl-4">"oversight_events": {"["}</p>
                            <p className="text-neutral-300 pl-8">{"{"}</p>
                            <p className="text-neutral-300 pl-12">"type": <span className="text-yellow-300">"approval_request"</span>,</p>
                            <p className="text-neutral-300 pl-12">"tool": <span className="text-yellow-300">"email.send_external"</span>,</p>
                            <p className="text-neutral-300 pl-12">"requested_at": <span className="text-yellow-300">"2026-02-14T09:12:44Z"</span>,</p>
                            <p className="text-neutral-300 pl-12">"reviewed_by": <span className="text-yellow-300">"operator@company.com"</span>,</p>
                            <p className="text-neutral-300 pl-12">"decision": <span className="text-emerald-400">"APPROVED"</span>,</p>
                            <p className="text-neutral-300 pl-12">"decided_at": <span className="text-yellow-300">"2026-02-14T09:14:01Z"</span></p>
                            <p className="text-neutral-300 pl-8">{"}"}</p>
                            <p className="text-neutral-300 pl-4">{"]"},</p>
                            <p className="text-neutral-300 pl-4">"kill_switch_tests": {"["}</p>
                            <p className="text-neutral-300 pl-8">{"{"} "tested_at": <span className="text-yellow-300">"2026-02-01T10:00:00Z"</span>, "result": <span className="text-emerald-400">"PASS"</span>, "propagation_ms": <span className="text-emerald-400">47</span> {"}"}</p>
                            <p className="text-neutral-300 pl-4">{"]"}</p>
                            <p className="text-neutral-300">{"}"}</p>
                        </div>
                    </section>

                    {/* Section 6: Building the Evidence Package */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <ClipboardList className="w-6 h-6 text-emerald-500" />
                            Building the Article 14 Evidence Package
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            When a national AI supervisory authority conducts an inspection, Article 14 compliance is demonstrated through documentation. The request will typically come in the form of a written inquiry asking for specific records. Here is what to prepare in advance so you are not scrambling when the request arrives.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    label: "Screenshots of Oversight Mechanisms",
                                    detail: "Capture the approval queue interface, the agent status controls, and the live audit feed. Document that these are operational and accessible to named personnel.",
                                },
                                {
                                    label: "Sample Approval Request Records",
                                    detail: "Export at least 10 sample approval request records showing tool name, arguments (sanitized), reviewer identity, decision, and timing. Include both approvals and rejections.",
                                },
                                {
                                    label: "Audit Log Samples",
                                    detail: "Export a representative sample of audit log entries covering a 30-day period. Show the full range of tool calls — not just blocked ones. Demonstrate completeness.",
                                },
                                {
                                    label: "Written Process Description",
                                    detail: "A short document (2–3 pages) describing who is responsible for oversight, what the escalation path is, how the kill switch is tested, and what triggers a review.",
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <p className="text-white font-black uppercase tracking-wider text-sm mb-2">{item.label}</p>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Pro Tip: The Monthly Export Habit</p>
                            <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                                Generate and archive your HOE export on the first of every month. By the time a regulator asks, you will have a complete historical record rather than needing to reconstruct it. SupraWall's scheduled export feature can automate this to your S3 bucket or email inbox.
                            </p>
                        </div>
                    </section>

                    {/* Section 7: Article 14 Checklist */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            Article 14 Compliance Checklist
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Use this checklist to assess your current Article 14 readiness. Each item corresponds to a specific requirement or documented expectation from EU AI Act guidance.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "A kill switch exists that halts all agent tool calls within 100ms",
                                "The kill switch has been tested and the test result is documented",
                                "High-stakes tools (email, payments, deletions) require human approval",
                                "An approval queue is monitored by named, responsible personnel",
                                "The audit log captures every tool call with decision and reason",
                                "The audit log is accessible to compliance officers without SQL knowledge",
                                "A structured evidence export can be generated in under 10 minutes",
                                "A written process document describes the oversight workflow and escalation path",
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all flex items-start gap-4">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-neutral-300 font-medium text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Deadline</p>
                            <p className="text-neutral-300 text-lg font-medium leading-relaxed">
                                All eight items must be in place before <strong className="text-white">August 2, 2026</strong>, when the EU AI Act high-risk provisions take full effect. National supervisory authorities can request documentation from that date forward.
                            </p>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Lock className="w-6 h-6 text-emerald-500" />
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "What does EU AI Act Article 14 require?",
                                    a: "Article 14 mandates that high-risk AI systems be designed to enable human oversight during operation. This means real humans must be able to monitor AI outputs, understand agent decisions, intervene or halt operations, and override system decisions when necessary.",
                                },
                                {
                                    q: "Does human oversight mean a human reviews every AI action?",
                                    a: "Not necessarily. Article 14 requires 'appropriate human oversight' proportionate to the risk. For most AI agents, this means automated logging with human review capability plus manual approval queues for high-stakes actions.",
                                },
                                {
                                    q: "What technical controls satisfy Article 14?",
                                    a: "The regulation requires: the ability to interrupt and halt the system, meaningful monitoring of outputs and behavior, the ability to override AI decisions, and documented evidence of oversight. SupraWall's approval queues, audit logs, and kill-switch satisfy all four.",
                                },
                                {
                                    q: "When must Article 14 compliance be demonstrated?",
                                    a: "The EU AI Act's high-risk provisions take full effect August 2, 2026. Documentation of Article 14 compliance must be available to national authorities on request.",
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
