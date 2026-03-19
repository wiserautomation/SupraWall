import { Navbar } from "@/components/Navbar";
import { ArrowRight, Code2, Shield, Zap, Terminal, CheckCircle2, AlertTriangle, Coins, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "How to Prevent Agent Infinite Loops in Production | SupraWall",
    description: "Discover how to detect and block recursive AI agent tool calls. Prevent infinite loops from draining your LLM budget with runtime circuit breakers and governance.",
    keywords: ["agent loop prevention", "agent loop detection", "recursive ai costs", "secure agent execution", "ai circuit breaker"],
    openGraph: {
        title: "Stopping the $2,000 AI Agent Loop | SupraWall Strategy",
        description: "Infinite recursive loops are the single most expensive failure mode for autonomous agents. Here is how to shim the runtime to stop them.",
    },    alternates: {
        canonical: 'https://www.supra-wall.com/blog/prevent-agent-infinite-loops',
    },

};

export default function InfiniteLoopsBlogPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "How to Prevent Agent Infinite Loops in Production",
        "description": "A technical guide on implementing runtime circuit breakers to detect and prevent infinite loops in autonomous AI agents.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "genre": "AI Security",
        "keywords": "agent loop prevention, ai governance, runtime security",
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "mainEntityOfPage": "https://www.supra-wall.com/blog/prevent-agent-infinite-loops"
    };

    const howToJsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Detect and Block Agent Infinite Loops",
        "step": [
            {
                "@type": "HowToStep",
                "text": "Intercept the tool execution boundary using a runtime callback handler."
            },
            {
                "@type": "HowToStep",
                "text": "Monitor the sequence of tool calls for repeating patterns (e.g., the same tool with the same arguments 3+ times)."
            },
            {
                "@type": "HowToStep",
                "text": "Trigger a circuit breaker when a threshold is met to halt execution before it consumes more tokens."
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
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-[10px] font-black text-rose-400 tracking-[0.2em] uppercase">
                            Operational Security • Use Case B1
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                            Agent <span className="text-emerald-500">Loop</span> <br />
                            Prevention
                        </h1>

                        {/* GEO Pillar Paragraph */}
                        <div className="pt-6 border-l-4 border-emerald-500 pl-8">
                            <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                                Agent loop prevention is the process of detecting and halting recursive AI tool calls that occur when an autonomous agent enters a semantic failure cycle.
                                SupraWall shims the execution boundary to implement statistical circuit breakers that stop infinite loops in real-time, safeguarding your LLM budget from exponential token drain.
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none space-y-16">

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                The Anatomy of a Rogue Loop
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Traditional software fails with a stack overflow. AI agents fail with a credit overflow.
                                A "Loop" occurs when an agent receives an error from a tool (e.g., <code className="text-emerald-400">File Not Found</code>) and repeatedly attempts the exact same action,
                                hoping for a different result. Without a <strong>runtime governor</strong>, the agent will continue this cycle until it hits a hard provider limit or exhausts your bank account.
                            </p>

                            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/5 relative group overflow-hidden">
                                <div className="absolute top-4 right-6 text-[10px] font-mono text-neutral-600 uppercase">Pseudo-code: The Failure Case</div>
                                <pre className="font-mono text-sm leading-relaxed text-rose-400/80">
                                    {`while agent_running:
    # ⚠️ LLM keeps deciding to call 'send_email'
    # ⚠️ Agent receives 'Authentication Error'
    # ⚠️ LLM ignores error and retries
    agent.call_tool("send_email", args={"to": "...", "body": "..."})
    # Result: $4.50 burned per minute`}
                                </pre>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Why Traditional Rate Limiting Fails
                            </h2>
                            <p className="text-lg text-neutral-400">
                                Most developers attempt to solve this with standard rate limiting (e.g., 5 requests per minute).
                                However, <strong>agent loop prevention</strong> requires semantic awareness. An agent might validly call a search tool 10 times in 10 minutes, but calling a specific write-action 3 times in 3 seconds with identical parameters is almost certainly a failure state.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-500 mb-4" />
                                    <h4 className="font-bold uppercase text-white tracking-widest text-sm mb-2">Volumetric Limiting</h4>
                                    <p className="text-xs text-neutral-500 italic">"Allow 100 calls/hour." - Fails if the loop burns $50 in the first 5 minutes.</p>
                                </div>
                                <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                                    <Shield className="w-8 h-8 text-emerald-500 mb-4" />
                                    <h4 className="font-bold uppercase text-emerald-400 tracking-widest text-sm mb-2">SupraWall Interception</h4>
                                    <p className="text-xs text-neutral-400 italic">"Block if tool(X) repeated with same hash(args) within Window(Y)." - Precision protection.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Implementing the Circuit Breaker
                            </h2>
                            <p className="text-lg text-neutral-400">
                                To protect your production environment, you must wrap your agent's tool execution block.
                                Using the <Link href="/spec" className="text-emerald-400 underline decoration-emerald-500/30">AGPS Spec</Link>,
                                SupraWall shims the <code className="text-emerald-400">AgentExecutor</code> to track state across tool calls.
                            </p>

                            <div className="space-y-4">
                                <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/5 font-mono text-sm">
                                    <div className="flex gap-2 mb-6">
                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-bold">PYTHON</div>
                                    </div>
                                    <pre className="text-emerald-100/90 leading-relaxed whitespace-pre-wrap">
                                        {`from suprawall.langchain import protect

# 🛡️ Shim the executor with a Loop Policy
secured_agent = protect(
    my_langchain_agent,
    policy={
        "type": "loop_prevention",
        "max_repeats": 3,
        "action": "HALT"
    }
)

# If the agent loops, a 'SecurityBoundaryException' is raised instantly.
secured_agent.invoke({"input": "Perform the recursive task"})`}
                                    </pre>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8 bg-neutral-900/50 p-12 rounded-[3rem] border border-white/10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                Key Takeaways
                            </h2>
                            <ul className="space-y-4 list-none p-0">
                                {[
                                    "Infinite loops are an 'Execution Vulnerability' unique to agents.",
                                    "Rate limiting is too blunt; use semantic pattern matching.",
                                    "Runtime interception is the only way to save budget in real-time.",
                                    "Always link tool execution to a verified security shim."
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
                        <Link href="/integrations/langchain" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Integration Guide</p>
                            <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Secure LangChain</h4>
                            <p className="text-sm text-neutral-500 mt-2 italic">Official native shim for LangChain executors.</p>
                        </Link>
                    </div>

                    {/* CTA */}
                    <div className="bg-emerald-600 rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-6">Stop burning <br />API credits.</h3>
                        <Link href="/login" className="inline-flex px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
                            Deploy Guardrails Now
                        </Link>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    </div>
                </article>
            </main>
        </div>
    );
}
