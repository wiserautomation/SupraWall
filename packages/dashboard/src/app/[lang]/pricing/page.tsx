// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/slug-map";
import PricingClient from "./PricingClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "Transparent Enterprise Pricing Security",
        description: "Zero-trust security and compliance for AI agentic applications, priced for the scale of autonomous swarms.",
        internalPath: "pricing"
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
    const localizedUrl = `https://www.supra-wall.com${getLocalizedPath('pricing', lang)}`;
    
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "SupraWall Pricing",
        "description": "Enterprise-grade security and compliance for autonomous AI agents.",
        "url": localizedUrl,
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
