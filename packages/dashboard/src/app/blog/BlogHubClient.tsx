// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Newspaper, ArrowRight, Zap, History, FileText, Globe
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

const BLOG_ARTICLES = [
    {
        title: "The State of AI Agent Security 2026",
        href: "/blog/state-of-ai-agent-security-2026",
        desc: "An annual report on the evolving threat landscape of autonomous agentic systems.",
        date: "March 2026",
        category: "Research"
    },
    {
        title: "Agent-to-Agent Commerce & The EU AI Act",
        href: "/blog/agent-to-agent-commerce-eu-ai-act",
        desc: "The regulatory boundary for machine-to-machine financial transactions.",
        date: "Feb 28, 2026",
        category: "Compliance"
    },
    {
        title: "Agentic AI Security Checklist 2026",
        href: "/blog/agentic-ai-security-checklist-2026",
        desc: "A developer's checklist for shipping secure autonomous agents to production.",
        date: "Feb 15, 2026",
        category: "Engineering"
    },
    {
        title: "Build vs Buy for Agent Security",
        href: "/blog/build-vs-buy-ai-agent-security",
        desc: "Why building custom security layers is the biggest risk to your roadmap.",
        date: "Feb 05, 2026",
        category: "Product"
    },
    {
        title: "Preventing Agent Infinite Cost Loops",
        href: "/blog/prevent-agent-infinite-loops",
        desc: "Technical deep-dive on circuit breakers for autonomous tool usage.",
        date: "Jan 20, 2026",
        category: "Engineering"
    },
    {
        title: "AI Gateway vs. Compliance Layer",
        href: "/blog/ai-gateway-vs-compliance-layer",
        desc: "The fundamental difference between monitoring traffic and enforcing safety.",
        date: "Jan 10, 2026",
        category: "Architecture"
    }
];

export default function BlogHubClient() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredArticles = activeFilter === "All" 
        ? BLOG_ARTICLES 
        : BLOG_ARTICLES.filter(a => a.category === activeFilter);

    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-rose-500/20 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10">
                    <TagBadge>Latest from SupraWall</TagBadge>
                    <h1 className="text-6xl md:text-[80px] font-black tracking-tighter text-white leading-none uppercase italic text-glow">
                        Security. Research. <br />
                        <span className="text-rose-500 font-bold italic underline decoration-white/10">The Agent Era.</span>
                    </h1>
                </div>
            </section>

             {/* 🎯 TABS & GRID */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 p-2 bg-neutral-900 border border-white/10 rounded-3xl w-fit">
                            {["All", "Research", "Compliance", "Threats", "Engineering"].map(f => (
                                <button 
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-rose-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Article List */}
                        <div className="grid grid-cols-1 gap-12">
                            {filteredArticles.map((art, i) => (
                                <Link 
                                    key={art.href} 
                                    href={art.href}
                                    className="group flex flex-col md:flex-row gap-10 md:items-center p-8 rounded-[3rem] bg-neutral-900/20 border border-white/5 hover:border-rose-500/30 transition-all hover:bg-neutral-900/40 translate-y-0 hover:translate-y-[-5px]"
                                >
                                    <div className="w-full md:w-1/3 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest bg-rose-500/10 px-3 py-1.5 rounded-full">{art.category}</span>
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{art.date}</span>
                                        </div>
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none group-hover:text-rose-400 transition-colors">{art.title}</h3>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <p className="text-neutral-500 text-lg font-bold uppercase italic tracking-tighter leading-snug">{art.desc}</p>
                                        <div className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                            Full Investigation <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Trending */}
                    <aside className="w-full lg:w-80 space-y-12">
                        <div className="p-8 rounded-[3rem] bg-neutral-900/40 border border-white/5 space-y-8 sticky top-32">
                            <div className="flex items-center gap-2 text-rose-500 font-black uppercase tracking-widest text-[10px]">
                                <Zap className="w-4 h-4" /> Trending Now
                            </div>
                            <div className="space-y-6">
                                {[
                                    { title: "What is ARS?", href: "/learn/what-is-agent-runtime-security" },
                                    { title: "Article 12 Guide", href: "/learn/eu-ai-act-article-12-automatic-logging" },
                                    { title: "HITL Evidence", href: "/features/audit-trail" }
                                ].map((t, i) => (
                                    <Link key={i} href={t.href} className="block group">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl font-black italic text-white/5 group-hover:text-rose-500 transition-colors">0{i+1}</span>
                                            <p className="text-sm font-black italic uppercase text-white group-hover:text-rose-400 transition-colors tracking-tight leading-none">{t.title}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

             {/* 🎯 NEWSLETTER CTA */}
             <section className="py-40 px-6 bg-black relative text-center">
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <div className="p-8 rounded-[4rem] bg-rose-500/5 border border-rose-500/20 space-y-10 group">
                        <TagBadge>Engineering Report</TagBadge>
                        <h2 className="text-6xl font-black italic uppercase leading-[0.85] tracking-tighter">
                            Get the <span className="text-rose-500 underline decoration-white/10 font-bold italic">Agentic Security</span> <br />
                            Weekly.
                        </h2>
                        <form className="max-w-md mx-auto flex gap-4 p-2 bg-neutral-900 border border-white/10 rounded-[2rem] focus-within:border-rose-500 transition-all">
                             <input type="email" placeholder="YOUR EMAIL..." className="bg-transparent text-white px-6 py-4 w-full outline-none font-black uppercase tracking-widest placeholder:text-neutral-700 text-xs" />
                             <button className="px-8 py-4 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-rose-500 transition-all">JOIN</button>
                        </form>
                        <p className="text-xs text-neutral-600 font-black uppercase tracking-widest">NO SPAM. JUST RESEARCH. 100% SUPRAWALL.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
