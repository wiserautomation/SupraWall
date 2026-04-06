// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Globe, Shield, Zap, TrendingUp, CheckCircle2, FileText, Lock, Code, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "OpenRouter App Attribution Security | Rank Your Agent | SupraWall",
    description: "Automatically inject OpenRouter App Attribution headers into your agent requests. Get free analytics, rank on leaderboards, and secure your router-based agents.",
    keywords: ["openrouter attribution", "rank ai agents", "openrouter leaderboard", "secure openrouter agents", "ai agent analytics"],
    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/openrouter',
    },
};

export default function OpenRouterIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for OpenRouter",
        "applicationCategory": "SecurityApplication",
        "url": "https://www.supra-wall.com/integrations/openrouter",
        "author": { "@type": "Organization", "name": "SupraWall" },
        "description": "Deterministic security and automatic app attribution for AI agents using OpenRouter."
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden text-center">
                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="space-y-10">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase mx-auto">
                            LLM Routing • Attribution Enabled
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic text-glow">
                            Attributed & <br />
                            <span className="text-purple-500 text-7xl md:text-[10rem]">Protected.</span> <br />
                        </h1>

                        <div className="max-w-3xl mx-auto pt-10 text-center">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Stop making anonymous calls. SupraWall injects OpenRouter App Attribution headers 
                                automatically, giving you free rankings and analytics while securing your agent's tool calls.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-10">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-2xl">
                                Secure & Rank My Agent <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto prose prose-invert prose-purple text-left space-y-20">
                        <section>
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-10 border-b border-white/10 pb-4">
                                Zero-Code Leaderboard Entry
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed font-medium italic">
                                OpenRouter's dashboard ranks applications by token volume. Usually, this requires manually 
                                passing headers on every low-level fetch. SupraWall handles this at the gateway level. 
                                Set your app details once, and every tool call is automatically attributed.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {[
                                    { title: "App Rankings", desc: "Get listed on openrouter.ai/apps leaderboard.", icon: TrendingUp },
                                    { title: "Deterministic Safety", desc: "Block prompt injections before they reach the router.", icon: Shield },
                                    { title: "Unified Analytics", desc: "See your attribution stats inside OpenRouter.", icon: BarChart3 },
                                    { title: "Category Tagging", desc: "Tag your agent (cli, personal, researcher) automatically.", icon: FileText }
                                ].map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4 hover:border-purple-500/30 transition-all">
                                        <b.icon className="w-8 h-8 text-purple-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-purple-500/5 p-12 rounded-[3.5rem] border border-purple-500/20">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white mb-6 flex items-center gap-3">
                                <Code className="w-8 h-8 text-purple-400" /> One-Line Integration
                            </h2>
                            <p className="text-neutral-300 font-medium italic mb-8">
                                No matter what framework you use (LangChain, CrewAI, AutoGen), SupraWall abstracts the attribution layer.
                            </p>
                            <pre className="bg-black/80 p-6 rounded-2xl border border-white/10 overflow-x-auto">
                                <code className="text-purple-300 text-sm">
{`# Python SDK example
suprawall.init(
    api_key="ag_...",
    openrouter_attribution={
        "app_url": "https://myapp.com",
        "app_title": "My Secured Agent",
        "categories": "cli-agent"
    }
)`}
                                </code>
                            </pre>
                        </section>

                        <section className="space-y-10">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white text-center">
                                Why OpenRouter + SupraWall?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Automatic HTTP-Referer Injection",
                                    "X-Title header management",
                                    "Budget caps per routed model",
                                    "PII scrubbing on router tool results",
                                    "Deterministic Tool Call Interception"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-purple-600 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8 flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none text-center">
                            Govern Your <br />Router-Based Agents.
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                                Secure My App
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
