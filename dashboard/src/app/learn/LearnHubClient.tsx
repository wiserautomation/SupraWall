"use client";

import { motion } from "framer-motion";
import { 
    Book, Search, ShieldCheck, ArrowRight, Zap, 
    ChevronRight, Info, LayoutDashboard, Globe,
    Cpu, History, Lock, FileText, Fingerprint
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

const LEARN_CATEGORIES = [
    {
        title: "Agent Runtime Security",
        articles: [
            { title: "What is Agent Runtime Security?", href: "/learn/what-is-agent-runtime-security", desc: "The deterministic framework for AI safety." },
            { title: "Zero-Trust for AI Agents", href: "/learn/zero-trust-ai-agents", desc: "Why agents should never trust their context." },
            { title: "Runtime AI Governance", href: "/learn/runtime-ai-governance", desc: "Controlling decision-making in real-time." },
            { title: "Deterministic vs Probabilistic", href: "/learn/deterministic-vs-probabilistic-ai-security", desc: "The limits of prompt-based safety." }
        ]
    },
    {
        title: "EU AI Act Compliance",
        articles: [
            { title: "AI Act Compliance for Agents", href: "/learn/eu-ai-act-compliance-ai-agents", desc: "A practical developer's checklist." },
            { title: "Article 12: Automatic Logging", href: "/learn/eu-ai-act-article-12-automatic-logging", desc: "Proof of monitoring requirements." },
            { title: "Article 14: Human Oversight", href: "/learn/eu-ai-act-article-14-human-oversight", desc: "Enforcing the &lsquo;Kill Switch&rsquo;." },
            { title: "High-Risk AI Systems", href: "/learn/eu-ai-act-high-risk-ai-assessment", desc: "When do agents become high-risk?" }
        ]
    },
    {
        title: "Best Practices",
        articles: [
            { title: "Governance Best Practices", href: "/learn/ai-agent-governance-best-practices", desc: "Building from prototype to production." },
            { title: "Risk Management Framework", href: "/learn/ai-agent-risk-management-framework", desc: "Quantifying agentic security threats." },
            { title: "Protecting API Keys", href: "/learn/protect-api-keys-from-ai-agents", desc: "The one-way secret injection pattern." },
            { title: "Setting Token Limits", href: "/learn/how-to-set-token-limits-ai-agents", desc: "Preventing infinite cost loops." }
        ]
    },
    {
        title: "Advanced Ecosystem",
        articles: [
            { title: "MCP Server Security", href: "/learn/mcp-server-security", desc: "Securing the Model Context Protocol." },
            { title: "Prompt Injection Thefts", href: "/learn/prompt-injection-credential-theft", desc: "How agents leak secrets to attackers." },
            { title: "What are Guardrails?", href: "/learn/what-are-ai-agent-guardrails", desc: "The differences between LLM and SDK safety." },
            { title: "Human in the Loop (HITL)", href: "/learn/human-in-the-loop-ai-agents", desc: "Orchestrating manual approvals." }
        ]
    }
];

export default function LearnHubClient() {
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none text-glow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/20 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>Learning Hub</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             The AI Agent <br />
                             <span className="text-emerald-500 font-bold italic underline decoration-white/10">Security Bible.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             Master the standard rules for the autonomous agent era. Research, tutorials, and regulatory compliance — all in one SDK-first center.
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 CATEGORIES SECTION */}
             <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    {LEARN_CATEGORIES.map((cat, i) => (
                        <div key={cat.title} className="space-y-12">
                            <div className="flex items-center gap-6">
                                <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white whitespace-nowrap">{cat.title}</h2>
                                <div className="h-px w-full bg-white/5" />
                                <span className="text-neutral-500 font-black italic uppercase text-[10px] tracking-widest whitespace-nowrap">{cat.articles.length} Guides</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {cat.articles.map((art, j) => (
                                    <Link 
                                        key={art.href} 
                                        href={art.href}
                                        className="p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/10 hover:border-emerald-500/30 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[280px]"
                                    >
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center gap-2 text-emerald-500/50 mb-2">
                                                <Book className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">{cat.title.split(' ')[0]}</span>
                                            </div>
                                            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none group-hover:text-emerald-400 transition-colors">{art.title}</h3>
                                            <p className="text-neutral-500 text-xs font-bold uppercase tracking-tight leading-relaxed italic">{art.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/20 font-black uppercase tracking-[0.2em] text-[10px] pt-6 group-hover:text-emerald-500 transition-all">
                                            Read Guide <ArrowRight className="w-3 h-3 translate-x-[-5px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 relative text-center">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                     <div className="p-8 rounded-full bg-white/5 border border-white/10 w-fit mx-auto animate-bounce italic font-black uppercase tracking-widest text-[10px] text-emerald-500">Become a Certifed Agent Sec Engineer</div>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        From Learning <br />
                        <span className="text-emerald-500 underline decoration-white/20 font-bold italic">To Securing.</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        Don&apos;t just read about the future — build it safely. Implement what you&apos;ve learned with the SupraWall SDK today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/login" className="px-16 py-8 bg-emerald-600 text-white font-black text-3xl rounded-2xl hover:bg-emerald-500 transition-all shadow-[0_0_100px_rgba(16,185,129,0.3)] tracking-tighter flex items-center gap-4 group">
                             Implement SDK Now <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
