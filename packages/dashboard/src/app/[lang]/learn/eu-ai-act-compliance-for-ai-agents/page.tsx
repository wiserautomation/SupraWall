// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import EUAIActPillarClient from "./EUAIActPillarClient";
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
        "inLanguage": lang,
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

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <EUAIActPillarClient dictionary={dictionary} lang={lang} />
        </div>
    );
}
