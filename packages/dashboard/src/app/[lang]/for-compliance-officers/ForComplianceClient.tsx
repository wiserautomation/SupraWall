// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    FileText, ShieldCheck, ArrowRight, History, 
    Fingerprint, Scale, Download, CheckCircle2,
    ShieldAlert, Search, Globe, Lock
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/app/HomeClient";

export default function ForComplianceClient() {
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>Compliance Landing</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             Evidence Delivered. <br />
                             <span className="text-blue-500 font-bold italic underline decoration-white/10 uppercase italic">Audit Won.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             Autonomous agents don&apos;t have to be a &ldquo;black box.&rdquo; SupraWall creates the immutable record for every tool call and blocked action.
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 THE COMPLIANCE REPORTING EXPERIENCE */}
             <section className="py-24 px-6 md:px-0 bg-black border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                         <div className="flex flex-col justify-center space-y-10 order-2 md:order-1">
                             <TagBadge>EU AI Act Articles 9, 11, 12, 14</TagBadge>
                             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-glow">
                                 Automated <br />
                                 <span className="text-blue-500 font-bold italic underline decoration-white/10 uppercase italic">Observability.</span>
                             </h2>
                             <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-relaxed">
                                 The EU AI Act requires developers of &ldquo;High-Risk&rdquo; agentic architectures to maintain continuous logging and human oversight. SupraWall automates this with signed, regulator-ready PDF reports produced directly from the SDK.
                             </p>
                             <div className="grid grid-cols-1 gap-6">
                                 {[
                                     { title: "Article 12: Logging", icon: <History className="w-6 h-6 text-blue-400" /> },
                                     { title: "Article 14: Human Oversight", icon: <ShieldAlert className="w-6 h-6 text-blue-400" /> },
                                     { title: "Article 25: Data Protection", icon: <Lock className="w-6 h-6 text-blue-400" /> }
                                 ].map(item => (
                                     <div key={item.title} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/20 transition-all">
                                         <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                         <p className="text-white text-sm font-black italic uppercase tracking-tighter">{item.title}</p>
                                         <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500 opacity-40 group-hover:opacity-100" />
                                     </div>
                                 ))}
                             </div>
                         </div>
                         <div className="flex items-center justify-center order-1 md:order-2">
                             <div className="w-full max-w-md p-10 rounded-[4rem] bg-white text-black shadow-2xl space-y-8 relative overflow-hidden group rotate-[1deg] hover:rotate-[0deg] transition-all">
                                 <div className="flex items-center justify-between border-b pb-4 border-neutral-200">
                                     <TagBadge>Signed PDF</TagBadge>
                                     <Download className="w-5 h-5 text-neutral-400" />
                                 </div>
                                 <h4 className="text-3xl font-black italic uppercase italic tracking-tighter">Conformity Assessment Report</h4>
                                 <div className="space-y-4">
                                     <div className="h-5 w-full bg-neutral-100 rounded animate-pulse" />
                                     <div className="h-5 w-3/4 bg-neutral-100 rounded animate-pulse" />
                                     <div className="h-5 w-1/2 bg-neutral-100 rounded animate-pulse" />
                                 </div>
                                 <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-widest"><Fingerprint className="w-3 h-3" /> RSA-4096 Signed</div>
                                     <p className="text-[10px] font-medium leading-relaxed italic text-neutral-600">This report confirms that of 41,200 agent tool calls, 29 blocks occurred based on Policy DP-14. Human approval was granted by 3 authorized engineers for all sensitive actions.</p>
                                 </div>
                                 <button className="w-full py-6 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">Download Audit Report</button>
                             </div>
                         </div>
                    </div>
                </div>
            </section>

             {/* 🎯 TRUST PILLARS */}
             <section className="py-40 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="text-center space-y-6">
                        <TagBadge>Total Resilience</TagBadge>
                        <h2 className="text-5xl md:text-[6rem] font-black italic uppercase tracking-tighter leading-[0.8] text-glow">
                             Zero-Trust <br />
                             <span className="text-blue-500 font-bold italic underline decoration-white/10 italic">Governance Standard.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        {[
                            { title: "Immutable Trail", desc: "Every action is hashed and signed at the source. Once recorded, the evidence cannot be altered.", icon: <Fingerprint className="w-8 h-8 text-blue-400" /> },
                            { title: "Unified Risk Policy", desc: "Centralize your security policies across all internal and outbound agents in one dashboard.", icon: <Scale className="w-8 h-8 text-blue-400" /> },
                            { title: "Automated GDPR", desc: "Instantly satisfy data scrubbing requirements with the PII shield running on every integration.", icon: <ShieldCheck className="w-8 h-8 text-blue-400" /> }
                        ].map((p, i) => (
                            <div key={p.title} className="p-12 rounded-[3.5rem] bg-neutral-900/40 border border-white/5 space-y-8 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 w-fit mx-auto md:mx-0 group-hover:scale-110 transition-transform">{p.icon}</div>
                                <div className="space-y-4">
                                     <h4 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">{p.title}</h4>
                                     <p className="text-neutral-500 text-sm font-bold uppercase tracking-tight italic leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 bg-black relative text-center">
                <div className="absolute inset-0 bg-blue-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <TagBadge>For Regulators</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        Audit Passed. <br />
                        <span className="text-blue-500 underline decoration-white/20 font-bold italic uppercase italic font-bold">Risk Controlled.</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        Don&apos;t wait for a compliance investigation. Arm your team with the evidence they need today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/beta" className="px-16 py-8 bg-blue-600 text-white font-black text-3xl rounded-3xl hover:bg-blue-500 transition-all shadow-[0_0_100px_rgba(59,130,246,0.3)] tracking-tighter flex items-center gap-4 group">
                             Start Compliant <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
