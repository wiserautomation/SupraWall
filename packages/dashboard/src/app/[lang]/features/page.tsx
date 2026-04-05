// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import FeaturesClient from "./FeaturesClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = "https://www.supra-wall.com";
    const isDefault = lang === i18n.defaultLocale;

    // Build alternates for hreflang
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        languages[l] = `${baseUrl}/${l}/features`;
    });
    languages["x-default"] = `${baseUrl}/en/features`;

    return {
        title: "Enterprise AI Security Features | SupraWall Firewall",
        description: "Explore the security stack for autonomous agents. Prompt injection shields, deterministic PII redaction, and runtime tool enforcement.",
        alternates: {
            canonical: `${baseUrl}/${lang}/features`,
            languages,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: "Enterprise AI Security Features | SupraWall Firewall",
            description: "Explore the security stack for autonomous agents. Prompt injection shields, deterministic PII redaction, and runtime tool enforcement.",
            url: `${baseUrl}/${lang}/features`,
            siteName: "SupraWall",
            type: "website",
        },
    };
}

import { getDictionary } from "../../../i18n/getDictionary";

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "name": "SupraWall AI Agent Security Features",
                "description": "Full-stack security features for autonomous agentic swarms.",
                "inLanguage": lang,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "PII Shield", "url": `https://www.supra-wall.com/${lang}/features/pii-shield` },
                    { "@type": "ListItem", "position": 2, "name": "Guardrails", "url": `https://www.supra-wall.com/${lang}/features/guardrails` },
                    { "@type": "ListItem", "position": 3, "name": "Policy Engine", "url": `https://www.supra-wall.com/${lang}/features/policy-engine` },
                    { "@type": "ListItem", "position": 4, "name": "Human Oversight", "url": `https://www.supra-wall.com/${lang}/features/human-in-the-loop` },
                    { "@type": "ListItem", "position": 5, "name": "Secret Vault", "url": `https://www.supra-wall.com/${lang}/features/vault` },
                    { "@type": "ListItem", "position": 6, "name": "Budget Controls", "url": `https://www.supra-wall.com/${lang}/features/budget-limits` }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.supra-wall.com/${lang}` },
                    { "@type": "ListItem", "position": 2, "name": "Features", "item": `https://www.supra-wall.com/${lang}/features` }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <FeaturesClient dictionary={dictionary} />
        </div>
    );
}
