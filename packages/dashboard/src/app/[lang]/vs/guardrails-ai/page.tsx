// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { getLocalizedPath } from "@/i18n/slug-map";
import { Footer } from "@/components/Footer";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import GuardrailsAIClient from "./GuardrailsAIClient";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";

export const metadata: Metadata = {
    title: "SupraWall vs Guardrails AI | Runtime Security Comparison",
    description: "Technical comparison between SupraWall and Guardrails AI. Learn why action-level runtime security is essential for autonomous agents compared to validation-only guardrails.",
    keywords: ["suprawall vs guardrails ai", "llm guardrails comparison", "agent runtime security", "autonomous agent safety"],
    alternates: {
        canonical: 'https://www.supra-wall.com/vs/guardrails-ai',
    },
};

export default async function vsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    const comparisonData = [
        { feature: "Runtime Interception", suprawall: true, guard: false, note: "Guardrails AI is mostly validation-focused (pre/post-llm)." },
        { feature: "Action Blocking", suprawall: true, guard: false, note: "SupraWall specifically blocks tool/env actions at runtime." },
        { feature: "Agent Frameworks", suprawall: "Native", guard: "Wrapper", note: "SupraWall has deep integration with LangChain/CrewAI logic." },
        { feature: "Managed Hub", suprawall: true, guard: true, note: "Both have a policy hub, but SupraWall focuses on live enforcement." },
        { feature: "Audit Rail", suprawall: "Action-Level", guard: "Content-Level", note: "SupraWall audits exactly what the agent *did* vs what it *said*." }
    ];

    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "inLanguage": lang,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".quick-summary-table", ".answer-first-paragraph", ".comparison-verdict"]
        },
        "url": `https://www.supra-wall.com${getLocalizedPath("vs/guardrails-ai", lang)}`
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": lang,
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How is SupraWall different from Guardrails AI?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Guardrails AI focuses on output validation and formatting. SupraWall is a runtime firewall that intercepts and blocks unauthorized tool actions and side-effects in real-time."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use SupraWall and Guardrails AI together?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Many enterprises use Guardrails AI for structural integrity of LLM outputs and SupraWall for security enforcement of tool permissions."
                }
            }
        ]
    };

    const summaryRows = [
        { label: "Core Difference", value: "Guardrails AI validates language/schema; SupraWall intercepts and blocks tool execution." },
        { label: "Primary Use Case", value: "SupraWall is for autonomous agents with tool access; Guardrails AI is for structured data pipelines." },
        { label: "Security Enforcement", value: "SupraWall provides deterministic blocking; Guardrails AI relies on re-prompting the LLM." },
        { label: "Performance", value: "SupraWall adds <5ms; Guardrails AI latency varies based on re-prompting requirements." },
        { label: "Verdict", value: "Use both for layered defense, or SupraWall for action-critical safety." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">
                    <div className="space-y-8 text-center">
                        <p className="answer-first-paragraph text-2xl text-neutral-300 leading-snug font-medium border-l-8 border-emerald-600 pl-8 py-4 italic text-left max-w-4xl mx-auto">
                            SupraWall vs Guardrails AI: Guardrails AI is a validation library for structured LLM outputs, while SupraWall is a runtime firewall for autonomous agent actions. 
                            Without action-level interception, agents remain vulnerable to prompt injection attacks that bypass linguistic checks to execute unauthorized tools. 
                            SupraWall addresses this by implementing a deterministic security shim at the SDK layer.
                        </p>
                        <QuickSummaryTable rows={summaryRows} />
                    </div>

                    <GuardrailsAIClient comparisonData={comparisonData} />
                </div>
            </main>

            <Footer lang={lang} dictionary={dictionary} />
        </div>
    );
}
