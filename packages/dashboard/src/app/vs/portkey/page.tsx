// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import PortkeyClient from "./PortkeyClient";

export const metadata: Metadata = {
    title: "SupraWall vs Portkey | Agent Security Comparison",
    description: "Discover why SupraWall is the essential security layer for autonomous agents compared to LLM gateways like Portkey. Action-level blocking vs gateway-level logging.",
    keywords: ["suprawall vs portkey", "portkey search comparison", "agent security layer", "llm observability security"],    alternates: {
        canonical: 'https://www.supra-wall.com/vs/portkey',
    },

};

export default function vsPortkey() {
    const comparisonData = [
        { feature: "Runtime Interception", suprawall: true, portkey: false, note: "Portkey is a gateway; it sees traffic but doesn't intercept tool inputs *locally*." },
        { feature: "Action Blocking", suprawall: true, portkey: false, note: "SupraWall blocks the result of the prompt (the tool call)." },
        { feature: "Agent Logic Logic", suprawall: "Native", portkey: "Transparent", note: "SupraWall is embedded in LangChain/CrewAI; Portkey is a proxy." },
        { feature: "PII Shield", suprawall: true, portkey: true, note: "Both have enterprise-grade PII masking, SupraWall masks at the tool-argument level." },
        { feature: "Observability", suprawall: "Security-Focused", portkey: "Performance-Focused", note: "Portkey excels at latency/cost optimization; SupraWall excels at safety." }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How is SupraWall different from Portkey?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Portkey is an excellent AI gateway for observability, cost tracking, and routing. SupraWall is a runtime firewall that secures the actions an agent takes *after* the LLM response."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use Portkey with SupraWall?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. You can use Portkey as your gateway for LLM traffic and SupraWall as your local security layer for tool execution."
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
                    <PortkeyClient comparisonData={comparisonData} />
                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Enterprise Agent Observability Audit • 2026
                </p>
            </footer>
        </div>
    );
}
