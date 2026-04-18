// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { 
    Shield, CheckCircle2, ArrowRight, FileText, Scale, 
    Lock, Activity, Globe, Zap, ListCheck, AlertTriangle,
    ShieldCheck, ClipboardCheck, Clock
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/app/HomeClient";
import { complianceMatrix, Regulation } from "@/data/compliance-matrix";

export default function ComplianceClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const t = dictionary.compliance;
    const common = dictionary.common;

    const regulationIcons: Record<Regulation, any> = {
        'EU_AI_ACT': <Shield className="w-6 h-6 text-blue-400" />,
        'GDPR': <Lock className="w-6 h-6 text-purple-400" />,
        'NIS2': <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        'DORA': <Activity className="w-6 h-6 text-amber-400" />,
        'ISO_42001': <ClipboardCheck className="w-6 h-6 text-blue-500" />,
        'CRA': <Zap className="w-6 h-6 text-rose-400" />
    };

    return (
        <main className="overflow-hidden bg-[#030303] text-white">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>{t.hero.badge}</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             {t.hero.title} <br />
                             <span className="text-emerald-500 font-bold italic underline decoration-white/10 italic">{t.hero.emphasis}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             {t.hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* 📑 THE FULL REGULATORY STACK */}
            <section className="py-24 px-6 border-y border-white/5 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter uppercase italic">{t.regulations.title}</h2>
                        <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter">{t.regulations.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(t.regulations.rows).map(([key, reg]: [string, any]) => (
                            <div key={key} className="p-8 rounded-[2rem] bg-neutral-900/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                        {regulationIcons[key.toUpperCase().replace('EUAI', 'EU_AI_') as Regulation] || <Shield />}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest">{reg.fine}</span>
                                        <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {reg.deadline}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{reg.name}</h3>
                                <p className="text-neutral-400 text-sm font-bold uppercase tracking-tight mb-6">{reg.feature}</p>
                                <Link href={`/${lang}/learn/${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-colors">
                                    View Pillar <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🛡️ THE MASTER MATRIX */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter uppercase italic leading-none">{t.matrix.title}</h2>
                            <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-snug">
                                {t.matrix.subtitle}
                            </p>
                        </div>
                        <div className="flex gap-4">
                             <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase text-rose-500 tracking-widest">
                                <AlertTriangle className="w-3 h-3" /> Critical Liability
                             </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900/20 backdrop-blur-2xl shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.matrix.headers.article}</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.matrix.headers.requirement}</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.matrix.headers.feature}</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">{t.matrix.headers.evidence}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {complianceMatrix.map((item, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-8">
                                                <div className="space-y-1">
                                                    <div className="text-emerald-500 font-black text-xl italic tracking-tighter uppercase">{item.article}</div>
                                                    <div className="text-[9px] font-black uppercase text-neutral-600 tracking-widest">{item.regulation.replace('_', ' ')}</div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-white text-sm font-bold leading-relaxed max-w-xs">{item.requirement}</p>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-wrap gap-2">
                                                    {item.suprawallFeature.map(f => (
                                                        <span key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-neutral-400 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
                                                            {f.replace('-', ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3 text-neutral-500 group-hover:text-white transition-colors">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.evidenceGenerated}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🎯 SECTOR-SPECIFIC BLUEPRINTS (GEO SECTION) */}
            <section className="py-24 px-6 bg-black border-y border-white/5">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <TagBadge>ANNEX III</TagBadge>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">SECTOR-SPECIFIC <span className="text-blue-500">TEMPLATES</span></h2>
                            <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-snug">
                                Pre-configured guardrail blueprints for the 8 high-risk categories of the EU AI Act. 
                            </p>
                        </div>
                        <Link 
                            href={`/${lang}/compliance-templates`} 
                            className="group flex items-center gap-4 text-white font-black uppercase tracking-tighter text-xl border-b-2 border-emerald-500/30 pb-2 hover:border-emerald-500 transition-all"
                        >
                            View All Blueprints <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform text-emerald-500" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['biometrics', 'hr-employment', 'education', 'healthcare'].map((slug) => (
                            <Link 
                                key={slug}
                                href={`/${lang}/compliance-templates/${slug}`}
                                className="p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-white group-hover:text-blue-400 transition-colors">
                                    {slug.replace('-', ' ')}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600 group-hover:text-emerald-500 transition-colors">
                                    Get Template <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🎁 EVIDENCE KIT CTA */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[4rem] p-1 bg-gradient-to-br from-emerald-500/20 via-white/5 to-purple-500/20">
                    <div className="bg-[#050505] rounded-[3.9rem] p-16 md:p-24 space-y-12 text-center relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full -mr-48 -mt-48" />
                         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full -ml-48 -mb-48" />
                         
                         <TagBadge>Regulator Ready</TagBadge>
                         <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-glow">
                             {t.cta.title}
                         </h2>
                         <p className="text-xl text-neutral-400 max-w-2xl mx-auto italic font-medium">
                             {t.cta.description}
                         </p>
                         
                         <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                             <Link href="#" className="px-12 py-6 bg-white text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                 {t.cta.cta}
                             </Link>
                             <Link href="#" className="px-12 py-6 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white/5 transition-all">
                                 {t.cta.checker}
                             </Link>
                         </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
