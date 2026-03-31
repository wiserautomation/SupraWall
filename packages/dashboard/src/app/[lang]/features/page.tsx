// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import FeaturesClient from "./FeaturesClient";

export const metadata: Metadata = {
    title: "Features | SupraWall AI Agent Compliance OS",
    description: "Six enterprise features that make SupraWall the Compliance OS for AI agents: HITL approvals, EU AI Act logging, PII shield, secret vault, and more.",
    keywords: [
        "ai agent security features",
        "ai compliance platform features",
        "ai agent governance features",
        "enterprise ai compliance features",
        "ai security platform capabilities",
        "compliance OS for ai agents",
        "ai agent policy enforcement"
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features",
    },
};

export default function FeaturesHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall Compliance OS Features",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Universal",
        "description": "Six enterprise-grade capabilities that together make SupraWall the Compliance OS for autonomous AI agents.",
        "url": "https://www.supra-wall.com/features",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Human-in-the-Loop", "url": "https://www.supra-wall.com/features/human-in-the-loop" },
                { "@type": "ListItem", "position": 2, "name": "Audit Logging", "url": "https://www.supra-wall.com/features/audit-trail" },
                { "@type": "ListItem", "position": 3, "name": "PII Shield", "url": "https://www.supra-wall.com/features/pii-shield" },
                { "@type": "ListItem", "position": 4, "name": "Policy Engine", "url": "https://www.supra-wall.com/features/policy-engine" },
                { "@type": "ListItem", "position": 5, "name": "Secret Vault", "url": "https://www.supra-wall.com/features/vault" },
                { "@type": "ListItem", "position": 6, "name": "Budget Controls", "url": "https://www.supra-wall.com/features/budget-limits" }
            ]
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://www.supra-wall.com/features" }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <FeaturesClient />
        </div>
    );
}
