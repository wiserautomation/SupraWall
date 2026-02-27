"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Check, X, Shield, Zap, AlertTriangle, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function vsNemoGuardrails() {
    const comparisonData = [
        { feature: "Runtime Interception", supra: true, nemo: false, note: "NeMo is post-facto or proxy-based; SupraWall is native runtime." },
        { title: "Agent Framework Support", feature: "LangChain, CrewAI, AutoGen", supra: true, nemo: false, note: "NeMo lacks native agentic flow state tracking." },
        { feature: "One-Line Integration", supra: true, nemo: false, note: "NeMo requires YAML/Colang logic files; SupraWall is code-first." },
        { feature: "Managed Policy Engine", supra: true, nemo: "Self-hosted only", note: "SupraWall provides a cloud-native dashboard for policies." },
        { feature: "Tool Call Sandboxing", supra: true, nemo: false, note: "SupraWall inspects bash/python arguments before execution." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">

                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 text-[10px] font-black text-rose-400 tracking-[0.2em] uppercase"
                        >
                            Competitor Analysis
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
                            SupraWall vs <br />
                            <span className="text-neutral-500">NeMo Guardrails</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                            Why developers are switching from static policy proxies to dynamic Agent Runtime Security.
                        </p>
                    </div>

                    {/* Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {/* Comparison Card: NeMo */}
                        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <AlertTriangle className="w-32 h-32" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-neutral-500">NeMo Guardrails</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    A powerful, open-source framework by NVIDIA for adding programmable guardrails to LLM-based applications. Best for chat interfaces and content moderation.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-neutral-500">
                                    <X className="w-4 h-4 text-rose-900" /> Complex Colang syntax
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-500">
                                    <X className="w-4 h-4 text-rose-900" /> High latency (proxy mode)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-neutral-500">
                                    <X className="w-4 h-4 text-rose-900" /> No native agent state tracking
                                </li>
                            </ul>
                        </div>

                        {/* Comparison Card: SupraWall */}
                        <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Shield className="w-32 h-32 text-emerald-500" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                                    SupraWall <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                                </h3>
                                <p className="text-sm text-neutral-300 leading-relaxed">
                                    The Agent Runtime Firewall. Built specifically for autonomous agents that take actions. Installs as a native SDK wrapper with zero-latency policy enforcement.
                                </p>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
                                    <Check className="w-4 h-4" /> Native agent SDK support
                                </li>
                                <li className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
                                    <Check className="w-4 h-4" /> One-line decorator setup
                                </li>
                                <li className="flex items-center gap-3 text-sm text-emerald-400 font-bold">
                                    <Check className="w-4 h-4" /> Managed policy dashboard
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Technical Table */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-emerald-500" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">Technical Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.01]">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">NeMo Guardrails</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                            <td className="p-6">
                                                {row.nemo === true ? <Check className="w-5 h-5 text-emerald-500" /> : row.nemo === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500">{row.nemo}</span>}
                                            </td>
                                            <td className="p-6">
                                                {row.supra ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />}
                                                <p className="text-[10px] text-neutral-500 mt-2 font-medium">{row.note}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary / Verdict */}
                    <div className="p-10 rounded-3xl bg-neutral-900 border border-white/5 space-y-6">
                        <h3 className="text-2xl font-black uppercase italic">The Verdict</h3>
                        <p className="text-neutral-400 leading-relaxed font-medium">
                            NeMo Guardrails is excellent for research-driven content filtering on basic LLM chains. However, if you are building <strong className="text-white">autonomous agents</strong> (using LangChain, CrewAI, or AutoGen) that interact with production infrastructure, you need the visibility and enforcement provided only by <strong className="text-emerald-500">SupraWall</strong>.
                        </p>
                        <div className="pt-4 flex items-center gap-4">
                            <Link href="/login" className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Swap to SupraWall <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.5em]">
                    Enterprise-Grade Agent Security • 2026
                </p>
            </footer>
        </div>
    );
}
