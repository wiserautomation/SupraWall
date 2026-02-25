"use client";

import { motion } from "framer-motion";
import { ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2, Shield, Database, Terminal, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("npm");

    const installationSnippets: Record<string, string> = {
        npm: "npm install agentgate",
        pip: "pip install agentgate",
        gem: "gem install agentgate",
        go: "go get github.com/agentgate/agentgate-go",
        docker: "docker pull agentgate/server:latest"
    };

    const features = [
        {
            icon: <Globe className="w-5 h-5" />,
            title: "8 Programming Languages",
            description: "Native SDKs for Python, TypeScript, Go, Ruby, PHP, Java, Rust, and C#. Built by developers, for developers.",
        },
        {
            icon: <Database className="w-5 h-5" />,
            title: "Database Agnostic",
            description: "First-class ORM adapters for PostgreSQL, MySQL, MongoDB, Supabase, and Firebase.",
        },
        {
            icon: <Terminal className="w-5 h-5" />,
            title: "Local Dev & CLI",
            description: "Work offline on airplanes. Spin up the isolated SQLite local dev server and manage policies from your terminal.",
        },
        {
            icon: <Code2 className="w-5 h-5" />,
            title: "Framework Integrations",
            description: "Drop in native @with_agentgate decorators for LangChain, LlamaIndex, AutoGen, Vercel AI, and CrewAI.",
        },
        {
            icon: <Activity className="w-5 h-5" />,
            title: "Webhook Architecture",
            description: "Real-time, Stripe-grade webhooks for policy decisions backed by BullMQ with HMAC SHA256 signatures.",
        },
        {
            icon: <Box className="w-5 h-5" />,
            title: "Drop-in UI Components",
            description: "React, Vue, Svelte, and Embeddable iFrames for instant Audit Log Streams and Policy Editors.",
        }
    ];

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-neutral-800 selection:text-white">
            {/* Background Subtle Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-20 pointer-events-none overflow-hidden flex items-start justify-center">
                <div className="w-[800px] h-[400px] bg-indigo-600/30 blur-[120px] rounded-full mt-[-200px]" />
            </div>

            <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-500" />
                        <span className="text-white font-medium tracking-tight">AgentGate</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/docs" className="text-neutral-400 hover:text-white transition-colors duration-200">
                            Documentation
                        </Link>
                        <Link href="/login" className="text-neutral-400 hover:text-white transition-colors duration-200">
                            Sign In
                        </Link>
                        <Link href="/login" className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-neutral-200 transition-colors duration-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6 overflow-hidden">
                {/* HERO SECTION */}
                <section className="max-w-4xl mx-auto text-center relative z-10 pt-20 pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-neutral-300 mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                        AgentGate API & OS Architecture 1.0 is live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                    >
                        The Stripe of AI <br className="hidden md:block" /> Agent Security.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Enterprise security for AI agents in one line of code. Prevent prompt injections, unauthorized tool executions, and data exfiltration out of the box.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <Link href="/login" className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                            Start Securing Agents <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link href="/docs" className="px-6 py-3 border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-300">
                            Read Documentation
                        </Link>
                    </motion.div>
                </section>

                {/* CODE INSTALLATION TABS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-2xl mx-auto mb-24 relative z-10"
                >
                    <div className="rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="flex border-b border-white/5 bg-white/[0.02]">
                            {Object.keys(installationSnippets).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "text-indigo-400 border-b-2 border-indigo-500" : "text-neutral-500 hover:text-neutral-300"
                                        }`}
                                >
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 font-mono text-sm text-neutral-300 flex items-center justify-between group">
                            <code>{installationSnippets[activeTab]}</code>
                            <div className="text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Code2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SCROLL INDICATOR */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex justify-center mb-24"
                >
                    <div className="w-[1px] h-[60px] bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>

                {/* VALUE PROPOSITION DETAIL - FEATURE GRID */}
                <section className="max-w-6xl mx-auto relative z-10 mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Built for any stack. Running anywhere.</h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            The architecture you need to scale zero-trust autonomous agents across your entire organization.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                onMouseEnter={() => setHoveredFeature(i)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className={`relative group p-8 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 ${hoveredFeature === i ? 'bg-white/[0.04] border-white/10 shadow-[0_8px_32px_-12px_rgba(255,255,255,0.05)]' : ''}`}
                            >
                                <div className="mb-5 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-neutral-300 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>

                                {/* Micro-interaction subtle gradient */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent transition-opacity duration-500 ${hoveredFeature === i ? 'opacity-100' : 'opacity-0'}`} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SOCIAL PROOF & CODE VISUAL */}
                <section className="max-w-5xl mx-auto relative z-10 mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-2 shadow-2xl overflow-hidden relative border-t-white/20"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <span className="ml-4 text-xs font-mono text-neutral-500">agent_execution.py</span>
                        </div>
                        <div className="p-6 overflow-x-auto text-sm font-mono leading-loose">
                            <div className="text-neutral-500 mb-2"># Initialize LangChain Agent</div>
                            <div><span className="text-blue-400">from</span> langchain.agents <span className="text-blue-400">import</span> create_react_agent</div>
                            <div><span className="text-blue-400">from</span> agentgate <span className="text-blue-400">import</span> secure_agent</div>
                            <div className="mt-4">agent = create_react_agent(llm, tools, prompt)</div>
                            <div className="mt-4 text-neutral-500"># Intercept execution with AgentGate</div>
                            <div>secured_agent = secure_agent(agent, api_key=<span className="text-emerald-400">&quot;ag_live_x8F21...&quot;</span>)</div>
                            <div className="mt-4 text-neutral-500"># Action evaluation: 'rm -rf /' -&gt; 🚨 DENIED by Central Policy</div>
                            <div>secured_agent.invoke({"{"}<span className="text-emerald-400">&quot;input&quot;</span>: <span className="text-emerald-400">&quot;Wipe the target server&quot;</span>{"}"})</div>
                        </div>

                        {/* Decorative glass overlay gradient */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
                    </motion.div>
                </section>

                {/* BOTTOM CTA */}
                <section className="max-w-4xl mx-auto text-center relative z-10 py-24 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                            Ready to secure your AI?
                        </h2>
                        <p className="text-neutral-400 md:text-lg mb-10 max-w-xl mx-auto">
                            Implement zero-trust policy execution today. Use our managed cloud platform or self-host AgentGate anywhere.
                        </p>
                        <Link href="/login" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                            Get Started for Free <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="mt-8 flex justify-center gap-6 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-neutral-600" /> Fully Self-Hostable</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-neutral-600" /> Generous free tier</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-neutral-600" /> Open Webhooks</span>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="border-t border-white/5 bg-black text-neutral-500 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Lock className="w-4 h-4 text-neutral-600" />
                        <span className="font-medium text-sm text-neutral-400">AgentGate</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
