// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import LearnHubClient from "./LearnHubClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "AI Agent Security Guides: Prompt Injection, GDPR, EU AI Act",
        description: "Comprehensive guides, tutorials, and best practices for securing AI agents in production. EU AI Act compliance, zero-trust guardrails, and more.",
        internalPath: "learn"
    });
}

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
        "inLanguage": "en",
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

    
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": "en",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is AI Agent Security Guides: Prompt Injection, GDPR, EU AI Act?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Comprehensive guides, tutorials, and best practices for securing AI agents in production. EU AI Act compliance, zero-trust guardrails, and more."
                }
            },
            {
                "@type": "Question",
                "name": "Why is AI Agent Security Guides: Prompt Injection, GDPR, EU AI Act important for AI agents?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Autonomous AI agents require specialized runtime guardrails to prevent prompt injection, unauthorized tool execution, and budget overruns. Understanding this is critical for secure deployment."
                }
            },
            {
                "@type": "Question",
                "name": "Does SupraWall support AI Agent Security Guides: Prompt Injection, GDPR, EU AI Act compliance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. SupraWall provides the deterministic SDK-level middleware required to enforce security policies and generate audit logs for AI Agent Security Guides: Prompt Injection, GDPR, EU AI Act requirements."
                }
            }
        ]
    };
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <LearnHubClient lang={lang} dictionary={dictionary} />
        </div>
    );
}
