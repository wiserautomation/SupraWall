"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Monitor, Shield, Zap, Search, Eye } from "lucide-react";
import Link from "next/link";

export default function OpenClawIntegrationPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-6 space-y-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase"
                        >
                            Infrastructure • Autonomous Browsing
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic"
                            >
                                Secure the <span className="text-emerald-500">Autonomous</span> <br />
                                Browser.
                            </motion.h1>
                            <p className="text-xl text-neutral-400 leading-relaxed font-medium max-w-lg">
                                Stop autonomous agents from leaking session cookies, buying unauthorized items, or deleting user data via the browser. SupraWall for <span className="text-white">OpenClaw</span>.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <Link href="/login" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-all active:scale-95 flex items-center gap-2">
                                Get API Key <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/docs/frameworks/openclaw" className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors border-b-2 border-transparent hover:border-emerald-500 pb-1">
                                View Plugin Source
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
                                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">claw-security.ts</span>
                            </div>
                            <div className="p-10 space-y-8 font-mono text-sm leading-relaxed">
                                <div className="space-y-2">
                                    <p className="text-neutral-600">// 1. Initialize Clawbot with SupraWall</p>
                                    <p className="text-emerald-400">import {"{ secureClaw }"} from "@suprawall/claw";</p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-neutral-600">// 2. Secure the agent instance</p>
                                    <div className="text-neutral-300 p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                                        <p><span className="text-emerald-400">const</span> agent = new Clawbot(browser);</p>
                                        <p className="mt-2"><span className="text-emerald-400">const</span> secured = secureClaw(agent, {"{"} apiKey: "..." {"}"});</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-neutral-600">// 3. Dangerous acts are blocked</p>
                                    <p className="text-red-400/80">await secured.execute("Delete AWS Account");</p>
                                    <p className="text-red-400 italic">!! SupraWall: Action Blocked (Policy: No-Destruction)</p>
                                </div>
                            </div>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000" />
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-7xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((b, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900/30 border border-white/[0.05] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                            <b.icon className="w-8 h-8 text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{b.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors uppercase text-[10px] tracking-widest">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Visual Section: Browser Shield */}
                <div className="max-w-7xl mx-auto mt-40 py-32 text-center space-y-12">
                    <div className="inline-flex p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-8">
                        <Monitor className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Transparent Interception.</h2>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium">
                        SupraWall injects security directly into the CDP (Chrome DevTools Protocol) stream, allowing us to block actions before they hit the page.
                    </p>
                </div>

                {/* Call to Action */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-emerald-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />autonomous browsing?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Secure your Browser
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "DOM Interception", desc: "Monitors clicks and input events for sensitive fields and dangerous patterns.", icon: Search },
    { title: "Session Guard", desc: "Prevents agents from reading cookies or local storage directly from the browser context.", icon: Shield },
    { title: "Financial Kill-Switch", desc: "Blocks payment submissions or 'Buy Now' actions without human approval.", icon: Zap },
    { title: "Step-by-Step Audit", desc: "Records every navigation and click as a verified security event in the cloud.", icon: Eye }
];
