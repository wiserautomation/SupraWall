import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import EuAiActClient from "./EuAiActClient";

export const metadata: Metadata = {
    title: "EU AI Act Compliance Hub for AI Agents | SupraWall",
    description: "The definitive guide and solution hub for the EU AI Act specifically for autonomous agentic systems. Satisfy Articles 9, 11, 12, and 14 with deterministic SDK-level evidence.",
    keywords: [
        "EU AI Act AI agents GUIDE",
        "compliance platform autonomous systems",
        "AI Act risk assessment high-risk",
        "automated logging for ai act",
        "human oversight requirements agents",
        "suprawall eu ai act solution",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/eu-ai-act",
    },
    openGraph: {
        title: "EU AI Act Compliance Hub | SupraWall Security",
        description: "Zero-trust compliance for the EU AI Act. Automated evidence trails and deterministic risk controls.",
        url: "https://www.supra-wall.com/eu-ai-act",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function EuAiActHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SupraWall EU AI Act Hub",
        "description": "Information and tools for complying with the EU AI Act in AI agentic applications.",
        "url": "https://www.supra-wall.com/eu-ai-act",
        "hasPart": [
            { "@type": "WebPage", "name": "Article 12: Automatic Logging", "url": "https://www.supra-wall.com/eu-ai-act/article-12" },
            { "@type": "WebPage", "name": "Article 14: Human Oversight", "url": "https://www.supra-wall.com/eu-ai-act/article-14" },
            { "@type": "WebPage", "name": "Compliance Checklist", "url": "https://www.supra-wall.com/learn/eu-ai-act-compliance-ai-agents" }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <EuAiActClient />
        </div>
    );
}
