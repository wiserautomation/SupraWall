import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import IntegrationsHubClient from "./IntegrationsHubClient";

export const metadata: Metadata = {
    title: "AI Framework Integrations | Secure LangChain, CrewAI, AutoGen | SupraWall",
    description: "SupraWall works with every major AI agent framework. Secure your Tool Calls in LangChain, CrewAI, AutoGen, and Vercel AI with one line of code.",
    keywords: [
        "secure langgraph agents",
        "langchain security sdk",
        "crewai budget limits",
        "autogen tool call protection",
        "pydantic ai security shield",
        "vercel ai agent governance",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/integrations",
    },
    openGraph: {
        title: "AI Agent Framework Integrations | SupraWall Security",
        description: "Zero-trust security for all major AI frameworks. Secure your agent tools in LangChain, CrewAI, and beyond.",
        url: "https://www.supra-wall.com/integrations",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function IntegrationsHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SupraWall AI Framework Integrations",
        "description": "SDK-level security integrations for autonomous agent frameworks.",
        "url": "https://www.supra-wall.com/integrations",
        "hasPart": [
            { "@type": "WebPage", "name": "Secure LangChain Agents", "url": "https://www.supra-wall.com/integrations/langchain" },
            { "@type": "WebPage", "name": "Secure CrewAI Agents", "url": "https://www.supra-wall.com/integrations/crewai" },
            { "@type": "WebPage", "name": "Secure AutoGen Agents", "url": "https://www.supra-wall.com/integrations/autogen" }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <IntegrationsHubClient />
        </div>
    );
}
