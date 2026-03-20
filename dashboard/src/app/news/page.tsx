import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import NewsIndexClient from "./NewsIndexClient";

export const metadata: Metadata = {
    title: "AI Agent Security News | SupraWall",
    description:
        "Breaking news and analysis on AI agent security, EU AI Act enforcement, agentic threats, and emerging frameworks. Updated weekly by the SupraWall Security Team.",
    keywords: [
        "AI agent security news",
        "EU AI Act news",
        "agentic AI security updates",
        "LLM security news",
        "AI agent threats 2026",
        "AI governance news",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/news",
    },
    openGraph: {
        title: "AI Agent Security News | SupraWall",
        description:
            "Threats, regulation, and framework updates for teams building autonomous AI agents.",
        url: "https://www.supra-wall.com/news",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Agent Security News | SupraWall",
        description:
            "Breaking news on AI agent threats, EU AI Act enforcement, and agentic security frameworks.",
    },
    robots: "index, follow",
};

export default function NewsIndexPage() {
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        name: "SupraWall",
        url: "https://www.supra-wall.com",
        logo: "https://www.supra-wall.com/logo.png",
        description:
            "AI agent runtime security platform covering threats, regulation, and frameworks for autonomous AI.",
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com" },
            { "@type": "ListItem", position: 2, name: "News", item: "https://www.supra-wall.com/news" },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar />
            <NewsIndexClient />
        </div>
    );
}
