import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import { SpecClient } from "./SpecClient";

export const metadata: Metadata = {
    title: "AGPS Policy Spec | Open Standard for AI Agent Governance",
    description: "The Agent Governance Policy Spec (AGPS) is an open standard for defining tool access, security boundaries, and cost controls for autonomous AI agents.",
    keywords: ["agps policy spec", "agent governance standard", "ai tools security standard", "secure ai agent framework"],    alternates: {
        canonical: 'https://www.supra-wall.com/spec',
    },

};

export default function SpecPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Agent Governance Policy Spec (AGPS) 1.0",
        "description": "An open standard for intercepting and governing AI agent tool calls.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "mainEntityOfPage": "https://www.supra-wall.com/spec"
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <main className="pt-40 px-6">
                <SpecClient />
            </main>
        </div>
    );
}
