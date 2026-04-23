"use client";

import { motion } from "framer-motion";
import { 
    AlertTriangle, ArrowRight, CheckCircle2, 
    Scale, FileText, Upload, Filter, UserX, Activity, Lock, Search, Code, Briefcase
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/app/HomeClient";

interface SharedNicheLayoutProps {
    dictionary: any;
    nicheKey: 'hr' | 'banking' | 'healthcare' | 'legal' | 'executives';
}

function getIcon(iconName: string) {
    switch (iconName) {
        case 'upload': return <Upload className="w-6 h-6 text-amber-400" />;
        case 'filter': return <Filter className="w-6 h-6 text-amber-400" />;
        case 'missing-trail': return <Search className="w-6 h-6 text-amber-400" />;
        case 'bias': return <UserX className="w-6 h-6 text-amber-400" />;
        case 'bypass': return <AlertTriangle className="w-6 h-6 text-amber-400" />;
        case 'competitive': return <Activity className="w-6 h-6 text-amber-400" />;
        case 'scope': return <Search className="w-6 h-6 text-amber-400" />;
        case 'notes': return <FileText className="w-6 h-6 text-amber-400" />;
        case 'triage': return <Activity className="w-6 h-6 text-amber-400" />;
        case 'records': return <FileText className="w-6 h-6 text-amber-400" />;
        case 'admin': return <Lock className="w-6 h-6 text-amber-400" />;
        case 'upload-doc': return <Upload className="w-6 h-6 text-amber-400" />;
        case 'draft': return <FileText className="w-6 h-6 text-amber-400" />;
        case 'research': return <Search className="w-6 h-6 text-amber-400" />;
        case 'discovery': return <Scale className="w-6 h-6 text-amber-400" />;
        default: return <AlertTriangle className="w-6 h-6 text-amber-400" />;
    }
}

export default function SharedNicheLayout({ dictionary, nicheKey }: SharedNicheLayoutProps) {
    const t = dictionary.nichePages[nicheKey];
    const shared = dictionary.nichePages.shared;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": t.hero.title,
        "description": t.hero.description,
        "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.supra-wall.com/assets/technical-noir-compliance.png"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Compliance", "item": "https://www.supra-wall.com/compliance-templates" },
                { "@type": "ListItem", "position": 2, "name": t.hero.title }
            ]
        },
        "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": t.faq?.map((f: any) => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                }
            })) || t.boardQuestions?.items?.map((f: any) => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                }
            }))
        }
    };

    return (
        <main className="overflow-hidden bg-[#030303]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {/* 🚀 HERO SECTION (Amber for Risk) */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-amber-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <div className="px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {t.hero.urgency || shared.urgencyBadge}
                    </div>
                    <TagBadge>{t.hero.badge}</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[80px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             {t.hero.title} <br />
                             <span className="text-amber-500 font-bold italic underline decoration-white/10 uppercase italic">{t.hero.emphasis}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             {t.hero.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* 📖 STORY / SCENARIO SECTION */}
            <section className="py-24 px-6 md:px-0 bg-black border-y border-white/5 relative">
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <TagBadge>{t.story.label}</TagBadge>
                    <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] relative">
                        <p className="text-2xl md:text-4xl font-bold text-white italic leading-relaxed tracking-tight">
                            "{t.story.quote}"
                        </p>
                    </div>
                </div>
            </section>

            {/* ⚠️ BEHAVIORAL RISKS & EXPOSURE (Executives has riskMap & boardQuestions instead) */}
            {nicheKey !== 'executives' && (
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto space-y-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            <div className="space-y-10">
                                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-glow">
                                    {t.behaviors?.title}
                                </h2>
                                <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-relaxed">
                                    {t.behaviors?.subtitle}
                                </p>
                                <div className="space-y-6">
                                    {t.behaviors?.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                            <div className="p-3 bg-amber-500/10 rounded-xl h-fit">
                                                {getIcon(item.icon)}
                                            </div>
                                            <div>
                                                <h4 className="text-white text-lg font-black italic uppercase tracking-tighter">{item.title}</h4>
                                                <p className="text-neutral-400 text-sm font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-10">
                                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-glow">
                                    {t.exposure?.title}
                                </h2>
                                <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-relaxed">
                                    {t.exposure?.subtitle}
                                </p>
                                <div className="space-y-6 flex flex-col">
                                    {t.exposure?.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-2 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all">
                                            <span className="text-red-400 text-xs font-black uppercase tracking-widest">{item.tag}</span>
                                            <h4 className="text-white text-xl font-bold tracking-tight">{item.title}</h4>
                                            <p className="text-neutral-400 text-sm">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {nicheKey === 'executives' && (
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto space-y-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            <div className="space-y-10">
                                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-glow">
                                    {t.boardQuestions?.title}
                                </h2>
                                <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-relaxed">
                                    {t.boardQuestions?.subtitle}
                                </p>
                                <div className="space-y-6">
                                    {t.boardQuestions?.items?.map((item: any, i: number) => (
                                        <div key={i} className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                            <h4 className="text-amber-400 text-lg font-black italic uppercase tracking-tighter mb-2">Q: {item.q}</h4>
                                            <p className="text-neutral-300 text-sm font-medium">A: {item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-10">
                                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-glow">
                                    {t.riskMap?.title}
                                </h2>
                                <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-relaxed">
                                    {t.riskMap?.subtitle}
                                </p>
                                <div className="space-y-4">
                                    {t.riskMap?.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white font-bold">{item.dept}</span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${item.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                    {item.urgency}
                                                </span>
                                            </div>
                                            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">{item.regulation}</span>
                                            <p className="text-neutral-400 text-sm">{item.risk}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ✅ COMPLIANT PATH (Blue for solutions) */}
            <section className="py-32 px-6 bg-blue-950/20 border-y border-blue-500/10 relative">
                <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none" />
                <div className="max-w-6xl mx-auto space-y-16 relative z-10">
                    <div className="text-center space-y-6">
                        <TagBadge>{shared.relatedTemplates}</TagBadge>
                        <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-glow text-white">
                            {t.compliantPath?.title || t.actionPlan?.title}
                        </h2>
                        <p className="text-xl text-blue-400 font-bold italic uppercase tracking-tighter">
                            {t.compliantPath?.subtitle || t.actionPlan?.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {(t.compliantPath?.steps || t.actionPlan?.steps)?.slice(0, 5).map((step: any, i: number) => (
                            <div key={i} className="p-6 rounded-3xl bg-blue-900/20 border border-blue-500/20 flex flex-col items-center text-center space-y-4 hover:bg-blue-800/30 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-black italic text-xl">
                                    {step.step}
                                </div>
                                <h4 className="text-white font-bold tracking-tight">{step.title}</h4>
                                <p className="text-blue-200/60 text-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🛑 DUAL CTA (Blue for Business, Emerald for Dev) */}
            <section className="py-40 px-6 bg-black relative text-center">
                <div className="max-w-5xl mx-auto space-y-16 relative z-10">
                    <div className="space-y-6">
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">
                            {shared.dualCtaTitle}
                        </h2>
                        <p className="text-xl text-neutral-400 italic">
                            {shared.dualCtaSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* BUSINESS CTA */}
                        <div className="p-12 rounded-[3rem] bg-blue-950/30 border border-blue-500/20 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center space-y-8 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                            <Briefcase className="w-12 h-12 text-blue-400" />
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-blue-400 text-sm font-black uppercase tracking-widest">{shared.businessPath}</h3>
                                <div className="text-3xl font-black italic uppercase text-white">{t.ctaBusiness.label}</div>
                                <p className="text-neutral-400 italic">{t.ctaBusiness.sublabel}</p>
                            </div>
                            <Link href={t.ctaBusiness.href} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-colors relative z-10 w-full">
                                Book Executive Call
                            </Link>
                        </div>

                        {/* DEV CTA */}
                        <div className="p-12 rounded-[3rem] bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center space-y-8 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                            <Code className="w-12 h-12 text-emerald-400" />
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-emerald-400 text-sm font-black uppercase tracking-widest">{shared.sdkPath}</h3>
                                <div className="text-3xl font-black italic uppercase text-white">{t.ctaDev.label}</div>
                                <p className="text-neutral-400 italic">{t.ctaDev.sublabel}</p>
                            </div>
                            <Link href={t.ctaDev.href} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-colors relative z-10 w-full">
                                View Technical SDK
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
