"use client";

import { motion } from "framer-motion";
import { 
    Key, DollarSign, ShieldCheck, EyeOff, FileText, Bug, 
    ArrowRight, Zap, Target, Lock, LayoutDashboard, Globe
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

const FEATURE_CARDS = [
    {
        id: "vault",
        title: "Credential Vault",
        desc: "Zero-knowledge secret injection for AI tools. Agents never see raw API keys or passwords — they only use authorized tokens.",
        icon: <Key className="w-8 h-8 text-emerald-400" />,
        href: "/features/vault",
        color: "emerald"
    },
    {
        id: "budget-limits",
        title: "Budget Limits",
        desc: "Hard caps on agent API spend. Prevent infinite loops and runaway costs with per-agent circuit breakers.",
        icon: <DollarSign className="w-8 h-8 text-amber-400" />,
        href: "/features/budget-limits",
        color: "amber"
    },
    {
        id: "policy-engine",
        title: "Policy Engine",
        desc: "Deterministic ALLOW/BLOCK rules for tool calls. Enforced outside the LLM context to prevent hallucinations and rogue actions.",
        icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
        href: "/features/policy-engine",
        color: "blue"
    },
    {
        id: "pii-shield",
        title: "PII Shield",
        desc: "Automatic outbound data scrubbing. Redact Names, Emails, SSNs, and custom patterns from tool payloads automatically.",
        icon: <EyeOff className="w-8 h-8 text-purple-400" />,
        href: "/features/pii-shield",
        color: "purple"
    },
    {
        id: "audit-trail",
        title: "Audit Trail",
        desc: "Immutable, signed logs of every action. One-click PDF evidence reports specifically for EU AI Act compliance.",
        icon: <FileText className="w-8 h-8 text-cyan-400" />,
        href: "/features/audit-trail",
        color: "cyan"
    },
    {
        id: "prompt-shield",
        title: "Prompt Shield",
        desc: "SDK-level injection protection. Enforce critical safety rules in binary code, where no indirect prompt injection can reach.",
        icon: <Bug className="w-8 h-8 text-rose-400" />,
        href: "/features/prompt-shield",
        color: "rose"
    }
];

export default function FeaturesClient() {
    return (
        <main className="overflow-hidden">
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/20 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>6 Core Pillars</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             Every Threat. <br />
                             <span className="text-emerald-500 font-bold italic underline decoration-white/10">One SDK Shield.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             Deterministic security for the agentic future. Explore the six core capabilities that make SupraWall the production standard for autonomous AI agents.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURE_CARDS.map((f, i) => (
                            <Link 
                                key={f.id} 
                                href={f.href}
                                className="group relative block p-10 rounded-[3rem] bg-neutral-900/40 border border-white/10 hover:border-emerald-500/30 transition-all overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity bg-${f.color}-500`} />
                                
                                <div className="relative z-10 space-y-8">
                                    <div className="p-4 rounded-2xl w-fit bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                                        {f.icon}
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">{f.title}</h3>
                                        <p className="text-neutral-500 text-sm font-bold uppercase tracking-tight leading-relaxed italic">{f.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-500 pt-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                        Exploration Guide <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

             {/* 🎯 THE GRAND SLAM CONVERGENCE */}
             <section className="py-40 px-6 bg-[#030303] border-y border-white/5">
                <div className="max-w-7xl mx-auto text-center space-y-24">
                    <div className="space-y-6">
                        <TagBadge>Convergence</TagBadge>
                        <h2 className="text-5xl md:text-[8rem] font-black italic tracking-tighter leading-[0.85] uppercase text-glow">
                             The One <br />
                             <span className="text-emerald-500 font-bold italic underline decoration-white/10">Deterministic Layer.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="p-12 rounded-[4rem] bg-neutral-900/20 border border-white/5 space-y-8 text-left group hover:border-blue-500/30 transition-all">
                             <div className="flex items-center gap-4">
                                 <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                                     <LayoutDashboard className="w-8 h-8" />
                                 </div>
                                 <h4 className="text-3xl font-black italic uppercase text-white">Consolidated Dashboard</h4>
                             </div>
                             <p className="text-neutral-500 text-lg leading-relaxed font-bold italic uppercase tracking-tighter">
                                 Manage all six pillars from one central command center. See your total blocked exfiltrations, tokens scrubbed, and budget saved across your entire fleet.
                             </p>
                             <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-500 font-black uppercase tracking-widest text-sm hover:text-blue-400 transition-colors">Go to Dashboard →</Link>
                         </div>
                         <div className="p-12 rounded-[4rem] bg-neutral-900/20 border border-white/5 space-y-8 text-left group hover:border-purple-500/30 transition-all">
                             <div className="flex items-center gap-4">
                                 <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
                                     <Globe className="w-8 h-8" />
                                 </div>
                                 <h4 className="text-3xl font-black italic uppercase text-white">Universal Integration</h4>
                             </div>
                             <p className="text-neutral-500 text-base leading-relaxed font-bold italic uppercase tracking-tighter">
                                 Whether you ship in LangChain, CrewAI, AutoGen, or Vercel AI, SupraWall works the same. One SDK to standardize security across your entire tech stack.
                             </p>
                             <Link href="/integrations" className="inline-flex items-center gap-2 text-purple-500 font-black uppercase tracking-widest text-sm hover:text-purple-400 transition-colors">See Frameworks →</Link>
                         </div>
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 bg-black relative text-center">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <TagBadge>Take Control</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                         Wait for Chaos <br />
                         <span className="text-emerald-500 underline decoration-white/20 font-bold italic">Or Build on Stone.</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                         Don&apos;t patch your security one tool at a time. Standardize your agentic architecture with the six pillars of SupraWall.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/login" className="px-16 py-8 bg-emerald-600 text-white font-black text-3xl rounded-3xl hover:bg-emerald-500 transition-all shadow-[0_0_100px_rgba(16,185,129,0.3)] tracking-tighter flex items-center gap-4 group">
                             Get Started for Free <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
