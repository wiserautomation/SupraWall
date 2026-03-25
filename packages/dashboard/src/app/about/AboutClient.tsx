// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    Zap, Globe, ShieldCheck, ArrowRight, History, 
    Layers, Cpu, Fingerprint, Lock, Coffee, Search
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

export default function AboutClient() {
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-neutral-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>Our Mission</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             Standardize the <br />
                             <span className="text-neutral-500 font-bold italic underline decoration-white/10 uppercase italic font-bold">Autonomous Future.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             SupraWall was founded in 2024 with a single conviction: Prompts are not security. As the world moves from <span className="text-white italic">Chatbots</span> to <span className="text-white italic text-glow uppercase italic font-bold">Autonomous Agents</span>, the industry needed a deterministic, binary-level safety layer.
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 THE PHILOSOPHY SECTION */}
             <section className="py-24 px-6 md:px-0 bg-black border-y border-white/5 relative">
                <div className="max-w-6xl mx-auto space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                         <div className="flex flex-col justify-center space-y-10 group">
                             <TagBadge>The Deterministic Pillar</TagBadge>
                             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none group-hover:text-glow transition-all">
                                 Security, <br />
                                 <span className="text-neutral-500 font-bold italic underline decoration-white/10 italic">Not Advice.</span>
                             </h2>
                             <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-relaxed">
                                 The current standard for &ldquo;AI Safety&rdquo; is to ask the LLM to be safe. We believe this is fundametally flawed. In a production environment, security must be enforced outside the model&apos;s context window — where it can&apos;t be manipulated by indirect prompt injections or model drift. 
                             </p>
                             <div className="flex items-center gap-4 text-white/40 font-black uppercase tracking-widest text-xs italic">
                                 <Coffee className="w-5 h-5" /> Engineering-first Culture
                             </div>
                         </div>
                         <div className="flex items-center justify-center relative">
                             <div className="p-12 bg-neutral-900 border border-white/10 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all rotate-[-2deg] hover:rotate-0">
                                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] pointer-events-none" />
                                 <div className="space-y-10 relative z-10 text-center">
                                     <div className="p-5 bg-white/5 rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform"><Cpu className="w-10 h-10 text-neutral-400" /></div>
                                     <div className="space-y-4">
                                         <h4 className="text-center text-4xl font-black italic uppercase tracking-tighter italic">Founding Vision</h4>
                                         <p className="text-neutral-600 text-xs font-black italic uppercase tracking-widest leading-loose">To move agentic security into the binary runtime. To provide the world with the 1-line fixa for autonomous chaos. To ensure the agents we build today are the ones we control tomorrow.</p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

             {/* 🎯 CORE VALUES */}
             <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto space-y-24 text-center">
                    <div className="space-y-6">
                        <TagBadge>Institutional Standards</TagBadge>
                        <h2 className="text-5xl md:text-[6rem] font-black italic uppercase tracking-tighter leading-[0.8] text-glow">
                             Every Sector. <br />
                             <span className="text-neutral-500 font-bold italic underline decoration-white/10 italic">Every Agent.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Transparency", desc: "No magic. We publish our interception methods and encourage third-party security audits.", icon: <Search className="w-8 h-8 text-neutral-400" /> },
                            { title: "Sovereignty", desc: "Your agents, your rules. We provide the substrate, but you own the enforcement policy.", icon: <Lock className="w-8 h-8 text-neutral-400" /> },
                            { title: "Resilience", desc: "Our SDK is designed for mission-critical tasks in finance, legal, and healthcare.", icon: <ShieldCheck className="w-8 h-8 text-neutral-400" /> }
                        ].map((p, i) => (
                            <div key={p.title} className="p-12 rounded-[3.5rem] bg-neutral-900/40 border border-white/5 space-y-8 hover:border-white/20 transition-all group overflow-hidden relative text-left">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 w-fit group-hover:scale-110 transition-transform">{p.icon}</div>
                                <div className="space-y-4">
                                     <h4 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">{p.title}</h4>
                                     <p className="text-neutral-500 text-sm font-bold uppercase tracking-tight italic leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 bg-black relative text-center">
                <div className="absolute inset-0 bg-neutral-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <TagBadge>Join the Movement</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        Secure the <br />
                        <span className="text-neutral-500 underline decoration-white/20 font-bold italic">Uncontrolled.</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        We are building the trust layer for the agentic internet. Come build it with us.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/login" className="px-16 py-8 bg-neutral-800 text-white font-black text-3xl rounded-3xl hover:bg-neutral-700 transition-all shadow-[0_0_100px_rgba(255,255,255,0.05)] tracking-tighter flex items-center gap-4 group">
                             Get Started Now <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
