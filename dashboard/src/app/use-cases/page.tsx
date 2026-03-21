import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import UseCasesHubClient from "./UseCasesHubClient";

export const metadata: Metadata = {
    title: "AI Agent Use Cases | Financial, Healthcare, & Legal | SupraWall",
    description: "Explore how industries use SupraWall to secure autonomous AI agents. From financial cost control to legal prompt injection defense, see the real-world impact of deterministic safety.",
    keywords: [
        "AI agent use cases financial",
        "healthcare agent compliance",
        "legal AI agent security",
        "cost control for ai agents",
        "prompt injection mitigation in finance",
        "suprawall industry solutions",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/use-cases",
    },
    openGraph: {
        title: "AI Agent Industry Use Cases | SupraWall Security",
        description: "See how SupraWall secures autonomous agents in the most regulated industries on Earth.",
        url: "https://www.supra-wall.com/use-cases",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function UseCasesHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SupraWall AI Agent Industry Use Cases",
        "description": "Real-world implementations of SupraWall in regulated industries and specific high-risk scenarios.",
        "url": "https://www.supra-wall.com/use-cases",
        "hasPart": [
            { "@type": "WebPage", "name": "Financial Cost Control", "url": "https://www.supra-wall.com/use-cases/cost-control" },
            { "@type": "WebPage", "name": "Prompt Injection Mitigation", "url": "https://www.supra-wall.com/use-cases/prompt-injection" }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <UseCasesHubClient />
        </div>
    );
}
