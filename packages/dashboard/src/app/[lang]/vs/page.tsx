// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { getLocalizedPath } from "../../../i18n/slug-map";
import VsHubClient from "./VsHubClient";
import { getDictionary } from "../../../i18n/getDictionary";
import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "SupraWall vs Alternatives | AI Agent Security Comparison",
        description: "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey. Honest feature-by-feature breakdown for AI teams.",
        keywords: [
            "SupraWall vs alternatives",
            "ai agent security comparison",
            "best ai agent security platform",
            "ai guardrails comparison 2026",
            "Galileo alternative",
            "NeMo alternative",
            "Guardrails AI alternative"
        ],
        internalPath: "vs"
    });
}

export default async function VsHubPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    const localizedUrl = `https://www.supra-wall.com${getLocalizedPath('vs', lang)}`;
    
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "SupraWall vs Alternatives",
        "description": "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey. Honest feature-by-feature breakdown for AI teams.",
        "url": localizedUrl,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "SupraWall vs Galileo", "url": `https://www.supra-wall.com${getLocalizedPath('vs/galileo', lang)}` },
                { "@type": "ListItem", "position": 2, "name": "SupraWall vs NVIDIA NeMo", "url": `https://www.supra-wall.com${getLocalizedPath('vs/nemo-guardrails', lang)}` },
                { "@type": "ListItem", "position": 3, "name": "SupraWall vs Guardrails AI", "url": `https://www.supra-wall.com${getLocalizedPath('vs/guardrails-ai', lang)}` },
                { "@type": "ListItem", "position": 4, "name": "SupraWall vs Lakera", "url": `https://www.supra-wall.com${getLocalizedPath('vs/lakera', lang)}` }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": localizedUrl }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <VsHubClient lang={lang} dictionary={dictionary} />
        </div>
    );
}
