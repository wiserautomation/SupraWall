import { Navbar } from "@/components/Navbar";
import {
    ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2,
    Shield, BrickWall, Database, Terminal, Globe, Code2, AlertTriangle,
    Play, Users, Star, HelpCircle, Mail, DollarSign, ExternalLink,
    Zap, Server, Bot, Layers, Triangle, RefreshCw, Coins
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { CodeTerminal, TechTabs, ClawbotDemo, TagBadge, AnimatedBox } from "./HomeClient";

export const metadata: Metadata = {
    title: "SupraWall | The Agent Security Runtime for Autonomous AI",
    description: "Secure your AI agents with the global standard for agentic governance. Zero-trust tool calls, loop detection, and cost control for LangChain, AutoGen, CrewAI, and OpenClaw.",
    keywords: ["agent security", "ai governance", "secure langsmith alternative", "prevent agent prompt injection"],
};

export default function LandingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "SupraWall",
        "url": "https://suprawall.com",
        "description": "The security and cost-control shim for autonomous AI agents.",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "featureList": [
            "Real-time Tool Interception",
            "Infinite Loop Detection",
            "AI Budget Caps",
            "Prompt Injection Prevention",
            "Zero-Latency Security SDK"
        ]
    };

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="overflow-hidden">

                {/* 📐 SECTION 1: HERO */}
                <section className="relative pt-40 pb-32 px-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-30 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-600/20 blur-[150px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-8 text-left">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-400 tracking-wider uppercase">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                                Security Infrastructure for AI Agents.
                            </div>

                            <h1 className="text-6xl md:text-[90px] font-extrabold tracking-tight text-white leading-[0.9] uppercase italic">
                                We Block Your <Link href="/learn/what-is-agent-runtime-security" className="text-emerald-500 underline decoration-emerald-500/30">Agent</Link> <br />
                                <span className="text-emerald-500">from going Rogue.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
                                The security & cost-control shim for <Link href="/integrations/langchain" className="text-white hover:text-emerald-400">LangChain</Link>, <Link href="/integrations/autogen" className="text-white hover:text-emerald-400">AutoGen</Link>, <Link href="/integrations/crewai" className="text-white hover:text-emerald-400">CrewAI</Link>, and <Link href="/integrations/openclaw" className="text-white hover:text-emerald-400">OpenClaw</Link>.
                                Prevent rogue behavior and runaway budgets with zero-trust tool governance.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-3xl hover:bg-neutral-100 transition-all flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                    <div className="flex items-center gap-3">
                                        Secure My Agents <ArrowRight className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] opacity-60 font-black tracking-widest mt-1">Free Tier Available</span>
                                </Link>
                            </div>

                            <div className="pt-8">
                                <div className="p-8 bg-neutral-900 border border-white/5 rounded-[3rem] max-w-md relative group">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />)}
                                    </div>
                                    <p className="text-xl font-bold text-neutral-200 italic mb-8 leading-relaxed">
                                        "Essential for anyone running <Link href="/integrations/openclaw" className="text-emerald-500 underline">Claw agents</Link> in prod. Caught 30 dangerous clicks before they happened."
                                    </p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                        <div className="w-12 h-12 rounded-full border border-emerald-500/30 overflow-hidden bg-neutral-800" />
                                        <div>
                                            <p className="font-black text-sm text-white uppercase tracking-tight">— @maxhaining</p>
                                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Creator of OpenClaw</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <CodeTerminal />
                            <div className="mt-6 flex items-center gap-2 justify-center lg:justify-start">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                                    LIVE: Blocked 12,402 rogue tool calls today
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📐 COMPARISON BLOCK */}
                <section className="py-24 px-6 border-b border-white/5 bg-black">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] mb-12 text-center italic">The Industry Standard Alternative</p>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-24">
                            <Link href="/vs/nemo-guardrails" className="text-2xl font-black text-neutral-500 hover:text-white transition-colors uppercase italic tracking-tighter">
                                Better than NeMo Guardrails →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 📐 POLICY SECTION */}
                <section className="py-40 px-6 bg-[#030303] text-white">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
                                Policy <br />
                                <span className="text-emerald-500 font-black">As Code.</span>
                            </h2>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic">
                                Don't let your agents act solo. Use the <Link href="/learn/what-is-agent-runtime-security" className="text-white underline decoration-emerald-500">ARS framework</Link> to define
                                per-agent tool permissions, cost budgets, and safety guardrails.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { title: "Universal Integration", desc: "Native support for all major LLM agents." },
                                    { title: "Prompt Injection Blocking", desc: "Detects hidden instructions in untrusted data." },
                                    { title: "Cost Control", desc: "Hard-budget caps on expensive tool chains." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest">{item.title}</h4>
                                            <p className="text-xs text-neutral-500 font-bold mt-1 uppercase leading-none">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <TechTabs />
                    </div>
                </section>

                {/* 📐 USE CASES */}
                <section className="py-32 bg-white text-black px-6">
                    <div className="max-w-7xl mx-auto space-y-16 text-center">
                        <h3 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">Safe Mode <br />in the Wild.</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="p-10 rounded-[3rem] border-2 border-black space-y-8 bg-neutral-50 text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest py-1 px-4 border border-black rounded-full">Injection Prevention</span>
                                <h4 className="text-3xl font-black italic leading-none">Stop Prompt Injection.</h4>
                                <p className="text-neutral-600 font-bold leading-relaxed">
                                    Our <Link href="/use-cases/prompt-injection" className="text-black underline">Prompt Injection Prevention</Link> system catches
                                    adversarial attempts to hijack your agent's tool access via untrusted context.
                                </p>
                                <div className="h-40 rounded-2xl bg-black overflow-hidden border-2 border-black">
                                    <ClawbotDemo />
                                </div>
                            </div>

                            <div className="p-10 rounded-[3rem] border-2 border-black space-y-8 bg-neutral-50 text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest py-1 px-4 border border-black rounded-full">Cost Governance</span>
                                <h4 className="text-3xl font-black italic leading-none">Unlimited Loop Protection.</h4>
                                <p className="text-neutral-600 font-bold leading-relaxed">
                                    Agents can get stuck in loops that drain $1000s in minutes. SupraWall's circuit breakers
                                    cut the power as soon as a repeat pattern is detected.
                                </p>
                            </div>

                            <div className="p-10 rounded-[3rem] border-2 border-black space-y-8 bg-neutral-50 text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest py-1 px-4 border border-black rounded-full">Tool Sandboxing</span>
                                <h4 className="text-3xl font-black italic leading-none">Dangerous Tool Guard.</h4>
                                <p className="text-neutral-600 font-bold leading-relaxed">
                                    Intercept restricted bash, python, or database commands before they execute.
                                    Require manual approval for sensitive production actions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📐 FINAL CTA */}
                <section className="py-40 px-6 bg-black relative text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 className="text-7xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter">STOP <br />GUESSING.</h2>
                        <Link href="/login" className="px-16 py-8 bg-emerald-600 text-white font-black text-3xl rounded-[2.5rem] hover:bg-emerald-500 transition-all inline-block shadow-[0_0_100px_rgba(16,185,129,0.3)]">
                            SECURE YOUR SWARM →
                        </Link>
                    </div>
                </section>

            </main>

            <footer className="bg-black border-t border-white/5 py-32 px-6 text-neutral-500">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <BrickWall className="w-8 h-8 text-emerald-500" />
                            <span className="text-white font-black text-3xl uppercase italic tracking-tighter">SupraWall</span>
                        </div>
                        <p className="max-w-sm text-lg font-bold leading-tight uppercase italic opacity-60">
                            The security standard for autonomous AI agents. Scaling the zero-trust future.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-8">Integrations</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
                            <li><Link href="/integrations/langchain" className="hover:text-emerald-500 transition-colors">LangChain</Link></li>
                            <li><Link href="/integrations/crewai" className="hover:text-emerald-500 transition-colors">CrewAI</Link></li>
                            <li><Link href="/integrations/autogen" className="hover:text-emerald-500 transition-colors">AutoGen</Link></li>
                            <li><Link href="/integrations/openclaw" className="hover:text-emerald-500 transition-colors">OpenClaw</Link></li>
                            <li><Link href="/integrations/vercel" className="hover:text-emerald-500 transition-colors">Vercel AI</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-8">Pillars</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
                            <li><Link href="/learn/what-is-agent-runtime-security" className="hover:text-emerald-500 transition-colors">What is ARS?</Link></li>
                            <li><Link href="/use-cases/prompt-injection" className="hover:text-emerald-500 transition-colors">Prompt Injection</Link></li>
                            <li><Link href="/vs/nemo-guardrails" className="hover:text-emerald-500 transition-colors">Vs NeMo</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-32 text-[10px] font-black uppercase tracking-[0.6em] text-center opacity-20">
                    © 2026 SUPRAWALL • SECURING THE AUTONOMOUS FUTURE.
                </div>
            </footer>
        </div>
    );
}
