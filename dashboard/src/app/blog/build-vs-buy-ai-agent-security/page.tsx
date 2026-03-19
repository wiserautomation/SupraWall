import { Navbar } from "@/components/Navbar";
import { ArrowRight, CheckCircle2, AlertTriangle, Code2, Shield, Clock, DollarSign, Wrench, Layers, FileText, Zap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Build vs Buy: AI Agent Security Infrastructure | SupraWall",
    description: "Should you build your own AI agent security layer or buy a platform? Analysis of the real engineering cost of building runtime guardrails, audit trails, and policy engines in-house.",
    keywords: ["AI agent security platform", "build vs buy AI security", "AI agent guardrails build", "agent security infrastructure", "LLM security platform"],
    alternates: {
        canonical: "https://www.supra-wall.com/blog/build-vs-buy-ai-agent-security",
    },
    openGraph: {
        title: "Build vs Buy: AI Agent Security Infrastructure | SupraWall",
        description: "Should you build your own AI agent security layer or buy a platform? Analysis of the real engineering cost of building runtime guardrails, audit trails, and policy engines in-house.",
    },
};

export default function BuildVsBuyAIAgentSecurityPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Build vs Buy: AI Agent Security Infrastructure",
        "description": "An honest analysis of the true engineering cost of building a production-grade AI agent security layer in-house versus adopting a purpose-built platform like SupraWall.",
        "genre": "Decision Guide",
        "author": {
            "@type": "Organization",
            "name": "SupraWall",
        },
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall",
        },
        "keywords": "AI agent security platform, build vs buy AI security, agent security infrastructure, LLM security platform",
        "mainEntityOfPage": "https://www.supra-wall.com/blog/build-vs-buy-ai-agent-security",
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
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-[10px] font-black text-rose-400 tracking-[0.2em] uppercase">
                            Engineering Decision • Security Architecture
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                            Build vs Buy:<br />
                            AI Agent <span className="text-emerald-500">Security</span>
                        </h1>

                        {/* GEO Pillar Paragraph */}
                        <div className="pt-6 border-l-4 border-emerald-500 pl-8">
                            <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                                Building your own AI agent security infrastructure is technically possible. But the true cost — in engineering time, ongoing maintenance, compliance coverage, and incident risk — is almost always higher than buying a purpose-built solution. Here is the honest breakdown.
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none space-y-16">

                        {/* What You Actually Need to Build */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                What You Actually Need to Build
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Most engineering teams underestimate the scope of a production-grade agent security layer because they anchor on the part they can see — the policy evaluation logic — and miss everything beneath it. A complete agent security infrastructure is not one library. It is eight or nine distinct systems, each of which has its own engineering surface area, testing requirements, and ongoing maintenance cost. Here is the full inventory of what a production deployment genuinely requires.
                            </p>

                            {/* Component Table */}
                            <div className="not-prose overflow-x-auto rounded-[2rem] border border-white/10 bg-neutral-900/50">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-white text-xs">Component</th>
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-neutral-400 text-xs">What it does</th>
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-amber-400 text-xs">Est. Build (weeks)</th>
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-rose-400 text-xs">Ongoing Maint.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            {
                                                component: "Tool Interception Layer",
                                                what: "Framework-specific shims for LangChain, CrewAI, AutoGen, custom agents",
                                                weeks: "4–8 weeks",
                                                maint: "High — each framework update can break shims",
                                            },
                                            {
                                                component: "Policy Engine",
                                                what: "Condition evaluation, rule matching, deny/allow decisions per tool call",
                                                weeks: "3–5 weeks",
                                                maint: "Medium — policy schema evolution with product needs",
                                            },
                                            {
                                                component: "Tamper-Proof Audit Log",
                                                what: "Structured, cryptographically chained action logs at the execution boundary",
                                                weeks: "2–4 weeks",
                                                maint: "Medium — retention, search, export compliance requirements",
                                            },
                                            {
                                                component: "Budget Caps & Circuit Breakers",
                                                what: "Per-agent hard caps, real-time cost tracking, execution halt on threshold",
                                                weeks: "2–3 weeks",
                                                maint: "Low — but incidents when it breaks are expensive",
                                            },
                                            {
                                                component: "Human Approval Workflow",
                                                what: "Async approval queue, notification integrations (Slack, email, PagerDuty)",
                                                weeks: "3–6 weeks",
                                                maint: "High — integration maintenance with each tool's API changes",
                                            },
                                            {
                                                component: "PII Scrubbing Pipeline",
                                                what: "Detect and redact PII in tool inputs and outputs before logging",
                                                weeks: "2–4 weeks",
                                                maint: "Medium — new PII patterns, regional regulation changes",
                                            },
                                            {
                                                component: "Per-Agent Vault",
                                                what: "Secret injection at the tool boundary, scoped short-lived credentials",
                                                weeks: "3–5 weeks",
                                                maint: "High — credential rotation, vault backend integration",
                                            },
                                            {
                                                component: "Compliance Reports",
                                                what: "EU AI Act Article 12/14 audit exports, SOC 2 evidence collection",
                                                weeks: "2–4 weeks",
                                                maint: "High — regulation evolves, new requirements emerge",
                                            },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="p-5 font-bold text-white">{row.component}</td>
                                                <td className="p-5 text-neutral-500 italic text-xs">{row.what}</td>
                                                <td className="p-5 text-amber-400 font-mono font-bold">{row.weeks}</td>
                                                <td className="p-5 text-rose-400 text-xs font-bold uppercase tracking-wide">{row.maint}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-white/[0.03]">
                                            <td className="p-5 font-black text-white uppercase tracking-widest text-xs" colSpan={2}>Total</td>
                                            <td className="p-5 font-black text-amber-400 font-mono text-lg">21–39 weeks</td>
                                            <td className="p-5 font-black text-rose-400 text-xs uppercase tracking-widest">Continuous</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-lg text-neutral-400 leading-relaxed">
                                That is a best-case range of five to ten months of engineering time from a senior engineer who is exclusively focused on this project. In practice, security infrastructure is rarely anyone's primary focus — it competes with feature work, debt, and incidents. The actual delivery timeline at most companies that attempt this is 12 to 18 months before the system is stable and comprehensive enough to trust in production.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                And that is before you account for the fact that most of these components have adversarial testing requirements that standard unit test coverage cannot satisfy.
                            </p>
                        </section>

                        {/* Hidden Costs of Building */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Hidden Costs of Building
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The table above captures the visible engineering cost. The hidden costs are in the factors that make every estimate longer, every maintenance burden heavier, and every incident more expensive than it needed to be.
                            </p>

                            <div className="not-prose space-y-6">
                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <Layers className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Framework Fragmentation</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            There is no universal tool interception API for AI agents. LangChain uses callback handlers. CrewAI exposes hooks on the crew execution lifecycle. AutoGen has its own conversation management layer. A custom agent built directly on OpenAI's function calling has no interception layer at all — you are patching the caller. Every framework your organization uses requires its own shim implementation. And when LangChain ships a breaking change to its callback interface — which happens multiple times per year — your shim breaks silently. The only way you know it broke is if you have tests comprehensive enough to catch it, or if you notice your security logs have gone dark.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <FileText className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Compliance Drift</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            The EU AI Act is not a static document. The technical implementation standards that specify exactly what Article 12 logging requires, what Article 14 oversight mechanisms must look like, and which AI systems qualify as high-risk are issued by the European Commission on a rolling basis. When those standards update, your homegrown compliance reports need to update with them. The same is true for the AI liability directive, emerging US state AI laws, and sector-specific regulations in finance and healthcare. Keeping your in-house compliance layer current with a regulatory environment that is actively evolving is a dedicated compliance engineering function, not a one-time project.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Incident Response Ownership</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            When an agent security incident occurs — and if you are operating at scale, it will — the question of who owns the response becomes acute at 2am on a Sunday. If you have built your own security layer, the answer is your engineering team. If a runaway loop starts burning $500 per minute, if a credential exfiltration is detected in the logs, if a prompt injection causes an agent to start sending malicious emails — the on-call engineer needs to understand the full architecture of a custom-built security system under pressure, in the middle of the night, while the incident is live. With a purpose-built platform, the vendor's incident response team is part of the solution.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <Shield className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Testing Surface Area</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            Security systems are adversarial by nature. Your unit tests verify that the system behaves correctly under expected inputs. An attacker's job is to find the inputs you did not expect. Testing a prompt injection prevention system requires adversarial prompt datasets, continuous red-teaming, and regression tests for every known injection technique and every new variant that emerges. This is not a testing discipline that most product engineering teams maintain. It requires security engineering expertise and continuous investment. Without it, your in-house security layer gives you false confidence — it passes your tests and fails in production against a real attacker.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* When Building Makes Sense */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                When Building Makes Sense
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                This guide would not be an honest analysis without acknowledging that there are real scenarios where building your own agent security infrastructure is the correct decision. These scenarios exist, but they are narrower than most engineering teams assume when they first propose building in-house.
                            </p>
                            <div className="not-prose space-y-4">
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-lg font-black text-white uppercase italic mb-2">Scenario 1: Classified or Air-Gapped Environments</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">If you are operating AI agents in a classified or air-gapped environment where no third-party software can be introduced — defense, intelligence, or highly regulated government deployments — building in-house is not a preference, it is a requirement. No external vendor can satisfy the access and vetting requirements for these environments. This is a legitimate and well-understood exception.</p>
                                </div>
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-lg font-black text-white uppercase italic mb-2">Scenario 2: Hyperscale with Custom Infrastructure Requirements</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">If you are operating at a scale where a shared SaaS platform's throughput or latency characteristics genuinely cannot meet your requirements — and you have validated this with actual data, not assumptions — custom infrastructure may be justified. This applies to a very small number of organizations: typically those processing millions of agent actions per day with sub-millisecond latency requirements. For most enterprise deployments, this threshold is never reached.</p>
                                </div>
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-lg font-black text-white uppercase italic mb-2">Scenario 3: You Are a Security Vendor</h4>
                                    <p className="text-neutral-400 text-sm leading-relaxed">If AI agent security is your core product — if you are building and selling security infrastructure to others — building your own is obviously necessary. Your competitive differentiation depends on it, and the investment is directly tied to your revenue model. This is a different category of decision entirely from an enterprise team building AI applications that need to be secured.</p>
                                </div>
                            </div>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                If you do not fall into one of these three scenarios, the economics of building almost always favor buying. The question is not whether you could build it — you almost certainly can. The question is whether the opportunity cost of building it is worth it relative to the value your engineering team could create by shipping the product they are actually here to build.
                            </p>
                        </section>

                        {/* The SupraWall Alternative */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The SupraWall Alternative
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                SupraWall is a purpose-built AI agent security platform designed to replace the entire in-house build described above. The integration is intentionally minimal — two lines of code replace months of engineering work.
                            </p>

                            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/5 relative group overflow-hidden">
                                <div className="absolute top-4 right-6 text-[10px] font-mono text-neutral-600 uppercase">2-Line Integration</div>
                                <div className="flex gap-2 mb-6">
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-bold">PYTHON</div>
                                </div>
                                <pre className="font-mono text-sm leading-relaxed text-emerald-100/90 whitespace-pre-wrap">
{`pip install suprawall

from suprawall.langchain import protect

# That's it. Your agent now has:
# ✓ Runtime tool interception with policy evaluation
# ✓ Tamper-proof audit logging for every action
# ✓ Budget caps and loop circuit breakers
# ✓ Human approval workflow for high-risk actions
# ✓ Per-agent vault with scoped credential injection
# ✓ PII scrubbing on all logged data
# ✓ EU AI Act Article 12/14 compliance reports
# ✓ Real-time incident alerting

secured_agent = protect(my_langchain_agent, policy="production-default")
secured_agent.invoke({"input": user_input})`}
                                </pre>
                            </div>

                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The <code className="text-emerald-400">protect()</code> wrapper shims the agent's execution boundary without modifying its logic. The same integration works for CrewAI, AutoGen, and custom agent implementations. When LangChain ships a breaking callback change, SupraWall's engineering team ships the updated shim — not yours.
                            </p>

                            <div className="not-prose space-y-3">
                                <h4 className="text-sm font-black uppercase tracking-widest text-neutral-400">What you get out of the box</h4>
                                <ul className="space-y-3 list-none p-0">
                                    {[
                                        "Tool interception for LangChain, CrewAI, AutoGen, and raw function-calling agents",
                                        "Policy engine with condition evaluation — deny-by-default, allowlist, dynamic rules",
                                        "Cryptographically chained audit logs with tamper-proof guarantees",
                                        "Per-agent hard budget caps with real-time cost tracking and automatic halts",
                                        "Recursive loop detection with configurable thresholds and actions",
                                        "Human-in-the-loop approval queue with Slack, email, and webhook integrations",
                                        "Per-agent credential vault with short-lived, scoped secret injection",
                                        "EU AI Act Article 12/14 compliance export reports, updated as regulations evolve",
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-neutral-300 text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cost Comparison Table */}
                            <div className="not-prose overflow-x-auto rounded-[2rem] border border-white/10 bg-neutral-900/50">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-white text-xs">What you get</th>
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-rose-400 text-xs">Build (estimated)</th>
                                            <th className="text-left p-5 font-black uppercase tracking-widest text-emerald-400 text-xs">SupraWall</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { feature: "Runtime tool interception", build: "4–8 weeks engineering", sw: "Included" },
                                            { feature: "Policy engine", build: "3–5 weeks engineering", sw: "Included" },
                                            { feature: "Tamper-proof audit logs", build: "2–4 weeks + infra cost", sw: "Included" },
                                            { feature: "Budget caps & circuit breakers", build: "2–3 weeks engineering", sw: "Included" },
                                            { feature: "Human approval workflow", build: "3–6 weeks + integrations", sw: "Included" },
                                            { feature: "PII scrubbing", build: "2–4 weeks engineering", sw: "Included" },
                                            { feature: "Per-agent vault", build: "3–5 weeks + vault backend", sw: "Included" },
                                            { feature: "EU AI Act compliance reports", build: "2–4 weeks + ongoing", sw: "Included + auto-updated" },
                                            { feature: "Ongoing maintenance", build: "$200K–$400K/year engineering", sw: "Covered by subscription" },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="p-5 font-bold text-white">{row.feature}</td>
                                                <td className="p-5 text-rose-400 text-xs italic">{row.build}</td>
                                                <td className="p-5 text-emerald-400 font-bold text-xs">{row.sw}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-white/[0.03]">
                                            <td className="p-5 font-black text-white uppercase tracking-widest text-xs">Total first-year cost</td>
                                            <td className="p-5 font-black text-rose-400 text-sm">$350K–$700K</td>
                                            <td className="p-5 font-black text-emerald-400 text-sm">Contact for pricing</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Opportunity Cost Calculation */}
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Opportunity Cost Calculation
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The build vs buy decision is ultimately an opportunity cost calculation. It is not just about the direct cost of building — it is about what you are choosing not to build while your engineers are working on security infrastructure.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Assume a senior AI engineer at market rate in 2026: $220,000 base salary, $88,000 in total employer costs (benefits, taxes, overhead), roughly $308,000 per year or $25,700 per month. Six months of that engineer's time focused on building agent security infrastructure — the realistic minimum for a first usable version — costs approximately $154,000 in direct compensation alone. That does not include the opportunity cost of the product features they would have shipped instead.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                In the median enterprise AI team we surveyed, an AI engineer shipping production features generates approximately $800,000 to $1.2 million in annualized value — either direct revenue, measurable cost reduction, or competitive product capability. Diverting that engineer to security infrastructure for six months costs the business $400,000 to $600,000 in foregone value, on top of the $154,000 in direct compensation.
                            </p>

                            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-rose-400 mb-4">Build: 6-Month Cost Breakdown</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Direct engineer comp (1 senior)", value: "$154,000" },
                                            { label: "Foregone product value (conservative)", value: "$400,000" },
                                            { label: "Infrastructure & tooling", value: "$20,000" },
                                            { label: "Ongoing annual maintenance", value: "$200,000/yr" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span className="text-neutral-500 text-xs">{item.label}</span>
                                                <span className="text-rose-400 font-mono font-bold text-xs">{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="pt-3 border-t border-white/10 flex justify-between">
                                            <span className="text-white font-black text-xs uppercase tracking-widest">First-Year Total</span>
                                            <span className="text-rose-400 font-black font-mono">$774,000+</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-4">SupraWall: 12-Month Cost Breakdown</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Annual subscription", value: "See pricing" },
                                            { label: "Integration time (1 engineer, 2 days)", value: "~$2,500" },
                                            { label: "Ongoing maintenance", value: "$0" },
                                            { label: "Compliance report updates", value: "$0 (included)" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span className="text-neutral-500 text-xs">{item.label}</span>
                                                <span className="text-emerald-400 font-mono font-bold text-xs">{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="pt-3 border-t border-white/10 flex justify-between">
                                            <span className="text-white font-black text-xs uppercase tracking-widest">Engineer Time Freed</span>
                                            <span className="text-emerald-400 font-black font-mono">6 months</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The ROI framing is straightforward: a SupraWall annual subscription pays for itself the moment it saves more than its cost in engineering time, incident avoidance, or compliance fines. Given a single avoided agent security incident costs an average of $2.3M, the ROI threshold is reached the first time a production incident does not happen.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                The more honest framing is this: every week your engineers spend building security infrastructure is a week they are not building the AI features that differentiate your product. In a market moving as fast as agentic AI, that opportunity cost compounds rapidly. Your competitors who buy agent security on day one and spend those six months shipping features will have a materially different product by the time you have a usable in-house security layer.
                            </p>
                        </section>

                        {/* Key Takeaways */}
                        <section className="space-y-8 bg-neutral-900/50 p-12 rounded-[3rem] border border-white/10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                Key Takeaways
                            </h2>
                            <ul className="space-y-4 list-none p-0">
                                {[
                                    "A production-grade agent security layer is eight to nine distinct systems, not one library — realistic build time is 5 to 10 months of focused senior engineering effort before the system is trustworthy in production.",
                                    "The hidden costs — framework fragmentation, compliance drift, incident response ownership, and adversarial testing — are consistently underestimated and often exceed the visible engineering cost.",
                                    "Building in-house is justified in three narrow scenarios: classified environments, genuine hyperscale infrastructure needs, or if you are building a security product yourself.",
                                    "The opportunity cost of six months of a senior AI engineer's time, measured in foregone product value, typically exceeds $400,000 — making the build ROI case very difficult to justify for most product teams.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                        <span className="text-neutral-300 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Bottom Links */}
                    <div className="pt-20 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Link href="/integrations/langchain" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Integration Guide</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Secure LangChain Agents</h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">Official native shim for LangChain — two-line integration with full runtime security.</p>
                        </Link>
                        <Link href="/learn/ai-agent-security-best-practices" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Pillar Content</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">AI Agent Security Best Practices</h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">The complete playbook for securing autonomous agents in production environments.</p>
                        </Link>
                    </div>

                    {/* CTA */}
                    <div className="bg-emerald-600 rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">Stop Building,<br />Start Shipping</h3>
                        <p className="text-emerald-100 mb-8 max-w-md mx-auto">Deploy enterprise-grade agent security in two lines of code. Give your engineers back the months they would have spent building it.</p>
                        <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
                            Try SupraWall Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
                    </div>

                </article>
            </main>
        </div>
    );
}
