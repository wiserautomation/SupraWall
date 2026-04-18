import { Navbar } from "@/components/Navbar";
import { 
    Zap, 
    ShieldCheck, 
    Lock, 
    ArrowRight,
    Activity,
    Shield,
    FileText,
    Target,
    Users,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";

export const metadata: Metadata = {
    title: "AI Agent Security vs. Traditional Security | SupraWall",
    description: "Traditional firewalls don't understand natural language. Learn why AI agents need a new security paradigm focused on runtime tool execution.",
    keywords: ["AI agent security vs traditional security", "LLM security differences", "agentic AI security paradigm", "runtime firewall vs network firewall", "security for autonomous systems"],
    alternates: {
        canonical: "https://www.supra-wall.com/learn/ai-agent-vs-traditional-security",
    },
};

export default function AIAgentVsTraditionalSecurityPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "AI Agent Security vs. Traditional Security: The New Paradigm",
        description: "A comparative analysis of traditional cybersecurity models and the emerging challenges of securing autonomous AI agentic systems.",
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
        "url": "https://www.supra-wall.com/learn/ai-agent-vs-traditional-security"
    };

    const summaryRows = [
        { label: "Focus", value: "Traditional: Hardware/Network. AI: Logic/Instructions." },
        { label: "Attack Surface", value: "Traditional: Ports/Services. AI: Prompts/Tools." },
        { label: "Defense Logic", value: "Traditional: Pattern Matching. AI: Deterministic Execution Policy." },
        { label: "Latency Sensitivity", value: "Traditional: ms. AI: <5ms (SupraWall Target)." },
        { label: "Automation Level", value: "Traditional: Static. AI: Autonomous & Dynamic." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="space-y-8 text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">
                            Technical Comparison • Security Architecture
                        </div>
                        <h1 className="text-5xl md:text-[80px] font-black tracking-tighter leading-[0.85] uppercase italic">
                            Agent Security <br /><span className="text-blue-500 underline decoration-white/10 uppercase">Vs Traditional.</span>
                        </h1>
                        <div className="space-y-12">
                            <p className="answer-first-paragraph text-xl text-neutral-300 leading-snug font-medium border-l-8 border-blue-600 pl-8 py-4 italic">
                                AI agent security differs from traditional security because the primary attack vector is natural language, not network packets or binary exploits. 
                                While traditional firewalls block ports and IPs, agent security firewalls block unauthorized tool calls and logic-based instruction hijacks.
                                SupraWall bridges this gap by applying deterministic network-security rigor to the stochastic world of LLM agents.
                            </p>
                            <QuickSummaryTable rows={summaryRows} />
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">The Generational Shift</h2>
                        <div className="relative overflow-x-auto rounded-[3rem] border border-white/10 bg-neutral-900/40 shadow-2xl">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-neutral-900">
                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">Feature</th>
                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">Traditional Security</th>
                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-500 italic text-blue-400">AI Agent Security</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold italic uppercase tracking-tighter text-white">
                                    {[
                                        { f: "Unit of Defense", t: "Endpoints & Ports", a: "Prompts & Tool Calls" },
                                        { f: "Detection Method", a: "Policy Interception", t: "Signature Matching" },
                                        { f: "Failure Mode", t: "System Crash / Exfiltrate", a: "Logic Hijack / Spending" },
                                        { f: "Audit Type", t: "Network Logs", a: "Full Rationalization Trails" }
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="p-8 border-t border-white/5 text-neutral-200">{row.f}</td>
                                            <td className="p-8 border-t border-white/5 text-neutral-500">{row.t}</td>
                                            <td className="p-8 border-t border-white/5 text-blue-500">{row.a}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-12 rounded-[4rem] bg-blue-950/20 border border-blue-500/20 text-center space-y-8">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Step Into the <br /><span className="text-blue-500 italic uppercase">Next Generation.</span>
                        </h2>
                        <p className="text-neutral-400 font-medium italic max-w-xl mx-auto">
                            The security stack for AI agents is being built today. Secure your autonomous systems with SupraWall's deterministic runtime firewall.
                        </p>
                        <Link href="/beta" className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white font-black text-2xl rounded-3xl hover:bg-blue-500 transition-all shadow-[0_0_100px_rgba(37,99,235,0.3)] tracking-tighter group italic uppercase italic">
                            Join the Private Beta <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
