import { Navbar } from "@/components/Navbar";
import {
    ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2,
    Shield, BrickWall, Database, Terminal, Globe, Code2, AlertTriangle,
    Play, Users, Star, HelpCircle, Mail, DollarSign, ExternalLink,
    Zap, Server, Bot, Layers, Triangle, RefreshCw, Coins, FileText,
    LayoutDashboard, Cpu, Network
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { SwarmVisualization, TechTabs, ClawbotDemo, TagBadge, AnimatedBox } from "./HomeClient";

export const metadata: Metadata = {
    title: "SupraWall | The Deterministic Security Layer for AI Agents",
    description: "Zero-trust security for AI agents. Intercept every tool call, enforce hard policies, and generate EU AI Act-ready compliance reports — in one line of code.",
    keywords: ["agent security", "ai governance", "eu ai act compliance", "prompt injection prevention", "langchain security", "crewai monitoring", "agentic security"],
};

export default function LandingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "SupraWall",
        "url": "https://www.supra-wall.com",
        "description": "Deterministic security and EU AI Act compliance for autonomous AI agents.",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "featureList": [
            "Zero-Trust Tool Interception",
            "Deterministic Policy Engine",
            "EU AI Act Compliance Reporting",
            "Human-in-the-loop Protocol",
            "Infinite Loop Circuit Breaker"
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

                {/* 🚀 SECTION: HERO */}
                <section className="relative pt-48 pb-32 px-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-600/30 blur-[180px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                        <div className="animate-fade-in inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                            Now Integrated with Claude Cowork & Vercel AI
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-[110px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                Your AI Agent <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Will Go Rogue.</span> <br />
                                SupraWall <br />
                                <span className="underline decoration-emerald-800">Makes Sure It Can't.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                                Zero-trust security for AI agents. Intercept every tool call, enforce hard policies, and generate EU AI Act-ready compliance reports — in one line of code.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            <Link 
                                id="cta-start-free" 
                                href="/login" 
                                className="px-14 py-6 bg-white text-black font-black uppercase tracking-tighter text-2xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.1)] group flex items-center gap-3"
                            >
                                Start Free <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link 
                                id="cta-see-how" 
                                href="#how-it-works" 
                                className="px-14 py-6 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-2xl rounded-2xl hover:bg-white/5 transition-all"
                            >
                                See How It Works →
                            </Link>
                        </div>

                        <div className="pt-12 flex flex-col items-center gap-4">
                            <div className="flex -space-x-4 opacity-80">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center overflow-hidden`}>
                                        <Users className="w-6 h-6 text-neutral-500" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.3em]">
                                Trusted by AI engineers shipping <span className="text-white">LangChain, CrewAI, AutoGen, and Vercel AI</span> to production.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 🚨 PROBLEM BAR */}
                <section className="py-6 bg-rose-950/20 border-y border-rose-500/20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="flex items-center gap-4 text-rose-400">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest"><span className="text-white">$47M LOST</span> — Amazon Kiro agent deleted 847 instances</p>
                        </div>
                        <div className="flex items-center gap-4 text-rose-400">
                            <Shield className="w-5 h-5 flex-shrink-0 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest"><span className="text-white">94% FAILURE</span> — Prompt injections bypass system prompts</p>
                        </div>
                        <div className="flex items-center gap-4 text-rose-400">
                            <FileText className="w-5 h-5 flex-shrink-0 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest"><span className="text-white">EU AI ACT ART 9</span> — Requires documented human oversight</p>
                        </div>
                    </div>
                </section>

                {/* 🎯 CORE HOOK */}
                <section className="py-40 px-6 bg-black relative overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8">
                            <TagBadge>Governance vs Intent</TagBadge>
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase text-glow">
                                System prompts <br />
                                <span className="text-emerald-500">are not a</span> <br />
                                security layer.
                            </h2>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic">
                                You told your LLM <span className="text-white font-bold tracking-tight">"NEVER DROP TABLES"</span>. It listened perfectly — until the context window filled up, the model hallucinated, and it deleted your production database anyway.
                            </p>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic">
                                SupraWall sits between your agent and the real world. It intercepts every tool call deterministically, before it executes — no matter what the model thinks it should do.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-emerald-500/10 blur-[80px] rounded-full" />
                            <SwarmVisualization />
                        </div>
                    </div>
                </section>

                {/* ⚙️ HOW IT WORKS */}
                <section id="how-it-works" className="py-40 px-6 bg-[#030303] border-y border-white/5">
                    <div className="max-w-7xl mx-auto space-y-24">
                        <div className="text-center space-y-4">
                            <h3 className="text-5xl md:text-7xl font-black italic uppercase italic tracking-tighter">How SupraWall <span className="text-emerald-500">Secures</span> Your Swarm.</h3>
                            <p className="text-xl text-neutral-500 font-bold uppercase tracking-widest">A deterministic middleware for the agentic future.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { step: "01", title: "Intercept", desc: "Every tool call your agent fires is caught by SupraWall before it hits your database, API, or filesystem.", icon: <Network className="w-8 h-8" /> },
                                { step: "02", title: "Evaluate", desc: "Checks the payload against your hard-coded policy engine. ALLOW, BLOCK, or REQUIRE_APPROVAL — outside the LLM context.", icon: <Shield className="w-8 h-8" /> },
                                { step: "03", title: "Enforce", desc: "Blocked calls return a structured error back to your agent, forcing it to self-correct. You get a signed audit log.", icon: <Zap className="w-8 h-8" /> }
                            ].map((s, idx) => (
                                <div key={idx} className="p-12 rounded-[3.5rem] bg-neutral-900/40 border border-white/5 space-y-8 hover:border-emerald-500/30 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                                            {s.icon}
                                        </div>
                                        <span className="text-4xl font-black text-white/10 italic leading-none">{s.step}</span>
                                    </div>
                                    <h4 className="text-3xl font-black italic uppercase text-white">{s.title}</h4>
                                    <p className="text-neutral-500 font-bold leading-relaxed italic">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-20">
                            <TechTabs />
                        </div>
                    </div>
                </section>

                {/* 🛡️ FEATURES GRID */}
                <section className="py-40 px-6 bg-black">
                    <div className="max-w-7xl mx-auto space-y-20">
                        <div className="text-center space-y-4">
                            <TagBadge>Enterprise Protection</TagBadge>
                            <h3 className="text-5xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-none">The Full Stack <br />of Agentic Control.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "Zero-Trust Tool Interception", desc: "Intercepts every tool call before execution. Hard-coded regex rules, not LLM instructions. Works with LangChain & CrewAI.", icon: <Shield className="w-6 h-6" /> },
                                { title: "Hard Budget Caps", desc: "Set a $10/day limit per agent. When it hits the cap, SupraWall blocks further API executions deterministically.", icon: <Coins className="w-6 h-6" /> },
                                { title: "Infinite Loop Circuit Breaker", desc: "Detects repetitive failed tool calls and halts the agent before it burns thousands in tokens overnight.", icon: <RefreshCw className="w-6 h-6" /> },
                                { title: "Human-in-the-Loop Approvals", desc: "Route sensitive actions (sending emails, transactions, deletions) to a human approval queue before execution.", icon: <Users className="w-6 h-6" /> },
                                { title: "Compliance Report Export", desc: "Generate a one-click PDF 'Human Oversight Evidence Report' with audit logs built for EU AI Act auditors.", icon: <FileText className="w-6 h-6" /> },
                                { title: "EU AI Act Compliance Dashboard", desc: "Live status badges mapped to specific Articles (Art. 9, 13, 14). Know your compliance posture in real time.", icon: <LayoutDashboard className="w-6 h-6" /> }
                            ].map((f, i) => (
                                <div key={i} className="p-10 rounded-[3rem] bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 hover:border-emerald-500/20 transition-all group backdrop-blur-3xl min-h-[300px] flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                            {f.icon}
                                        </div>
                                        <h4 className="text-2xl font-black italic uppercase text-white leading-tight">{f.title}</h4>
                                        <p className="text-sm font-bold text-neutral-500 leading-relaxed uppercase tracking-tight">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 🧬 COMPATIBILITY STRIP */}
                <section className="py-20 border-y border-white/5 bg-[#020202]">
                    <div className="max-w-7xl mx-auto px-6 space-y-12">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] text-center italic">Works with every stack you already use</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10 items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                            {['Python', 'TypeScript', 'LangChain', 'CrewAI', 'AutoGen', 'Vercel AI', 'PostgreSQL', 'Docker'].map((tech) => (
                                <div key={tech} className="text-sm font-black text-white italic text-center uppercase tracking-widest">{tech}</div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ⚖️ COMPLIANCE SECTION */}
                <section className="py-40 px-6 bg-gradient-to-b from-black to-[#050505]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="h-[400px] rounded-[3rem] bg-[#0A0A0A] border-2 border-white/10 p-12 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FileText className="w-64 h-64" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-3 text-emerald-500">
                                        <Shield className="w-8 h-8" />
                                        <span className="font-black uppercase tracking-widest">H.O.E. Report v1.0</span>
                                    </div>
                                    <div className="h-px w-full bg-white/10" />
                                    <h5 className="text-3xl font-black italic uppercase leading-none">Human Oversight <br />Evidence Report</h5>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                            <span className="text-[10px] font-black uppercase text-green-500">Article 09 - Risk Mgmt</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <span className="text-[10px] font-black uppercase text-amber-500">Article 13 - Transparency</span>
                                            <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <span className="text-[10px] font-black uppercase text-blue-500">Article 14 - Oversight</span>
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8 order-1 lg:order-2">
                            <TagBadge>EU AI Act Compliance</TagBadge>
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase text-glow">
                                Stop dreading <br />
                                <span className="text-emerald-500 italic">the audit.</span>
                            </h2>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic">
                                SupraWall doesn't just protect your agents — it documents that protection in the format regulators expect. Every policy decision is signed, timestamped, and exportable.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    { art: "Art. 9", label: "Risk management system" },
                                    { art: "Art. 13", label: "Transparency and logging" },
                                    { art: "Art. 14", label: "Human oversight controls" }
                                ].map((a, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xl font-bold uppercase italic group">
                                        <span className="text-emerald-500 font-black group-hover:translate-x-1 transition-transform">{a.art} —</span>
                                        <span className="text-white">{a.label}</span>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6">
                                <Link href="/compliance" className="text-emerald-400 font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all">
                                    Export Compliance Report <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 💳 PRICING SECTION */}
                <section id="pricing" className="py-40 px-6 bg-black">
                    <div className="max-w-7xl mx-auto space-y-24">
                        <div className="text-center space-y-6">
                            <h3 className="text-5xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-none">Free to start. <br />Professional in <span className="text-emerald-500">scale.</span></h3>
                            <div className="inline-flex flex-col items-center">
                                <p className="text-2xl text-neutral-500 font-black italic uppercase tracking-tighter">Pay per interception. Never per agent.</p>
                                <div className="h-0.5 w-32 bg-emerald-500 mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Free", price: "0", ops: "10k", overage: "—", rules: "3", features: ["24h Retention", "Community Support"], icon: <Box className="w-6 h-6" />, btn: "ct-pricing-free" },
                                { name: "Builder", price: "29", ops: "100k", overage: "$0.40/1k", rules: "Unlimited", features: ["30 Day Retention", "Human-in-the-loop", "Webhooks"], icon: <Zap className="w-6 h-6" />, highlight: true, btn: "ct-pricing-builder" },
                                { name: "Scale", price: "99", ops: "1M", overage: "$0.20/1k", rules: "Unlimited", features: ["90 Day Retention", "Compliance Exports", "EU AI Act Dashboard"], icon: <Layers className="w-6 h-6" />, btn: "ct-pricing-scale" },
                                { name: "Enterprise", price: "399", ops: "10M", overage: "$0.08/1k", rules: "Custom", features: ["Custom Retention", "Self-hosting", "SSO / SLA", "Dedicated Support"], icon: <Globe className="w-6 h-6" />, btn: "ct-pricing-enterprise" }
                            ].map((tier, i) => (
                                <div key={i} className={`p-10 rounded-[3rem] border-2 transition-all relative flex flex-col justify-between ${tier.highlight ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_30px_60px_rgba(16,185,129,0.2)]' : 'bg-neutral-900/40 border-white/5 text-neutral-200'}`}>
                                    {tier.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>}
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-4 rounded-2xl ${tier.highlight ? 'bg-white/10' : 'bg-white/5'}`}>{tier.icon}</div>
                                            <h4 className="text-3xl font-black italic uppercase">{tier.name}</h4>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black tracking-tighter italic">${tier.price}</span>
                                                <span className={`text-sm font-bold uppercase ${tier.highlight ? 'text-white/60' : 'text-neutral-500'}`}>/mo</span>
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${tier.highlight ? 'text-white/80' : 'text-emerald-500'}`}>Includes {tier.ops} Ops</p>
                                        </div>

                                        <div className="h-px w-full bg-white/10" />

                                        <ul className="space-y-4">
                                            {tier.features.map((f, j) => (
                                                <li key={j} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider italic">
                                                    <CheckCircle2 className={`w-4 h-4 ${tier.highlight ? 'text-white' : 'text-emerald-500'}`} />
                                                    {f}
                                                </li>
                                            ))}
                                            <li className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider italic opacity-60">
                                                <Activity className="w-4 h-4" />
                                                Overage: {tier.overage}
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-10">
                                        <Link 
                                            id={tier.btn}
                                            href="/login" 
                                            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 ${tier.highlight ? 'bg-white text-black hover:bg-neutral-100 shadow-xl' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                                        >
                                            Get Started <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center max-w-2xl mx-auto space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 italic">
                             <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                                Every tool call your agent fires costs you a fraction of a cent. You only pay when SupraWall is actually protecting you.
                             </p>
                        </div>
                    </div>
                </section>

                {/* 🔚 FINAL CTA */}
                <section className="py-48 px-6 bg-black relative text-center">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                        <TagBadge>Join the Guardians</TagBadge>
                        <h2 className="text-7xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                            Is Your Agent <br />
                            <span className="text-emerald-500 underline decoration-white/20">SAFE?</span>
                        </h2>
                        <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                            Add SupraWall in the next 10 minutes. Forever free for indie developers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <Link href="/login" className="px-16 py-8 bg-emerald-600 text-white font-black text-3xl rounded-[2.5rem] hover:bg-emerald-500 transition-all shadow-[0_0_100px_rgba(16,185,129,0.3)] animate-bounce tracking-tighter flex items-center gap-4">
                                UNLOCK API KEY <ArrowRight className="w-10 h-10" />
                            </Link>
                            <Link href="/docs" className="text-white font-black uppercase tracking-[0.3em] text-sm hover:text-emerald-400 transition-colors underline decoration-white/10 underline-offset-8">
                                READ THE DOCS
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="bg-black border-t border-white/5 py-32 px-6 text-neutral-500">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-16">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-emerald-400" />
                            <span className="text-white font-black text-3xl uppercase italic tracking-tighter">SupraWall</span>
                        </div>
                        <p className="max-w-sm text-lg font-bold leading-tight uppercase italic opacity-60">
                            The security standard for autonomous AI agents. Scaling the zero-trust future with deterministic safety.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-8">Ecosystem</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
                            <li><Link href="/integrations/langchain" className="hover:text-emerald-500 transition-colors">LangChain</Link></li>
                            <li><Link href="/integrations/crewai" className="hover:text-emerald-500 transition-colors">CrewAI</Link></li>
                            <li><Link href="/integrations/autogen" className="hover:text-emerald-500 transition-colors">AutoGen</Link></li>
                            <li><Link href="/integrations/vercel" className="hover:text-emerald-500 transition-colors">Vercel AI</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-8">Pillars</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
                            <li><Link href="/compliance" className="hover:text-emerald-500 transition-colors">EU AI Act Dashboard</Link></li>
                            <li><Link href="/reports" className="hover:text-emerald-500 transition-colors">H.O.E. Exports</Link></li>
                            <li><Link href="/learn/what-is-agent-runtime-security" className="hover:text-emerald-500 transition-colors">Security Hub</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-32 flex flex-col items-center gap-4">
                    <div className="flex gap-4 opacity-30">
                        <Triangle className="w-5 h-5 fill-white" />
                        <Database className="w-5 h-5 fill-white" />
                        <Lock className="w-5 h-5 fill-white" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.6em] text-center opacity-20 italic">
                        © 2026 SUPRAWALL • SECURING THE AUTONOMOUS FUTURE • BUILT FOR AUDITORS.
                    </div>
                </div>
            </footer>
        </div>
    );
}
