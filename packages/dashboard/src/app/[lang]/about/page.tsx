// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import AboutClient from "./AboutClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "About SupraWall | The Deterministic Security Layer for AI Teams",
        description: "SupraWall is the industry standard for securing autonomous AI agents. Built by engineers who believe that prompt engineering is not security.",
        internalPath: "about"
    });
}

import { getDictionary } from "../../../i18n/getDictionary";
import { Locale } from "@/i18n/config";

export default async function AboutPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-neutral-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <AboutClient dictionary={dictionary} />
        </div>
    );
}
