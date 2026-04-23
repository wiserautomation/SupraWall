// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import GdprClient from "./GdprClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
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
        internalPath: "gdpr"
    });
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
            <GdprClient dictionary={dictionary} lang={lang} />
        </div>
    );
}
