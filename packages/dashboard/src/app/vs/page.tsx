// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import VsHubClient from "./VsHubClient";

export const metadata: Metadata = {
    title: "SupraWall vs Alternatives | AI Agent Security Comparison",
    description: "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey. Honest feature-by-feature breakdown for AI teams.",
    keywords: [
        "SupraWall vs alternatives",
        "ai agent security comparison",
        "best ai agent security platform",
        "ai guardrails comparison 2026",
        "ai agent security alternatives",
        "Galileo alternative",
        "NeMo alternative",
        "Guardrails AI alternative",
        "compare ai agent security tools"
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/vs",
    },
};

export default function VsHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "SupraWall vs Alternatives",
        "description": "Compare SupraWall against Galileo, NVIDIA NeMo, Guardrails AI, Straiker, Lakera, and Portkey. Honest feature-by-feature breakdown for AI teams.",
        "url": "https://www.supra-wall.com/vs",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "SupraWall vs Galileo", "url": "https://www.supra-wall.com/vs/galileo" },
                { "@type": "ListItem", "position": 2, "name": "SupraWall vs NVIDIA NeMo", "url": "https://www.supra-wall.com/vs/nemo-guardrails" },
                { "@type": "ListItem", "position": 3, "name": "SupraWall vs Guardrails AI", "url": "https://www.supra-wall.com/vs/guardrails-ai" },
                { "@type": "ListItem", "position": 4, "name": "SupraWall vs Lakera", "url": "https://www.supra-wall.com/vs/lakera" }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Comparisons", "item": "https://www.supra-wall.com/vs" }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <VsHubClient />
        </div>
    );
}
