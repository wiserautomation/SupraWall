// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import NemoClient from "./NemoClient";

export const metadata: Metadata = {
    title: "SupraWall vs NVIDIA NeMo Guardrails | Performance comparison 2026",
    description: "Technical comparison between NVIDIA NeMo Guardrails and SupraWall runtime security. Learn why sub-1ms interception beats conversational guardrails for agents.",
    keywords: ["suprawall vs nemo guardrails", "nvidia nemo guardrails alternative", "llm security performance", "agent runtime guardrails"],
    alternates: {
        canonical: 'https://www.supra-wall.com/vs/nemo-guardrails',
    },
};

export default function vsNemo() {
    const comparisonData = [
        { feature: "Latency (P99)", suprawall: "< 1ms", comp: "500ms - 2s", note: "NeMo often requires a model call for evaluation. SupraWall is deterministic/local." },
        { feature: "Policy Language", suprawall: "JSON/UI", comp: "Colang", note: "SupraWall rules are simple. Colang has a steep learning curve." },
        { feature: "Action Enforcement", suprawall: true, comp: "Partial", note: "SupraWall specifically wraps the tool execution stack." },
        { feature: "Human Review", suprawall: true, comp: false, note: "Native approval queues in SupraWall for high-stakes tool calls." },
        { feature: "Edge Runtime", suprawall: "Native", comp: "Server-Heavy", note: "SupraWall runs in <1mb of memory on Vercel/Cloudflare Edge." }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Why is SupraWall faster than NeMo Guardrails?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "NeMo Guardrails often uses a small language model or heavy semantic checks to evaluate flows. SupraWall uses a deterministic policy engine that executes with sub-1ms latency, making it the fastest security layer for agents."
                }
            },
            {
                "@type": "Question",
                "name": "Does SupraWall use Colang?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. SupraWall uses a standard JSON-based policy structure that can be managed via our UI or API. This is easier for security teams to audit and maintain than complex Colang scripts."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">
                    <NemoClient comparisonData={comparisonData} />
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Enterprise Agent Performance • 2026
                </p>
            </footer>
        </div>
    );
}
