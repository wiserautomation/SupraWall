import { Navbar } from "@/components/Navbar";
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    FileText,
    ArrowRight,
    AlertCircle,
    Users,
    Lock,
    Eye,
    ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Is Your AI Agent High-Risk? EU AI Act Guide | SupraWall",
    description:
        "Not sure if the EU AI Act applies to your AI agent? This self-assessment guide walks you through the Annex III classification criteria with real-world agent examples.",
    keywords: [
        "EU AI Act high-risk AI",
        "high-risk AI definition",
        "EU AI Act classification",
        "AI agent risk level",
        "EU AI Act assessment",
    ],
    alternates: {
        canonical:
            "https://www.supra-wall.com/learn/eu-ai-act-high-risk-ai-assessment",
    },
    openGraph: {
        title: "Is Your AI Agent High-Risk? EU AI Act Guide | SupraWall",
        description:
            "Not sure if the EU AI Act applies to your AI agent? This self-assessment guide walks you through the Annex III classification criteria with real-world agent examples.",
        url: "https://www.supra-wall.com/learn/eu-ai-act-high-risk-ai-assessment",
        siteName: "SupraWall",
        type: "article",
    },
};

export default function HighRiskAIAssessmentPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Is Your AI Agent High-Risk? EU AI Act Self-Assessment Guide",
        description:
            "Not sure if the EU AI Act applies to your AI agent? This self-assessment guide walks you through the Annex III classification criteria with real-world agent examples.",
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
            "EU AI Act high-risk AI, high-risk AI definition, EU AI Act classification, AI agent risk level",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What makes an AI system 'high-risk' under the EU AI Act?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The EU AI Act Annex III defines high-risk AI systems across 8 categories: biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration/asylum, and administration of justice. Any AI agent operating in these domains is likely high-risk.",
                },
            },
            {
                "@type": "Question",
                name: "Are all AI agents considered high-risk?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. AI agents used purely for text generation, creative tasks, or internal productivity without consequential decision-making are generally not high-risk. Agents that make decisions affecting people's lives, access to services, or operate in regulated industries are typically high-risk.",
                },
            },
            {
                "@type": "Question",
                name: "What happens if I wrongly classify my AI as not high-risk?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Incorrect classification that leads to non-compliance can result in enforcement action from national AI supervisory authorities. The penalties mirror those for non-compliance: up to €15M or 3% of global turnover.",
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
                            EU AI Act • Self-Assessment Guide
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                                Is Your Agent{" "}
                                <span className="text-emerald-500">High-Risk?</span>
                            </h1>
                            <p className="text-2xl font-black tracking-tighter uppercase italic text-neutral-500 mt-2">
                                The EU AI Act Classification Guide
                            </p>
                        </div>
                        <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
                            Getting the classification wrong has consequences in both directions. Over-classify and you build compliance overhead you do not need. Under-classify and you face fines up to €15M. This guide walks you through the Annex III criteria with real examples.
                        </p>
                    </div>

                    {/* TLDR */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400">TL;DR — Key Takeaways</p>
                        <ul className="space-y-3">
                            {[
                                "High-risk classification is defined by Annex III: 8 categories covering specific use-case domains, not technical capabilities.",
                                "The critical factors are: what decisions the agent influences, who is affected, and what the consequences are.",
                                "HR screening, medical assistance, financial lending, and legal research agents are almost always high-risk.",
                                "Internal productivity agents with no consequential decision-making are generally not high-risk.",
                                "Wrong classification can result in €15M fines or 3% of global turnover — document your classification rationale.",
                            ].map((point, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-300 text-sm font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 1: The Classification Question */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Shield className="w-6 h-6 text-emerald-500" />
                            The Classification Question
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            The EU AI Act creates a tiered compliance structure. The tier your AI agent falls into determines how many obligations apply to you. Getting this right before you build is far cheaper than retrofitting compliance after deployment.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">High-Risk Classification</p>
                                <div className="text-5xl font-black text-rose-500">8+</div>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed">Compliance obligations including risk management (Art. 9), data governance (Art. 10), technical documentation (Art. 11), logging (Art. 12), transparency (Art. 13), human oversight (Art. 14), and accuracy/robustness (Art. 15).</p>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Not High-Risk Classification</p>
                                <div className="text-5xl font-black text-emerald-500">2</div>
                                <p className="text-neutral-300 text-sm font-medium leading-relaxed">Minimal obligations: transparency requirements (disclose AI to users if applicable) and general-purpose AI rules if you are a foundation model provider. No technical documentation, audit logs, or human oversight mandates.</p>
                            </div>
                        </div>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-3">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">The Cost of Getting it Wrong</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-neutral-400 text-sm font-medium">Over-classification (unnecessary compliance)</p>
                                    <p className="text-white font-black text-sm mt-1">Engineering overhead, slower deployment, higher operational cost</p>
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm font-medium">Under-classification (missed obligations)</p>
                                    <p className="text-rose-400 font-black text-sm mt-1">Up to €15M or 3% global turnover + reputational damage</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Annex III The 8 High-Risk Categories */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <FileText className="w-6 h-6 text-emerald-500" />
                            Annex III: The 8 High-Risk Categories
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Annex III of the EU AI Act lists the specific domains where AI systems are considered high-risk. If your agent operates in any of these categories — even partially — you must apply the high-risk compliance framework. The classification is domain-based, not technology-based.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    num: "1",
                                    category: "Biometrics",
                                    examples: "Remote biometric identification, emotion recognition, biometric categorization of people into sensitive categories.",
                                    agentExample: "Identity verification agent, facial recognition screening agent",
                                },
                                {
                                    num: "2",
                                    category: "Critical Infrastructure",
                                    examples: "Safety components of water, gas, heating, electricity networks and road transport.",
                                    agentExample: "Power grid optimization agent, traffic management agent, network security automation agent",
                                },
                                {
                                    num: "3",
                                    category: "Education",
                                    examples: "Determining access or admission to educational institutions, evaluating learning outcomes.",
                                    agentExample: "Admissions screening agent, automated grading agent, student performance assessment agent",
                                },
                                {
                                    num: "4",
                                    category: "Employment",
                                    examples: "Recruitment, CV screening, promotion decisions, monitoring employee performance.",
                                    agentExample: "HR screening agent, interview scheduling agent, performance review agent, workforce planning agent",
                                },
                                {
                                    num: "5",
                                    category: "Essential Services",
                                    examples: "Credit scoring, insurance risk assessment, life insurance underwriting, emergency services dispatch.",
                                    agentExample: "Loan decisioning agent, insurance underwriting agent, credit limit adjustment agent",
                                },
                                {
                                    num: "6",
                                    category: "Law Enforcement",
                                    examples: "Risk assessment for criminal recidivism, polygraph-like systems, evidence reliability evaluation.",
                                    agentExample: "Criminal risk assessment agent, predictive policing agent, evidence analysis agent",
                                },
                                {
                                    num: "7",
                                    category: "Migration and Asylum",
                                    examples: "Lie detection in border control, risk assessment for irregular migration, visa and asylum application processing.",
                                    agentExample: "Visa processing agent, asylum claim assessment agent, border document verification agent",
                                },
                                {
                                    num: "8",
                                    category: "Administration of Justice",
                                    examples: "AI in dispute resolution, assisting courts in researching and interpreting facts, applying the law.",
                                    agentExample: "Legal research agent, case outcome prediction agent, contract dispute analysis agent",
                                },
                            ].map((item) => (
                                <div key={item.num} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black text-emerald-500/20">{item.num}</span>
                                        <p className="text-white font-black uppercase tracking-wider text-sm">{item.category}</p>
                                    </div>
                                    <p className="text-neutral-400 font-medium text-sm leading-relaxed">{item.examples}</p>
                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Agent Examples</p>
                                        <p className="text-neutral-500 text-xs font-medium">{item.agentExample}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Self-Assessment Decision Tree */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <ClipboardList className="w-6 h-6 text-emerald-500" />
                            Self-Assessment Decision Tree
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Work through this decision tree for your AI agent. Each step narrows the classification. Document your answers — you will need them for your classification rationale.
                        </p>
                        <div className="space-y-4">
                            {[
                                {
                                    step: "Step 1",
                                    question: "What domain does your agent operate in?",
                                    yes: "If it falls into any of the 8 Annex III categories → proceed to Step 2",
                                    no: "If none of the 8 categories apply → likely NOT high-risk. Document your reasoning.",
                                },
                                {
                                    step: "Step 2",
                                    question: "Does the agent make or significantly influence consequential decisions?",
                                    yes: "If yes → likely HIGH-RISK. Proceed to Step 3.",
                                    no: "If the agent is purely informational with no decision influence → may not be high-risk. Consult legal counsel.",
                                },
                                {
                                    step: "Step 3",
                                    question: "Are real people affected by the agent's outputs?",
                                    yes: "If yes, and those effects are material (access to services, employment, credit) → HIGH-RISK.",
                                    no: "If the agent only affects internal systems with no human impact → further analysis needed.",
                                },
                                {
                                    step: "Step 4",
                                    question: "What is the potential harm if the agent makes an error?",
                                    yes: "If a wrong decision could cause physical, financial, social, or legal harm to a person → HIGH-RISK.",
                                    no: "If errors are easily correctable and have no real-world consequences on individuals → assess further.",
                                },
                            ].map((item, i) => (
                                <div key={i} className="border border-white/10 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">{item.step}</span>
                                        <p className="text-white font-black text-base">{item.question}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
                                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Yes</p>
                                            <p className="text-neutral-300 text-sm font-medium">{item.yes}</p>
                                        </div>
                                        <div className="bg-neutral-800/50 border border-white/5 rounded-2xl p-4">
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">No</p>
                                            <p className="text-neutral-400 text-sm font-medium">{item.no}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 4: Real-World Examples */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Eye className="w-6 h-6 text-emerald-500" />
                            Real-World Agent Examples: High-Risk or Not?
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Classification is easier with concrete examples. Here is how 8 common agent archetypes classify under the EU AI Act, with the reasoning for each.
                        </p>
                        <div className="space-y-4">
                            {[
                                {
                                    agent: "Customer Service Agent (General)",
                                    verdict: "NOT HIGH-RISK",
                                    verdictColor: "text-emerald-400",
                                    verdictBg: "bg-emerald-500/10 border-emerald-500/20",
                                    reasoning: "Handles general inquiries, provides information, escalates issues. Does not make consequential decisions affecting people's rights or access to services. Standard transparency requirements apply.",
                                },
                                {
                                    agent: "HR Candidate Screening Agent",
                                    verdict: "HIGH-RISK",
                                    verdictColor: "text-rose-400",
                                    verdictBg: "bg-rose-500/10 border-rose-500/20",
                                    reasoning: "Annex III Category 4 (Employment). Makes or influences decisions about who gets considered for a job. Even as a filtering tool, it significantly affects employment outcomes for real people.",
                                },
                                {
                                    agent: "Medical Diagnosis Assistant",
                                    verdict: "HIGH-RISK",
                                    verdictColor: "text-rose-400",
                                    verdictBg: "bg-rose-500/10 border-rose-500/20",
                                    reasoning: "Annex III Category 5 (Essential Services) and likely subject to medical device regulation. Influences clinical decisions with direct health consequences. Full high-risk compliance plus medical device frameworks apply.",
                                },
                                {
                                    agent: "Code Generation Assistant",
                                    verdict: "NOT HIGH-RISK",
                                    verdictColor: "text-emerald-400",
                                    verdictBg: "bg-emerald-500/10 border-emerald-500/20",
                                    reasoning: "Generates code suggestions for developers. Does not make autonomous decisions affecting third parties. Unless deployed to generate code for critical infrastructure systems, this falls outside Annex III. Basic transparency requirements apply.",
                                },
                                {
                                    agent: "Financial Trading Agent",
                                    verdict: "HIGH-RISK",
                                    verdictColor: "text-rose-400",
                                    verdictBg: "bg-rose-500/10 border-rose-500/20",
                                    reasoning: "Annex III Category 5 (Essential Services). Makes autonomous financial decisions with material consequences. Also subject to MiFID II and other financial regulation. Risk management and human oversight requirements are mandatory.",
                                },
                                {
                                    agent: "Internal IT Automation Agent",
                                    verdict: "DEPENDS",
                                    verdictColor: "text-yellow-400",
                                    verdictBg: "bg-yellow-500/10 border-yellow-500/20",
                                    reasoning: "If automating routine tasks (ticket routing, password resets) — likely NOT high-risk. If managing safety-critical infrastructure (power systems, network security controls, production deployments) — potentially Category 2 (Critical Infrastructure). Conduct a specific analysis of the systems it controls.",
                                },
                                {
                                    agent: "Content Moderation Agent",
                                    verdict: "DEPENDS",
                                    verdictColor: "text-yellow-400",
                                    verdictBg: "bg-yellow-500/10 border-yellow-500/20",
                                    reasoning: "Depends on scale and context. For a small internal tool — likely not high-risk. For a platform making autonomous decisions about user accounts, content visibility, or access to services at scale — may trigger Category 5 or 8. The EU AI Act explicitly considers context of use.",
                                },
                                {
                                    agent: "Legal Research Agent",
                                    verdict: "HIGH-RISK",
                                    verdictColor: "text-rose-400",
                                    verdictBg: "bg-rose-500/10 border-rose-500/20",
                                    reasoning: "Annex III Category 8 (Administration of Justice). Assists in legal research and case analysis, directly influencing legal outcomes for real people. Even as an advisory tool, the potential for harm through missed case law or incorrect legal analysis is consequential.",
                                },
                            ].map((item, i) => (
                                <div key={i} className={`border rounded-3xl p-6 ${item.verdictBg}`}>
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <p className="text-white font-black text-base">{item.agent}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${item.verdictColor}`}>{item.verdict}</span>
                                    </div>
                                    <p className="text-neutral-400 font-medium text-sm leading-relaxed">{item.reasoning}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5: If High-Risk: Your 8 Obligations */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-emerald-500" />
                            If High-Risk: Your 8 Compliance Obligations
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            If your agent is high-risk, the following eight obligations apply. All must be in place before <strong className="text-white">August 2, 2026</strong>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { article: "Art. 9", obligation: "Risk Management System", brief: "Establish, implement, and maintain a documented risk management system throughout the lifecycle." },
                                { article: "Art. 10", obligation: "Data Governance", brief: "Training, validation, and testing data must be subject to appropriate governance and quality checks." },
                                { article: "Art. 11", obligation: "Technical Documentation", brief: "Prepare technical documentation before market placement; keep it updated for the system's lifetime." },
                                { article: "Art. 12", obligation: "Automatic Logging", brief: "Implement automatic record-keeping that logs operations with sufficient detail for post-deployment audit." },
                                { article: "Art. 13", obligation: "Transparency", brief: "Users must be informed they are interacting with a high-risk AI system with sufficient information to exercise oversight." },
                                { article: "Art. 14", obligation: "Human Oversight", brief: "Design the system to enable effective human oversight — including the ability to interrupt, monitor, and override." },
                                { article: "Art. 15", obligation: "Accuracy & Robustness", brief: "Maintain appropriate levels of accuracy and resilience to errors, including adversarial manipulation." },
                                { article: "Art. 43", obligation: "Conformity Assessment", brief: "Undergo conformity assessment before deployment. For some categories, this requires a notified body." },
                            ].map((item) => (
                                <div key={item.article} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">{item.article}</span>
                                        <p className="text-white font-black text-sm uppercase tracking-wider">{item.obligation}</p>
                                    </div>
                                    <p className="text-neutral-400 font-medium text-sm leading-relaxed">{item.brief}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 6: If Not High-Risk */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            If Not High-Risk: Still Recommended Controls
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Even agents that do not fall under high-risk classification benefit from runtime governance. The absence of a legal mandate does not mean the risks do not exist — it means the consequences of getting it wrong are commercial rather than regulatory. Three baseline controls are recommended for all production agents.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    control: "Tool Allowlist",
                                    desc: "Define what tools your agent is allowed to call. Block everything else. This prevents scope creep and accidental data access regardless of risk tier.",
                                    icon: Lock,
                                },
                                {
                                    control: "Audit Logging",
                                    desc: "Log every tool call with decision and timestamp. Even if not legally required, this is essential for debugging, billing reconciliation, and incident response.",
                                    icon: Eye,
                                },
                                {
                                    control: "Budget Cap",
                                    desc: "Set a hard cost ceiling per session and per day. Infinite loops are not a high-risk-exclusive problem — they happen to all agents and cost real money.",
                                    icon: AlertCircle,
                                },
                            ].map((item, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all space-y-3">
                                    <item.icon className="w-5 h-5 text-emerald-500" />
                                    <p className="text-white font-black uppercase tracking-wider text-sm">{item.control}</p>
                                    <p className="text-neutral-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 7: Documentation */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <FileText className="w-6 h-6 text-emerald-500" />
                            Documentation: Prove Your Classification
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Whether you classify your agent as high-risk or not, you need to document the reasoning. A national AI supervisory authority can question your classification. Without documentation, you cannot defend a "not high-risk" determination, and the default assumption will likely not be in your favor.
                        </p>
                        <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Classification Rationale Document Template</p>
                            <div className="space-y-4">
                                {[
                                    { field: "Agent Name & Version", detail: "The specific system being classified, including version number and deployment date." },
                                    { field: "Use Case Description", detail: "What the agent does, what tools it has access to, and what decisions it influences." },
                                    { field: "Annex III Analysis", detail: "For each of the 8 Annex III categories: does the agent operate in this domain? Why or why not?" },
                                    { field: "Affected Parties", detail: "Who interacts with or is affected by the agent's outputs? Are there third parties who are not the users?" },
                                    { field: "Classification Decision", detail: "High-risk or not high-risk, with explicit reference to the Annex III category or the reason for exclusion." },
                                    { field: "Review Date", detail: "Classifications should be reviewed annually or when the agent's functionality changes materially." },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
                                        <p className="text-emerald-400 font-black text-sm w-48 flex-shrink-0">{item.field}</p>
                                        <p className="text-neutral-400 font-medium text-sm">{item.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">When to Re-Classify</p>
                            <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                                A classification is not permanent. If your agent gains new tools, is deployed in a new context, or begins influencing decisions in a new domain, re-run the classification analysis. An agent that starts life as a text summarizer and evolves into an HR decision support tool crosses the high-risk threshold the moment it starts influencing employment decisions.
                            </p>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black italic text-white flex items-center gap-3">
                            <Users className="w-6 h-6 text-emerald-500" />
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "What makes an AI system 'high-risk' under the EU AI Act?",
                                    a: "The EU AI Act Annex III defines high-risk AI systems across 8 categories: biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration/asylum, and administration of justice. Any AI agent operating in these domains is likely high-risk.",
                                },
                                {
                                    q: "Are all AI agents considered high-risk?",
                                    a: "No. AI agents used purely for text generation, creative tasks, or internal productivity without consequential decision-making are generally not high-risk. Agents that make decisions affecting people's lives, access to services, or operate in regulated industries are typically high-risk.",
                                },
                                {
                                    q: "What happens if I wrongly classify my AI as not high-risk?",
                                    a: "Incorrect classification that leads to non-compliance can result in enforcement action from national AI supervisory authorities. The penalties mirror those for non-compliance: up to €15M or 3% of global turnover.",
                                },
                            ].map((faq, i) => (
                                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                                    <p className="text-white font-black text-lg mb-3">{faq.q}</p>
                                    <p className="text-neutral-400 font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-6">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Start Compliant.</h2>
                        <p className="text-emerald-100 text-lg font-medium">Generate EU AI Act evidence exports automatically.</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href="/login" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 inline-flex items-center gap-2">
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
