// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import VerticalDetailClient from "./VerticalDetailClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'use-cases/financial-services',
        title: "AI Agent Security for Financial Services",
        description: "Secure autonomous agents in banking, insurance, and fintech. Prevent infinite spending loops, redact customer PII, and maintain immutable audit trails for compliance.",
        keywords: [
            "AI agents in financial services",
            "fintech agent security",
            "banking agentic governance",
            "redact sensitive names from payment tools",
            "prevent rogue financial transfers by LLM",
            "suprawall industry finance",
        ],
    });
}

export default async function FinancialServicesPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <VerticalDetailClient />
        </div>
    );
}
