import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import VaultClient from "./VaultClient";

export const metadata: Metadata = {
    title: "AI Agent Credential Vault | Protect Secrets from Autonomous Agents | SupraWall",
    description: "Your AI agent should never see your API keys, passwords, or credit cards. SupraWall Vault gives agents permissioned access to credentials without exposing raw values.",
    keywords: [
        "AI agent credential vault",
        "AI agent secrets management",
        "agent API key protection",
        "LLM vault",
        "prevent agent credential theft",
        "AI agent PII protection",
        "agent secrets vault",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/vault",
    },
    openGraph: {
        title: "Your AI Agent Can Read Your Passwords. Vault Makes Sure It Can't.",
        description: "SupraWall Vault: zero-knowledge credential management for autonomous AI agents. Agents authenticate without ever seeing raw secrets.",
        url: "https://www.supra-wall.com/features/vault",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Your AI Agent Can Read Your Passwords. Vault Makes Sure It Can't.",
        description: "SupraWall Vault: zero-knowledge credential management for autonomous AI agents.",
    },
    robots: "index, follow",
};

export default function VaultPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "SupraWall Vault",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Cloud, Self-hosted",
        description: "Zero-knowledge credential vault for AI agents. Agents authenticate to APIs, databases, and services without ever seeing raw secrets like passwords, API keys, or credit card numbers.",
        url: "https://www.supra-wall.com/features/vault",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free tier includes 10k operations/month",
        },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What credentials can SupraWall Vault protect?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "API keys, OAuth tokens, database passwords, credit card numbers, SSH keys, and any secret you configure. Vault supports string, JSON, and file-type secrets.",
                },
            },
            {
                "@type": "Question",
                name: "Does the AI agent ever see the raw credential?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Never. The agent requests an action (e.g., 'call Stripe API'), and Vault injects the credential at the SDK level after SupraWall validates the policy. The LLM never receives the raw value.",
                },
            },
            {
                "@type": "Question",
                name: "What happens if an agent is prompt-injected and tries to exfiltrate credentials?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall's policy engine blocks unauthorized credential access. Even if an injected prompt instructs the agent to read secrets, Vault returns a structured denial — not the secret.",
                },
            },
            {
                "@type": "Question",
                name: "Does Vault work with all SupraWall-supported frameworks?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Vault integrates with LangChain, CrewAI, AutoGen, Vercel AI SDK, and any MCP-compatible agent framework.",
                },
            },
            {
                "@type": "Question",
                name: "How is Vault different from HashiCorp Vault or AWS Secrets Manager?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Traditional vaults protect secrets from humans and services. SupraWall Vault is purpose-built for AI agents — it intercepts at the LLM-to-tool boundary, ensuring the language model itself never has access to raw credentials.",
                },
            },
            {
                "@type": "Question",
                name: "Does Vault create audit logs for EU AI Act compliance?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Every credential access attempt — approved or denied — is logged with agent ID, timestamp, policy applied, and outcome. Exportable as HOE (Human Oversight Evidence) reports.",
                },
            },
        ],
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Protect AI Agent Credentials with SupraWall Vault",
        step: [
            { "@type": "HowToStep", text: "Store your secrets in SupraWall Vault via the dashboard or CLI." },
            { "@type": "HowToStep", text: "Configure which agents can access which secrets using scope policies." },
            { "@type": "HowToStep", text: "Wrap your agent handler — Vault auto-injects credentials at runtime." },
        ],
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com" },
            { "@type": "ListItem", position: 2, name: "Features", item: "https://www.supra-wall.com/features" },
            { "@type": "ListItem", position: 3, name: "Vault", item: "https://www.supra-wall.com/features/vault" },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Navbar />
            <VaultClient />
        </div>
    );
}
