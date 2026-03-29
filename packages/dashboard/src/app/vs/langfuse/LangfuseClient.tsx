// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Info, BarChart2, Code2, ShieldAlert, Activity, Filter, Layers } from "lucide-react";

interface ComparisonRow {
    feature: string;
    suprawall: boolean | string;
    comp: boolean | string;
    note: string;
}

export default function LangfuseClient({ comparisonData }: { comparisonData: ComparisonRow[] }) {
    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <div className="text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase"
                >
                    Infrastructure Analysis
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] uppercase italic">
                    SupraWall vs <br />
                    <span className="text-neutral-500">Langfuse</span>
                </h1>
                <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-medium italic">
                    Why Observability (Tracing) is not the same as Security (Enforcement).
                </p>
            </div>

            {/* Core Distinction Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-12 rounded-[3.5rem] bg-neutral-900 border border-white/5 space-y-8 relative overflow-hidden group hover:bg-neutral-800 transition-all duration-500">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Activity className="w-7 h-7 text-neutral-500" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic text-neutral-500">Langfuse</h3>
                        <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                            Focuses on **Observability**. It tells you exactly what happened, how much it cost, and how users rated it. Essential for optimizing your model performance.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-neutral-600">
                        <li className="flex items-center gap-4"><Filter className="w-5 h-5 text-neutral-500" /> Post-hoc Tracing</li>
                        <li className="flex items-center gap-4"><BarChart2 className="w-5 h-5 text-neutral-500" /> Token Analytics</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-neutral-500" /> Evals & Feedback</li>
                    </ul>
                </div>

                <div className="p-12 rounded-[3.5rem] bg-blue-600 border border-blue-500/20 space-y-8 relative overflow-hidden group hover:bg-blue-500 transition-all duration-500 shadow-2xl">
                    <div className="space-y-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Zap className="w-7 h-7 text-white fill-white" />
                        </div>
                        <h3 className="text-3xl font-black uppercase italic text-white flex items-center gap-4">
                            SupraWall
                        </h3>
                        <p className="text-lg text-white leading-relaxed font-black opacity-90">
                            The **Runtime Firewall**. It prevents unauthorized actions before they occur. Essential for ensuring your autonomous agent doesn't overspend or exfiltrate data.
                        </p>
                    </div>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-white/70 relative z-10">
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Real-time Blocking</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Tool Permissions</li>
                        <li className="flex items-center gap-4"><Check className="w-5 h-5 text-white" /> Human approvals</li>
                    </ul>
                </div>
            </div>

            {/* Technical Breakdown Table */}
            <div className="space-y-12">
                <div className="flex items-center gap-4 border-l-4 border-blue-600 pl-6 py-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Technical Breakdown</h2>
                </div>
                <div className="overflow-x-auto rounded-[3.5rem] border border-white/5 bg-neutral-900 shadow-2xl">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-10 font-black uppercase tracking-widest text-neutral-500">Capability</th>
                                <th className="p-10 font-black uppercase tracking-widest text-neutral-500 text-center">Langfuse</th>
                                <th className="p-10 font-black uppercase tracking-widest text-blue-500 text-center">SupraWall</th>
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
                                            {row.suprawall === true ? <div className="p-2 bg-blue-500/20 rounded-lg"><Check className="w-6 h-6 text-blue-400" /></div> : <span className="font-bold text-blue-400 uppercase text-[10px] tracking-widest">{row.suprawall}</span>}
                                            <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto">{row.note}</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Code Interception Section */}
            <div className="space-y-12 py-20">
                <div className="flex items-center gap-4 border-l-4 border-blue-600 pl-6 py-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tight">Interception Architecture</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Langfuse tracks the **Payload**. It sees what the agent says and what results return from the tool call. This is retrospective visibility.
                        </p>
                        <div className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 font-mono text-xs text-neutral-500 h-[300px] overflow-hidden group">
                           <pre className="group-hover:-translate-y-8 transition-transform duration-1000">{`# Langfuse Tracking (Observability)
# Shows what already happened
trace = langfuse.trace(name="agent_call")

# Tool execution happens
# If malicious, damage is done
result = tool.execute(args)

# Post-execution trace
trace.update(output=result)`}</pre>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-neutral-300 text-lg leading-relaxed font-black transition-colors group-hover:text-blue-400 italic">
                            SupraWall interceptors block the **Side-Effect**. We evaluate the tool call *before* it leaves the SDK, preventing damage from taking place.
                        </p>
                         <div className="p-10 rounded-[2.5rem] bg-neutral-900 border border-blue-500/30 font-mono text-xs text-blue-400 h-[300px] overflow-hidden group">
                           <pre className="group-hover:-translate-y-8 transition-transform duration-1000">{`# SupraWall Interceptor (Security)
# Prevents damage before execution
sw = SupraWall(api_key="sw_live_...")

# INTERCEPTS call BEFORE tool execution
# MATCH 'payment.refund' -> DENY
# Action is BLOCKED at the boundary
secured_agent = sw.protect(agent)
secured_agent.invoke({"input": "..."})`}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Verdict Section */}
            <div className="p-16 rounded-[4rem] bg-neutral-900 border border-white/5 text-center relative overflow-hidden group">
                <div className="relative z-10 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">The Verdict</h2>
                        <div className="max-w-2xl mx-auto space-y-8">
                            <p className="text-neutral-400 font-medium italic text-xl">
                                If you are developing and testing your first models, use **Langfuse**. If you are deploying autonomous agents to users, you need **SupraWall**.
                            </p>
                            <p className="text-white font-black uppercase tracking-tight text-3xl leading-none italic group-hover:text-blue-400 transition-colors">
                                Visibility detects theft.<br />
                                Enforcement prevents it.
                            </p>
                        </div>
                    </div>
                    <div>
                         <a href="/beta" className="inline-flex px-12 py-5 bg-blue-600 text-black font-black uppercase tracking-widest rounded-3xl hover:bg-blue-500 transition-all text-sm group-hover:scale-110 duration-500">
                             Secure Your Agent <Zap className="ml-2 w-4 h-4 fill-black" />
                         </a>
                    </div>
                </div>
                 {/* Decorative glow */}
                 <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full group-hover:bg-blue-600/10 transition-all duration-1000" />
            </div>

            {/* Continuous Text for SEO */}
            <div className="prose prose-invert prose-blue max-w-none space-y-20 py-20 pb-40">
                <section className="space-y-10 border-t border-white/5 pt-20">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight">Observability vs security: The gap in agent workflows</h2>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        The distinction between tracing and security was clear in traditional web apps (Sentry vs WAF). In the world of AI Agents, these roles are often blurred, but the risks are exponentially higher. An agent with a Langfuse trace is essentially an attacker with a flight recorder—you can see exactly how they stole your data, but you couldn't stop them. 
                    </p>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        SupraWall implements the first dedicated **Security Boundary** for agentic systems. Using deep SDK-level interception, we provide deterministic control over which agents can access which tools. This is more than observability; it is Governance as Code.
                    </p>
                </section>
                
                <section className="space-y-10">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight">EU AI Act compliance: Tracing isn't enough</h2>
                    <p className="text-neutral-400 text-xl leading-relaxed font-medium">
                        Under **Article 14 of the EU AI Act (August 2026 enforcement)**, high-risk AI systems must have "meaningful human oversight." Observability platforms like Langfuse provide transparency, but SupraWall provides the actual oversight mechanism—deterministic approval queues that pause an agent until a human grants permission.
                    </p>
                </section>
            </div>
        </div>
    );
}
