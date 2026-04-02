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
import { TagBadge } from "@/app/HomeClient";

export default function EuAiActClient({ dictionary }: { dictionary: any }) {
    const t = dictionary.euAiAct;
    
    const EU_ACT_MAPPING = [
        {
            article: "Art. 9",
            requirement: t.mapping.art9.req,
            solution: t.mapping.art9.sol,
            product: "Policy Engine, Compliance Templates"
        },
        {
            article: "Art. 13",
            requirement: t.mapping.art12.req,
            solution: t.mapping.art12.sol,
            product: "Audit Logs, Compliance Reports"
        },
        {
            article: "Art. 14",
            requirement: t.mapping.art14.req,
            solution: t.mapping.art14.sol,
            product: "Policy Engine, Approval Workflows"
        }
    ];

    const EU_ACT_ARTICLES = [
        {
            title: t.articles.art9.title,
            href: "/learn/eu-ai-act-high-risk-ai-assessment",
            desc: t.articles.art9.desc,
            icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
            pill: "Foundation"
        },
        {
            title: t.articles.art12.title,
            href: "/eu-ai-act/article-12",
            desc: t.articles.art12.desc,
            icon: <History className="w-6 h-6 text-blue-400" />,
            pill: "Monitoring"
        },
        {
            title: t.articles.art14.title,
            href: "/eu-ai-act/article-14",
            desc: t.articles.art14.desc,
            icon: <ShieldAlert className="w-6 h-6 text-blue-400" />,
            pill: "Oversight"
        }
    ];

    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>{t.hero.badge}</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             {t.hero.headlinePrefix} <br />
                             <span className="text-blue-500 font-bold italic underline decoration-white/10 uppercase italic">{t.hero.headlineEmphasis}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             {t.hero.subheadline}
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 TABLE MAPPING SECTION */}
            <section className="py-24 px-6 bg-black border-y border-white/5">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t.moat.title} <span className="text-blue-500">{t.moat.moatWord}</span></h2>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">{t.moat.subtitle}</p>
                    </div>
                    
                    <div className="overflow-x-auto rounded-[3rem] border border-white/10 bg-neutral-900/20 shadow-2xl">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-neutral-900/80">
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">{t.table.article}</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">{t.table.requires}</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">{t.table.does}</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">{t.table.location}</th>
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
                                    {t.articles.cta} <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                       </Link>
                    ))}
                </div>
            </section>

             {/* 🎯 PLATFORM STATS SECTION */}
             <section className="py-40 px-6 bg-[#030303] relative border-y border-white/5 overflow-hidden text-center">
                 <div className="max-w-7xl mx-auto space-y-16">
                    <TagBadge>{t.conformity.badge}</TagBadge>
                    <h2 className="text-5xl md:text-[7rem] font-black italic uppercase tracking-tighter leading-[0.8] text-glow">
                         {t.conformity.titlePrefix} <br />
                         <span className="text-blue-500 font-bold italic underline decoration-white/10 uppercase italic">{t.conformity.titleEmphasis}</span>
                    </h2>
                     <p className="text-xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        {t.conformity.description}
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
                    <TagBadge>{t.final.badge}</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        {t.final.titlePrefix} <br />
                        <span className="text-blue-500 underline decoration-white/20 font-bold italic uppercase italic font-bold">{t.final.titleEmphasis}</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                        {t.final.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href="/beta" className="px-16 py-8 bg-blue-600 text-white font-black text-3xl rounded-3xl hover:bg-blue-500 transition-all shadow-[0_0_100px_rgba(59,130,246,0.3)] tracking-tighter flex items-center gap-4 group">
                             {t.final.cta} <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
