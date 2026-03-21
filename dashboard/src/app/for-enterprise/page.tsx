import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import ForEnterpriseClient from "./ForEnterpriseClient";

export const metadata: Metadata = {
    title: "Enterprise AI Agent Security | Scale Safely | SupraWall",
    description: "SupraWall Enterprise provides large teams with centralized governance, private cloud deployment, and 24/7 support for autonomous agent security infrastructure.",
    keywords: [
        "enterprise AI security platform",
        "SLA for AI agentic systems",
        "on-premise agent governance",
        "private cloud LLM firewall",
        "SSO for AI agents",
        "centralized agent audit trails",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/for-enterprise",
    },
    openGraph: {
        title: "Scale Your Agent Fleets Without Scaling Risk.",
        description: "Centralized security and governance for the autonomous enterprise. Built-in compliance and SLA-backed infrastructure.",
        url: "https://www.supra-wall.com/for-enterprise",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function ForEnterprisePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <ForEnterpriseClient />
        </div>
    );
}
