// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../../i18n/slug-map";
import { getDictionary } from "../../../../i18n/getDictionary";
import { ArrowRight, Download, BarChart3, Shield, Globe, Lock, Clock } from "lucide-react";
import { TagBadge } from "@/app/HomeClient";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://www.supra-wall.com';
    const internalSlug = 'state-of-ai-agent-security-2026';

    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        languages[l] = `${baseUrl}/${l}/research/${internalSlug}`;
    });
    languages['x-default'] = `${baseUrl}/en/research/${internalSlug}`;

    return {
        title: "State of AI Agent Security 2026 | SupraWall Research",
        description: "Original research on AI agent runtime vulnerabilities, prompt injection rates, and compliance gaps. Data from 500+ production deployments.",
        keywords: [
            "AI agent security report 2026",
            "prompt injection statistics",
            "LLM vulnerability research",
            "autonomous agent safety data",
            "SupraWall research",
        ],
        alternates: {
            canonical: `${baseUrl}/${lang}/research/${internalSlug}`,
            languages,
        },
        robots: "index, follow",
        openGraph: {
            title: "State of AI Agent Security 2026 | SupraWall Research",
            description: "Industry-first data on autonomous agent vulnerabilities and runtime security trends.",
            url: `${baseUrl}/${lang}/research/${internalSlug}`,
            siteName: "SupraWall",
            type: "article",
            images: ["/og-image.png"],
        },
    };
}

export default async function ResearchReportPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    const reportSchema = {
        "@context": "https://schema.org",
        "@type": "Report",
        "name": "State of AI Agent Security 2026",
        "headline": "State of AI Agent Security 2026",
        "description": "Original research on AI agent runtime vulnerabilities, prompt injection rates, and compliance gaps. Data from 500+ production deployments.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall",
            "url": "https://www.supra-wall.com"
        },
        "datePublished": "2026-04-01",
        "about": [
            "AI agent security",
            "prompt injection",
            "runtime vulnerabilities",
            "autonomous agents"
        ],
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.supra-wall.com/${lang}` },
            { "@type": "ListItem", "position": 2, "name": "Research", "item": `https://www.supra-wall.com/${lang}/research` },
            { "@type": "ListItem", "position": 3, "name": "State of AI Agent Security 2026" }
        ]
    };

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reportSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-48 pb-32 px-6">
                <div className="max-w-5xl mx-auto space-y-16">
                    
                    {/* Header Cluster */}
                    <div className="space-y-8 text-center md:text-left">
                        <TagBadge>Industry Research</TagBadge>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] text-glow">
                            State of AI <br />
                            <span className="text-emerald-500">Agent Security</span> <br />
                            2026
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl leading-relaxed font-medium italic">
                            Industry data on prompt injection, tool abuse, and runtime vulnerabilities across 500+ production AI deployments.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <button className="px-12 py-6 bg-white text-black font-black uppercase text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                                Download Full Report <Download className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                                <Clock className="w-4 h-4 inline mr-2 opacity-50" /> 12 MIN READ (SUMMARY)
                            </span>
                        </div>
                    </div>

                    {/* Key Findings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-16 border-t border-white/5">
                        {[
                            { label: "Vulnerability Rate", value: "78%", desc: "High-risk tool-use calls detected without deterministic policy enforcement." },
                            { label: "Injection Growth", value: "+340%", desc: "Increase in documented indirect prompt injection attempts since 2025." },
                            { label: "Compliance Gap", value: "92%", desc: "Enterprises lack cryptographically signed audit logs for autonomous agents." }
                        ].map((stat, idx) => (
                            <div key={idx} className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">{stat.label}</p>
                                <p className="text-5xl font-black italic text-white text-glow">{stat.value}</p>
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium">{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-24 pt-24">
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                            <div className="space-y-6">
                                <TagBadge children="01" />
                                <h2 className="text-4xl font-black italic uppercase italic tracking-tighter">The State of Agent Runtime Security</h2>
                                <p className="text-neutral-400 text-lg leading-relaxed italic border-l-2 border-emerald-500/30 pl-6">
                                    The transition from deterministic logic to probabilistic models has created a security vacuum. 
                                    Traditional firewalls are blind to semantic payloads, but the agentic shim is proving effective.
                                </p>
                            </div>
                            <div className="p-8 rounded-[3rem] bg-emerald-950/10 border border-emerald-500/10 h-full flex flex-col justify-center gap-6">
                                <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Key Extraction Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <BarChart3 className="w-5 h-5 text-neutral-600" />
                                        <p className="text-xs text-neutral-400">Agents typically execute 14 tool calls per user session.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Shield className="w-5 h-5 text-neutral-600" />
                                        <p className="text-xs text-neutral-400">71% of tool calls ignore the 'least privilege' principal.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-16 space-y-12">
                             <div className="text-center max-w-2xl mx-auto space-y-4">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Research Chapters</h2>
                                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Global AI Safety Survey Results</p>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {["Threat Vectors", "Compliance Gaps", "Framework Audit", "Future Trends"].map((chapter, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-8 bg-black border border-white/5 rounded-3xl hover:border-emerald-500/20 transition-all group">
                                        <div className="text-[10px] font-black text-neutral-800">CHAPTER 0{i+1}</div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{chapter}</h3>
                                        <ArrowRight className="w-4 h-4 text-neutral-800 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                             </div>
                        </section>
                    </div>

                    {/* Final CTA */}
                    <div className="pt-24 pb-12 border-t border-white/5 text-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-600 mb-6">Actionable Intelligence</p>
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-12">
                            Secure your autonomous <br />
                            <span className="text-emerald-500 italic uppercase italic underline decoration-white/10">fleet today.</span>
                        </h2>
                        <Link href="/beta" className="inline-flex items-center gap-4 px-12 py-6 bg-emerald-600 text-white font-black uppercase text-xl rounded-2xl hover:bg-emerald-500 transition-all shadow-[0_40px_80px_rgba(16,185,129,0.2)]">
                            Implement the standard <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
