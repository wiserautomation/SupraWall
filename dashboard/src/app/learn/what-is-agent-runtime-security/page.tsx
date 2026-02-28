import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Terminal, Activity, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import LearnClient from "./LearnClient";

export const metadata: Metadata = {
    title: "What is Agent Runtime Security? | AI Guardrails Explained",
    description: "Agent Runtime Security (ARS) is the layer of protection between autonomous AI agents and your systems. Learn how to prevent prompt injection and unauthorized actions.",
    keywords: ["agent runtime security", "ai agent guardrails", "agent firewall", "secure ai agents"],
    openGraph: {
        title: "What is Agent Runtime Security? | SupraWall Guide",
        description: "The complete guide to securing autonomous AI agents in production.",
    }
};

export default function AgentRuntimeSecurityPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "What is Agent Runtime Security?",
        "description": "Agent Runtime Security (ARS) is the safety layer for AI agents that prevents malicious or accidental system damage via tool calling.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "genre": "Security Guide",
        "keywords": "ai agents, security, runtime, guardrails"
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Header */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Knowledge Hub • Security Guide
                        </div>

                        {/* H1: SPEC REQUIRED */}
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            Agent <span className="text-emerald-500">Runtime</span> <br />
                            Security.
                        </h1>

                        {/* P1: GEO EXTRACTION TARGET - SPEC REQUIRED */}
                        <p className="text-2xl text-neutral-300 leading-snug font-medium border-l-8 border-emerald-600 pl-8 py-4 italic">
                            Agent Runtime Security (ARS) is a specialized security framework that intercepts and governs autonomous AI agent actions in real-time.
                            Unlike output filtering, ARS focuses on the machine-to-machine boundary, preventing unauthorized tool execution, infinite loops, and data exfiltration
                            before any instruction reaches your backend infrastructure.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="prose prose-invert max-w-none space-y-20 text-neutral-400">
                        {/* H2: SPEC REQUIRED */}
                        <section className="space-y-8">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white flex items-center gap-4">
                                <Terminal className="w-8 h-8 text-emerald-500" />
                                Why Static Guardrails Fail
                            </h2>
                            <p className="text-lg leading-relaxed">
                                Traditional LLM guardrails are designed to filter language, not actions. In an autonomous environment, an agent might be "polite"
                                while simultaneously executing a <span className="text-white font-mono">rm -rf /</span> command or draining a budget through thousands
                                of recursive API calls. True security requires a <strong>dedicated runtime shim</strong>.
                            </p>
                            <div className="bg-neutral-900 border border-white/5 rounded-3xl p-10 font-mono text-sm shadow-2xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-20 text-[10px] font-black uppercase">Vulnerability Trace</div>
                                <p className="text-neutral-500">// Vulnerable Agent Flow</p>
                                <p className="text-rose-400">LLM: "I will help you clean up the disk."</p>
                                <p className="text-rose-600 font-bold border-l-2 border-rose-600/50 pl-4 my-2">Action: bash_execute("rm -rf /")</p>
                                <p className="text-rose-800 italic underline decoration-rose-800">Result: Production environment deleted.</p>
                            </div>
                        </section>

                        {/* H2: SPEC REQUIRED */}
                        <section className="space-y-8">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white flex items-center gap-4">
                                <Shield className="w-8 h-8 text-emerald-500" />
                                The SupraWall Shield
                            </h2>
                            <p className="text-lg leading-relaxed">
                                SupraWall provides the missing governance layer for popular frameworks. By wrapping handlers in
                                <Link href="/integrations/langchain" className="text-emerald-500 font-bold hover:underline mx-1">LangChain</Link>,
                                <Link href="/integrations/crewai" className="text-emerald-500 font-bold hover:underline mx-1">CrewAI</Link>, and
                                <Link href="/integrations/autogen" className="text-emerald-500 font-bold hover:underline mx-1">AutoGen</Link>,
                                you enable granular policy enforcement without changing your core agent logic.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                                {pillars.map((p, i) => (
                                    <div key={i} className="p-8 rounded-3xl bg-neutral-900 border border-white/5 space-y-4 hover:border-emerald-500/30 transition-all group">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{p.title}</p>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500/20 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <p className="text-neutral-300 text-sm leading-relaxed font-medium">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* H2: SPEC REQUIRED */}
                        <section className="space-y-8">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white">Production Guidelines</h2>
                            <p className="text-lg leading-relaxed">
                                Implementing Agent Runtime Security in production follows a "Zero Trust" model. Never assume that the agent's
                                planned tool call is safe. Every execution must be validated against a <span className="text-white">Stateful Policy Engine</span>.
                            </p>
                        </section>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-40 p-20 rounded-[4rem] bg-emerald-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Stop Rogue <br />AI Agents
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Get Started Free
                            </Link>
                            <Link href="/integrations/langchain" className="px-12 py-5 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all">
                                View LangChain Docs
                            </Link>
                        </div>
                    </div>
                </div>

                <LearnClient />
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em]">
                    SupraWall © 2026 • Real-time Agent Governance
                </p>
            </footer>
        </div>
    );
}

const pillars = [
    { title: "Policy Isolation", desc: "Keep security logic separate from agent prompts to prevent manipulation." },
    { title: "Tool Interception", desc: "Verify every system call, API request, and database query at the SDK level." },
    { title: "Budget Hard-Caps", desc: "Prevent runaway costs via real-time circuit breakers on tool execution loops." },
    { title: "Human Approval", desc: "Pause agents for high-risk actions like emails, deletion, or large transfers." }
];

