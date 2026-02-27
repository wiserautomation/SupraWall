"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Bot, Shield, Zap, Terminal, Code2, Layers, Cpu } from "lucide-react";
import Link from "next/link";

export default function AutoGenIntegrationPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-6 space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase"
                        >
                            Orchestration • Microsoft AutoGen
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
                            >
                                Govern the <br />
                                <span className="text-purple-500">Autonomous</span> <br />
                                Loop.
                            </motion.h1>
                            <p className="text-xl text-neutral-400 leading-relaxed font-medium max-w-lg">
                                Stop agents from falling into infinite loops or approving dangerous file writes. SupraWall for <span className="text-white">Microsoft AutoGen</span>.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <Link href="/login" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 shadow-[0_10px_40px_rgba(147,51,234,0.1)] transition-all active:scale-95 flex items-center gap-2">
                                Secure your Agents <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/docs/frameworks/autogen" className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors border-b-2 border-transparent hover:border-purple-500 pb-1">
                                Integration Guide
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative">
                        {/* Interactive Console Mockup */}
                        <div className="bg-[#0A0A0A] border-2 border-white/[0.05] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.05] bg-white/[0.01]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/30" />
                                </div>
                                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">autogen_safety.py</span>
                            </div>
                            <div className="p-10 space-y-8 font-mono text-sm leading-relaxed">
                                <div className="space-y-2">
                                    <p className="text-neutral-600"># 1. Import the universal decorator</p>
                                    <p className="text-purple-400">from suprawall import secure</p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-neutral-600"># 2. Protect individual agents or swarms</p>
                                    <div className="text-neutral-300 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                        <p className="text-purple-400">@secure(api_key="ag_...")</p>
                                        <p><span className="text-purple-400">def</span> create_assistant():</p>
                                        <p className="pl-4 mt-2">return AssistantAgent(</p>
                                        <p className="pl-8 text-neutral-400">name="coder",</p>
                                        <p className="pl-8 text-neutral-400">llm_config=config</p>
                                        <p className="pl-4">)</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-neutral-600"># 3. Malicious code is blocked at runtime</p>
                                    <p className="text-red-400/80"># Agent tried: subprocess.run(["rm", "-rf", "/"])</p>
                                    <p className="text-red-400 italic">!! SupraWall: File Access Violation (Action Blocked)</p>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-1000" />
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((b, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/[0.05] hover:border-purple-500/30 transition-all group relative overflow-hidden">
                            <b.icon className="w-8 h-8 text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{b.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors uppercase text-[10px] tracking-widest">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Technical Section */}
                <div className="max-w-7xl mx-auto mt-40 py-32 text-center space-y-12">
                    <div className="inline-flex p-6 bg-purple-500/10 rounded-full border border-purple-500/20 mb-8">
                        <Code2 className="w-12 h-12 text-purple-500" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Transparent Code Interception.</h2>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium">
                        AutoGen agents love to write and execute code. SupraWall sits between the agent and the execution environment, auditing every script before it runs.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-purple-600 relative overflow-hidden text-center group font-sans">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your multi-agent loops?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1 shadow-2xl">
                                Start Secure Loop
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Code Guard", desc: "Monitors and blocks dangerous bash/python execution within AutoGen agents.", icon: Code2 },
    { title: "Conversation Audit", desc: "Logs every message exchanged between agents to prevent emergent prompt attacks.", icon: Bot },
    { title: "Zero Loops", desc: "Detects and breaks infinite 'code-fail' loops that drain your LLM credits.", icon: Zap },
    { title: "Unified Governance", desc: "One policy engine to rule all agents, regardless of their individual configurations.", icon: Layers }
];
