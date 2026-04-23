// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Info, BarChart2, Code2, ShieldAlert, Activity, Filter, Layers, Cpu, Clock } from "lucide-react";

interface ComparisonRow {
    feature: string;
    suprawall: boolean | string;
    comp: boolean | string;
    note: string;
}

export default function NemoClient({ comparisonData }: { comparisonData: ComparisonRow[] }) {
    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <div className="text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 text-[10px] font-black text-rose-400 tracking-[0.2em] uppercase"
                >
                    Infrastructure Analysis
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] uppercase italic">
                    SupraWall vs <br />
                    <span className="text-neutral-500">NeMo Guardrails</span>
                </h1>
                <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-medium italic">
                    Comparing Sub-1ms Interception vs Conversational Guardrails.
                </p>
            </div>

            {/* Core Distinction Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-12 rounded-[3.5rem] bg-neutral-900 border border-white/5 space-y-8 relative overflow-hidden group hover:bg-neutral-800 transition-all duration-500">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Layers className="w-7 h-7 text-neutral-500" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic text-neutral-500 tracking-tighter">NeMo Guardrails</h3>
                        <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                            NVIDIA's framework for **Conversational Guardrails**. Excellent for controlling the *flow* and *relevance* of LLM chats. Ideal for chatbots where conversational integrity is paramount.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-neutral-600">
                        <li className="flex items-center gap-4"><Filter className="w-5 h-5 text-neutral-500" /> Colang Scripted Flows</li>
                        <li className="flex items-center gap-4"><Activity className="w-5 h-5 text-neutral-500" /> State Management</li>
                        <li className="flex items-center gap-4"><Cpu className="w-5 h-5 text-neutral-500" /> Model-Based Guarding</li>
                    </ul>
                </div>

                <div className="p-12 rounded-[3.5rem] bg-rose-600 border border-rose-500/20 space-y-8 relative overflow-hidden group hover:bg-rose-500 transition-all duration-500 shadow-2xl">
                    <div className="space-y-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Zap className="w-7 h-7 text-white fill-white" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic text-white flex items-center gap-4 tracking-tighter">
                            SupraWall
                        </h3>
                        <p className="text-lg text-white leading-relaxed font-black opacity-90 italic pr-6">
                           The **Action Interception Firewall**. Designed for sub-1ms execution. It focuses on the *behavior* of tools and side-effects in autonomous agent systems.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-white/70 relative z-10">
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Deterministic rules</li>
                        <li className="flex items-center gap-4"><Clock className="w-5 h-5 text-white" /> Sub-1ms Latency</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Edge-native logic</li>
                    </ul>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-12">
                 <div className="flex items-center gap-4 border-l-4 border-rose-600 pl-6 py-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Technical comparison</h2>
                </div>
                <div className="overflow-x-auto rounded-[3.5rem] border border-white/5 bg-neutral-900 shadow-2xl">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-10 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                <th className="p-10 font-black uppercase tracking-widest text-neutral-500 text-center">NeMo Guardrails</th>
                                <th className="p-10 font-black uppercase tracking-widest text-rose-500 text-center">SupraWall</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                    <td className="p-10 font-bold text-neutral-300 pr-20 uppercase tracking-tighter text-lg italic">{row.feature}</td>
                                    <td className="p-10 text-center">
                                         <span className="text-neutral-500 font-bold uppercase text-[12px] tracking-widest">{row.comp}</span>
                                    </td>
                                    <td className="p-10 text-center">
                                         <div className="flex flex-col items-center gap-4">
                                            {row.suprawall === true ? <div className="p-2 bg-rose-500/20 rounded-lg"><Check className="w-6 h-6 text-rose-400" /></div> : <span className="font-bold text-rose-400 uppercase text-[12px] tracking-widest italic">{row.suprawall}</span>}
                                            <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto">{row.note}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Graphic Mockup */}
            <div className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-rose-600 pl-6 py-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Latency Comparison</h2>
                </div>
                <div className="p-16 rounded-[4rem] bg-neutral-950 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-20 items-end">
                    <div className="space-y-6">
                         <div className="flex items-end gap-1">
                            {/* Bar chart mockup */}
                            <div className="w-[10px] h-[300px] bg-rose-900/50 rounded-t-full relative group">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap">~2000ms</div>
                            </div>
                            <div className="w-[10px] h-[250px] bg-rose-900/50 rounded-t-full relative">
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap">~1500ms</div>
                            </div>
                            <div className="w-[10px] h-[180px] bg-rose-900/50 rounded-t-full relative">
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap">~800ms</div>
                            </div>
                         </div>
                         <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">NVIDIA NeMo (Model-Based)</p>
                    </div>

                    <div className="space-y-6">
                         <div className="flex items-end gap-1">
                            <div className="w-[30px] h-[5px] bg-rose-500 rounded-t-full relative group shadow-[0_-10px_30px_rgba(244,63,94,0.3)]">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-400 uppercase tracking-widest whitespace-nowrap">&lt; 1ms</div>
                            </div>
                         </div>
                         <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">SupraWall Runtime</p>
                    </div>
                </div>
                <p className="text-neutral-500 text-center font-bold uppercase tracking-widest text-[10px]">P99 latency comparison. SupraWall's deterministic policy engine is 1000x faster than LLM-based guardrails.</p>
            </div>

            {/* Continuous Text for SEO */}
            <div className="prose prose-invert prose-rose max-w-none space-y-20 py-20 pb-40">
                <section className="space-y-10 border-t border-white/5 pt-20">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight">When to use SupraWall over NVIDIA NeMo Guardrails</h2>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        NVIDIA NeMo is an incredibly deep and sophisticated framework for scripted conversational systems. If your primary goal is to ensure your bot follows a specific "golden path" in a customer support conversation, NeMo and its **Colang** language provide unmatched control over dialogue structure. 
                    </p>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        However, the complexity of Colang and the associated latency—often requiring small language model calls to evaluate flows—makes it poorly suited for autonomous **Tools-First** agents. SupraWall was built for the 2026 agent economy: where models call millions of tools per minute and security decisions must happen in under a millisecond.
                    </p>
                </section>
                
                <section className="space-y-10">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight italic">Action Interception vs Conversational Safety</h2>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        The core difference is the **Interception Layer**. NeMo guardrails live at the conversational level; SupraWall lives at the **Execution Boundary**. Even if NeMo fails to categorize a malicious prompt, SupraWall's tool-level allowlist will still block the final execution. It is a defense-in-depth approach that doesn't care about the conversation—it only cares about the agent's side-effects.
                    </p>
                </section>
            </div>
        </div>
    );
}
