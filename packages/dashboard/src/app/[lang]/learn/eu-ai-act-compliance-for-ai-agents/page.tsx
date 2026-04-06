// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import EUAIActPillarClient from "./EUAIActPillarClient";
import { Navbar } from "@/components/Navbar";

interface Props {
    params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = params;
    const dictionary = await getDictionary(lang as Locale);
    const t = dictionary.euAiActPillar || { hero: { title: "EU AI Act Compliance", emphasis: "for AI Agents" } };

    return {
        title: `${t.hero.title} ${t.hero.emphasis} — August 2026 Requirements`,
        description: t.hero.description,
        alternates: {
            canonical: `https://www.supra-wall.com/${lang}/learn/eu-ai-act-compliance-for-ai-agents`,
        },
    };
}

export default async function EUAIActCompliancePage({ params }: Props) {
    const { lang } = params;
    const dictionary = await getDictionary(lang as Locale);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar lang={lang as Locale} />
            <EUAIActPillarClient dictionary={dictionary} lang={lang} />
        </div>
    );
}
