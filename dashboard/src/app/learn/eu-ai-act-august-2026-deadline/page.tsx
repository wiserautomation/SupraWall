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
    Clock,
    Target,
    TrendingDown,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "EU AI Act August 2026 Deadline: What AI Agent Developers Must Do Now | SupraWall",
    description:
        "The EU AI Act Article 6 deadline hits August 2, 2026. AI agents classified as high-risk must implement risk management, audit logging, and human oversight. Here's your compliance roadmap.",
    keywords: [
        "EU AI Act August 2026",
        "EU AI Act deadline",
        "EU AI Act compliance deadline",
        "AI agent compliance 2026",
        "high-risk AI system requirements",
        "EU AI Act Article 6",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/learn/eu-ai-act-august-2026-deadline",
    },
    openGraph: {
        title: "EU AI Act August 2026 Deadline: What AI Agent Developers Must Do Now | SupraWall",
        description:
            "The EU AI Act Article 6 deadline hits August 2, 2026. AI agents classified as high-risk must implement risk management, audit logging, and human oversight. Here's your compliance roadmap.",
        url: "https://www.supra-wall.com/learn/eu-ai-act-august-2026-deadline",
        siteName: "SupraWall",
        type: "article",
    },
    twitter: {
        card: "summary_large_image",
        title: "EU AI Act August 2026 Deadline: What AI Agent Developers Must Do Now",
        description:
            "The EU AI Act Article 6 deadline hits August 2, 2026. AI agents classified as high-risk must implement risk management, audit logging, and human oversight.",
    },
    robots: "index, follow",
};

