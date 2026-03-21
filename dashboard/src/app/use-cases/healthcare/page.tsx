import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import HealthcareVerticalClient from "./HealthcareVerticalClient";

export const metadata: Metadata = {
    title: "AI Agent Security for Healthcare | HIPAA & PII Protection | SupraWall",
    description: "Secure autonomous agents in healthcare and life sciences. Automatically redact PHI and PII from agentic tool calls to ensure HIPAA compliance and patient privacy.",
    keywords: [
        "AI agents in healthcare",
        "HIPAA compliance for autonomous AI",
        "redact PHI from agent tools",
        "medical agent safety layer",
        "secure patient data in LLM apps",
        "suprawall healthcare solution",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/use-cases/healthcare",
    },
    openGraph: {
        title: "Patient First. Privacy Mandatory. | Healthcare AI Security",
        description: "Standardize your medical agent security with automated PHI/PII scrubbing. Deterministic safety for regulated industries.",
        url: "https://www.supra-wall.com/use-cases/healthcare",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function HealthcarePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar />
            <HealthcareVerticalClient />
        </div>
    );
}
