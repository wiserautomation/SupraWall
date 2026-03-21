import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import SecurityTrustClient from "./SecurityTrustClient";

export const metadata: Metadata = {
    title: "Security & Trust Center | Compliance & Reliability | SupraWall",
    description: "Our security infrastructure is built for mission-critical agentic fleets. Explore our SOC2 status, zero-knowledge secret injection, and immutable audit protocols.",
    keywords: [
        "SupraWall SOC2 compliance",
        "zero-knowledge secret management AI",
        "immutable logs security infra",
        "penetration test results suprawall",
        "agentic security trust center",
        "SLA for AI safety layer",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/security",
    },
    openGraph: {
        title: "Trust SupraWall. Secure Your Business.",
        description: "Zero-knowledge security infrastructure for AI teams. Our trust center details our commitment to enterprise safety.",
        url: "https://www.supra-wall.com/security",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            <SecurityTrustClient />
        </div>
    );
}
