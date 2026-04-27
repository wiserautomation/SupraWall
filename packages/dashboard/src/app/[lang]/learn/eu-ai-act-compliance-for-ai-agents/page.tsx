// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import EUAIActPillarClient from "./EUAIActPillarClient";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);
    const t = dictionary.euAiActPillar || { hero: { title: "EU AI Act Compliance", emphasis: "for AI Agents" } };

    return generateLocalizedMetadata({
        params,
        title: `${t.hero.title} ${t.hero.emphasis} — August 2026 Requirements`,
        description: t.hero.description,
        internalPath: "learn/eu-ai-act-compliance-for-ai-agents"
    });
}

export default async function EUAIActCompliancePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "inLanguage": "en",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `https://www.supra-wall.com/${lang}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Learn",
                "item": `https://www.supra-wall.com/${lang}/learn`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "EU AI Act Compliance",
                "item": `https://www.supra-wall.com/${lang}/learn/eu-ai-act-compliance-for-ai-agents`
            }
        ]
    };

    
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": "en",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is EU AI Act Compliance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Comprehensive guide on securing autonomous AI agents."
                }
            },
            {
                "@type": "Question",
                "name": "Why is EU AI Act Compliance important for AI agents?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Autonomous AI agents require specialized runtime guardrails to prevent prompt injection, unauthorized tool execution, and budget overruns. Understanding this is critical for secure deployment."
                }
            },
            {
                "@type": "Question",
                "name": "Does SupraWall support EU AI Act Compliance compliance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. SupraWall provides the deterministic SDK-level middleware required to enforce security policies and generate audit logs for EU AI Act Compliance requirements."
                }
            }
        ]
    };
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <EUAIActPillarClient dictionary={dictionary} lang={lang} />
        
            {/* Internal Linking Cluster */}
            <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-20 bg-black">
                <h2 className="text-3xl font-black italic text-white flex items-center gap-4 mb-8">
                    Explore Agent Security Clusters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href={`/en/learn`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-emerald-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-emerald-400 transition-colors">AI Agent Security Hub</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Browse the complete library of agent guardrails.</p>
                    </Link>
                    <Link href={`/en/gdpr`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-purple-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-purple-400 transition-colors">GDPR AI Compliance</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Protect PII across all agent tool calls.</p>
                    </Link>
                    <Link href={`/en/for-compliance-officers`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-blue-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-blue-400 transition-colors">EU AI Act Readiness</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Automate Article 12 audit trails for agents.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
