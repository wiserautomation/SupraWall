// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Info, BarChart2, Code2, Shield, Activity, DollarSign, Database, Globe } from "lucide-react";

interface ComparisonRow {
    feature: string;
    suprawall: boolean | string;
    comp: boolean | string;
    note: string;
}

export default function HeliconeClient({ comparisonData }: { comparisonData: ComparisonRow[] }) {
    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <div className="text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 text-[10px] font-black text-pink-400 tracking-[0.2em] uppercase"
                >
                    Infrastructure Analysis
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] uppercase italic">
                    SupraWall vs <br />
                    <span className="text-neutral-500">Helicone</span>
                </h1>
                <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-medium italic">
                    Comparing Proxy-Level Cost tracking vs SDK-Level Agent Budgets.
                </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-12 rounded-[3.5rem] bg-neutral-900 border border-white/5 space-y-8 relative overflow-hidden group hover:bg-neutral-800 transition-all duration-500">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <DollarSign className="w-7 h-7 text-neutral-500" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic text-neutral-500">Helicone</h3>
                        <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                            The industry standard for **LLM Observability**. Excellent at cost tracking, caching, and request/response logging via a smart proxy. Best for seeing your API bill.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-neutral-600">
                        <li className="flex items-center gap-4"><Info className="w-5 h-5 text-neutral-500" /> Proxy-Based Monitoring</li>
                        <li className="flex items-center gap-4"><Database className="w-5 h-5 text-neutral-500" /> Prompt Caching</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-neutral-500" /> Simple Integration</li>
                    </ul>
                </div>

                <div className="p-12 rounded-[3.5rem] bg-pink-600 border border-pink-500/20 space-y-8 relative overflow-hidden group hover:bg-pink-500 transition-all duration-500 shadow-2xl">
                    <div className="space-y-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic text-white flex items-center gap-4">
                            SupraWall
                        </h3>
                        <p className="text-lg text-white leading-relaxed font-black opacity-90">
                            The **Agentic Security Layer**. In addition to cost tracking, we provide runtime interception and deterministic policy enforcement for your agent's external actions.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-white/70 relative z-10">
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Decision Blocking</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Permission Guardrails</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Human approvals</li>
                    </ul>
                </div>
            </div>

            {/* Technical Breakdown Table */}
            <div className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-pink-600 pl-6 py-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Technical Breakdown</h2>
                </div>
                <div className="overflow-x-auto rounded-[3.5rem] border border-white/5 bg-neutral-900 shadow-2xl">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-10 font-black uppercase tracking-widest text-neutral-500">Policy Control</th>
                                <th className="p-10 font-black uppercase tracking-widest text-neutral-500 text-center">Helicone</th>
                                <th className="p-10 font-black uppercase tracking-widest text-pink-500 text-center">SupraWall</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                    <td className="p-10 font-bold text-neutral-300 pr-20">{row.feature}</td>
                                    <td className="p-10 text-center">
                                        {row.comp === true ? <Check className="w-6 h-6 text-neutral-500 mx-auto" /> : row.comp === false ? <X className="w-6 h-6 text-rose-900 mx-auto" /> : <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest">{row.comp}</span>}
                                    </td>
                                    <td className="p-10 text-center">
                                         <div className="flex flex-col items-center gap-4">
                                            {row.suprawall === true ? <div className="p-2 bg-pink-500/20 rounded-lg"><Check className="w-6 h-6 text-pink-400" /></div> : <span className="font-bold text-pink-400 uppercase text-[10px] tracking-widest">{row.suprawall}</span>}
                                            <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto">{row.note}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Continuous Text for SEO */}
            <div className="prose prose-invert prose-pink max-w-none space-y-20 py-20 pb-40">
                <section className="space-y-10 border-t border-white/5 pt-20">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight">Why proxies aren't enough for security</h2>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        Proxies like Helicone live in the "in-between." They see the request from the app and the model's response. This is perfect for seeing what an agent is *thinking* about doing. However, in an agentic workflow, the model's response is just instructions to a tool. The security risk happens downstream, when those instructions are executed against a database or filesystem.
                    </p>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        Because SupraWall lives in the SDK itself, we can intercept the tool call at the moment of execution, *after* the model has processed the request but *before* the damage occurs. Proxies are blind to these side-effects. 
                    </p>
                </section>
                
                <section className="space-y-10">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight">Hard budget caps for autonomous loops</h2>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        If an agent enters an infinite loop, Helicone will show you that cost is accelerating, but it won't stop the loop. SupraWall implements **Hard Budget Caps**. You can define a dollar limit for an agent profile (e.g. $5.00/session). The moment the agent reaches that limit, SupraWall blocks all subsequent actions, saving your budget automatically.
                    </p>
                </section>
            </div>
        </div>
    );
}
