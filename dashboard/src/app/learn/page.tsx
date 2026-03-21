import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import LearnHubClient from "./LearnHubClient";

export const metadata: Metadata = {
    title: "AI Agent Security Learning Hub | Best Practices & Tutorials | SupraWall",
    description: "The definitive library for AI agent runtime security. Learn how to manage risk, prevent prompt injection, and achieve EU AI Act compliance for autonomous agents.",
    keywords: [
        "AI agent security learning center",
        "agentic governance best practices",
        "runtime security for AI",
        "LLM guardrails tutorial",
        "agent security research",
        "deterministic ai security guide",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/learn",
    },
    openGraph: {
        title: "AI Agent Security Learning Hub | SupraWall",
        description: "Best practices, tutorials, and research for securing the autonomous agent future. Learn how the industry standard is being built.",
        url: "https://www.supra-wall.com/learn",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function LearnHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SupraWall AI Agent Security Learning Hub",
        "description": "Educational resources and technical guides for securing and auditing autonomous AI agents.",
        "url": "https://www.supra-wall.com/learn",
        "hasPart": [
            { "@type": "WebPage", "name": "What is Agent Runtime Security?", "url": "https://www.supra-wall.com/learn/what-is-agent-runtime-security" },
            { "@type": "WebPage", "name": "EU AI Act Compliance Guide", "url": "https://www.supra-wall.com/learn/eu-ai-act-compliance-ai-agents" },
            { "@type": "WebPage", "name": "Zero-Trust for AI Agents", "url": "https://www.supra-wall.com/learn/zero-trust-ai-agents" },
            { "@type": "WebPage", "name": "Human in the Loop AI Governance", "url": "https://www.supra-wall.com/learn/human-in-the-loop-ai-agents" }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <LearnHubClient />
        </div>
    );
}
