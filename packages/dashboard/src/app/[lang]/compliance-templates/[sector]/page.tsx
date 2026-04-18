// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { SLUG_MAP } from "@/i18n/slug-map";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { sectorTemplates, getTemplateBySlug } from "@/data/compliance-matrix";
import SectorTemplateClient from "./SectorTemplateClient";

export async function generateStaticParams() {
    const params = [];
    for (const locale of i18n.locales) {
        for (const template of sectorTemplates) {
            params.push({ lang: locale, sector: template.slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; sector: string }> }): Promise<Metadata> {
    const { lang, sector } = await params;
    const template = getTemplateBySlug(sector);
    if (!template) return {};

    const dictionary = await getDictionary(lang as Locale);
    const localized = (dictionary as any).complianceTemplates?.sectors?.[sector];
    if (!localized) return {};

    const baseUrl = 'https://www.supra-wall.com';
    
    // Build alternates for hreflang
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        const publicSectorSlug = SLUG_MAP[sector]?.[l] || sector;
        const publicHubSlug = SLUG_MAP['compliance-templates']?.[l] || 'compliance-templates';
        languages[l] = `${baseUrl}/${l}/${publicHubSlug}/${publicSectorSlug}`;
    });
    languages['x-default'] = `${baseUrl}/en/compliance-templates/${sector}`;

    return {
        title: `${localized.title} | Annex III Compliance Blueprint`,
        description: localized.opening,
        alternates: {
            canonical: `${baseUrl}/${lang}/compliance-templates/${sector}`,
            languages,
        },
        openGraph: {
            title: localized.title,
            description: localized.opening,
            url: `${baseUrl}/${lang}/compliance-templates/${sector}`,
            siteName: "SupraWall",
            type: "article",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function SectorTemplatePage({
    params,
}: {
    params: Promise<{ lang: string; sector: string }>;
}) {
    const { lang, sector } = (await params) as { lang: Locale; sector: string };
    const template = getTemplateBySlug(sector);
    
    if (!template) {
        notFound();
    }

    const dictionary = await getDictionary(lang);
    const localized = (dictionary as any).complianceTemplates?.sectors?.[sector];

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
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": localized?.title || sector,
                "item": `https://www.supra-wall.com/${lang}/compliance-templates/${sector}`
            }
        ]
    };

    const techServiceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `SupraWall ${localized?.title} Compliance Template`,
        "description": localized?.opening,
        "provider": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "areaServed": "EU",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "EU AI Act Compliance Blueprints",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Deterministic Risk Mitigation"
                    }
                }
            ]
        }
    };
    
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techServiceSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <SectorTemplateClient 
                template={template} 
                dictionary={dictionary} 
                lang={lang} 
            />
            <Footer lang={lang} dictionary={dictionary} />
        </div>
    );
}
