import { Navbar } from "@/components/Navbar";
import { 
    AlertTriangle, 
    ShieldAlert, 
    Lock, 
    Zap, 
    ArrowRight,
    Activity,
    Shield,
    Database,
    Cloud,
    Cpu
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";

export const metadata: Metadata = {
    title: "AI Agent Security Risks: The Complete Threat Landscape | SupraWall",
    description: "Beyond simple chatbots, autonomous agents face unique risks like tool abuse, lateral movement, and recursive spending. Learn how to mitigate them.",
    keywords: ["AI agent security risks", "autonomous agent threats", "LLM security vulnerabilities", "agentic AI security guide", "preventing AI agent hacking"],
    alternates: {
        canonical: "https://www.supra-wall.com/learn/ai-agent-security-risks",
    },
};

export default function AIAgentSecurityRisksPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "AI Agent Security Risks in 2026",
        description: "An exhaustive analysis of the unique security risks facing autonomous AI agents and the frameworks used to secure them.",
        author: { "@type": "Organization", "name": "SupraWall" },
        publisher: { "@type": "Organization", "name": "SupraWall" },
        datePublished: "2026-03-01",
    };

    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".quick-summary-table", ".answer-first-paragraph"]
        },
        "url": "https://www.supra-wall.com/learn/ai-agent-security-risks"
    };

    const summaryRows = [
        { label: "Category", value: "Autonomous Agent Vulnerabilities." },
        { label: "Critical Risks", value: "Tool Abuse, Prompt Injection, Recursive Execution." },
        { label: "Impact", value: "Data Breach, Financial Loss, Reputational Damage." },
        { label: "Solution Style", value: "Zero-Trust Runtime Firewalls (SupraWall)." },
        { label: "Priority", value: "High (for production deployments)." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="space-y-8 text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-black text-amber-400 tracking-[0.2em] uppercase">
                            Industry Intelligence • Threat Landscape
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            AI Agent <br /><span className="text-amber-500 underline decoration-white/10">Security Risks.</span>
                        </h1>
                        <div className="space-y-12">
                            <p className="answer-first-paragraph text-xl text-neutral-300 leading-snug font-medium border-l-8 border-amber-600 pl-8 py-4 italic">
                                AI agent security risks are the set of vulnerabilities unique to autonomous systems that can execute code, call APIs, and make decisions without human intervention. 
                                Unlike static LLMs, agents face "unlimited action space" risks where a single compromised prompt can lead to full system takeover.
                                SupraWall eliminates these risks by enforcing granular, deterministic boundaries on every tool the agent attempts to use.
                            </p>
                            <QuickSummaryTable rows={summaryRows} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: "Tool Abuse", desc: "Agents hijacking internal APIs to exfiltrate data or delete resources.", icon: <Cpu /> },
                            { title: "Recursive Spending", desc: "Infinite loops in autonomous execution leading to runaway API costs.", icon: <AlertTriangle /> },
                            { title: "Lateral Movement", desc: "Compromised agents using internal credentials to pivot between services.", icon: <Database /> },
                            { title: "Insecure Output", desc: "Agents generating malicious payloads that exploit downstream systems.", icon: <Cloud /> }
                        ].map((risk) => (
                            <div key={risk.title} className="p-8 rounded-3xl bg-neutral-900 border border-white/5 space-y-4 group hover:border-amber-500/30 transition-all">
                                <div className="p-3 bg-amber-500/10 rounded-xl w-fit group-hover:scale-110 transition-transform">{risk.icon}</div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{risk.title}</h3>
                                <p className="text-neutral-500 font-medium leading-relaxed italic uppercase tracking-tighter text-sm">{risk.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-12 rounded-[4rem] bg-amber-950/20 border border-amber-500/20 text-center space-y-8">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Ready to <span className="text-amber-500 italic uppercase">Secure Your Fleet?</span>
                        </h2>
                        <p className="text-neutral-400 font-medium italic max-w-xl mx-auto">
                            Don't wait for a security incident. Deploy SupraWall and get full visibility and control over your autonomous agents today.
                        </p>
                        <Link href="/login" className="inline-flex items-center gap-4 px-12 py-6 bg-amber-600 text-white font-black text-2xl rounded-3xl hover:bg-amber-500 transition-all shadow-[0_0_80px_rgba(217,119,6,0.3)] tracking-tighter group italic uppercase italic">
                            Join the Private Beta <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
