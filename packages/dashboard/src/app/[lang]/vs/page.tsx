// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import VsHubClient from "./VsHubClient";
import { getDictionary } from "../../../i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = "https://www.supra-wall.com";
    const isDefault = lang === i18n.defaultLocale;
    const internalSlug = 'vs';

    // Build alternates for hreflang pointing to public aliases
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        const publicSlug = SLUG_MAP[internalSlug]?.[l] || internalSlug;
        languages[l] = `${baseUrl}/${l}/${publicSlug}`;
    });
    const defaultPublicSlug = SLUG_MAP[internalSlug]?.['en'] || internalSlug;
    languages["x-default"] = `${baseUrl}/en/${defaultPublicSlug}`;

    const currentPublicSlug = SLUG_MAP[internalSlug]?.[lang] || internalSlug;

    return {
        title: "SupraWall vs Alternatives | AI Agent Security Comparison",
        description: "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey. Honest feature-by-feature breakdown for AI teams.",
        keywords: [
            "SupraWall vs alternatives",
            "ai agent security comparison",
            "best ai agent security platform",
            "ai guardrails comparison 2026",
            "ai agent security alternatives",
            "Galileo alternative",
            "NeMo alternative",
            "Guardrails AI alternative",
            "compare ai agent security tools"
        ],
        alternates: {
            canonical: `${baseUrl}/${lang}/${currentPublicSlug}`,
            languages,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: "SupraWall vs Alternatives | AI Agent Security Comparison",
            description: "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey",
            url: `${baseUrl}/${lang}/${currentPublicSlug}`,
            siteName: "SupraWall",
            type: "website",
        },
    };
}

export default async function VsHubPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "SupraWall vs Alternatives",
        "description": "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey. Honest feature-by-feature breakdown for AI teams.",
        "url": `https://www.supra-wall.com/${lang}/vs`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "SupraWall vs Galileo", "url": "https://www.supra-wall.com/vs/galileo" },
                { "@type": "ListItem", "position": 2, "name": "SupraWall vs NVIDIA NeMo", "url": "https://www.supra-wall.com/vs/nemo-guardrails" },
                { "@type": "ListItem", "position": 3, "name": "SupraWall vs Guardrails AI", "url": "https://www.supra-wall.com/vs/guardrails-ai" },
                { "@type": "ListItem", "position": 4, "name": "SupraWall vs Lakera", "url": "https://www.supra-wall.com/vs/lakera" }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": `https://www.supra-wall.com/${lang}/vs` }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <VsHubClient dictionary={dictionary} />
        </div>
    );
}
