// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import BlogHubClient from "./BlogHubClient";

export const metadata: Metadata = {
    title: "AI Agent Security Blog: Research, Compliance & Hardening | SupraWall",
    description: "The leading blog for AI agent security. Original research on runaway costs, prompt injection defense, and EU AI Act compliance. Read the 2026 State of Security report.",
    keywords: [
        "ai agent security blog",
        "ai agent security articles",
        "ai governance blog",
        "agentic AI security insights",
        "AI compliance blog",
        "AI agent governance research",
        "AI security industry analysis"
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/blog",
    },
};

export default function BlogHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "AI Agent Security Blog",
        "description": "Expert analysis, original research, and perspectives on AI agent security, EU AI Act compliance, and the future of autonomous AI.",
        "url": "https://www.supra-wall.com/blog",
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.supra-wall.com/icon.png"
            }
        },
        "breadcrumb": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.supra-wall.com" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.supra-wall.com/blog" }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <BlogHubClient />
        </div>
    );
}
