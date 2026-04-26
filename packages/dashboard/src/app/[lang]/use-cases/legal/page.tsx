// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import LegalVerticalClient from "./LegalVerticalClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'use-cases/legal',
        title: "AI Agent Security for Legal Teams | Privilege & Audits | SupraWall",
        description: "Secure autonomous agents in law firms and legal departments. Maintain attorney-client privilege, prevent data leaks, and generate immutable audit trails for every agentic action.",
        keywords: [
            "AI agents in legal firms",
            "attorney-client privilege AI security",
            "legal audit trails autonomous agents",
            "secure legal research agents",
            "AI agent governance for lawyers",
            "suprawall legal solution",
        ],
    });
}

export default async function LegalPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <LegalVerticalClient />
        </div>
    );
}
