import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import GdprClient from "./GdprClient";

export const metadata: Metadata = {
    title: "GDPR Compliance for AI Agents | PII Scrubbing | SupraWall",
    description: "Satisfy GDPR requirements for autonomous AI agents. SupraWall PII Shield automatically redacts customer names, emails, and SSNs from tool call payloads before they leave your infrastructure.",
    keywords: [
        "GDPR compliance AI agents",
        "PII scrubbing for AI tools",
        "redact customer data LLM",
        "GDPR Article 25 AI governance",
        "automated data masking for agents",
        "suprawall pii shield gdpr",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/gdpr",
    },
    openGraph: {
        title: "GDPR for AI Agents. Secured at the SDK.",
        description: "Zero-PII leakage for autonomous agentic systems. Automated redaction for every outbound tool call.",
        url: "https://www.supra-wall.com/gdpr",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function GdprPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <GdprClient />
        </div>
    );
}
