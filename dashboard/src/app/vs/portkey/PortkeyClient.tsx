"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, Zap, Info, BarChart2 } from "lucide-react";

interface ComparisonRow {
    feature: string;
    suprawall: boolean | string;
    portkey: boolean | string;
    note: string;
}

export default function PortkeyClient({ comparisonData }: { comparisonData: ComparisonRow[] }) {
    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase"
                >
                    Infrastructure Analysis
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
                    SupraWall vs <br />
                    <span className="text-emerald-500 text-glow">Portkey.</span>
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                    Observability vs Enforcement. Choosing the right AI stack.
                </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8 group transition-all hover:bg-white/[0.04]">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase italic text-neutral-500">Portkey AI</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                            An enterprise-grade AI Gateway. Best in class for balancing latency, tracking costs, and unified observability across 100+ models.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm text-neutral-500 font-bold">
                        <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Best for: LLM Gateway & Ops</li>
                        <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Focus: Cost & Latency</li>
                        <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Strength: Unified API</li>
                    </ul>
                </div>

                <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                            SupraWall <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                        </h3>
                        <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                            The Agent Firewall. Sits inside the application runtime to intercept every tool call and prevent autonomous agents from going rogue.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm text-emerald-400 font-bold">
                        <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Best for: Autonomous Swarms</li>
                        <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Focus: Security Policy</li>
                        <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Strength: Deterministic Control</li>
                    </ul>
                </div>
            </div>

            {/* Technical Table */}
            <div className="space-y-8">
                <div className="flex items-center gap-3">
                    <BarChart2 className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">Technical Breakdown</h2>
                </div>
                <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.01]">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Portkey</th>
                                <th className="p-6 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                    <td className="p-6">
                                        {row.portkey === true ? <Check className="w-5 h-5 text-emerald-500" /> : row.portkey === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500 font-bold">{row.portkey}</span>}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            {row.suprawall === true || row.suprawall === "Native" ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />}
                                            <span className="font-bold text-emerald-500">{row.suprawall === "Native" ? "(Native)" : ""}</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-600 mt-2 font-medium">{row.note}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
