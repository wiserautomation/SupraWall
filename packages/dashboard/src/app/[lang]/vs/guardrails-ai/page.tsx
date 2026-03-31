// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import GuardrailsAIClient from "./GuardrailsAIClient";

export const metadata: Metadata = {
    title: "SupraWall vs Guardrails AI | Runtime Security Comparison",
    description: "Technical comparison between SupraWall and Guardrails AI. Learn why action-level runtime security is essential for autonomous agents compared to validation-only guardrails.",
    keywords: ["suprawall vs guardrails ai", "llm guardrails comparison", "agent runtime security", "autonomous agent safety"],    alternates: {
        canonical: 'https://www.supra-wall.com/vs/guardrails-ai',
    },

};

export default function vsGuardrailsAI() {
    const comparisonData = [
        { feature: "Runtime Interception", suprawall: true, guard: false, note: "Guardrails AI is mostly validation-focused (pre/post-llm)." },
        { feature: "Action Blocking", suprawall: true, guard: false, note: "SupraWall specifically blocks tool/env actions at runtime." },
        { feature: "Agent Frameworks", suprawall: "Native", guard: "Wrapper", note: "SupraWall has deep integration with LangChain/CrewAI logic." },
        { feature: "Managed Hub", suprawall: true, guard: true, note: "Both have a policy hub, but SupraWall focuses on live enforcement." },
        { feature: "Audit Rail", suprawall: "Action-Level", guard: "Content-Level", note: "SupraWall audits exactly what the agent *did* vs what it *said*." }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
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

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">
                    <GuardrailsAIClient comparisonData={comparisonData} />
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Action-Level Security Dashboard • 2026
                </p>
            </footer>
        </div>
    );
}
