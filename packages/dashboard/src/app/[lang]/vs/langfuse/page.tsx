// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import LangfuseClient from "./LangfuseClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "SupraWall vs Langfuse | AI Observability vs Security Comparison",
        description: "Technical comparison between SupraWall and Langfuse. Learn why tracing alone isn't enough for agent security and how runtime enforcement prevents tool misuse.",
        keywords: ["suprawall vs langfuse", "ai observability vs security", "langfuse alternative security", "agent tracing guardrails"],
        internalPath: "vs/langfuse"
    });
}

export default function vsLangfuse() {
    const comparisonData = [
        { feature: "Live Enforcement", suprawall: true, comp: false, note: "Langfuse is post-hoc observability. SupraWall is real-time blocking." },
        { feature: "Tool Interception", suprawall: true, comp: false, note: "SupraWall intercepts and blocks tool execution at the SDK level." },
        { feature: "Trace Visibility", suprawall: "Security-Focused", comp: "Ops-Focused", note: "Langfuse has deep trace analysis; SupraWall focuses on security audit." },
        { feature: "Policy Engine", suprawall: "Deterministic", comp: "Analytics", note: "SupraWall enforces rules; Langfuse analyzes outcomes." },
        { feature: "Edge Runtime", suprawall: "Native (<1ms)", comp: "Cloud/Self-Host", note: "SupraWall is optimized for zero-latency edge security." }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is SupraWall a replacement for Langfuse?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Langfuse is an excellent observability and tracing platform. SupraWall is a security firewall. While both provide visibility, SupraWall provides the deterministic blocking that prevents security incidents."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use both together?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Most production stacks use Langfuse for performance monitoring and SupraWall for security policy enforcement and human-in-the-loop approvals."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">
                    <LangfuseClient comparisonData={comparisonData} />
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Enterprise Agent Governance • 2026
                </p>
            </footer>
        </div>
    );
}
