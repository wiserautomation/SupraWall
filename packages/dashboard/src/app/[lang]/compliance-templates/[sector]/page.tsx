// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
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
    const localized = dictionary.complianceTemplates.sectors[sector];
    if (!localized) return {};

    const baseUrl = 'https://www.supra-wall.com';
    
    return {
        title: `${localized.title} | Annex III Compliance Blueprint`,
        description: localized.opening,
        alternates: {
            canonical: `${baseUrl}/${lang}/compliance-templates/${sector}`,
        },
        openGraph: {
            title: localized.title,
            description: localized.opening,
            url: `${baseUrl}/${lang}/compliance-templates/${sector}`,
            siteName: "SupraWall",
            type: "article",
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
    
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
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
