"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Terminal, Activity, CheckCircle2 } from "lucide-react";

export default function AgentRuntimeSecurityPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "What is Agent Runtime Security?",
        "description": "Agent Runtime Security (also called AI agent guardrails or AI agent firewall) is the practice of intercepting, inspecting, and enforcing security policies on AI agent actions at runtime.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-400 tracking-wider uppercase"
                        >
                            Knowledge Hub • Security Guide
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tight"
                        >
                            What is Agent <br />
                            <span className="text-emerald-500">Runtime Security?</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-neutral-400 leading-relaxed font-medium border-l-4 border-emerald-600 pl-6 py-2"
                        >
                            Agent Runtime Security (also called AI agent guardrails or AI agent firewall) is the practice of intercepting, inspecting, and enforcing security policies on AI agent actions at runtime — before they execute.
                        </motion.p>
                    </div>

                    {/* Content Section */}
                    <div className="prose prose-invert max-w-none space-y-12 text-neutral-300">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Terminal className="w-6 h-6 text-emerald-500" />
                                The Core Problem: Autonomy vs. Risk
                            </h2>
                            <p className="text-base leading-relaxed">
                                As AI agents transition from simple chat interfaces to autonomous actors capable of interacting with APIs, databases, and file systems, the potential for catastrophic failure increases. Standard LLM guardrails focus on output content (e.g., toxicity), but Agent Runtime Security focuses on <strong className="text-white">intent and action.</strong>
                            </p>
                            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 font-mono text-sm space-y-2 shadow-2xl">
                                <p className="text-neutral-500">// Without Agent Runtime Security</p>
                                <p className="text-rose-400">Agent: "Running 'rm -rf /'..."</p>
                                <p className="text-rose-600 font-bold">Error: Production system deleted.</p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Lock className="w-6 h-6 text-emerald-500" />
                                Five Pillars of Agent Security
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                                {pillars.map((p, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-colors group">
                                        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">{p.title}</p>
                                        <p className="text-neutral-400 text-sm leading-relaxed">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">How It Works: The Interception Layer</h2>
                            <p className="text-base leading-relaxed">
                                SupraWall sits between your agent logic (LangChain, CrewAI, AutoGen) and the environment. Every tool call or API request is serialized, analyzed against your organization's policy engine, and either approved, modified, or denied in milliseconds. This is a <strong>Zero Trust</strong> approach to AI autonomy.
                            </p>
                        </section>
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mt-20 p-12 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-black border border-emerald-500/20 text-center space-y-6 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full translate-y-1/2" />
                        <h3 className="text-3xl font-black relative z-10">Ready to SupraWall your agents?</h3>
                        <p className="text-neutral-400 relative z-10">Join 800+ teams securing their autonomous runtime with one line of code.</p>
                        <div className="flex justify-center relative z-10">
                            <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                                Get Started for Free
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer space */}
            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-600 text-xs font-bold uppercase tracking-[0.3em]">
                    SupraWall © 2026 • Agent Runtime Security
                </p>
            </footer>
        </div>
    );
}

const pillars = [
    { title: "Policy Enforcement", desc: "Define granular, human-readable policies for tool usage and environment access." },
    { title: "Real-time Monitoring", desc: "Full cryptographic audit rails of every decision made by every agent." },
    { title: "Action Interception", desc: "Block destructive actions before they reach your servers or downstream APIs." },
    { title: "Credential Isolation", desc: "Ensure agents never see raw API keys or database secrets, preventing exfiltration." },
    { title: "Human-in-the-Loop", desc: "Require manual approval for high-risk actions automatically via Slack or PagerDuty." }
];
