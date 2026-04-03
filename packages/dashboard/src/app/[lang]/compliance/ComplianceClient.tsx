// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Navbar } from "@/components/Navbar";
import { 
    Shield, CheckCircle2, ArrowRight, FileText, Scale, 
    Lock, Activity, Globe, Zap, ListCheck 
} from "lucide-react";
import Link from "next/link";

export default function ComplianceClient({ dictionary }: { dictionary: any }) {
    const t = dictionary.compliance;
    const common = dictionary.common;

    const articles = [
        {
            article: "Article 12",
            name: t.articles.art12.name,
            desc: t.articles.art12.desc,
            feature: t.articles.art12.feature,
            href: "/eu-ai-act/article-12"
        },
        {
            article: "Article 14",
            name: t.articles.art14.name,
            desc: t.articles.art14.desc,
            feature: t.articles.art14.feature,
            href: "/eu-ai-act/article-14"
        },
        {
            article: "Article 10",
            name: t.articles.art10.name,
            desc: t.articles.art10.desc,
            feature: t.articles.art10.feature,
            href: "#"
        },
        {
            article: "Article 15",
            name: t.articles.art15.name,
            desc: t.articles.art15.desc,
            feature: t.articles.art15.feature,
            href: "#"
        }
    ];

    const roadmapRows = [
        { req: t.roadmap.table.rows.transparency.req, control: t.roadmap.table.rows.transparency.control, status: "Active" },
        { req: t.roadmap.table.rows.techDoc.req, control: t.roadmap.table.rows.techDoc.control, status: "Active" },
        { req: t.roadmap.table.rows.riskMgmt.req, control: t.roadmap.table.rows.riskMgmt.control, status: "Active" },
        { req: t.roadmap.table.rows.conformity.req, control: t.roadmap.table.rows.conformity.control, status: "Active" }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <main className="pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    
                    {/* Hero Section */}
                    <section className="text-center space-y-12 max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-sm font-black text-emerald-400 uppercase tracking-widest animate-fade-in">
                            <Globe className="w-4 h-4 mr-2" /> {t.hero.badge}
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            {t.hero.titlePrefix} <br />
                            <span className="text-emerald-500 text-glow">{t.hero.titleEmphasis}</span> <br />
                            {t.hero.titleSuffix}
                        </h2>
                        <p className="text-xl md:text-2xl text-neutral-400 font-medium italic leading-relaxed">
                            {t.hero.description}
                        </p>
                    </section>

                    {/* Mapping Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((item, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-emerald-500/30 transition-all">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-4">
                                        <div className="text-emerald-500 font-black text-4xl italic tracking-tighter uppercase">{item.article}</div>
                                        <h3 className="text-2xl font-bold">{item.name}</h3>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                                        <Scale className="w-6 h-6 text-neutral-400 group-hover:text-emerald-500" />
                                    </div>
                                </div>
                                <p className="text-neutral-400 mb-8 leading-relaxed">
                                    {item.desc}
                                </p>
                                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">{item.feature}</span>
                                    </div>
                                    {item.href !== "#" && (
                                        <Link href={item.href} className="text-emerald-500 font-bold uppercase text-xs flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                            Deep Dive <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Enterprise Comparison/Feature Table */}
                    <section className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight">{t.roadmap.title}</h2>
                            <p className="text-neutral-500">{t.roadmap.subtitle}</p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/20 backdrop-blur-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="p-6 text-sm font-black uppercase tracking-widest text-neutral-400">{t.roadmap.table.head.req}</th>
                                        <th className="p-6 text-sm font-black uppercase tracking-widest text-neutral-400">{t.roadmap.table.head.control}</th>
                                        <th className="p-6 text-sm font-black uppercase tracking-widest text-neutral-400">{t.roadmap.table.head.status}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {roadmapRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="p-6 font-bold">{row.req}</td>
                                            <td className="p-6 text-neutral-400">{row.control}</td>
                                            <td className="p-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 uppercase">
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Technical Integration CTA */}
                    <section className="relative p-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 rounded-[3rem] overflow-hidden">
                        <div className="bg-black rounded-[2.9rem] p-12 md:p-20 flex flex-col items-center text-center space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                            
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none max-w-4xl relative z-10">
                                {t.cta.titlePrefix} <br />
                                <span className="text-emerald-500">{t.cta.titleEmphasis}</span> {t.cta.titleSuffix}
                            </h2>
                            <p className="text-xl text-neutral-400 max-w-2xl relative z-10">
                                {t.cta.description}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                <Link 
                                    href="/beta" 
                                    className="px-12 py-5 bg-white text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105"
                                >
                                    {t.cta.bookAudit}
                                </Link>
                                <Link 
                                    href="/docs" 
                                    className="px-12 py-5 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white/5 transition-all"
                                >
                                    {common.viewDocs}
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
