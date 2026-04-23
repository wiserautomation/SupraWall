// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import PiiShieldClient from "./PiiShieldClient";

export const metadata: Metadata = {
    title: "AI Agent PII Shield | Automatic Data Scrubbing | SupraWall",
    description: "AI agents don't know what is PII and what is not. SupraWall PII Shield automatically detects and redacts customer names, emails, and SSNs from tool call payloads before they leave your infrastructure.",
    keywords: [
        "PII scrubbing for AI agents",
        "data loss prevention for LLMs",
        "prevent agent data leaks",
        "automated redaction agent tools",
        "AI agent PII shield",
        "GDPR compliance for AI agents",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/pii-shield",
    },
    openGraph: {
        title: "Agents Leak Data. The PII Shield Stops It.",
        description: "Automatic PII detection and scrubbing for autonomous AI agents. Deterministic data protection outside the LLM context.",
        url: "https://www.supra-wall.com/features/pii-shield",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Agents Leak Data. The PII Shield Stops It.",
        description: "Don't trust an LLM with your customer data. SupraWall PII Shield scrubs every tool call payload automatically.",
    },
    robots: "index, follow",
};

export default function PiiShieldPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <PiiShieldClient />
        </div>
    );
}
