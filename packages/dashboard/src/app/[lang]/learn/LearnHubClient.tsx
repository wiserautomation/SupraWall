// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    Book, Search, ShieldCheck, ArrowRight, Zap, 
    ChevronRight, Info, LayoutDashboard, Globe,
    Cpu, History, Lock, FileText, Fingerprint
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/app/HomeClient";

const LEARN_CATEGORIES = [
    {
        title: "Security Fundamentals",
        articles: [
            { title: "What is Agent Runtime Security?", href: "/learn/what-is-agent-runtime-security", desc: "The deterministic framework for AI safety." },
            { title: "Zero-Trust for AI Agents", href: "/learn/zero-trust-ai-agents", desc: "Why agents should never trust their context." },
            { title: "Runtime AI Governance", href: "/learn/runtime-ai-governance", desc: "Controlling decision-making in real-time." },
            { title: "AI Agent Security Bible", href: "/learn/ai-agent-security-best-practices", desc: "The core principles of agentic safety." }
        ]
    },
    {
        title: "EU AI Act & Compliance",
        articles: [
            { title: "AI Act Compliance Guide", href: "/learn/eu-ai-act-compliance-ai-agents", desc: "A practical developer's checklist." },
            { title: "Article 12: Audit Logging", href: "/learn/eu-ai-act-article-12-automatic-logging", desc: "Proof of monitoring requirements." },
            { title: "Article 14: Human Oversight", href: "/learn/eu-ai-act-article-14-human-oversight", desc: "Enforcing the 'Kill Switch'." },
            { title: "August 2026 Deadline", href: "/learn/eu-ai-act-august-2026-deadline", desc: "Timeline for high-risk AI enforcement." }
        ]
    },
    {
        title: "Threats & Attacks",
        articles: [
            { title: "Prompt Injection Control", href: "/learn/prompt-injection-credential-theft", desc: "How agents leak secrets to attackers." },
            { title: "Credential Theft Shield", href: "/learn/ai-agent-vault-secrets-management", desc: "Preventing tool call exfiltration." },
            { title: "Tool Call Hijacking", href: "/learn/protect-api-keys-from-ai-agents", desc: "Hardening the identity handshake." },
            { title: "Infinite Loop Defense", href: "/learn/ai-agent-infinite-loop-detection", desc: "Stopping runaway compute cycles." }
        ]
    },
    {
        title: "Cost & Operations",
        articles: [
            { title: "Runaway Cost Prevention", href: "/learn/ai-agent-runaway-costs", desc: "Setting hard budgetary circuit breakers." },
            { title: "Setting Token Limits", href: "/learn/how-to-set-token-limits-ai-agents", desc: "Resource allocation for autonomous swarms." },
            { title: "Agentic Cost Management", href: "/learn/ai-agent-risk-management-framework", desc: "Financial governance for agent fleets." },
            { title: "Usage Scaling Guide", href: "/learn/high-risk-ai-assessment", desc: "Scaling safely without unbounded liability." }
        ]
    },
    {
        title: "Integration Guides",
        articles: [
            { title: "MCP Server Security", href: "/learn/mcp-server-security", desc: "Securing the Model Context Protocol." },
            { title: "LangChain Security Wrap", href: "/learn/eu-ai-act-langchain", desc: "Middleware for Python and TS agents." },
            { title: "CrewAI Governance", href: "/learn/human-in-the-loop-ai-agents", desc: "Orchestrating manual task-level approvals." },
            { title: "What are Guardrails?", href: "/learn/what-are-ai-agent-guardrails", desc: "LLM safety vs. SDK-level enforcement." }
        ]
    },
    {
        title: "Glossary & Docs",
        articles: [
            { title: "Security Glossary", href: "/learn/ai-agent-security-glossary", desc: "Key terms for AI security engineers." },
            { title: "Risk Management", href: "/learn/ai-agent-risk-management-framework", desc: "Quantifying agentic security threats." },
            { title: "Vault Architecture", href: "/learn/ai-agent-vault-secrets-management", desc: "Zero-trust credential injection." },
            { title: "Audit Trail API", href: "/learn/ai-agent-audit-trail-logging", desc: "Programmatic compliance retrieval." }
        ]
    }
];

