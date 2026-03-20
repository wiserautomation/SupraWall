import { Navbar } from "@/components/Navbar";
import { CheckCircle2, XCircle, Shield, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agent-to-Agent Commerce Meets the EU AI Act: What Palo Alto's Threat Report Missed | Supra-wall",
    description: "Palo Alto's Unit 42 flagged agent-to-agent commerce as the next major risk frontier. Here's what their threat report missed: the EU AI Act already has the answer.",
    keywords: ["EU AI Act agent compliance", "agent-to-agent security", "Article 14 human oversight", "AI agent policy enforcement", "Unit 42 threat report"],
    openGraph: {
        title: "Agent-to-Agent Commerce Meets the EU AI Act",
        description: "Palo Alto's Unit 42 flagged agent-to-agent commerce as the next major risk frontier. Here's what their threat report missed.",
    },    alternates: {
        canonical: 'https://www.supra-wall.com/blog/agent-to-agent-commerce-eu-ai-act',
    },

};

export default function AgentCommerceBlogPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Agent-to-Agent Commerce Meets the EU AI Act: What Palo Alto's Threat Report Missed",
        description:
            "Palo Alto Networks' Unit 42 called agent-to-agent commerce the next major risk frontier. The EU AI Act already has the answer — and it goes further than identity security.",
        author: { "@type": "Person", name: "Alejandro", worksFor: { "@type": "Organization", name: "Supra-wall" } },
        datePublished: "2026-03-13",
        genre: "AI Compliance",
        keywords: "EU AI Act agent compliance, agent-to-agent security, Article 14 human oversight",
        publisher: { "@type": "Organization", name: "Supra-wall" },
        mainEntityOfPage: "https://supra-wall.com/blog/agent-to-agent-commerce-eu-ai-act",
    };

    const comparisonRows = [
        { concern: "Who made the request", identity: true, suprawall: true },
        { concern: "Was the request authenticated", identity: true, suprawall: true },
        { concern: "Was there human oversight opportunity", identity: false, suprawall: true, note: "Article 14" },
        { concern: "Was risk assessed before deployment", identity: false, suprawall: true, note: "Article 9" },
        { concern: "Is the action traceable to an audit log", identity: "partial", suprawall: true, note: "Article 13" },
        { concern: "Can I prove compliance to a regulator", identity: false, suprawall: true },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <article className="max-w-4xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                                EU AI Act · Compliance
                            </div>
                            <span className="text-xs text-neutral-600">March 13, 2026 · Alejandro</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] uppercase italic">
                            Agent Commerce<br />
                            Meets the <span className="text-emerald-500">EU AI Act</span>
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl font-medium">
                            What Palo Alto's Threat Report Missed
                        </p>

                        {/* GEO Pillar Paragraph */}
                        <div className="pt-6 border-l-4 border-emerald-500 pl-8">
                            <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                                Palo Alto Networks' Unit 42 called agent-to-agent commerce the next major AI risk frontier.
                                Their fix: identity-first security. The EU AI Act's fix goes further — and it's already law.
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none space-y-16">

                        {/* Intro */}
                        <section className="space-y-5">
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Palo Alto Networks' Unit 42 dropped their March 2026 Threat Bulletin this week, and buried inside
                                the identity-weakness statistics and OT risk warnings was a paragraph that should stop every AI
                                developer cold.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                They called it <strong className="text-white">"agent-to-agent commerce."</strong> AI proxies, acting
                                autonomously on behalf of humans, transacting with other AI agents — booking, purchasing, contracting,
                                committing. The report warned that AI agents could handle up to a quarter of all e-commerce
                                transactions by 2030, and that without proper guardrails, fraud could shift from a shrink problem
                                into a speed-and-volume catastrophe.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Their recommended fix was identity-first security. Know Your Agent. Treat AI agents like privileged
                                human identities. Apply zero standing privileges.
                            </p>
                            <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-8">
                                <p className="text-lg text-neutral-200 font-medium italic">
                                    Good advice. But incomplete.
                                </p>
                                <p className="text-base text-neutral-400 mt-3 leading-relaxed">
                                    The EU AI Act already anticipated this exact problem — and it has significantly more to say
                                    about it than Palo Alto's threat model does.
                                </p>
                            </div>
                        </section>

                        {/* What Unit 42 Got Right */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                What Unit 42 Got Right
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The agent commerce framing is genuinely useful. Most security teams are still thinking about AI
                                agents as query-response systems: a human asks, the agent answers. Unit 42 is right that this
                                mental model is breaking down.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Modern AI agents don't just respond. They browse, call APIs, place orders, update records, and
                                trigger downstream workflows — autonomously, at machine speed, across organizational boundaries.
                                When your AI agent commissions a vendor through another AI agent, neither organization's human
                                ever reviewed the transaction.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The identity questions Unit 42 raises are real. But they're{" "}
                                <strong className="text-white">security questions</strong>. What the EU AI Act introduces —
                                and what Unit 42's threat model entirely omits — are{" "}
                                <strong className="text-emerald-400">legal accountability questions</strong>.
                            </p>
                        </section>

                        {/* What the EU AI Act Says */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                What the EU AI Act Says About Autonomous Agents
                            </h2>

                            {/* Article 14 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-black text-emerald-400 tracking-widest uppercase">
                                        Article 14
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Human Oversight Isn't Optional</h3>
                                </div>
                                <p className="text-base text-neutral-400 leading-relaxed">
                                    Article 14 requires that high-risk AI systems be designed to allow natural persons to
                                    "effectively oversee" the system during operation. For autonomous agents, this is more
                                    than a UX requirement — it's a technical mandate.
                                </p>
                                <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                                    <p className="text-sm font-semibold text-white mb-3">Effective oversight means humans must be able to:</p>
                                    <ul className="space-y-2">
                                        {[
                                            "Understand what actions the agent is taking (and why)",
                                            "Interrupt or override those actions in real time",
                                            "Detect operational out-of-distribution behaviour before it compounds",
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                                <span className="text-sm text-neutral-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-base text-neutral-400 leading-relaxed">
                                    When agent A commissions agent B to execute a financial transaction, and no human reviewed
                                    that chain of delegation, <strong className="text-white">Article 14 has almost certainly been
                                    violated</strong> — regardless of how good the underlying identity controls are.
                                </p>
                                <p className="text-base text-neutral-400 leading-relaxed italic">
                                    Identity management tells you <em>who</em> made a request. Article 14 asks whether{" "}
                                    <em>any human</em> had a meaningful opportunity to review it. Those are different questions
                                    with different technical answers.
                                </p>
                            </div>

                            {/* Article 9 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-black text-blue-400 tracking-widest uppercase">
                                        Article 9
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Risk Management for High-Risk Systems</h3>
                                </div>
                                <p className="text-base text-neutral-400 leading-relaxed">
                                    Article 9 requires a documented, continuously maintained risk management system for any
                                    high-risk AI application. For AI agents operating in commerce, financial services, employment,
                                    or critical infrastructure, this typically means high-risk classification applies.
                                </p>
                                <p className="text-base text-neutral-400 leading-relaxed">
                                    The risk management obligation under Article 9 is{" "}
                                    <strong className="text-white">forward-looking</strong>: you must identify and evaluate
                                    foreseeable risks, not just react to incidents. Unit 42's threat model addresses incident
                                    detection. Article 9 requires that risk analysis exist{" "}
                                    <em className="text-neutral-200">before</em> the incident.
                                </p>
                            </div>

                            {/* Article 13 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs font-black text-violet-400 tracking-widest uppercase">
                                        Article 13
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Transparency and Traceability</h3>
                                </div>
                                <p className="text-base text-neutral-400 leading-relaxed">
                                    Article 13 requires that high-risk AI systems produce logs sufficient to ensure traceability
                                    of their results throughout their lifecycle. In an agent-to-agent transaction chain, this means
                                    every step in the delegation hierarchy must be auditable.
                                </p>
                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                                    <AlertTriangle className="w-5 h-5 text-amber-400 mb-3" />
                                    <p className="text-sm text-neutral-300 leading-relaxed">
                                        A firewall or identity provider logs <em>authentication events</em>. Article 13 requires
                                        you to log the reasoning, the inputs, the outputs, and the decision context — in a format
                                        that can be presented to a regulator.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Gap Between Security and Compliance
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Let's be precise about what Palo Alto's recommendations cover, and what they don't.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 pr-4 text-xs font-black uppercase tracking-widest text-neutral-500">Concern</th>
                                            <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-neutral-500">Identity Security</th>
                                            <th className="text-center py-3 pl-4 text-xs font-black uppercase tracking-widest text-emerald-500">Supra-wall</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparisonRows.map(({ concern, identity, suprawall, note }) => (
                                            <tr key={concern} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3.5 pr-4 text-neutral-300">
                                                    {concern}
                                                    {note && (
                                                        <span className="ml-2 text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">
                                                            {note}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center py-3.5 px-4">
                                                    {identity === true ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                                    ) : identity === "partial" ? (
                                                        <span className="text-amber-400 text-xs font-medium">Partial</span>
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-neutral-700 mx-auto" />
                                                    )}
                                                </td>
                                                <td className="text-center py-3.5 pl-4">
                                                    {suprawall ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-neutral-700 mx-auto" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-base text-neutral-400 leading-relaxed">
                                Security and compliance are not the same discipline. Security minimizes attack surface.
                                Compliance demonstrates adherence to a legal framework. In August 2026, only one of them
                                will keep you out of a regulatory investigation.
                            </p>
                        </section>

                        {/* How Supra-wall Closes the Gap */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                How Supra-wall Closes the Gap
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Supra-wall is a policy enforcement layer that sits between your AI agent's decision-making
                                and its ability to act. For agent-to-agent commerce specifically, it solves three problems
                                that identity security leaves open.
                            </p>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Policy-level controls on delegated actions",
                                        body: "You define what your agent can do and under what conditions. Require human approval for any financial commitment above €500? Any delegation to an external agent system? Those are Supra-wall policy rules — written once, enforced on every action, logged automatically.",
                                        color: "emerald",
                                    },
                                    {
                                        title: "Article 14 human-in-the-loop routing",
                                        body: "Supra-wall's REQUIRE_APPROVAL policy routes high-consequence actions to a human reviewer before execution. This is enforcement at the tool-call level — exactly what Article 14's 'effective oversight' requirement demands.",
                                        color: "emerald",
                                    },
                                    {
                                        title: "Article 13 audit trails by design",
                                        body: "Every action your agent attempts, every policy triggered, every approval requested, every denial issued — logged to a tamper-evident audit trail built to answer auditor questions, not just security incident reviews.",
                                        color: "emerald",
                                    },
                                ].map(({ title, body }) => (
                                    <div key={title} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex gap-4">
                                        <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
                                            <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/5 font-mono text-sm">
                                <div className="flex gap-2 mb-6">
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-bold">PYTHON</div>
                                    <div className="px-3 py-1 bg-white/5 text-neutral-500 rounded-md text-[10px]">Article 14 — Human Oversight</div>
                                </div>
                                <pre className="text-emerald-100/90 leading-relaxed whitespace-pre-wrap">
{`from suprawall import protect

secured = protect(
    my_agent,
    api_key="sw_...",
    policies=[
        # Require human approval for any financial commitment
        {
            "toolPattern": "commit_purchase|sign_contract|transfer_*",
            "action": "REQUIRE_APPROVAL",
            "reason": "Article 14 — financial delegation requires oversight"
        },
        # Block agent-to-agent delegation to unknown systems
        {
            "toolPattern": "call_external_agent",
            "action": "DENY",
            "reason": "Article 9 — unverified agent delegation is a risk"
        }
    ]
)
# Every blocked/approved action is logged to Article 13 audit trail`}
                                </pre>
                            </div>
                        </section>

                        {/* What to Do This Week */}
                        <section className="space-y-6 bg-neutral-900/50 p-12 rounded-[3rem] border border-white/10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                What to Do This Week
                            </h2>
                            <p className="text-base text-neutral-400">Unit 42 gave you the threat model. Here is the compliance checklist that goes with it.</p>
                            <ul className="space-y-5 list-none p-0">
                                {[
                                    "Map your agent actions to EU AI Act risk categories. Finance, HR, healthcare, critical infrastructure → you're in high-risk territory. Article 9 requires documented risk assessment before deployment.",
                                    "Audit your oversight architecture. For every action your agent can take autonomously, ask: does a human have a meaningful opportunity to review and override this before it completes?",
                                    "Check your audit trail against Article 13. Can you reconstruct what your agent did, why, and based on what inputs — in a format a regulator can review? Auth logs are not enough.",
                                    "Add a policy enforcement layer. LangChain, AutoGen, CrewAI, Vercel AI — Supra-wall installs in under five minutes and generates Article 14 and Article 13 audit evidence out of the box.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <span className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-black shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span className="text-neutral-300 font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Conclusion */}
                        <section className="space-y-5">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Conclusion
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Palo Alto's Unit 42 is right that agent-to-agent commerce is coming — and that most organizations
                                are not ready for it. But the readiness gap isn't only a security gap. It's a regulatory gap.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Identity controls stop bad actors from accessing your systems. Compliance enforcement stops your
                                own systems from acting outside the boundaries the law requires.
                            </p>
                            <p className="text-lg text-neutral-200 font-medium">
                                You need both. And the clock is running.
                            </p>
                            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                                <p className="text-base text-neutral-300">
                                    <strong className="text-white">August 2, 2026 is 142 days away.</strong> If you're building
                                    AI agents that act autonomously in high-risk domains, now is the time to close the compliance
                                    gap — not when the enforcement machinery is already running.
                                </p>
                            </div>
                        </section>

                        {/* Sources */}
                        <section className="pt-4 border-t border-white/[0.06]">
                            <p className="text-xs text-neutral-600 italic">
                                Sources: Palo Alto Networks Unit 42 March 2026 Threat Bulletin; EU AI Act Articles 9, 13, 14;
                                European Parliament AI Omnibus proposal, March 2026.
                            </p>
                        </section>
                    </div>

                    {/* Bottom Links */}
                    <div className="pt-20 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/learn/eu-ai-act-august-2026-deadline" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Related Article</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                EU AI Act August 2026 Deadline
                            </h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">5-month compliance roadmap for the August 2, 2026 deadline.</p>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors mt-4" />
                        </Link>
                        <Link href="/blog/ai-gateway-vs-compliance-layer" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Related Article</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                AI Gateway vs. Compliance Layer
                            </h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">Why Portkey and Supra-wall solve different problems.</p>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors mt-4" />
                        </Link>
                        <Link href="/use-cases/cost-control" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Use Case</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                Budget Controls for AI Agents
                            </h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">Hard cost caps that satisfy Article 9 risk management.</p>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors mt-4" />
                        </Link>
                    </div>

                    {/* CTA */}
                    <div className="bg-emerald-600 rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
                            Close the compliance gap.
                        </h3>
                        <p className="text-emerald-100 mb-8 max-w-md mx-auto">
                            Add Article 14 human oversight and Article 13 audit trails to your agent in under 5 minutes.
                        </p>
                        <Link
                            href="/quickstart"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    </div>
                </article>
            </main>
        </div>
    );
}
