import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import FeaturesClient from "./FeaturesClient";

export const metadata: Metadata = {
    title: "AI Agent Security Features | 6 Pillars of Deterministic Safety | SupraWall",
    description: "Explore the 6 core security features of SupraWall: Credential Vault, Budget Limits, Policy Engine, PII Shield, Audit Trail, and Prompt Injection Shield. Standardize your AI agent governance today.",
    keywords: [
        "AI agent security features",
        "agentic governance pillars",
        "LLM tool call protection",
        "ai budget control",
        "pii scrubbing ai agents",
        "agent audit compliance",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features",
    },
    openGraph: {
        title: "6 Pillars of Deterministic AI Agent Security | SupraWall",
        description: "Vault, Cap, Block, Scrub, Generate, and Stop. Explore the features that make SupraWall the security standard for autonomous AI agents.",
        url: "https://www.supra-wall.com/features",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function FeaturesHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SupraWall Security Features",
        "description": "A comprehensive suite of security and compliance tools for autonomous AI agents.",
        "url": "https://www.supra-wall.com/features",
        "hasPart": [
            { "@type": "WebPage", "name": "Credential Vault", "url": "https://www.supra-wall.com/features/vault" },
            { "@type": "WebPage", "name": "Budget Limits", "url": "https://www.supra-wall.com/features/budget-limits" },
            { "@type": "WebPage", "name": "Policy Engine", "url": "https://www.supra-wall.com/features/policy-engine" },
            { "@type": "WebPage", "name": "PII Shield", "url": "https://www.supra-wall.com/features/pii-shield" },
            { "@type": "WebPage", "name": "Audit Trail", "url": "https://www.supra-wall.com/features/audit-trail" },
            { "@type": "WebPage", "name": "Prompt Injection Shield", "url": "https://www.supra-wall.com/features/prompt-shield" }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <FeaturesClient />
        </div>
    );
}
