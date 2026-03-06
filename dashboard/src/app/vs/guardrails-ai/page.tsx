"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Check, X, Shield, Zap, Info, ArrowRight, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function vsGuardrailsAI() {
    const comparisonData = [
        { feature: "Runtime Interception", agentgate: true, guard: false, note: "Guardrails AI is mostly validation-focused (pre/post-llm)." },
        { feature: "Action Blocking", agentgate: true, guard: false, note: "AgentGate specifically blocks tool/env actions at runtime." },
        { feature: "Agent Frameworks", agentgate: "Native", guard: "Wrapper", note: "AgentGate has deep integration with LangChain/CrewAI logic." },
        { feature: "Managed Hub", agentgate: true, guard: true, note: "Both have a policy hub, but AgentGate focuses on live enforcement." },
        { feature: "Audit Rail", agentgate: "Action-Level", guard: "Content-Level", note: "AgentGate audits exactly what the agent *did* vs what it *said*." }
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
                            Competitor Analysis
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
                            AgentGate vs <br />
                            <span className="text-neutral-500">Guardrails AI</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                            Comparing Validation-First vs Action-First security for autonomous systems.
                        </p>
                    </div>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-8 group transition-all hover:bg-white/[0.04]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-neutral-500">Guardrails AI</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                                    Excellent for structured output validation (Pydantic models) and content filtering. Best for ensuring the LLM speaks correctly.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-neutral-500 font-bold">
                                <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Focus: Output Validation</li>
                                <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Best for: Data Pipelines</li>
                                <li className="flex items-center gap-3"><Info className="w-4 h-4" /> Method: Re-prompting</li>
                            </ul>
                        </div>

                        <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                                    AgentGate <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                                </h3>
                                <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                                    The Agent Runtime Firewall. Focuses on preventing the agent from causing real-world damage. Best for autonomous actors.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-emerald-400 font-bold">
                                <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Focus: Runtime Enforcement</li>
                                <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Best for: Autonomous Agents</li>
                                <li className="flex items-center gap-3"><Check className="w-4 h-4" /> Method: Interception/Blocking</li>
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
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Requirement</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Guardrails AI</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-emerald-500">AgentGate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                            <td className="p-6">
                                                {row.guard === true ? <Check className="w-5 h-5 text-emerald-500" /> : row.guard === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500 font-bold">{row.guard}</span>}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {row.agentgate === true || row.agentgate === "Native" ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />}
                                                    <span className="font-bold text-emerald-500">{row.agentgate === "Native" ? "(Native)" : ""}</span>
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
                        <h3 className="text-3xl font-black uppercase italic">Final Verdict</h3>
                        <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            If your goal is <strong className="text-white">Validation</strong> (making sure the LLM response is valid JSON), use Guardrails AI. If your goal is <strong className="text-white">Security</strong> (making sure the agent doesn't wipe your database or exfiltrate logs), use <strong className="text-emerald-500 italic">AgentGate</strong>.
                        </p>
                        <div className="pt-4 flex justify-center">
                            <Link href="/login" className="px-8 py-4 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-2xl">
                                Deploy AgentGate <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Action-Level Security Dashboard • 2026
                </p>
            </footer>
        </div>
    );
}