export default function EUAIActAugust2026DeadlinePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "EU AI Act August 2026 Deadline: What AI Agent Developers Must Do Now",
        description:
            "The EU AI Act Article 6 deadline hits August 2, 2026. AI agents classified as high-risk must implement risk management, audit logging, and human oversight. Here's your compliance roadmap.",
        author: {
            "@type": "Organization",
            name: "SupraWall",
        },
        publisher: {
            "@type": "Organization",
            name: "SupraWall",
            url: "https://www.supra-wall.com",
        },
        datePublished: "2026-03-01",
        dateModified: "2026-03-20",
        genre: "Compliance Guide",
        keywords:
            "EU AI Act, August 2026 deadline, AI agents compliance, Article 6, Article 9, Article 12, Article 14, high-risk AI",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "When exactly does the EU AI Act high-risk deadline take effect?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The EU AI Act's Articles 6 through 49 (covering high-risk AI systems) become fully enforceable on August 2, 2026. From that date, any AI agent classified as high-risk that does not demonstrate compliance with Article 9 (risk management), Article 12 (audit logging), and Article 14 (human oversight) is in violation and subject to fines.",
                },
            },
            {
                "@type": "Question",
                name: "Which AI agents are classified as high-risk under the EU AI Act?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Autonomous AI agents are classified as high-risk if they make decisions affecting employment (hiring, promotion), finance (creditworthiness, insurance), essential services (housing, utilities), law enforcement, critical infrastructure, education, or if they process biometric data for identification. Financial advisor bots, HR screening agents, legal research tools, and healthcare triage systems are typical examples.",
                },
            },
            {
                "@type": "Question",
                name: "What are the maximum fines for EU AI Act non-compliance?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Fines for non-compliance with high-risk AI requirements can reach up to €35 million or 7% of global annual revenue, whichever is higher. There is no grace period once August 2, 2026 enforcement begins.",
                },
            },
            {
                "@type": "Question",
                name: "Do companies outside the EU need to comply with the EU AI Act?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The EU AI Act applies to any organization that deploys or operates a high-risk AI agent that serves EU users or processes data of EU residents, regardless of where the company is incorporated. This creates extraterritorial compliance obligations for global AI agent deployments.",
                },
            },
            {
                "@type": "Question",
                name: "How long does EU AI Act compliance implementation take?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most organizations can implement core compliance requirements (risk management policies, audit logging, human-in-the-loop controls) within 4-6 months. The recommended timeline from March to August 2026 includes: auditing existing agents (1 month), implementing policies (1 month), deploying logging (1 month), building approval workflows (1 month), and testing/certification (2 months).",
                },
            },
            {
                "@type": "Question",
                name: "Can I use SupraWall to achieve EU AI Act compliance?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. SupraWall implements Articles 9, 12, and 14 directly: risk management policies and block-rate dashboards satisfy Article 9; automatic per-tool-call audit logging satisfies Article 12; human-in-the-loop approval queues and kill-switch APIs satisfy Article 14. Compliance evidence (audit logs, approval records, risk dashboards) is exportable on demand for regulatory submission.",
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
                            Deadline Countdown • EU AI Act
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            August 2, 2026:<br />
                            <span className="text-emerald-500">Compliance is Law.</span>
                        </h1>

                        <p className="text-xl text-neutral-300 leading-snug font-medium border-l-8 border-emerald-600 pl-8 py-4 italic">
                            The EU AI Act's most critical deadline for AI agent developers is August 2, 2026. On this date, Articles 6 through 49 — covering high-risk AI systems — become enforceable. Any AI agent that makes autonomous decisions affecting health, safety, employment, finance, or law enforcement must demonstrate full compliance with risk management (Article 9), audit logging (Article 12), and human oversight (Article 14) requirements, or face fines up to €35 million or 7% of global revenue.
                        </p>
                    </div>

                    {/* TLDR Box */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">TL;DR — What You Must Know</p>
                        <ul className="space-y-3">
                            {[
                                "August 2, 2026: High-risk AI enforcement begins. No extensions. No grace period. Fines from day one.",
                                "Articles 9, 12, 14 are mandatory: risk management policies, per-tool-call audit logs, and human approval queues.",
                                "5-month window (March–August): audit risk levels, implement policies, deploy logging, build approval workflows, test.",
                                "SupraWall covers all three articles automatically — policy engine (Article 9), audit logs (Article 12), approval queues (Article 14).",
                                "Fines up to €35 million or 7% of global revenue. Prepare now or face catastrophic penalties.",
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-300 font-medium leading-snug">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 1: What Happens on August 2, 2026 */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Clock className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            What Happens on August 2, 2026
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            August 2, 2026 marks the moment when the EU AI Act transitions from a policy framework into enforceable law. Articles 6 through 49 — which define what constitutes a high-risk AI system and what obligations providers must meet — become effective. This is not advisory. Regulators have confirmed there is no extension mechanism.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="w-5 h-5 text-emerald-500" />
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">April 2024 – August 2026</p>
                                </div>
                                <p className="text-white font-black text-sm mb-3">Transition Period</p>
                                <p className="text-neutral-400 font-medium leading-relaxed text-sm">
                                    EU member states and industry had 28 months to prepare. Regulatory guidance, technical standards, and implementation frameworks were published during this window.
                                </p>
                            </div>
                            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/30 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">August 2, 2026 onwards</p>
                                </div>
                                <p className="text-white font-black text-sm mb-3">Enforcement</p>
                                <p className="text-neutral-400 font-medium leading-relaxed text-sm">
                                    High-risk AI systems must be compliant from day one. Non-compliant agents are in violation. Regulators will conduct audits. Fines up to €35M apply immediately.
                                </p>
                            </div>
                        </div>
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Critical: Articles 6–49 Scope</p>
                            <p className="text-neutral-300 font-medium leading-relaxed">
                                Articles 6–49 define <strong className="text-white">high-risk AI systems</strong> (Article 6), <strong className="text-white">specific use case restrictions</strong> (Articles 5–6), and the <strong className="text-white">core technical obligations</strong> for compliance (Articles 9–15). For autonomous AI agents, this means:
                            </p>
                            <ul className="space-y-2 mt-4">
                                {[
                                    "Article 6: Definition of high-risk AI (includes decision-support for employment, finance, critical infrastructure, and more)",
                                    "Article 9: Risk management system (identify, evaluate, and mitigate risks throughout agent lifecycle)",
                                    "Article 12: Record-keeping and logging (automatic logs for post-hoc investigation)",
                                    "Article 14: Human oversight (meaningful human control over high-stakes agent actions)",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-4 h-4 border border-rose-500/40 rounded flex-shrink-0 mt-0.5" />
                                        <p className="text-neutral-400 text-sm font-medium">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 2: Is Your AI Agent High-Risk? */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Target className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Is Your AI Agent High-Risk?
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 6 and Annex III of the EU AI Act define which AI systems qualify as high-risk. If your agent operates in any of these domains, compliance with Articles 9, 12, and 14 is mandatory by August 2, 2026.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {highRiskAgentTypes.map((cat, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-black uppercase tracking-wider text-sm">{cat.title}</p>
                                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded-full">High-Risk</span>
                                    </div>
                                    <p className="text-neutral-400 font-medium leading-relaxed text-sm">{cat.desc}</p>
                                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Example: {cat.example}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: The Three Compliance Pillars */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Shield className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            The Three Compliance Pillars
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Three articles form the technical backbone of EU AI Act compliance for AI agents. Each has specific implementation requirements. All three must be in place by August 2, 2026.
                        </p>
                        <div className="space-y-4">
                            {compliancePillars.map((pillar, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0">
                                            <span className="text-3xl font-black text-emerald-500 italic">{pillar.number}</span>
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <p className="text-white font-black uppercase tracking-wider">{pillar.title}</p>
                                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full">
                                                    Mandatory Aug 2026
                                                </span>
                                            </div>
                                            <p className="text-neutral-400 font-medium leading-relaxed">{pillar.desc}</p>
                                            <div className="bg-black/40 rounded-2xl px-4 py-3 space-y-2">
                                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">What You Must Implement</p>
                                                <ul className="space-y-1">
                                                    {pillar.requirements.map((req, j) => (
                                                        <li key={j} className="text-emerald-400 font-medium text-sm flex items-start gap-2">
                                                            <span className="mt-1">→</span>
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 4: 5-Month Compliance Roadmap */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Zap className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            5-Month Compliance Roadmap: March–August 2026
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Here is a month-by-month action plan to achieve full compliance by the August 2, 2026 deadline. Organizations that start in March 2026 have exactly 5 months to complete all requirements.
                        </p>
                        <div className="space-y-4">
                            {roadmapMonths.map((month, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-20">
                                            <span className="text-2xl font-black text-emerald-500 italic block">{month.month}</span>
                                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">{month.duration}</span>
                                        </div>
                                        <div className="space-y-3 flex-1">
                                            <p className="text-white font-black uppercase tracking-wider">{month.title}</p>
                                            <p className="text-neutral-400 font-medium leading-relaxed">{month.desc}</p>
                                            <div className="bg-black/40 rounded-xl px-3 py-2">
                                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Deliverables:</p>
                                                <ul className="space-y-1 mt-2">
                                                    {month.deliverables.map((del, j) => (
                                                        <li key={j} className="text-neutral-400 text-sm font-medium flex items-start gap-2">
                                                            <span className="text-emerald-500 mt-0.5">✓</span>
                                                            <span>{del}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5: SupraWall EU AI Act Compliance Stack */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Shield className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            SupraWall's EU AI Act Compliance Stack
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            SupraWall directly implements Articles 9, 12, and 14 through its policy engine, audit logging system, and human-in-the-loop controls. Here is how each maps to regulatory requirements.
                        </p>

                        {/* Article 9 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Article 9 Implementation</p>
                            </div>
                            <p className="text-white font-black text-lg">Risk Management System</p>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                SupraWall's policy engine lets you define and enforce risk mitigation policies. Block high-risk actions, require human approval for borderline cases, and allow safe operations automatically. Risk metrics are tracked in real-time.
                            </p>
                            <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm overflow-x-auto space-y-3">
                                <p className="text-neutral-500">
                                    # Article 9: Risk Management via SupraWall Policy
                                </p>
                                <p className="text-neutral-300">
                                    from suprawall import secure_agent, Policy
                                </p>
                                <p className="text-neutral-300" />
                                <p className="text-neutral-300">
                                    # Define risk mitigation policies
                                </p>
                                <p className="text-neutral-300">
                                    policy = Policy(
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    rules=[
                                </p>
                                <p className="text-neutral-300 pl-8">
                                    {`{`}<span className="text-yellow-400">"action": "DENY"</span>,
                                    <span className="text-yellow-400">"tool": "execute_trade"</span>, <span className="text-neutral-500"># Article 9: Identify high-risk actions</span>
                                </p>
                                <p className="text-neutral-300 pl-12">
                                    <span className="text-yellow-400">"condition": "amount &gt; 10000"</span>{`}`},
                                </p>
                                <p className="text-neutral-300 pl-8">
                                    {`{`}<span className="text-yellow-400">"action": "REQUIRE_APPROVAL"</span>,
                                    <span className="text-yellow-400">"tool": "modify_patient_record"</span>, <span className="text-neutral-500"># Article 9: Mitigate with human oversight</span>
                                </p>
                                <p className="text-neutral-300 pl-12">
                                    <span className="text-yellow-400">"reason": "healthcare_decision"</span>{`}`},
                                </p>
                                <p className="text-neutral-300 pl-8">
                                    {`{`}<span className="text-yellow-400">"action": "ALLOW"</span>,
                                    <span className="text-yellow-400">"tool": "read_public_data"</span>, <span className="text-neutral-500"># Article 9: Safe operations unrestricted</span>
                                </p>
                                <p className="text-neutral-300 pl-12">
                                    <span className="text-yellow-400">"reason": "low_risk"</span>{`}`},
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    ]
                                </p>
                                <p className="text-neutral-300">
                                    )
                                </p>
                                <p className="text-neutral-300" />
                                <p className="text-neutral-300">
                                    agent = secure_agent(my_agent, api_key="ag_xxx", policy=policy)
                                </p>
                                <p className="text-neutral-300">
                                    result = agent.run(user_query)
                                </p>
                                <p className="text-neutral-300" />
                                <p className="text-neutral-500">
                                    # Article 9: SupraWall block-rate dashboard shows ongoing risk metrics
                                </p>
                            </div>
                            <Link href="/learn/eu-ai-act-article-9-risk-management" className="text-emerald-400 hover:text-emerald-300 font-black text-sm underline underline-offset-4 inline-flex items-center gap-2">
                                Learn more about Article 9 <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Article 12 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="w-5 h-5 text-emerald-500" />
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Article 12 Implementation</p>
                            </div>
                            <p className="text-white font-black text-lg">Record-Keeping & Audit Logging</p>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                SupraWall automatically generates per-tool-call audit logs that enable regulatory auditors to reconstruct every decision your agent made. Logs include all required fields: timestamp, tool name, arguments (with PII scrubbed), policy decision, cost, agent ID, session ID, and human approval (if applicable).
                            </p>
                            <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm overflow-x-auto space-y-2">
                                <p className="text-neutral-500">
                                    # Article 12: SupraWall Audit Log (auto-generated)
                                </p>
                                <p className="text-neutral-300">
                                    {`{`}
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"timestamp"</span>:
                                    <span className="text-emerald-400">"2026-08-01T14:23:01.847Z"</span>,
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"agent_id"</span>:
                                    <span className="text-emerald-400">"prod-agent-finance-01"</span>,
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"tool"</span>:
                                    <span className="text-emerald-400">"transfer_funds"</span>,
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"args"</span>: {`{`}<span className="text-yellow-400">"amount"</span>: <span className="text-emerald-400">50000</span>, <span className="text-yellow-400">"currency"</span>: <span className="text-emerald-400">"EUR"</span>{`}`},
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"decision"</span>:
                                    <span className="text-emerald-400">"REQUIRE_APPROVAL"</span>,
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"policy_matched"</span>:
                                    <span className="text-emerald-400">"high_value_transfer"</span>,
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"human_approved_by"</span>:
                                    <span className="text-emerald-400">"finance-officer@corp.eu"</span>,
                                </p>
                                <p className="text-neutral-300 pl-4">
                                    <span className="text-yellow-400">"human_approved_at"</span>:
                                    <span className="text-emerald-400">"2026-08-01T14:24:15Z"</span>
                                </p>
                                <p className="text-neutral-300">
                                    {`}`}
                                </p>
                                <p className="text-neutral-500 mt-2">
                                    # Exportable as JSON or CSV for regulatory audits
                                </p>
                            </div>
                            <Link href="/learn/ai-agent-audit-trail-logging" className="text-emerald-400 hover:text-emerald-300 font-black text-sm underline underline-offset-4 inline-flex items-center gap-2">
                                Learn more about audit logging <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Article 14 */}
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="w-5 h-5 text-emerald-500" />
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Article 14 Implementation</p>
                            </div>
                            <p className="text-white font-black text-lg">Human Oversight & Control</p>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                Article 14 requires meaningful human control over high-risk agent decisions. SupraWall implements this through approval queues (pause and route high-stakes actions to humans), kill-switch APIs (halt all operations instantly), and override capability (correct or reverse any agent decision).
                            </p>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3 space-y-3">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Article 14 Controls</p>
                                <div className="space-y-2">
                                    {[
                                        "Approval Queue: High-risk actions pause pending human review and explicit approval",
                                        "Kill Switch: Authorized personnel can halt all agent operations via dashboard or API",
                                        "Audit Trail: Every action is logged with human reviewer identity and timestamp",
                                        "Override: Humans can reject, modify, or reverse any agent decision post-hoc",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5 font-black">✓</span>
                                            <p className="text-neutral-300 text-sm font-medium">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Link href="/learn/human-in-the-loop-ai-agents" className="text-emerald-400 hover:text-emerald-300 font-black text-sm underline underline-offset-4 inline-flex items-center gap-2">
                                Learn more about human-in-the-loop <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </section>

                    {/* Section 6: Penalties for Non-Compliance */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Scale className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Penalties for Non-Compliance
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The EU AI Act imposes significant financial penalties for non-compliance. Regulators have stated they will actively audit high-risk AI deployments starting August 2, 2026. Non-compliance is expensive and damaging to reputation.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Tier 1: High-Risk Non-Compliance</p>
                                <p className="text-white font-black text-3xl">€35M or 7%</p>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                                    Maximum fine for non-compliance with Articles 9, 12, or 14 (risk management, logging, human oversight). Whichever is higher: €35 million or 7% of global annual revenue.
                                </p>
                                <p className="text-[10px] text-rose-400 uppercase tracking-widest font-black mt-3">Examples of violations triggering Tier 1:</p>
                                <ul className="space-y-1 mt-2">
                                    {[
                                        "No risk management policy in place",
                                        "No audit logs or incomplete logging",
                                        "No human approval mechanism for high-stakes actions",
                                    ].map((ex, i) => (
                                        <li key={i} className="text-neutral-400 text-xs font-medium flex items-start gap-2">
                                            <span>•</span>
                                            <span>{ex}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Enforcement Timeline</p>
                                <p className="text-white font-black text-lg">Audits Begin Immediately</p>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                                    The European AI Office and member state authorities have confirmed they will begin auditing high-risk AI deployments starting August 3, 2026. Expect regulatory letters to organizations operating AI agents in high-risk domains.
                                </p>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mt-4">Regulatory actions:</p>
                                <ul className="space-y-1 mt-2">
                                    {[
                                        "Audit notices (August 2026+)",
                                        "Compliance demands (30–90 day deadlines)",
                                        "Fines (no grace period)",
                                        "Mandatory system takedown in extreme cases",
                                    ].map((action, i) => (
                                        <li key={i} className="text-neutral-400 text-xs font-medium flex items-start gap-2">
                                            <span>→</span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 7: FAQ */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                            <Lock className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "When exactly does the EU AI Act high-risk deadline take effect?",
                                    a: "The EU AI Act's Articles 6 through 49 (covering high-risk AI systems) become fully enforceable on August 2, 2026. From that date, any AI agent classified as high-risk that does not demonstrate compliance with Article 9 (risk management), Article 12 (audit logging), and Article 14 (human oversight) is in violation and subject to fines.",
                                },
                                {
                                    q: "Which AI agents are classified as high-risk under the EU AI Act?",
                                    a: "Autonomous AI agents are classified as high-risk if they make decisions affecting employment (hiring, promotion), finance (creditworthiness, insurance), essential services (housing, utilities), law enforcement, critical infrastructure, education, or if they process biometric data for identification. Financial advisor bots, HR screening agents, legal research tools, and healthcare triage systems are typical examples.",
                                },
                                {
                                    q: "What are the maximum fines for EU AI Act non-compliance?",
                                    a: "Fines for non-compliance with high-risk AI requirements can reach up to €35 million or 7% of global annual revenue, whichever is higher. There is no grace period once August 2, 2026 enforcement begins.",
                                },
                                {
                                    q: "Do companies outside the EU need to comply with the EU AI Act?",
                                    a: "Yes. The EU AI Act applies to any organization that deploys or operates a high-risk AI agent that serves EU users or processes data of EU residents, regardless of where the company is incorporated. This creates extraterritorial compliance obligations for global AI agent deployments.",
                                },
                                {
                                    q: "How long does EU AI Act compliance implementation take?",
                                    a: "Most organizations can implement core compliance requirements (risk management policies, audit logging, human-in-the-loop controls) within 4–6 months. The recommended timeline from March to August 2026 includes: auditing existing agents (1 month), implementing policies (1 month), deploying logging (1 month), building approval workflows (1 month), and testing/certification (2 months).",
                                },
                                {
                                    q: "Can I use SupraWall to achieve EU AI Act compliance?",
                                    a: "Yes. SupraWall implements Articles 9, 12, and 14 directly: risk management policies and block-rate dashboards satisfy Article 9; automatic per-tool-call audit logging satisfies Article 12; human-in-the-loop approval queues and kill-switch APIs satisfy Article 14. Compliance evidence (audit logs, approval records, risk dashboards) is exportable on demand for regulatory submission.",
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
                            <FileText className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                            Related Articles & Resources
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "EU AI Act Compliance for AI Agents",
                                    desc: "Comprehensive overview of all EU AI Act articles that apply to autonomous AI agents.",
                                    href: "/learn/eu-ai-act-compliance-ai-agents",
                                },
                                {
                                    title: "Article 14: Human Oversight",
                                    desc: "Deep dive into what meaningful human control means in practice for AI agent deployments.",
                                    href: "/learn/eu-ai-act-article-14-human-oversight",
                                },
                                {
                                    title: "Article 9: Risk Management",
                                    desc: "How to design and implement an ongoing risk management system for high-risk AI agents.",
                                    href: "/learn/eu-ai-act-article-9-risk-management",
                                },
                                {
                                    title: "High-Risk AI Assessment",
                                    desc: "Detailed framework for classifying whether your AI agent qualifies as high-risk under Annex III.",
                                    href: "/learn/eu-ai-act-high-risk-ai-assessment",
                                },
                                {
                                    title: "AI Agent Audit Trail Logging",
                                    desc: "Complete guide to implementing Article 12-compliant logging for AI agents.",
                                    href: "/learn/ai-agent-audit-trail-logging",
                                },
                                {
                                    title: "Human-in-the-Loop AI Agents",
                                    desc: "Architecture and implementation patterns for approval queues and human oversight workflows.",
                                    href: "/learn/human-in-the-loop-ai-agents",
                                },
                            ].map((article, i) => (
                                <Link
                                    key={i}
                                    href={article.href}
                                    className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all group"
                                >
                                    <p className="text-white font-black mb-2 group-hover:text-emerald-400 transition-colors">{article.title}</p>
                                    <p className="text-neutral-400 font-medium text-sm leading-relaxed mb-4">{article.desc}</p>
                                    <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                                        Read more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-8">
                        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.3em]">The deadline is 4 months away</p>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-[0.9]">
                            Don't Miss August 2.<br />Start Now.
                        </h2>
                        <p className="text-emerald-100 font-medium text-lg max-w-xl mx-auto">
                            Implement Articles 9, 12, and 14 in your AI agent stack before enforcement. SupraWall has you covered.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all"
                            >
                                Get Compliant Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/learn/eu-ai-act-compliance-ai-agents"
                                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all"
                            >
                                Back to Overview
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

const highRiskAgentTypes = [
    {
        title: "Financial Advisor Agents",
        desc: "Autonomous agents that recommend investments, assess creditworthiness, or determine loan eligibility.",
        example: "Robo-advisor recommending stock portfolio allocation",
    },
    {
        title: "HR Screening Agents",
        desc: "AI systems that filter job applications, score candidate suitability, or make hiring recommendations.",
        example: "Resume screening bot ranking candidates for interviews",
    },
    {
        title: "Healthcare Triage Agents",
        desc: "Autonomous agents that prioritize patient cases, recommend treatments, or allocate medical resources.",
        example: "ER intake agent determining treatment priority",
    },
    {
        title: "Legal Research Agents",
        desc: "AI systems that interpret regulations, analyze case law, or recommend legal strategies in high-stakes matters.",
        example: "Agent drafting compliance recommendations for sanctions",
    },
    {
        title: "Insurance Assessment Agents",
        desc: "Autonomous systems that underwrite policies, set premiums, or deny claims.",
        example: "Agent calculating insurance eligibility and premium pricing",
    },
    {
        title: "Critical Infrastructure Agents",
        desc: "AI systems controlling or influencing energy, water, transport, or digital infrastructure safety components.",
        example: "Power grid load-balancing agent adjusting electrical distribution",
    },
];

const compliancePillars = [
    {
        number: "Art. 9",
        title: "Risk Management System",
        desc: "Requires an ongoing process to identify foreseeable risks, evaluate their severity and impact, and implement mitigation measures. For AI agents, this means defining policies that DENY high-risk actions, REQUIRE_APPROVAL for borderline cases, and ALLOW safe operations. You must track metrics (block rate, approval rate, policy violations) and demonstrate continuous improvement.",
        requirements: [
            "Risk identification matrix (map agent actions to potential harms)",
            "Policy definitions (DENY/REQUIRE_APPROVAL/ALLOW rules for each tool)",
            "Block-rate dashboards (real-time metrics on policy effectiveness)",
            "Monthly risk reviews (adjust policies based on observed violations)",
        ],
    },
    {
        number: "Art. 12",
        title: "Record-Keeping & Audit Logging",
        desc: "Mandates automatic logging that enables post-hoc investigation of system behavior. For AI agents, logging must occur at the tool-call level: every time an agent invokes a tool, the system must record the timestamp, tool name, arguments, policy decision, cost, agent ID, session ID, and (if applicable) which human approved it. Logs must be retained for at least 6 months.",
        requirements: [
            "Per-tool-call logging infrastructure (timestamp, tool, args, decision, cost, agent_id, session_id)",
            "PII scrubbing (redact sensitive personal data from logs)",
            "Log retention policy (minimum 6 months, auditable, immutable)",
            "Export capability (JSON/CSV formats for regulatory submission)",
        ],
    },
    {
        number: "Art. 14",
        title: "Human Oversight & Control",
        desc: "Requires that high-risk AI systems enable effective oversight by natural persons — humans must be able to understand what the system is doing, monitor it in real-time, and intervene to correct or override decisions. Meaningful oversight is not passive observation; it requires active control mechanisms: approval queues, kill switches, and the ability to reverse decisions.",
        requirements: [
            "Approval queues (high-stakes actions pause pending human review)",
            "Kill switch / halt capability (authorized users can stop all operations instantly)",
            "Audit trail (every action logged with human reviewer identity and timestamp)",
            "Override mechanism (humans can reject, modify, or reverse any agent decision)",
        ],
    },
];

const roadmapMonths = [
    {
        month: "March",
        duration: "Week 1–4",
        title: "Audit & Classification",
        desc: "Conduct a comprehensive audit of all deployed AI agents. Classify each as high-risk or low-risk using the Annex III criteria. Document findings in a risk classification matrix.",
        deliverables: [
            "Risk classification matrix (agent ID, domain, risk level, justification)",
            "High-risk agent inventory (names, functions, user base)",
            "Gap analysis (identify missing controls: policies, logging, approval workflows)",
        ],
    },
    {
        month: "April",
        duration: "Week 5–8",
        title: "Policy Implementation",
        desc: "Design and deploy risk management policies for each high-risk agent. Define DENY/REQUIRE_APPROVAL/ALLOW rules for all tools. SupraWall makes this straightforward via the policy engine.",
        deliverables: [
            "Policy definitions for each high-risk agent (documented)",
            "DENY/REQUIRE_APPROVAL/ALLOW rules deployed to SupraWall",
            "Initial policy testing (ensure rules fire correctly, no false positives)",
        ],
    },
    {
        month: "May",
        duration: "Week 9–12",
        title: "Logging Infrastructure",
        desc: "Deploy audit logging for all high-risk agents. Ensure every tool call is logged with required fields: timestamp, tool name, arguments (PII-scrubbed), policy decision, cost, agent ID, session ID. Set up log retention and immutability.",
        deliverables: [
            "Logging infrastructure live on all high-risk agents",
            "Sample audit logs verified for completeness and PII scrubbing",
            "Log retention policy documented (6+ months)",
            "Export pipeline tested (JSON/CSV generation)",
        ],
    },
    {
        month: "June",
        duration: "Week 13–16",
        title: "Human-in-the-Loop Workflows",
        desc: "Build and deploy human approval queues for high-stakes agent actions. Set up dashboard for human reviewers to approve/reject actions. Implement kill-switch APIs for instant halt capability. Document override procedures.",
        deliverables: [
            "Approval queue live for REQUIRE_APPROVAL actions",
            "Human reviewer dashboard deployed and tested",
            "Kill-switch API functional and documented",
            "Override procedures documented and validated",
        ],
    },
    {
        month: "July",
        duration: "Week 17–20",
        title: "Testing & Certification",
        desc: "Conduct thorough compliance testing. Verify all three pillars (Article 9, 12, 14) are working. Generate compliance evidence packages: audit log exports, approval records, risk dashboards. Prepare documentation for regulatory submission.",
        deliverables: [
            "Compliance test report (Article 9, 12, 14 validation)",
            "Audit log sample export (verified against Article 12 requirements)",
            "Human oversight evidence export (approval records with timestamps)",
            "Risk management metrics dashboard (block rate, approval rate, violations)",
            "Compliance documentation (policy matrix, technical architecture, training records)",
        ],
    },
    {
        month: "August 1–2",
        duration: "Days before deadline",
        title: "Final Verification & Readiness",
        desc: "Final checks: verify all systems are live, policies are correct, logging is continuous, approval workflows are operational. Ensure compliance evidence is exportable. Brief leadership on readiness. Prepare for regulatory audit.",
        deliverables: [
            "Final system health check (all components operational)",
            "Compliance evidence packaged and ready for submission",
            "Regulatory audit readiness checklist completed",
            "Leadership briefing on compliance posture",
        ],
    },
];
