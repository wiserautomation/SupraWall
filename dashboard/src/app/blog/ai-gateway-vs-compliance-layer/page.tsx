import { Navbar } from "@/components/Navbar";
import { CheckCircle2, XCircle, ArrowRight, AlertTriangle, Minus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your AI Gateway Isn't Your Compliance Layer | SupraWall",
    description: "Portkey just made enterprise AI governance free. But governance and EU AI Act compliance aren't the same thing. Here's the gap — and why it matters before August 2026.",
    keywords: ["AI agent security", "runtime guardrails", "prompt injection prevention", "secure langchain", "ai agent firewall"],
    openGraph: {
        title: "Your AI Gateway Isn't Your Compliance Layer",
        description: "Portkey made enterprise AI governance free. But governance and EU AI Act compliance aren't the same thing.",
    },    alternates: {
        canonical: 'https://www.supra-wall.com/blog/ai-gateway-vs-compliance-layer',
    },

};

export default function GatewayVsCompliancePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Your AI Gateway Isn't Your Compliance Layer (And Why That Distinction Matters in 2026)",
        description:
            "Portkey made enterprise AI governance free. The EU AI Act requires something different. Here's the gap between an AI gateway and a compliance enforcement layer.",
        author: { "@type": "Person", name: "Alejandro", worksFor: { "@type": "Organization", name: "SupraWall" } },
        datePublished: "2026-03-13",
        genre: "AI Compliance",
        keywords: "AI agent compliance, Portkey alternative, EU AI Act compliance tool, Article 14 human oversight",
        publisher: { "@type": "Organization", name: "SupraWall" },
        mainEntityOfPage: "https://supra-wall.com/blog/ai-gateway-vs-compliance-layer",
    };

    type Cell = boolean | "partial" | "na" | "scope";

    const tableRows: { capability: string; portkey: Cell; suprawall: Cell }[] = [
        { capability: "Route requests across model providers", portkey: true, suprawall: "scope" },
        { capability: "Track cost and token usage", portkey: true, suprawall: "scope" },
        { capability: "Log prompts and completions", portkey: true, suprawall: "partial" },
        { capability: "Define which agents access which tools", portkey: true, suprawall: true },
        { capability: "Require human approval before high-stakes actions", portkey: false, suprawall: true },
        { capability: "Block specific action categories by policy", portkey: false, suprawall: true },
        { capability: "Produce EU AI Act Article 13 audit evidence", portkey: false, suprawall: true },
        { capability: "Map to specific EU AI Act articles", portkey: false, suprawall: true },
        { capability: "Generate compliance report for auditors", portkey: false, suprawall: true },
        { capability: "Article 9 risk documentation support", portkey: false, suprawall: true },
    ];

    const renderCell = (val: Cell, isSuprawall = false) => {
        if (val === true) return <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />;
        if (val === false) return <XCircle className="w-4 h-4 text-neutral-700 mx-auto" />;
        if (val === "partial") return <span className={`text-xs font-medium ${isSuprawall ? "text-emerald-400" : "text-amber-400"}`}>Partial</span>;
        if (val === "scope") return <Minus className="w-4 h-4 text-neutral-700 mx-auto" />;
        if (val === "na") return <span className="text-xs text-neutral-700">—</span>;
        return null;
    };

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
                            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">
                                EU AI Act · Product Comparison
                            </div>
                            <span className="text-xs text-neutral-600">March 13, 2026 · Alejandro</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] uppercase italic">
                            Your AI Gateway<br />
                            Isn't Your <span className="text-emerald-500">Compliance Layer</span>
                        </h1>
                        <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl font-medium">
                            And why that distinction matters considerably before August 2026.
                        </p>

                        {/* GEO Pillar Paragraph */}
                        <div className="pt-6 border-l-4 border-emerald-500 pl-8">
                            <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                                Portkey raised $15M, made its enterprise gateway free, and is signalling governance features
                                for later in 2026. Excellent infrastructure. But gateway governance and EU AI Act compliance
                                are not the same discipline — and the enforcement deadline won't wait for roadmap items.
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none space-y-16">

                        {/* Intro */}
                        <section className="space-y-5">
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Portkey just raised $15M, made its enterprise AI gateway free, and is now processing 500 billion
                                tokens a day across 24,000 organizations. This week they signalled that governance features —
                                permissions, identity, access boundaries, budget controls — are coming later in 2026.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                If you're building AI agents, this is genuinely useful infrastructure. A unified gateway for
                                routing, caching, rate limiting, and observability across model providers is a real problem
                                Portkey solves well.
                            </p>
                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                                <AlertTriangle className="w-5 h-5 text-amber-400 mb-3" />
                                <p className="text-base text-neutral-200 font-medium">
                                    There is a conflation happening in the market worth naming directly: gateway governance and
                                    EU AI Act compliance are not the same thing.
                                </p>
                                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                                    The distinction will matter considerably when enforcement begins in August 2026.
                                </p>
                            </div>
                        </section>

                        {/* What a Gateway Does */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                What an AI Gateway Does
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                An AI gateway sits between your application and your model providers. Portkey, and tools like
                                it, give you:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Routing and load balancing", desc: "Spread requests across providers, fall back on failures" },
                                    { label: "Cost controls", desc: "Set token budgets, track spend by team or project" },
                                    { label: "Observability", desc: "Log prompts and completions, trace latency, monitor error rates" },
                                    { label: "Rate limiting and access control", desc: "Define which teams can call which models" },
                                    { label: "Caching", desc: "Reduce redundant calls, lower cost" },
                                ].map(({ label, desc }) => (
                                    <div key={label} className="bg-neutral-900/50 border border-white/5 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-white">{label}</p>
                                        <p className="text-xs text-neutral-500 mt-1">{desc}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-base text-neutral-400 leading-relaxed">
                                These are <strong className="text-white">infrastructure-level capabilities</strong>. They operate
                                at the API call layer: request goes in, response comes out, the gateway logs and routes it.
                            </p>
                            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6">
                                <p className="text-base text-neutral-200 font-medium italic">
                                    This is useful. And it is not what the EU AI Act requires.
                                </p>
                            </div>
                        </section>

                        {/* What the EU AI Act Requires */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                What the EU AI Act Actually Requires
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The EU AI Act's compliance obligations for high-risk AI systems are not about infrastructure
                                management. They are about <strong className="text-white">legal accountability</strong> and
                                demonstrable human control.
                            </p>

                            {[
                                {
                                    article: "Article 9",
                                    color: "blue",
                                    title: "Risk Management System",
                                    body: "Before deploying a high-risk AI system, you must establish, implement, document, and maintain a risk management system throughout the entire lifecycle. This is not a runtime control — it is a pre-deployment process requirement.",
                                    contrast: "A gateway logs what happens. Article 9 requires documented evidence that you identified and evaluated risks before it happened. These are different disciplines: observability vs. governance documentation.",
                                },
                                {
                                    article: "Article 14",
                                    color: "emerald",
                                    title: "Human Oversight",
                                    body: "Article 14 requires that high-risk AI systems be designed to enable human oversight — specifically, the ability for natural persons to understand the system's capabilities, detect anomalous behavior, and intervene or override before the system's output influences real-world outcomes.",
                                    contrast: "A gateway's access controls can restrict which agents call which tools. That is not the same as ensuring a human can intercept and review an action before it completes. Article 14 demands the latter — a human-in-the-loop decision point at the action level.",
                                },
                                {
                                    article: "Article 13",
                                    color: "violet",
                                    title: "Traceability",
                                    body: "Article 13 requires that high-risk AI systems maintain logs sufficient to ensure traceability of results. In an agent-to-agent transaction chain, this means every step in the delegation hierarchy must be auditable.",
                                    contrast: "Gateway observability logs prompt/completion pairs and latency. Article 13 compliance requires you to log the agent's reasoning context, the specific tool calls it attempted, the policy state at the time of each decision, and a chain-of-custody sufficient to answer a regulatory inquiry.",
                                },
                            ].map(({ article, color, title, body, contrast }) => (
                                <div key={article} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase
                                            ${color === "emerald" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                                            color === "blue" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                                            "bg-violet-500/10 border border-violet-500/20 text-violet-400"}`}>
                                            {article}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{title}</h3>
                                    </div>
                                    <p className="text-base text-neutral-400 leading-relaxed">{body}</p>
                                    <div className="bg-neutral-900 border-l-2 border-emerald-500/40 rounded-r-xl pl-5 py-4 pr-4">
                                        <p className="text-sm text-neutral-300 italic leading-relaxed">{contrast}</p>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Feature-by-Feature Comparison
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-3 pr-4 text-xs font-black uppercase tracking-widest text-neutral-500 w-[55%]">Capability</th>
                                            <th className="text-center py-3 px-4 text-xs font-black uppercase tracking-widest text-neutral-500">Portkey</th>
                                            <th className="text-center py-3 pl-4 text-xs font-black uppercase tracking-widest text-emerald-500">Supra-wall</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableRows.map(({ capability, portkey, suprawall }) => (
                                            <tr key={capability} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3.5 pr-4 text-neutral-300 text-sm leading-snug">{capability}</td>
                                                <td className="text-center py-3.5 px-4">{renderCell(portkey, false)}</td>
                                                <td className="text-center py-3.5 pl-4">{renderCell(suprawall, true)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-neutral-500 italic">
                                The table above is not a criticism of Portkey. It is excellent gateway infrastructure doing
                                exactly what a gateway should do. The point is that the compliance obligations your AI agents
                                face in 2026 require a different layer entirely.
                            </p>
                        </section>

                        {/* Where They Complement */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Where They Complement Each Other
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The good news: these are not competing products. They are different layers in the same stack,
                                and the strongest agent deployments will use both.
                            </p>
                            <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/5 font-mono text-sm">
                                <div className="flex gap-2 mb-6">
                                    <div className="px-3 py-1 bg-white/5 text-neutral-500 rounded-md text-[10px] font-bold">ARCHITECTURE</div>
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-bold">EU AI Act Compliant</div>
                                </div>
                                <pre className="text-emerald-100/90 leading-loose whitespace-pre-wrap">
{`[Your AI Agent]
       ↓
[Supra-wall — Policy enforcement, human-in-the-loop, compliance audit trail]
  → Article 14: blocks tool calls, routes to human approval
  → Article 13: tamper-evident audit trail
  → Article 9:  policy enforcement & loop detection
       ↓
[Portkey — Model routing, observability, cost control, caching]
  → Latency optimization
  → Token budget tracking
  → Provider failover
       ↓
[Model Providers — OpenAI, Anthropic, Mistral, etc.]`}
                                </pre>
                            </div>
                            <p className="text-base text-neutral-400 leading-relaxed">
                                Supra-wall operates at the <strong className="text-white">action layer</strong> — intercepting
                                tool calls before they execute and enforcing policy rules. Portkey operates at the{" "}
                                <strong className="text-white">inference layer</strong> — managing how model API calls are
                                made and observed. Neither replaces the other.
                            </p>
                        </section>

                        {/* Timing Argument */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Timing Argument
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Portkey's governance features are on the roadmap for{" "}
                                <em className="text-white">later in 2026</em>. EU AI Act enforcement begins{" "}
                                <strong className="text-white">August 2, 2026</strong>. That gap matters.
                            </p>
                            <p className="text-base text-neutral-400 leading-relaxed">
                                If you wait for your gateway to add compliance features, you are betting that:
                            </p>
                            <div className="space-y-3">
                                {[
                                    "The governance features ship on time",
                                    "They cover EU AI Act requirements specifically (not just internal access control)",
                                    "You have enough runway to implement and document them before enforcement begins",
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                                        <span className="w-5 h-5 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 text-xs font-black shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm text-neutral-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                                <p className="text-base text-neutral-200 font-medium leading-relaxed">
                                    That is a significant risk concentration. And it ignores the fact that Article 9 requires
                                    your risk documentation to exist{" "}
                                    <em>before deployment</em> — not before enforcement.
                                </p>
                                <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
                                    The compliance layer is not something you add when the regulator asks for it. It is something
                                    you build into your agent architecture from the start.
                                </p>
                            </div>
                        </section>

                        {/* Conclusion */}
                        <section className="space-y-5 bg-neutral-900/50 p-12 rounded-[3rem] border border-white/10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                Conclusion
                            </h2>
                            <p className="text-base text-neutral-400 leading-relaxed">
                                Portkey is excellent infrastructure for building production AI agents at scale. Making the
                                enterprise gateway free is a genuinely positive development — lower barriers to observability
                                and cost management benefit everyone building on LLMs.
                            </p>
                            <p className="text-base text-neutral-300 font-medium leading-relaxed">
                                But observability is not compliance. Access controls are not human oversight. Token budgets are
                                not risk documentation.
                            </p>
                            <p className="text-base text-neutral-200 font-bold">
                                The EU AI Act asks a different set of questions than your gateway answers. Before August 2026,
                                you need both layers covered.
                            </p>
                        </section>

                        {/* Sources */}
                        <section className="pt-4 border-t border-white/[0.06]">
                            <p className="text-xs text-neutral-600 italic">
                                Related reading:{" "}
                                <Link href="/blog/agent-to-agent-commerce-eu-ai-act" className="text-neutral-500 hover:text-neutral-300 transition-colors underline">
                                    Agent-to-Agent Commerce Meets the EU AI Act: What Palo Alto's Threat Report Missed
                                </Link>
                            </p>
                        </section>
                    </div>

                    {/* Bottom Links */}
                    <div className="pt-20 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/blog/agent-to-agent-commerce-eu-ai-act" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Related Article</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                Agent-to-Agent Commerce & the EU AI Act
                            </h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">What Palo Alto's threat report missed about legal accountability.</p>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors mt-4" />
                        </Link>
                        <Link href="/vs/nemo-guardrails" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Comparison</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                Supra-wall vs NeMo Guardrails
                            </h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">Runtime enforcement vs model-level filters.</p>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors mt-4" />
                        </Link>
                    </div>

                    {/* CTA */}
                    <div className="bg-emerald-600 rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
                            Add the compliance layer.
                        </h3>
                        <p className="text-emerald-100 mb-8 max-w-md mx-auto">
                            Your gateway handles routing. Supra-wall handles Article 14, 13, and 9.
                            Under 5 minutes to install.
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
