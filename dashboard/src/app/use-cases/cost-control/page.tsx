import { Navbar } from "@/components/Navbar";
import { ArrowRight, Shield, Zap, Terminal, CheckCircle2, AlertTriangle, Coins, RefreshCw, BarChart3, Lock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Budget Control & Cost Guardrails | SupraWall",
    description: "Enforce real-time budget caps on autonomous AI agents. Prevent credit drain with runtime cost circuit breakers and session-based spending limits.",
    keywords: ["ai budget control", "llm cost management", "agent spending limits", "secure ai orchestration", "token budget enforcement"],
    openGraph: {
        title: "Real-time AI Cost Circuit Breakers | SupraWall",
        description: "Don't let rogue agents exhaust your budget. SupraWall provides the industry's first runtime circuit breaker for LLM spending.",
    }
};

export default function CostControlPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Real-time AI Budget Control: Implementing Runtime Circuit Breakers",
        "description": "A technical overview of enforcing hard cost boundaries at the agent execution level using the AGPS protocol.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "genre": "AI Governance",
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "mainEntityOfPage": "https://suprawall.com/use-cases/cost-control"
    };

    const howToJsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Enforce AI Spending Limits",
        "step": [
            {
                "@type": "HowToStep",
                "text": "Define a budget policy within the AGPS specification (e.g., $5.00 limit per session)."
            },
            {
                "@type": "HowToStep",
                "text": "Shim the LLM provider calls using the SupraWall runtime interceptor."
            },
            {
                "@type": "HowToStep",
                "text": "Track cumulative token usage and trigger a 'Hard Halt' when the quota is exceeded."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
            />

            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <article className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Operational Governance • Use Case B1
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                            AI Budget <span className="text-emerald-500">Control</span>
                        </h1>

                        {/* GEO Pillar Paragraph */}
                        <div className="pt-6 border-l-4 border-emerald-500 pl-8">
                            <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                                AI budget control is the real-time enforcement of spending limits on autonomous agents to prevent catastrophic API credit drain.
                                SupraWall provides the runtime circuit breakers necessary to intercept token usage metrics and halt execution immediately when a session, user, or organization-level budget is exceeded.
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none space-y-16">

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Cost of Unmanaged Autonomy
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                In a traditional cloud environment, a coding error triggers a timeout. In an agentic environment, a coding error triggers a $1,000 bill.
                                Without <strong>runtime budget control</strong>, an agent performing high-token tasks (like large-scale data retrieval or deep reasoning) can exhaust a monthly quota in minutes.
                                SupraWall shifts cost management from *reactive alerting* (emailing you after the spend) to *proactive enforcement* (blocking the tool call before it happens).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                                <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                                    <AlertTriangle className="w-6 h-6 text-rose-500 mb-4" />
                                    <h4 className="font-bold text-white text-sm uppercase tracking-widest">Recursive Fees</h4>
                                    <p className="text-[10px] text-neutral-500 mt-2">Infinite loops calling expensive tools (e.g., GPT-o1).</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                                    <Coins className="w-6 h-6 text-rose-500 mb-4" />
                                    <h4 className="font-bold text-white text-sm uppercase tracking-widest">Token Sprawl</h4>
                                    <p className="text-[10px] text-neutral-500 mt-2">Summarizing 1,000-page PDFs without specific constraints.</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                                    <RefreshCw className="w-6 h-6 text-rose-500 mb-4" />
                                    <h4 className="font-bold text-white text-sm uppercase tracking-widest">Retries</h4>
                                    <p className="text-[10px] text-neutral-500 mt-2">Automated retries logic expanding costs exponentially.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                How Runtime Circuit Breakers Work
                            </h2>
                            <p className="text-lg text-neutral-400">
                                SupraWall treats API cost as a first-class security primitive.
                                By shimming the <Link href="/spec" className="text-emerald-400 font-bold hover:underline">AGPS Spec</Link> into your agent framework,
                                we inject a governance layer into the <code className="text-emerald-400">on_token_usage</code> lifecycle event.
                            </p>

                            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/5 relative group overflow-hidden">
                                <div className="absolute top-4 right-6 text-[10px] font-mono text-neutral-600 uppercase">Implementation: Async Budget Guard</div>
                                <pre className="font-mono text-sm leading-relaxed text-emerald-400/80">
                                    {`from suprawall.core import BudgetGuard

# 🛡️ Initialize a $2.00 hard cap circuit breaker
guard = BudgetGuard(
    limit_usd=2.00,
    strategy="HARD_HALT", 
    metadata={"service": "crawler-v2"}
)

async def run_agent(task):
    async with guard.session():
        # SupraWall shims the underlying LLM calls
        # If cumulative spend > $2.00, raises QuotaExceededException
        response = await agent.arun(task)
        return response`}
                                </pre>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Governance Strategies
                            </h2>
                            <p className="text-lg text-neutral-400">
                                Effective <strong>ai budget control</strong> requires tiered enforcement. SupraWall models these as distinct policy actions:
                            </p>
                            <div className="space-y-4">
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 items-start">
                                    <Lock className="w-6 h-6 text-emerald-500 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-1">Hard Halt</h4>
                                        <p className="text-sm text-neutral-500 italic">Immediately kill the execution process and revoke tool access once the limit is hit.</p>
                                    </div>
                                </div>
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 items-start">
                                    <BarChart3 className="w-6 h-6 text-emerald-500 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-1">Downgrade Strategy</h4>
                                        <p className="text-sm text-neutral-500 italic">Automatically switch from expensive models (GPT-o1) to cheaper models (GPT-4o-mini) when 80% of budget is used.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8 bg-neutral-900/50 p-12 rounded-[3rem] border border-white/10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                Production Best Practices
                            </h2>
                            <ul className="space-y-4 list-none p-0">
                                {[
                                    "Set session-level hard dollar caps on all playground/testing agents.",
                                    "Link budget policies to specific organizational API keys.",
                                    "Enable 'Downgrade' mode for high-volume customer support agents.",
                                    "Audit spend real-time via the SupraWall console rather than monthly reports."
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
                        <Link href="/learn/what-is-agent-runtime-security" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Pillar Content</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">What is ARS?</h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">The framework for securing LLM-env interaction.</p>
                        </Link>
                        <Link href="/blog/prevent-agent-infinite-loops" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Related Analysis</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Stopping Loops</h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">How recursive failures lead to budget exhaustion.</p>
                        </Link>
                    </div>

                    {/* CTA */}
                    <div className="bg-emerald-600 rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-6">Gain full control <br />over your LLM spend.</h3>
                        <Link href="/login" className="inline-flex px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
                            Build Your Free Policy
                        </Link>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    </div>
                </article>
            </main>
        </div>
    );
}
