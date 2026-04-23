// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import LegalClient from "./LegalClient";
import { getDictionary } from "../../../i18n/getDictionary";
import { Navbar } from "@/components/Navbar";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://www.supra-wall.com';
    const internalSlug = 'for-legal-teams';

    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        const publicSlug = SLUG_MAP[internalSlug]?.[l] || internalSlug;
        languages[l] = `${baseUrl}/${l}/${publicSlug}`;
    });
    const defaultPublicSlug = SLUG_MAP[internalSlug]?.['en'] || internalSlug;
    languages['x-default'] = `${baseUrl}/en/${defaultPublicSlug}`;

    return {
        title: "AI Compliance for Legal Firms | Protect Attorney-Client Privilege | SupraWall",
        description: "Guard against AI data leaks and confidentiality breaches. End-to-end data redacting and compliance for law firms.",
        alternates: {
            canonical: `${baseUrl}/${lang}/${SLUG_MAP[internalSlug]?.[lang] || internalSlug}`,
            languages,
        },
    };
}

export default async function ForLegalPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <LegalClient dictionary={dictionary} />
        </div>
    );
}
