import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import BlogHubClient from "./BlogHubClient";

export const metadata: Metadata = {
    title: "AI Agent Security Blog | News & Engineering Insights | SupraWall",
    description: "The official blog of SupraWall. Engineering insights on autonomous AI agents, security research, and the future of deterministic runtime safety.",
    keywords: [
        "AI agent security blog",
        "agentic ai engineering insights",
        "LLM security news 2026",
        "build vs buy ai security",
        "agent-to-agent commerce safety",
        "suprawall product news",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/blog",
    },
    openGraph: {
        title: "AI Agent Security Blog | SupraWall",
        description: "Breaking news and deep-dives into the security of autonomous agents. Read the latest from our engineering team.",
        url: "https://www.supra-wall.com/blog",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function BlogHubPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "SupraWall Security Blog",
        "description": "Insights and research into the security of autonomous AI agents.",
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.supra-wall.com/logo.png"
            }
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
