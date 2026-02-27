"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Users, Shield, Zap, Terminal, Layers, Box, Cpu } from "lucide-react";
import Link from "next/link";

export default function CrewAIIntegrationPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans">
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-6 space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-[10px] font-black text-orange-400 tracking-[0.2em] uppercase"
                        >
                            Orchestration • Agent Swarms
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
                            >
                                Secure the <br />
                                <span className="text-orange-500">Autonomous</span> <br />
                                Swarm.
                            </motion.h1>
                            <p className="text-xl text-neutral-400 leading-relaxed font-medium max-w-lg">
                                Multi-agent tasks are powerful but unpredictable. SupraWall provides role-based tool isolation and delegation audits for <span className="text-white">CrewAI</span>.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <Link href="/login" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 shadow-[0_10px_40px_rgba(255,165,0,0.1)] transition-all active:scale-95 flex items-center gap-2">
                                Secure your Crew <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/docs/frameworks/crewai" className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors border-b-2 border-transparent hover:border-orange-500 pb-1">
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
                                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">agent_swarm.py</span>
                            </div>
                            <div className="p-10 space-y-8 font-mono text-sm leading-relaxed">
                                <div className="space-y-2">
                                    <p className="text-neutral-600"># 1. Import the universal decorator</p>
                                    <p className="text-orange-400">from suprawall import secure</p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-neutral-600"># 2. Protect the entire crew factory</p>
                                    <div className="text-neutral-300 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                        <p className="text-orange-400">@secure(api_key="ag_...")</p>
                                        <p><span className="text-orange-400">def</span> create_crew():</p>
                                        <p className="pl-4 mt-2">researcher = Agent(role="Researcher", ...)</p>
                                        <p className="pl-4">writer = Agent(role="Writer", ...)</p>
                                        <p className="pl-4 mt-2">return Crew(agents=[...], tasks=[...])</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-neutral-600"># 3. Role-based violations are caught</p>
                                    <p className="text-red-400/80"># Researcher tried to 'refund_customer'</p>
                                    <p className="text-red-400 italic">!! SupraWall: Action Denied (Role Mismatch)</p>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all duration-1000" />
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((b, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/[0.05] hover:border-orange-500/30 transition-all group relative overflow-hidden">
                            <b.icon className="w-8 h-8 text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{b.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors uppercase text-[10px] tracking-widest">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Swarm Visual */}
                <div className="max-w-7xl mx-auto mt-40 py-32 text-center space-y-12">
                    <div className="inline-flex p-6 bg-orange-500/10 rounded-full border border-orange-500/20 mb-8">
                        <Cpu className="w-12 h-12 text-orange-500" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Role-Based Tool Governance.</h2>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium">
                        CrewAI thrives on roles. SupraWall maps these roles to specific tool permissions, ensuring a 'Writer' never has access to your production database.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-orange-600 relative overflow-hidden text-center group font-sans">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your agent swarm?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1 shadow-2xl">
                                Launch Protected Swarm
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Role Isolation", desc: "Hard-coded boundaries ensuring agents only access tools assigned to their roles.", icon: Layers },
    { title: "Delegation Audit", desc: "Every hand-off between CrewAI agents is monitored for policy compliance.", icon: Users },
    { title: "Zero Leakage", desc: "Prevents agents from passing sensitive workspace data to untrusted tools.", icon: Shield },
    { title: "Live Swarm View", desc: "Watch your agents think and act in real-time with an interactive audit log.", icon: Zap }
];
