"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, ArrowRight, ChevronDown, KeyRound, DollarSign } from "lucide-react";
import Link from "next/link";

export function Navbar() {
    const [featuresOpen, setFeaturesOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/60 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-1.5 bg-emerald-600 rounded-lg shadow-[0_0_20px_rgba(5,150,105,0.4)] group-hover:scale-110 transition-transform duration-500">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-black text-2xl tracking-[-0.05em] uppercase italic">SupraWall</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-glow">
                    {/* Features dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setFeaturesOpen(true)}
                        onMouseLeave={() => setFeaturesOpen(false)}
                    >
                        <button className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors">
                            Features <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {featuresOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <Link
                                        href="/features/vault"
                                        className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors group border-b border-white/5"
                                    >
                                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <KeyRound className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-[11px] font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Credential Vault</p>
                                            <p className="text-neutral-500 text-[10px] font-medium normal-case tracking-normal mt-0.5 leading-relaxed">Zero-knowledge secret injection</p>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/features/budget-limits"
                                        className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-white text-[11px] font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Budget Limits</p>
                                            <p className="text-neutral-500 text-[10px] font-medium normal-case tracking-normal mt-0.5 leading-relaxed">Hard caps on agent API spend</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/docs" className="text-neutral-500 hover:text-white transition-colors">Documentation</Link>
                    <Link href="/learn/what-is-agent-runtime-security" className="text-neutral-500 hover:text-white transition-colors">Security Hub</Link>
                    <Link href="/news" className="text-neutral-500 hover:text-white transition-colors">News</Link>
                    <Link href="/#integrations" className="text-neutral-500 hover:text-white transition-colors">Integrations</Link>
                    <Link href="/login" className="text-neutral-500 hover:text-white transition-colors tracking-tighter mr-[-1rem]">Join Beta</Link>
                    <div className="h-4 w-px bg-white/10" />
                    <Link href="/login" className="text-neutral-500 hover:text-white transition-colors">Sign In</Link>
                    <Link href="/login" className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95 group flex items-center gap-2">
                        Get Started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
