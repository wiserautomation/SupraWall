// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import UseCasesHubClient from "./UseCasesHubClient";

export const metadata: Metadata = {
    title: "AI Agent Security Use Cases | SupraWall",
    description: "See how compliance teams, developers, and enterprises use SupraWall to secure AI agents in production. From cost control to EU AI Act compliance.",
    keywords: [
        "ai agent security use cases",
        "ai compliance use cases",
        "enterprise ai agent security examples",
        "ai agent governance examples",
        "ai agent production safety",
        "ai agent deployment examples",
        "ai security workflow"
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/use-cases",
    },
};

export default function UseCasesHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "AI Agent Security Use Cases",
        "description": "See how compliance teams, developers, and enterprises use SupraWall to secure AI agents in production.",
        "url": "https://www.supra-wall.com/use-cases",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Financial Services Automation", "url": "https://www.supra-wall.com/use-cases/financial-services" },
                { "@type": "ListItem", "position": 2, "name": "Healthcare AI Governance", "url": "https://www.supra-wall.com/use-cases/healthcare" },
                { "@type": "ListItem", "position": 3, "name": "Legal AI Oversight", "url": "https://www.supra-wall.com/use-cases/legal" },
                { "@type": "ListItem", "position": 4, "name": "Runaway Cost Control", "url": "https://www.supra-wall.com/use-cases/cost-control" }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Use Cases", "item": "https://www.supra-wall.com/use-cases" }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <UseCasesHubClient />
        </div>
    );
}
