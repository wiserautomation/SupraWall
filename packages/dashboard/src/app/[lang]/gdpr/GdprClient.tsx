// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    EyeOff, ShieldCheck, ArrowRight, Lock, 
    CheckCircle2, Globe, FileText, Fingerprint, 
    ShieldAlert, Search, Trash2, Cpu
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/app/HomeClient";
import { useState } from "react";

export default function GdprClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const [activeTab, setActiveTab] = useState("insecure");
    const t = dictionary.gdpr;

    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>{t.hero.badge}</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             {t.hero.title} <br />
                             <span className="text-purple-500 font-bold italic underline decoration-white/10 italic">{t.hero.emphasis}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             {t.hero.description}
                        </p>
                    </div>
                </div>
            </section>

             {/* ⚔️ VISUAL COMPARISON — Insecure vs Secure */}
             <section className="py-20 px-6 bg-black border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                            {t.comparison.title} & <Link href={`/${lang}/learn/what-is-agent-runtime-security`} className="text-purple-500 hover:text-white transition-colors underline decoration-white/10">agent runtime security</Link>
                        </h2>

                        <div className="flex justify-center gap-2 p-1.5 bg-neutral-900 border border-white/10 rounded-2xl w-fit mx-auto text-glow">
                            <button onClick={() => setActiveTab("insecure")} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'insecure' ? 'bg-rose-600 text-white' : 'text-neutral-500 hover:text-white'}`}>{t.comparison.insecureLabel}</button>
                            <button onClick={() => setActiveTab("secure")} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'secure' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'text-neutral-500 hover:text-white'}`}>{t.comparison.secureLabel}</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Terminal Side */}
                        <div className="bg-[#050505] rounded-[2rem] border border-white/10 p-10 font-mono text-sm min-h-[400px] relative overflow-hidden shadow-2xl">
                             <div className="absolute top-4 right-10 text-[10px] font-black uppercase text-neutral-600 tracking-widest">{t.comparison.terminal.header}</div>
                             <div className="space-y-4 pt-10">
                                <p className="text-neutral-500">{"> agent.tool_call(\"external_crm.update_record\", { ... })"}</p>
                                
                                {activeTab === "insecure" ? (
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} key="insecure" className="space-y-4">
                                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-mono text-xs">
                                            <p className="text-neutral-500 text-[10px] mb-2 uppercase font-black">{t.comparison.terminal.insecure.status}</p>
                                            {`{\n  \"name\": \"Jane Doe\",\n  \"email\": \"jane@example.com\",\n  \"ssn\": \"942-12-XXXX\",\n  \"details\": \"Customer discussed health plan.\"\n}`}
                                        </div>
                                        <div className="flex items-center gap-3 text-rose-500 font-black uppercase text-[10px] italic">
                                            <ShieldAlert className="w-4 h-4" /> {t.comparison.terminal.insecure.violation}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} key="secure" className="space-y-4">
                                        <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 font-mono text-xs">
                                            <p className="text-neutral-500 text-[10px] mb-2 uppercase font-black">{t.comparison.terminal.secure.status}</p>
                                            {`{\n  \"name\": \"[REDACTED_NAME]\",\n  \"email\": \"[REDACTED_EMAIL]\",\n  \"ssn\": \"[REDACTED_SSN]\",\n  \"details\": \"Customer discussed health plan.\"\n}`}
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-500 font-black uppercase text-[10px] italic">
                                            <ShieldCheck className="w-4 h-4" /> {t.comparison.terminal.secure.protection}
                                        </div>
                                    </motion.div>
                                )}
                             </div>
                        </div>

                        {/* Explained Side */}
                        <div className="flex flex-col justify-center space-y-8">
                             <div className="space-y-4">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none italic uppercase italic">{t.comparison.explain.title}</h3>
                                <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-snug">
                                    {t.comparison.explain.p}
                                </p>
                             </div>
                             <div className="grid grid-cols-1 gap-4">
                                {[
                                    { title: t.comparison.explain.features.scrubbing.title, desc: t.comparison.explain.features.scrubbing.desc, icon: <EyeOff className="w-6 h-6 text-purple-400" /> },
                                    { title: t.comparison.explain.features.logs.title, desc: t.comparison.explain.features.logs.desc, icon: <FileText className="w-6 h-6 text-blue-400" /> }
                                ].map(item => (
                                    <div key={item.title} className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 group transition-all hover:bg-white/10">
                                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                        <div>
                                            <p className="text-white text-sm font-black italic uppercase tracking-widest">{item.title}</p>
                                            <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 bg-black relative text-center">
                <div className="absolute inset-0 bg-purple-500/5 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <TagBadge>{t.final.badge}</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        {t.final.title} <br />
                        <span className="text-purple-500 underline decoration-white/20 font-bold italic underline decoration-white/10 uppercase italic">{t.final.emphasis}</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        {t.final.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/beta" className="px-16 py-8 bg-purple-600 text-white font-black text-3xl rounded-3xl hover:bg-purple-500 transition-all shadow-[0_0_100px_rgba(168,85,247,0.3)] tracking-tighter flex items-center gap-4 group">
                             {t.final.cta} <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                    <Link href="/learn/eu-ai-act-compliance-ai-agents" className="block text-xs font-black uppercase tracking-widest text-neutral-500 underline underline-offset-8 mt-10">{t.final.guide} &rarr;</Link>
                </div>
            </section>
        </main>
    );
}
