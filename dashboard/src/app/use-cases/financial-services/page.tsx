import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import VerticalDetailClient from "./VerticalDetailClient";

export const metadata: Metadata = {
    title: "AI Agent Security for Financial Services | SupraWall",
    description: "Secure autonomous agents in banking, insurance, and fintech. Prevent infinite spending loops, redact customer PII, and maintain immutable audit trails for compliance.",
    keywords: [
        "AI agents in financial services",
        "fintech agent security",
        "banking agentic governance",
        "redact sensitive names from payment tools",
        "prevent rogue financial transfers by LLM",
        "suprawall industry finance",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/use-cases/financial-services",
    },
    openGraph: {
        title: "Secure Your FinTech Agents. Zero-Knowledge. Zero-PII.",
        description: "Standardize your financial agent security with the SDK-level interceptor. Built-in compliance and risk controls.",
        url: "https://www.supra-wall.com/use-cases/financial-services",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function FinancialServicesPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
            <Navbar />
            <VerticalDetailClient />
        </div>
    );
}
