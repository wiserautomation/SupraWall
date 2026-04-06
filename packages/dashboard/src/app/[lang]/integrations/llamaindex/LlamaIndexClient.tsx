// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Code2, Shield, Zap, Globe, Database, Terminal } from "lucide-react";

export default function LlamaIndexClient() {
    return (
        <div className="mt-40">
            {/* Interactive Console Mockup */}
            <div className="max-w-4xl mx-auto relative group">
                <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/[0.01]">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/30" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                            <div className="w-3 h-3 rounded-full bg-green-500/30" />
                        </div>
                        <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">llamaindex-governance.py</span>
                    </div>
                    <div className="p-10 space-y-8 font-mono text-sm leading-relaxed text-left">
                        <div className="space-y-2">
                            <p className="text-neutral-600"># 1. Initialize the security shim</p>
                            <p className="text-cyan-400">from suprawall.llamaindex import protect</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-neutral-600"># 2. Wrap your QueryEngine or ToolAgent</p>
                            <div className="text-neutral-300 p-6 bg-white/[0.05] border border-white/10 rounded-2xl">
                                <p><span className="text-cyan-400">agent</span> = OpenAIAgent.from_tools(tools)</p>
                                <p className="mt-2"><span className="text-cyan-400">secured_agent</span> = protect(agent)</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-neutral-600"># 3. Intercept every data retrieval and tool execution</p>
                            <p className="text-cyan-400">secured_agent.chat("query")</p>
                        </div>
                    </div>
                    {/* Decorative glow */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-1000" />
                </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((b, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/10 hover:border-cyan-500/30 transition-all group relative overflow-hidden text-left"
                    >
                        <b.icon className="w-8 h-8 text-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{b.title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors uppercase text-[10px] tracking-widest">{b.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const benefits = [
    { title: "Query Validation", desc: "Intercepts complex RAG queries before execution for sensitive data leaks.", icon: Database },
    { title: "Tool Isolation", desc: "Restricts LlamaIndex tools to pre-defined execution environments.", icon: Shield },
    { title: "Live Auditing", desc: "Real-time logging of document access and tool calls in the dashboard.", icon: Terminal },
    { title: "Budget Control", desc: "Cap token usage and tool execution costs across indices.", icon: Zap }
];
