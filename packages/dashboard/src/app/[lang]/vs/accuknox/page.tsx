// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { getLocalizedPath } from "@/i18n/slug-map";
import { Footer } from "@/components/Footer";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import { Navbar } from "@/components/Navbar";
import CompetitorVsClient from "../jozu/CompetitorVsClient";

export const metadata: Metadata = {
    title: "SupraWall vs. Accuknox | AI Agent Security vs. Cloud Infrastructure",
    description: "Compare SupraWall and Accuknox. While Accuknox focuses on generic cloud runtime security, SupraWall provides the deterministic layer for autonomous agent tool call policy enforcement.",
    keywords: [
        "SupraWall vs Accuknox",
        "Accuknox AI safety comparison",
        "cloud security vs agent safety",
        "stop rogue agent actions accuknox alternative",
        "deterministic agentic SDK for enterprises",
        "best accuknox alternative for AI",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/vs/accuknox",
    },
    openGraph: {
        title: "Cloud Security isn't Agent Security. | SupraWall vs Accuknox",
        description: "Standardize your autonomous agent safety with deterministic SDK-level interception. Compare with Accuknox.",
        url: "https://www.supra-wall.com/vs/accuknox",
        siteName: "SupraWall",
        type: "website",
    },
};

export default async function vsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <CompetitorVsClient competitor="Accuknox" focus="Cloud Infrastructure" />
        </div>
    );
}
