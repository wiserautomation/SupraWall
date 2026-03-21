import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import PolicyClient from "./PolicyClient";

export const metadata: Metadata = {
    title: "AI Agent Policy Engine | Deterministic Tool Interception | SupraWall",
    description: "Your system prompt isn't a firewall. SupraWall Policy Engine intercepts every tool call your LLM attempts and enforces hard-coded ALLOW/BLOCK rules outside the prompt context.",
    keywords: [
        "AI agent policy engine",
        "agentic governance",
        "deterministic tool control",
        "prevent agent destructive actions",
        "LLM tool interception",
        "AI agent firewall",
        "langchain policies",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/policy-engine",
    },
    openGraph: {
        title: "Your System Prompt Isn't a Firewall. The Policy Engine Is.",
        description: "SupraWall Policy Engine: Hard-coded security for autonomous agents. Move safety from the 'prompt' to the 'SDK'.",
        url: "https://www.supra-wall.com/features/policy-engine",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Your System Prompt Isn't a Firewall. The Policy Engine Is.",
        description: "Deterministic security for AI agents. Hard-coded rules that no LLM can talk its way around.",
    },
    robots: "index, follow",
};

export default function PolicyEnginePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "SupraWall Policy Engine",
        applicationCategory: "SecurityApplication",
        description: "Deterministic tool call interception for AI agents. Intercepts and evaluates every action your agent attempts against hard-coded security policies.",
        url: "https://www.supra-wall.com/features/policy-engine",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is the SupraWall Policy Engine?",
                acceptedAnswer: {
                    "@type": "Answer",
                    "text": "It's a deterministic firewall that sits at the SDK level. It intercepts every tool call your agent fires and checks it against hard-coded rules (ALLOW, DENY, REQUIRE_APPROVAL) before execution."
                }
            },
            {
                "@type": "Question",
                name: "Why not just use a system prompt for safety?",
                acceptedAnswer: {
                    "@type": "Answer",
                    "text": "System prompts are easily bypassed by indirect injection attacks. Policies in SupraWall are code-enforced outside the LLM context, making them impossible for the agent to hallucinate or talk its way around."
                }
            },
            {
                "@type": "Question",
                name: "Can I require human approval for certain actions?",
                acceptedAnswer: {
                    "@type": "Answer",
                    "text": "Yes. Any policy can be set to 'REQUIRE_APPROVAL'. This halts the agent and sends a notification to Slack, Teams, or the SupraWall Dashboard for a human to review the action before it proceeds."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <Navbar />
            <PolicyClient />
        </div>
    );
}
