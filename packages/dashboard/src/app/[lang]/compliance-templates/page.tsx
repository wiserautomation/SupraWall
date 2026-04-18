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
    
    return {
        title: "EU AI Act Compliance Templates | SupraWall Blueprints",
        description: "Explore 8 deterministic compliance templates for high-risk AI sectors under Annex III of the EU AI Act. Automated controls for HR, Biometrics, Health, and more.",
        alternates: {
            canonical: `${baseUrl}/${lang}/compliance-templates`,
        },
        openGraph: {
            title: "SupraWall Compliance Template Hub",
            description: "Ready-to-use compliance blueprints for all 8 high-risk AI categories.",
            url: `${baseUrl}/${lang}/compliance-templates`,
            siteName: "SupraWall",
            type: "website",
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
    
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <TemplatesHubClient dictionary={dictionary} lang={lang} />
            <Footer lang={lang} dictionary={dictionary} />
        </div>
    );
}
