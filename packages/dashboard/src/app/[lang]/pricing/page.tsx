// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import PricingClient from "./PricingClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = "https://www.supra-wall.com";
    const isDefault = lang === i18n.defaultLocale;

    // Build alternates for hreflang
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        languages[l] = `${baseUrl}/${l}/pricing`;
    });
    languages["x-default"] = `${baseUrl}/en/pricing`;

    return {
        title: "Transparent Enterprise Pricing | SupraWall Security",
        description: "Zero-trust security and compliance for AI agentic applications, priced for the scale of autonomous swarms.",
        alternates: {
            canonical: `${baseUrl}/${lang}/pricing`,
            languages,
        },
        robots: {
            index: true,
            follow: true,
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
        "name": "SupraWall Pricing",
        "description": "Enterprise-grade security and compliance for autonomous AI agents.",
        "url": `https://www.supra-wall.com/${lang}/pricing`,
        "inLanguage": lang,
    };

    return (
        <div className="min-h-screen bg-black">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <PricingClient dictionary={dictionary} />
        </div>
    );
}
