// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import HealthcareVerticalClient from "./HealthcareVerticalClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'use-cases/healthcare',
        title: "AI Agent Security for Healthcare | HIPAA & PII Protection | SupraWall",
        description: "Secure autonomous agents in healthcare and life sciences. Automatically redact PHI and PII from agentic tool calls to ensure HIPAA compliance and patient privacy.",
        keywords: [
            "AI agents in healthcare",
            "HIPAA compliance for autonomous AI",
            "redact PHI from agent tools",
            "medical agent safety layer",
            "secure patient data in LLM apps",
            "suprawall healthcare solution",
        ],
    });
}

export default async function HealthcarePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <HealthcareVerticalClient />
        </div>
    );
}
