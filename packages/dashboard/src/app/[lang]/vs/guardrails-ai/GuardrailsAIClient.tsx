// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Info, BarChart2, Code2, Globe, Box, ShieldCheck } from "lucide-react";

interface ComparisonRow {
    feature: string;
    suprawall: boolean | string;
    guard: boolean | string;
    note: string;
}

export default function GuardrailsAIClient({ comparisonData }: { comparisonData: ComparisonRow[] }) {
    return (
        <div className="space-y-20">
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
                    SupraWall vs <br />
                    <span className="text-neutral-500">Guardrails AI</span>
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                    Comparing Validation-First vs Action-First security for autonomous systems.
                </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-3xl bg-white/[0.05] border border-white/5 space-y-8 group transition-all hover:bg-white/[0.04]">
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
                            SupraWall <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
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
                            <tr className="border-b border-white/5 bg-white/[0.05]">
                                <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Requirement</th>
                                <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Guardrails AI</th>
                                <th className="p-6 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                                    <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                    <td className="p-6">
                                        {row.guard === true ? <Check className="w-5 h-5 text-emerald-500" /> : row.guard === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500 font-bold">{row.guard}</span>}
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
            {/* Code Comparison */}
            <div className="space-y-12">
                <div className="flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tight">Code Comparison</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-4">Guardrails AI (Validation Approach)</p>
                        <div className="p-8 rounded-[2.5rem] bg-neutral-900 border border-white/5 font-mono text-xs leading-relaxed overflow-x-auto h-[400px]">
                            <pre className="text-neutral-500">{`# 1. Define your guard instructions
rail_str = """
<rail version="0.1">
<output>
    <string 
        name="tool_call" 
        format="valid-tool-call" 
        on-fail-valid-tool-call="reask" 
    />
</output>
</rail>
"""

# 2. Initialize guard
guard = Guard.from_rail_string(rail_str)

# 3. Wrap LLM call
# Issues: Tool call is validated AFTER generation.
# If it fails, you must re-prompt.
# No native way to block the ACTUAL execution 
# without manual downstream checks.`}</pre>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-4">SupraWall (Runtime Interception)</p>
                        <div className="p-8 rounded-[2.5rem] bg-neutral-900 border border-emerald-500/10 font-mono text-xs leading-relaxed overflow-x-auto h-[400px]">
                            <pre className="text-emerald-400">{`# 1. Initialize the firewall
sw = SupraWall(api_key="sw_live_...")

# 2. Apply deterministic policies
sw.apply_policies([
    {"tool": "payment_*", "action": "DENY"},
    {"tool": "db_read", "action": "ALLOW"}
])

# 3. Deep-wrap the agent
# INTERCEPTS at the stack level.
# Blocks execution BEFORE compute starts.
# No re-prompting needed.
agent = sw.protect(langchain_agent)
agent.run("...")`}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verdict Section */}
            <div className="relative p-1 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-[3rem]">
                <div className="bg-black rounded-[2.8rem] p-16 space-y-10 text-center relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">The Verdict</h2>
                        <div className="max-w-2xl mx-auto space-y-8">
                            <p className="text-neutral-400 font-medium leading-relaxed italic text-lg">
                                Guardrails AI is a brilliant tool for **Output Validation**. If your goal is to ensure your LLM returns valid JSON or follows a specific schema for a data pipeline, it is the industry standard.
                            </p>
                            <p className="text-white font-black leading-relaxed text-2xl uppercase tracking-tight">
                                However, if you are building an <span className="text-emerald-500">Autonomous Agent</span> with access to tools, emails, or databases, SupraWall is essential.
                            </p>
                            <p className="text-neutral-400 font-medium leading-relaxed italic text-lg">
                                SupraWall operates at the **Action Layer**, not the **Language Layer**. It ensures that even if an agent is successfully prompted to do something malicious, the physical execution can never occur.
                            </p>
                        </div>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full" />
                </div>
            </div>

            {/* Content Expansion for SEO */}
            <div className="prose prose-invert prose-emerald max-w-none space-y-16 py-20">
                <section className="space-y-6">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-8">Why Action-Level Security Matters</h2>
                    <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                        The fundamental difference between SupraWall and traditional LLM guardrails lies in the placement of the security control. Most guardrails, including Guardrails AI, operate on the model's text output. They parse the text, look for violations, and potentially ask the model to try again (re-asking).
                    </p>
                    <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                        In an agentic workflow, the delta between "LLM Output" and "Execution" is where the most dangerous vulnerabilities live. An agent might decide to call a tool, generate the tool call arguments, and execute them in a matter of milliseconds. If your security layer is waiting for the full response to finish before validating, you are already too late.
                    </p>
                </section>
                
                <section className="space-y-6">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-8">Indirect Prompt Injection Resistance</h2>
                    <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                        One of the most insidious threats in 2026 is **Indirect Prompt Injection**. This occurs when an agent reads external data (like a website or a document) that contains hidden instructions. Because the agent believes these instructions are part of its legitimate task, it will bypass most text-based validators.
                    </p>
                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-10 space-y-4 my-12">
                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">The Security Gap</p>
                        <p className="text-neutral-300 font-medium italic">
                            "Text-based guardrails can be convinced to ignore their previous instructions. An execution boundary cannot be convinced to ignore its hard-coded policy."
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

const benefits = [
    { title: "Edge Native", desc: "Built for Vercel Edge Runtime and optimized for sub-1ms execution.", icon: Globe },
    { title: "Stream Guard", desc: "Real-time monitoring of AI SDK streams for emergent security threats.", icon: Zap },
    { title: "Type Safe", desc: "First-class support for TypeScript and the Vercel AI SDK 'tool' interface.", icon: Box },
    { title: "Cold Start Ready", desc: "Zero weight implementation that doesn't bloat your Lambda/Edge functions.", icon: ShieldCheck }
];
