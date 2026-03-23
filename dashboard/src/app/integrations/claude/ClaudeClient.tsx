"use client";

import { motion } from "framer-motion";
import { Bot, Shield, Zap, Terminal, Code2, Globe } from "lucide-react";

export default function ClaudeClient() {
    return (
        <div className="mt-40 text-center">
            {/* Interactive Console Mockup */}
            <div className="max-w-4xl mx-auto relative group">
                <div className="bg-[#0A0A0A] border-2 border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/[0.01]">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/30" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                            <div className="w-3 h-3 rounded-full bg-green-500/30" />
                        </div>
                        <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">claude-computer-use.py</span>
                    </div>
                    <div className="p-10 space-y-8 font-mono text-sm leading-relaxed text-left">
                        <div className="space-y-2">
                            <p className="text-neutral-600"># 1. Initialize Claude Security</p>
                            <p className="text-orange-400">from suprawall.anthropic import secure_computer_use</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-neutral-600"># 2. Secure Claude's Computer Use agent</p>
                            <div className="text-neutral-300 p-6 bg-white/[0.05] border border-white/10 rounded-2xl">
                                <p><span className="text-orange-400">claude_agent</span> = ClaudeAgent(model="claude-3-5-sonnet")</p>
                                <p className="mt-2"><span className="text-orange-400">secured_claude</span> = secure_computer_use(claude_agent)</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-neutral-600"># 3. Claude now verifies click/type intent at the OS level</p>
                            <p className="text-orange-400">{"secured_claude.run(\"Open Excel and export secrets\") // <-- BLOCKED"}</p>
                        </div>
                    </div>
                    {/* Decorative glow */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all duration-1000" />
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
                        className="p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/10 hover:border-orange-500/30 transition-all group relative overflow-hidden text-left"
                    >
                        <b.icon className="w-8 h-8 text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{b.title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors uppercase text-[10px] tracking-widest">{b.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const benefits = [
    { title: "Computer Use Shield", desc: "Interception for browser and desktop-level actions in Claude 3.5.", icon: Terminal },
    { title: "Prompt Cache Guard", desc: "Prevents exfiltration of sensitive pre-filled prompt contexts.", icon: Zap },
    { title: "Intent Verification", desc: "Scans model output for emergent malicious behavior before OS calls.", icon: Shield },
    { title: "Regulatory Trace", desc: "Mandatory telemetry for autonomous decision-making in Claude swarms.", icon: Globe }
];
