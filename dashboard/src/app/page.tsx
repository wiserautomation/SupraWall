"use client";

import { motion } from "framer-motion";
import { ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const features = [
        {
            icon: <Lock className="w-5 h-5" />,
            title: "Zero-Trust Execution",
            description: "Agents cannot execute a single tool or access any environment without pinging GateAPI first. Security enforced natively.",
        },
        {
            icon: <Box className="w-5 h-5" />,
            title: "Low-Latency Interceptor",
            description: "Milliseconds matter in agentic loops. Built on Cloud Functions (2nd Gen), policy evaluation resolves nearly instantly.",
        },
        {
            icon: <Activity className="w-5 h-5" />,
            title: "Real-time Telemetry",
            description: "Intercepted payloads, arguments, and LLM reasoning flow directly into your audit logs dashboard via WebSockets.",
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
                        <span className="text-white font-medium tracking-tight">AgentGuard</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
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
                        AgentGuard Interceptor SDK 1.0 is live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                    >
                        Stop autonomous agents <br className="hidden md:block" /> from going rogue.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        The control plane for AI agents. Intercept tools, define deterministic security policies, and monitor execution telemetry in real time. Built for the era of unconstrained LLMs.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <Link href="/login" className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-all duration-300 relative overflow-hidden">
                            {/* Hover beam effect */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                            Start Securing Agents <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link href="#" className="px-6 py-3 border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-300">
                            Read Documentation
                        </Link>
                    </motion.div>
                </section>

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-2 shadow-2xl overflow-hidden relative"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <span className="ml-4 text-xs font-mono text-neutral-500">agent-runtime.ts</span>
                        </div>
                        <div className="p-6 overflow-x-auto text-sm font-mono leading-loose">
                            <div className="text-neutral-500 mb-2">{"// Initialize LangChain Agent"}</div>
                            <div><span className="text-purple-400">const</span> rawAgent <span className="text-purple-400">=</span> <span className="text-blue-400">createReactAgent</span>(llm, tools);</div>
                            <div className="mt-4 text-neutral-500">{"// Wrap with AgentGuard execution interceptor"}</div>
                            <div><span className="text-purple-400">const</span> secureAgent <span className="text-purple-400">=</span> <span className="text-blue-400">withAgentGuard</span>(rawAgent, {"{"}</div>
                            <div className="pl-4">apiKey: <span className="text-emerald-400">process.env.AGENTGUARD_KEY</span>,</div>
                            <div>{"});"}</div>
                            <div className="mt-4 text-neutral-500">{"// Action evaluation: 'rm -rf /' -> 🚨 DENIED"}</div>
                            <div><span className="text-purple-400">await</span> secureAgent.<span className="text-blue-400">invoke</span>({"{"} input: <span className="text-emerald-400">&quot;Wipe the target server&quot;</span> {"}"});</div>
                        </div>

                        {/* Decorative glass overlay gradient */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
                    </motion.div>

                    <div className="mt-16 text-center">
                        <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-6">Trusted Infrastructure</p>
                        <div className="flex items-center justify-center gap-8 md:gap-16 opacity-50 grayscale">
                            {/* Abstract minimalist logos */}
                            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><div className="w-6 h-6 rounded-sm bg-white" /> ACME Corp</div>
                            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><div className="w-6 h-6 rounded-full border-4 border-white" /> Nexa</div>
                            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter hidden sm:flex"><div className="w-6 h-6 bg-white rotate-45" /> Vertex</div>
                        </div>
                    </div>
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
                            Implement zero-trust policy execution today. Setup takes less than 5 minutes for most Next.js and Node architectures.
                        </p>
                        <Link href="/login" className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                            Get Started for Free <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="mt-8 flex justify-center gap-6 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-neutral-600" /> No credit card required</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-neutral-600" /> Generous free tier</span>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="border-t border-white/5 bg-black text-neutral-500 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Lock className="w-4 h-4 text-neutral-600" />
                        <span className="font-medium text-sm text-neutral-400">AgentGuard</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
