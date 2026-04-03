// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import GdprClient from "./GdprClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = "https://www.supra-wall.com";
    const isDefault = lang === i18n.defaultLocale;
    const internalSlug = 'gdpr';

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
        title: "GDPR for AI Agents. Secured at the SDK. | SupraWall",
        description: "Zero-PII leakage for autonomous agentic systems. Automated redaction for every outbound tool call.",
        keywords: [
            "GDPR compliance AI agents",
            "PII scrubbing for AI tools",
            "redact customer data LLM",
            "GDPR Article 25 AI governance",
            "automated data masking for agents",
            "suprawall pii shield gdpr",
        ],
        alternates: {
            canonical: `${baseUrl}/${lang}/gdpr`,
            languages,
        },
        robots: {
            index: isDefault,
            follow: true,
        },
        openGraph: {
            title: "GDPR for AI Agents. Secured at the SDK.",
            description: "Zero-PII leakage for autonomous agentic systems. Automated redaction for every outbound tool call.",
            url: `${baseUrl}/${lang}/gdpr`,
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
        "@type": "WebPage",
        "name": "SupraWall GDPR Compliance Shield",
        "description": "Zero-PII leakage for autonomous agentic systems.",
        "url": `https://www.supra-wall.com/${lang}/gdpr`,
        "inLanguage": lang,
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <GdprClient dictionary={dictionary} />
        </div>
    );
}
