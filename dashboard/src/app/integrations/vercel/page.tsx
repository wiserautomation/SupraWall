"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Triangle, Shield, Zap, Terminal, Box, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function VercelIntegrationPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-6 space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase"
                        >
                            Infrastructure • Vercel AI SDK
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
                            >
                                Secure the <br />
                                <span className="text-blue-500">Edge</span> <br />
                                Runtime.
                            </motion.h1>
                            <p className="text-xl text-neutral-400 leading-relaxed font-medium max-w-lg">
                                Zero-trust security for Next.js AI apps. Intercept tool calls in <span className="text-white">v0/ai</span> and enforce policies at the edge.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <Link href="/login" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 shadow-[0_10px_40px_rgba(0,191,255,0.1)] transition-all active:scale-95 flex items-center gap-2">
                                Start Securing <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/docs/frameworks/vercel" className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors border-b-2 border-transparent hover:border-blue-500 pb-1">
                                Integration Guide
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative">
                        {/* Edge Code Mockup */}
                        <div className="bg-[#0A0A0A] border-2 border-white/[0.05] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.05] bg-white/[0.01]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/30" />
                                </div>
                                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">api/chat/route.ts</span>
                            </div>
                            <div className="p-10 space-y-8 font-mono text-sm leading-relaxed">
                                <div className="space-y-2">
                                    <p className="text-neutral-600">// 1. Universal protector for TypeScript</p>
                                    <p className="text-blue-400">import {"{ protect }"} from "@suprawall/sdk";</p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-neutral-600">// 2. Wrap your Vercel AI tools</p>
                                    <div className="text-neutral-300 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                        <p><span className="text-blue-400">const</span> tools = <span className="text-blue-400">protect</span>({"{"}</p>
                                        <p className="pl-4 mt-2">getInventory: tool({"{"}</p>
                                        <p className="pl-8 text-neutral-400">execute: async () ={">"} ...</p>
                                        <p className="pl-4">{"})"}</p>
                                        <p>{"}, { apiKey: 'ag_...' });"}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-neutral-600">// 3. Automatic edge policy enforcement</p>
                                    <p className="text-blue-400">await streamText({"{"} model, tools, prompt {"});"}</p>
                                    <p className="text-emerald-400 italic mt-2">// Tool call intercepted at the Edge ⚡</p>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000" />
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((b, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/[0.05] hover:border-blue-500/30 transition-all group relative overflow-hidden">
                            <b.icon className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{b.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors uppercase text-[10px] tracking-widest">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Edge Visual */}
                <div className="max-w-7xl mx-auto mt-40 py-32 text-center space-y-12">
                    <div className="inline-flex p-6 bg-blue-500/10 rounded-full border border-blue-500/20 mb-8">
                        <Globe className="w-12 h-12 text-blue-500" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Edge-First Governance.</h2>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium">
                        Don't wait for the backend. SupraWall integrates with Vercel's Edge Runtime to block unauthorized tool calls before they ever reach your core infrastructure.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-blue-600 relative overflow-hidden text-center group font-sans">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your Next.js AI stack?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1 shadow-2xl">
                                Deploy Secure Edge
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Edge Middleware", desc: "Native support for Vercel Edge Runtime and Next.js Middleware environments.", icon: Globe },
    { title: "Streaming Safety", desc: "Interrupts tool-calling streams in real-time if a violation is detected.", icon: Zap },
    { title: "Cold Start Ready", desc: "Sub-1ms overhead ensures zero impact on your Lambda/Edge cold starts.", icon: ShieldCheck },
    { title: "Type Safe Tools", desc: "Full TypeScript integration with Vercel AI SDK 'tool' and 'toolSet' types.", icon: Box }
];
