// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import HeliconeClient from "./HeliconeClient";

export const metadata: Metadata = {
    title: "SupraWall vs Helicone | LLM Proxy vs Agentic Guardrails",
    description: "Technical comparison between Helicone (LLM Observability) and SupraWall (Agent Security). Why proxy-level cost tracking alone isn't enough for autonomous agents.",
    keywords: ["suprawall vs helicone", "helicone alternative security", "llm proxy vs sdk security", "agentic cost guardrails"],
    alternates: {
        canonical: 'https://www.supra-wall.com/vs/helicone',
    },
};

export default function vsHelicone() {
    const comparisonData = [
        { feature: "Action Blocking", suprawall: true, comp: false, note: "Helicone monitors requests; SupraWall intercepts and blocks tool execution." },
        { feature: "Per-Agent Budget", suprawall: "Hard Caps", comp: "Soft Track", note: "SupraWall sets deterministic dollar limits per agent identity." },
        { feature: "Human Approvals", suprawall: true, comp: false, note: "Pause high-stakes actions in SupraWall; Helicone is fully automated observability." },
        { feature: "EU AI Act Ready", suprawall: "Compliance-First", comp: "Ops-First", note: "SupraWall specifically fulfills Art. 9, 12, and 14 requirements." },
        { feature: "LLM Caching", suprawall: false, comp: true, note: "Helicone excels at prompt caching; SupraWall focuses on runtime security." }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How is SupraWall different from Helicone?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Helicone is a proxy for monitoring and caching individual LLM calls. SupraWall is a security wrapper for the entire agentic loop, providing permission control and real-time blocking of tool actions."
                }
            },
            {
                "@type": "Question",
                "name": "Should I use a proxy or an SDK-level security tool?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ideally both. Use Helicone to proxy the model communication and SupraWall to secure the agent's interaction with the external environment (tools, databases, files)."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">
                    <HeliconeClient comparisonData={comparisonData} />
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Real-time Agent Governance • 2026
                </p>
            </footer>
        </div>
    );
}
