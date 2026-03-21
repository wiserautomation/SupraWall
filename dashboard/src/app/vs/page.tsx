import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import VsHubClient from "./VsHubClient";

export const metadata: Metadata = {
    title: "SupraWall vs. Competitors | The Difference is Deterministic | AI Security",
    description: "Compare SupraWall with other AI agent security tools like Lakera, Galileo, and NeMo. Learn why deterministic, SDK-level protection is the only way to secure autonomous agents in production.",
    keywords: [
        "SupraWall vs Lakera",
        "SupraWall vs Galileo",
        "AI security platform comparison",
        "LLM guardrails vs supra agent SDK",
        "best AI agent security tool",
        "probabilistic vs deterministic security",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/vs",
    },
    openGraph: {
        title: "SupraWall vs. Competitors | AI Agent Security Comparison",
        description: "Compare the engineering difference between probabilistic LLM guardrails and the SupraWall Deterministic SDK.",
        url: "https://www.supra-wall.com/vs",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function VsHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ComparisonPage",
        "name": "SupraWall Competitive Comparison",
        "description": "Comparison between SupraWall and industry alternatives for AI agent security and governance.",
        "url": "https://www.supra-wall.com/vs",
        "hasPart": [
            { "@type": "WebPage", "name": "SupraWall vs Lakera", "url": "https://www.supra-wall.com/vs/lakera" },
            { "@type": "WebPage", "name": "SupraWall vs Galileo", "url": "https://www.supra-wall.com/vs/galileo" },
            { "@type": "WebPage", "name": "SupraWall vs NeMo Guardrails", "url": "https://www.supra-wall.com/vs/nemo-guardrails" }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <VsHubClient />
        </div>
    );
}
