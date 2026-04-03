// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import LearnHubClient from "./LearnHubClient";

export const metadata: Metadata = {
    title: "AI Agent Security Hub | SupraWall Learn",
    description: "Comprehensive guides, tutorials, and best practices for securing AI agents in production. EU AI Act compliance, zero-trust guardrails, and more.",
    keywords: [
        "ai agent security guide",
        "ai agent security resources",
        "ai agent security knowledge base",
        "ai agent security tutorials",
        "LLM agent security",
        "ai agent compliance guide",
        "agentic security documentation",
        "ai agent guardrails guide"
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/learn",
    },
};

import { getDictionary } from "../../../i18n/getDictionary";
import { Locale } from "@/i18n/config";

export default async function LearnHubPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "AI Agent Security Hub",
        "description": "Comprehensive guides, tutorials, and best practices for securing AI agents in production.",
        "url": `https://www.supra-wall.com/${lang}/learn`,
        "inLanguage": lang,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "What is Agent Runtime Security?", "url": `https://www.supra-wall.com/${lang}/learn/what-is-agent-runtime-security` },
                { "@type": "ListItem", "position": 2, "name": "EU AI Act Compliance Guide", "url": `https://www.supra-wall.com/${lang}/learn/eu-ai-act-compliance-ai-agents` },
                { "@type": "ListItem", "position": 3, "name": "Zero-Trust for AI Agents", "url": `https://www.supra-wall.com/${lang}/learn/zero-trust-ai-agents` },
                { "@type": "ListItem", "position": 4, "name": "Human in the Loop AI Governance", "url": `https://www.supra-wall.com/${lang}/learn/human-in-the-loop-ai-agents` }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.supra-wall.com/${lang}` },
                { "@type": "ListItem", "position": 2, "name": "Learn", "item": `https://www.supra-wall.com/${lang}/learn` }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <LearnHubClient dictionary={dictionary} />
        </div>
    );
}