import { Locale } from "@/i18n/config";

export default function LearnHubClient({ lang = 'en', dictionary }: { lang?: Locale, dictionary: any }) {
    const t = dictionary.learn;
    const prefix = (path: string) => `/${lang}${path}`;
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none text-glow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/20 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>{t.hero.badge}</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             {t.hero.title} <br />
                             <span className="text-emerald-500 font-bold italic underline decoration-white/10">{t.hero.subtitle}.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             {t.hero.description}
                        </p>
                    </div>

                    {/* Featured Article - 'Start Here' */}
                    <Link href={prefix("/learn/what-is-agent-runtime-security")} className="group w-full max-w-4xl p-12 rounded-[3.5rem] bg-gradient-to-br from-neutral-900 to-black border-2 border-white/5 hover:border-emerald-500/30 transition-all text-left relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                         <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
                             <ShieldCheck className="w-64 h-64" />
                         </div>
                         <div className="flex-1 space-y-4 relative z-10">
                             <div className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] italic">
                                 <Zap className="w-3 h-3" /> {t.hero.featured.badge}
                             </div>
                             <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">{t.hero.featured.title}</h2>
                             <p className="text-neutral-500 font-bold uppercase tracking-tight italic">{t.hero.featured.desc}</p>
                         </div>
                         <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                             <ArrowRight className="w-8 h-8" />
                         </div>
                    </Link>
                </div>
            </section>

             {/* 🎯 CATEGORIES SECTION */}
             <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    {t.categories.map((cat: any, i: number) => (
                        <div key={cat.title} className="space-y-12">
                            <div className="flex items-center gap-6">
                                <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white whitespace-nowrap">{cat.title}</h2>
                                <div className="h-px w-full bg-white/5" />
                                <span className="text-neutral-500 font-black italic uppercase text-[10px] tracking-widest whitespace-nowrap">{cat.articles.length} {t.guidesSuffix}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {cat.articles.map((art: any, j: number) => (
                                    <Link 
                                        key={j} 
                                        href={prefix(`/learn/${art.title.toLowerCase().replace(/ /g, '-')}`)}
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
                                            {t.readGuide} <ArrowRight className="w-3 h-3 translate-x-[-5px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Browse by Regulation / Framework Rows */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-12 rounded-[3rem] bg-neutral-900/20 border border-white/5 space-y-8">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">{t.browseByRegulation}</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: "EU AI Act", href: prefix("/eu-ai-act") },
                                    { name: "GDPR", href: prefix("/gdpr") },
                                    { name: "HIPAA", href: prefix("/learn/healthcare-ai-governance") },
                                    { name: "Article 12", href: prefix("/learn/eu-ai-act-article-12-automatic-logging") }
                                ].map(r => (
                                    <Link key={r.name} href={r.href} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">{r.name}</Link>
                                ))}
                            </div>
                        </div>
                        <div className="p-12 rounded-[3rem] bg-neutral-900/20 border border-white/5 space-y-8">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">{t.browseByFramework}</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { name: "LangChain", href: prefix("/integrations/langchain") },
                                    { name: "CrewAI", href: prefix("/integrations/crewai") },
                                    { name: "Vercel AI SDK", href: prefix("/integrations/vercel") },
                                    { name: "AutoGen", href: prefix("/integrations/autogen") }
                                ].map(f => (
                                    <Link key={f.name} href={f.href} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">{f.name}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 relative text-center">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                     <div className="p-8 rounded-full bg-white/5 border border-white/10 w-fit mx-auto animate-bounce italic font-black uppercase tracking-widest text-[10px] text-emerald-500">{t.footer.badge}</div>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        {t.footer.title} <br />
                        <span className="text-emerald-500 underline decoration-white/20 font-bold italic">{t.footer.emphasis}</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        {t.footer.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href={prefix("/beta")} className="px-16 py-8 bg-emerald-600 text-white font-black text-3xl rounded-2xl hover:bg-emerald-500 transition-all shadow-[0_0_100px_rgba(16,185,129,0.3)] tracking-tighter flex items-center gap-4 group">
                             {t.footer.cta} <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
