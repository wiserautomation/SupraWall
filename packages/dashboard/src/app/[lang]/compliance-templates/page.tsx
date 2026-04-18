// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { i18n, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import TemplatesHubClient from "./TemplatesHubClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://www.supra-wall.com';
    const internalSlug = 'compliance-templates';

    // Build alternates for hreflang pointing to public aliases
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        const publicSlug = SLUG_MAP[internalSlug]?.[l] || internalSlug;
        languages[l] = `${baseUrl}/${l}/${publicSlug}`;
    });
    languages['x-default'] = `${baseUrl}/en/compliance-templates`;

    return {
        title: "EU AI Act Compliance Templates | SupraWall Blueprints",
        description: "Explore 8 deterministic compliance templates for high-risk AI sectors under Annex III of the EU AI Act. Automated controls for HR, Biometrics, Health, and more.",
        alternates: {
            canonical: `${baseUrl}/${lang}/compliance-templates`,
            languages,
        },
        openGraph: {
            title: "SupraWall Compliance Template Hub",
            description: "Ready-to-use compliance blueprints for all 8 high-risk AI categories.",
            url: `${baseUrl}/${lang}/compliance-templates`,
            siteName: "SupraWall",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ComplianceTemplatesHub({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
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
                "name": (dictionary as any).navbar?.solutions || "Compliance",
                "item": `https://www.supra-wall.com/${lang}/compliance-templates`
            }
        ]
    };
    
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <TemplatesHubClient dictionary={dictionary} lang={lang} />
            <Footer lang={lang} dictionary={dictionary} />
        </div>
    );
}
