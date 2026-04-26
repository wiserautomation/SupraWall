// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import NewsIndexClient from "./NewsIndexClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'news',
        title: "AI Agent Security News | SupraWall",
        description: "Breaking news and analysis on AI agent security, EU AI Act enforcement, agentic threats, and emerging frameworks. Updated weekly by the SupraWall Security Team.",
        keywords: [
            "AI agent security news",
            "EU AI Act news",
            "agentic AI security updates",
            "LLM security news",
            "AI agent threats 2026",
            "AI governance news",
        ],
        ogType: "website"
    });
}

export default async function NewsIndexPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    
    // News is currently English-only
    if (lang !== 'en') notFound();
    
    const dictionary = await getDictionary(lang);

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        name: "SupraWall",
        url: "https://www.supra-wall.com",
        logo: "https://www.supra-wall.com/logo.png",
        description:
            "AI agent runtime security platform covering threats, regulation, and frameworks for autonomous AI.",
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com/en" },
            { "@type": "ListItem", position: 2, name: "News", item: "https://www.supra-wall.com/en/news" },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar lang={lang} dictionary={dictionary} />
            <NewsIndexClient />
        </div>
    );
}

