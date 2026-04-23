// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import ExecutivesClient from "./ExecutivesClient";
import { getDictionary } from "../../../i18n/getDictionary";
import { Navbar } from "@/components/Navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://www.supra-wall.com';
    const internalSlug = 'for-executives';

    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        const publicSlug = SLUG_MAP[internalSlug]?.[l] || internalSlug;
        languages[l] = `${baseUrl}/${l}/${publicSlug}`;
    });
    const defaultPublicSlug = SLUG_MAP[internalSlug]?.['en'] || internalSlug;
    languages['x-default'] = `${baseUrl}/en/${defaultPublicSlug}`;

    return {
        title: "AI Risk Management for C-Suite | EU AI Act Executive Briefing | SupraWall",
        description: "Executive oversight for corporate AI. Understand your regulatory exposure under the EU AI Act and GDPR, and implement autonomous logging pipelines.",
        alternates: {
            canonical: `${baseUrl}/${lang}/${SLUG_MAP[internalSlug]?.[lang] || internalSlug}`,
            languages,
        },
    };
}

export default async function ForExecutivesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <ExecutivesClient dictionary={dictionary} />
        </div>
    );
}
