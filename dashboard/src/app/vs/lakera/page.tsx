"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Check, X, Shield, Zap, Info, ArrowRight, BarChart2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function vsLakera() {
    const comparisonData = [
        { feature: "Runtime Interception", suprawall: true, lakera: false, note: "Lakera is primarily a proxy/firewall for LLM traffic, not tool calls." },
        { feature: "Action Blocking", suprawall: true, lakera: false, note: "SupraWall blocks the *side-effects* of tool use, Lakera blocks the *intent*." },
        { feature: "Agent Logic Context", suprawall: "Native", lakera: "Black Box", note: "SupraWall understands LangChain/CrewAI state; Lakera sees raw text." },
        { feature: "Privacy Shield", suprawall: true, lakera: true, note: "Both have robust PII redaction and enterprise security features." },
        { feature: "Prompt Injection", suprawall: "Behavioral", lakera: "Heuristic", note: "Lakera is a leader in prompt injection detection; SupraWall adds behavior validation." }
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
                            className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase"
                        >
                            Enterprise Security Comparison
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
                            SupraWall vs <br />
                            <span className="text-emerald-500 text-glow">Lakera.</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                            Protecting the LLM vs Protecting the Environment.
                        </p>
                    </div>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-3xl bg-white/[0.05] border border-white/5 space-y-8 group transition-all hover:bg-white/[0.04]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-neutral-500">Lakera</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                                    The gold standard for LLM firewalls. Excellent at stopping jailbreaks, PII leaks, and prompt injections at the gateway level.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-neutral-500 font-bold">
                                <li className="flex items-center gap-3"><AlertCircle className="w-4 h-4" /> Best for: Generative AI Gateways</li>
                                <li className="flex items-center gap-3"><AlertCircle className="w-4 h-4" /> Focus: Input/Output Security</li>
                                <li className="flex items-center gap-3"><AlertCircle className="w-4 h-4" /> Strengths: Threat Intelligence</li>
                            </ul>
                        </div>

                        <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                                    SupraWall <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                                </h3>
                                <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                                    The Agentic Security Layer. While Lakera watches what the agent *says*, SupraWall watches what the agent *is trying to do* with your tools.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-emerald-400 font-bold">
                                <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Best for: Autonomous Multi-Agent Swarms</li>
                                <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Focus: Deterministic Tool Control</li>
                                <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Strengths: Runtime Interception</li>
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
                                    <tr className="border-b border-white/5 bg-white/[0.05]">
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Lakera</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                            <td className="p-6">
                                                {row.lakera === true ? <Check className="w-5 h-5 text-emerald-500" /> : row.lakera === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500 font-bold">{row.lakera}</span>}
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

                    {/* Verdict Block */}
                    <div className="p-12 rounded-[40px] bg-neutral-900 border border-white/5 text-center space-y-6">
                        <h3 className="text-3xl font-black uppercase italic">Better Together</h3>
                        <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            Lakera and SupraWall are complementary. Use <strong className="text-white text-glow">Lakera Guard</strong> as your broad-spectrum linguistic shield, and <strong className="text-emerald-500">SupraWall</strong> as your surgical tool-level firewall. Combining them creates a complete defense-in-depth strategy.
                        </p>
                        <div className="pt-4 flex justify-center">
                            <Link href="/login" className="px-10 py-5 bg-white text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105">
                                Start Your Implementation
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Enterprise Agentic Security Audit • 2026
                </p>
            </footer>
        </div>
    );
}
