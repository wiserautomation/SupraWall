// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    FileText, ShieldCheck, ArrowRight, History, 
    Fingerprint, Scale, Download, CheckCircle2,
    ShieldAlert, Search, Globe, Lock, Info
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

const EU_ACT_MAPPING = [
    {
        article: "Art. 9",
        requirement: "Prove your AI had a documented risk management system before it acted",
        solution: "Policy Engine: pre-execution allow/deny rules. Compliance Templates: one-click Article 9 policy activation for Banking, Healthcare, HR.",
        product: "Policy Engine, Compliance Templates"
    },
    {
        article: "Art. 13",
        requirement: "Log every AI action in an auditable, tamper-proof record",
        solution: "RSA-signed audit trail at the tool-call boundary. Every execution logged with cryptographic signature.",
        product: "Audit Logs, Compliance Reports"
    },
    {
        article: "Art. 14",
        requirement: "A human must be able to monitor and intervene in AI actions",
        solution: "Human approval workflows for flagged tool calls. Policy engine is human-defined; AI operates within human-set boundaries.",
        product: "Policy Engine, Approval Workflows"
    }
];

const EU_ACT_ARTICLES = [
    {
        title: "Article 09: Risk Management",
        href: "/learn/eu-ai-act-high-risk-ai-assessment",
        desc: "Evidence-based risk assessments for autonomous agent workflows.",
        icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
        pill: "Foundation"
    },
    {
        title: "Article 13: Auditable Logging",
        href: "/eu-ai-act/article-12",
        desc: "Tamper-proof, cryptographically signed record of every agentic intervention.",
        icon: <History className="w-6 h-6 text-blue-400" />,
        pill: "Monitoring"
    },
    {
        title: "Article 14: Human Oversight",
        href: "/eu-ai-act/article-14",
        desc: "Enforcing manual approval gates for sensitive agentic outcomes.",
        icon: <ShieldAlert className="w-6 h-6 text-blue-400" />,
        pill: "Oversight"
    }
];

export default function EuAiActClient() {
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>EU AI Act Compliance Hub</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             Every Article. <br />
                             <span className="text-blue-500 font-bold italic underline decoration-white/10 uppercase italic">Every Agent.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             Regulation doesn&apos;t have to be a &ldquo;black box.&rdquo; SupraWall helps AI developers comply with Europe&apos;s most stringent rules in one SDK integration.
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 TABLE MAPPING SECTION */}
            <section className="py-24 px-6 bg-black border-y border-white/5">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">The Compliance <span className="text-blue-500">Moat</span></h2>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Direct mapping of SupraWall capabilities to EU AI Act requirements.</p>
                    </div>
                    
                    <div className="overflow-x-auto rounded-[3rem] border border-white/10 bg-neutral-900/20 shadow-2xl">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-neutral-900/80">
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">Article</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">What It Requires</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">What SupraWall Does</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">Product Location</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold italic uppercase tracking-tighter text-white">
                                {EU_ACT_MAPPING.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-8 border-t border-white/5 text-blue-500 font-black">{row.article}</td>
                                        <td className="p-8 border-t border-white/5 text-neutral-200">{row.requirement}</td>
                                        <td className="p-8 border-t border-white/5 text-neutral-400 group-hover:text-white transition-colors">{row.solution}</td>
                                        <td className="p-8 border-t border-white/5 text-neutral-600 group-hover:text-blue-500 transition-colors uppercase italic font-bold">{row.product}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

             {/* 🎯 CORE ARTICLES GRID */}
            <section className="py-24 px-6 md:px-0 bg-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                   {EU_ACT_ARTICLES.map((art, i) => (
                       <Link 
                            key={art.href} 
                            href={art.href}
                            className="group p-1 bg-neutral-900/40 border border-white/5 rounded-[4rem] hover:border-blue-500/30 transition-all hover:bg-neutral-900/60 overflow-hidden relative shadow-2xl"
                       >
                            <div className="p-12 space-y-8 h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                     <div className="flex items-center gap-3">
                                         <div className="p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">{art.icon}</div>
                                         <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{art.pill}</span>
                                     </div>
                                    <h3 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none group-hover:text-blue-400 transition-colors uppercase italic">{art.title}</h3>
                                    <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-snug">{art.desc}</p>
                                </div>
                                <div className="flex items-center gap-2 text-white/50 font-black uppercase tracking-widest text-xs group-hover:text-blue-500 transition-all uppercase italic">
                                    SEE COMPLIANCE PATH <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                       </Link>
                    ))}
                </div>
            </section>

             {/* 🎯 PLATFORM STATS SECTION */}
             <section className="py-40 px-6 bg-[#030303] relative border-y border-white/5 overflow-hidden text-center">
                 <div className="max-w-7xl mx-auto space-y-16">
                    <TagBadge>Regulator Ready</TagBadge>
                    <h2 className="text-5xl md:text-[7rem] font-black italic uppercase tracking-tighter leading-[0.8] text-glow">
                         Designed for <br />
                         <span className="text-blue-500 font-bold italic underline decoration-white/10 uppercase italic">Conformity.</span>
                    </h2>
                     <p className="text-xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        SupraWall turns regular agentic workflows into &ldquo;High-Risk Compliant&rdquo; architectures with zero friction. From Article 9 to 14, we &lsquo;ve handled the engineering so you can handle the product.
                     </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                         <Link href="/learn/eu-ai-act-compliance-ai-agents" className="px-12 py-6 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white/5 transition-all underline decoration-white/10 underline-offset-8">
                             Read Compliance Guide
                         </Link>
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 bg-black relative text-center">
                <div className="absolute inset-0 bg-blue-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <TagBadge>Ready for Audit</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        Compliance Won. <br />
                        <span className="text-blue-500 underline decoration-white/20 font-bold italic uppercase italic font-bold">Evidence Shipped.</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        Don&apos;t build a compliance team. Enable SupraWall Audit Trail and get back to building the product. 
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/beta" className="px-16 py-8 bg-blue-600 text-white font-black text-3xl rounded-3xl hover:bg-blue-500 transition-all shadow-[0_0_100px_rgba(59,130,246,0.3)] tracking-tighter flex items-center gap-4 group">
                             Implement AI Act Shield <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
