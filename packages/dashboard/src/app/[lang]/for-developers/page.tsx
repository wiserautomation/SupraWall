// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import ForDevelopersClient from "./ForDevelopersClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'for-developers',
        title: "Add AI Security in One Line of Code — SupraWall for Developers",
        description: "Built by developers, for developers. Stop prompt injection, prevent secret leaks, and enforce tool call safety with one command. Integration-first agent governance.",
        keywords: [
            "AI agent security for developers",
            "secure agentic SDK python",
            "typescript ai agent security",
            "prevent agent command injection",
            "mcp server security guide",
            "suprawall developer portal",
        ],
    });
}

export default async function ForDevelopersPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <ForDevelopersClient />
        </div>
    );
}
