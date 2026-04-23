// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Navbar } from "@/components/Navbar";
import { 
    ArrowRight, Shield, BadgeDollarSign, Lock, RefreshCcw, 
    Zap, AlertTriangle, CheckCircle2, TrendingDown 
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

export default function StripeLandingPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-blue-500/30 selection:text-white">
            <Navbar />

            <main className="overflow-hidden">
                {/* 🚀 HERO */}
                <section className="relative pt-48 pb-32 px-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-600/30 blur-[180px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                        <TagBadge>Stripe App Marketplace</TagBadge>

                        <div className="space-y-8">
                            <h1 className="text-6xl md:text-[110px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow filter drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                Stop Rogue Agents <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Draining Your Stripe.</span> <br />
                            </h1>

                            <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium">
                                The first autonomous agent firewall for your Stripe Dashboard. <br />
                                <span className="text-white font-bold">Audit</span> costs. <span className="text-white font-bold">Protect</span> keys. <span className="text-white font-bold">Enforce</span> budgets.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            <Link
                                href="https://marketplace.stripe.com"
                                className="px-14 py-6 bg-blue-600 text-white font-black uppercase tracking-tighter text-2xl rounded-2xl hover:bg-blue-500 transition-all transform hover:scale-105 shadow-[0_20px_40px_rgba(59,130,246,0.2)] group flex items-center gap-3"
                            >
                                Install App <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href="/docs/integrations/stripe"
                                className="px-14 py-6 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-2xl rounded-2xl hover:bg-white/5 transition-all"
                            >
                                Read Docs →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 📊 VALUE PROPS */}
                <section className="py-40 px-6 bg-black relative">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <TrendingDown className="w-12 h-12 text-blue-400" />,
                                title: "Agent Usage Audit",
                                desc: "Statistical cost analysis detects infinite loops and redundant tool calls before they escalate. Save an average of 15% on billed tokens."
                            },
                            {
                                icon: <Lock className="w-12 h-12 text-emerald-400" />,
                                title: "Secure API Vault",
                                desc: "Wrap your Restricted API Keys (RAKs) in SupraWall. Agents only interact with secure tokens, preventing credential theft from prompt injections."
                            },
                            {
                                icon: <Shield className="w-12 h-12 text-rose-400" />,
                                title: "Budget Controller",
                                desc: "Automated revenue protection. Automatically revoke or pause agent permissions the moment a customer's payment fails in Stripe."
                            }
                        ].map((v, i) => (
                            <div key={i} className="p-12 rounded-[3rem] bg-neutral-900/40 border border-white/5 space-y-6 hover:border-blue-500/30 transition-all group">
                                <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <h3 className="text-3xl font-black italic uppercase text-white">{v.title}</h3>
                                <p className="text-neutral-500 font-medium leading-relaxed italic">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 🛡️ SECURITY BAR */}
                <section className="py-24 bg-blue-950/20 border-y border-blue-500/20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Enterprise Trust. <br/><span className="text-blue-500">Stripe Scale.</span></h2>
                            <p className="text-neutral-400 font-medium">Built on the Stripe UI Extensions SDK with full OAuth support.</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3 text-blue-400 font-black uppercase text-xs tracking-widest">
                                <CheckCircle2 className="w-5 h-5" /> 100% Sandboxed
                            </div>
                            <div className="flex items-center gap-3 text-blue-400 font-black uppercase text-xs tracking-widest">
                                <CheckCircle2 className="w-5 h-5" /> SOC2 Compliant
                            </div>
                            <div className="flex items-center gap-3 text-blue-400 font-black uppercase text-xs tracking-widest">
                                <CheckCircle2 className="w-5 h-5" /> Zero-Knowledge
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🎯 FINAL CTA */}
                <section className="py-48 px-6 bg-black text-center relative">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                        <h2 className="text-7xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                            Ready to <br />
                            <span className="text-blue-500 font-bold italic">Secure Your Revenue?</span>
                        </h2>
                        <Link href="https://marketplace.stripe.com" className="px-16 py-8 bg-blue-600 text-white font-black text-3xl rounded-[2.5rem] hover:bg-blue-500 transition-all shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-pulse tracking-tighter inline-flex items-center gap-4 group">
                            INSTALL ON STRIPE <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="bg-black border-t border-white/5 py-20 text-center text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em]">
                © 2026 SUPRAWALL • STRIPE APP MARKETPLACE INTEGRATION
            </footer>
        </div>
    );
}
