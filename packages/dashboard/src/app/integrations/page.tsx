// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import IntegrationsHubClient from "./IntegrationsHubClient";

export const metadata: Metadata = {
    title: "AI Agent Security Integrations | SupraWall",
    description: "One command adds enterprise security to LangChain, Vercel AI SDK, CrewAI, AutoGen, PydanticAI, and MCP. No rewrites. Works with your existing stack.",
    keywords: [
        "ai agent security integrations",
        "LangChain security middleware",
        "ai framework security",
        "Vercel AI SDK guardrails",
        "MCP security integration",
        "CrewAI security",
        "AutoGen security middleware",
        "PydanticAI security",
        "one-line ai security"
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/integrations",
    },
};

export default function IntegrationsHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall AI Agent Security Integrations",
        "description": "Universal one-line security middleware for every major AI agent framework.",
        "url": "https://www.supra-wall.com/integrations",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "LangChain", "url": "https://www.supra-wall.com/integrations/langchain" },
                { "@type": "ListItem", "position": 2, "name": "Vercel AI SDK", "url": "https://www.supra-wall.com/integrations/vercel" },
                { "@type": "ListItem", "position": 3, "name": "CrewAI", "url": "https://www.supra-wall.com/integrations/crewai" },
                { "@type": "ListItem", "position": 4, "name": "AutoGen", "url": "https://www.supra-wall.com/integrations/autogen" }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Integrations", "item": "https://www.supra-wall.com/integrations" }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <IntegrationsHubClient />
        </div>
    );
}
