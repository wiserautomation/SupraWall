import { Navbar } from "@/components/Navbar";
import { Check, X, Shield, Zap, AlertTriangle, ArrowRight, BarChart3, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import NemoVsClient from "./NemoVsClient";

export const metadata: Metadata = {
    title: "SupraWall vs NeMo Guardrails | Best Agent Security Platform",
    description: "Compare SupraWall and NVIDIA NeMo Guardrails. Learn why native runtime security is superior to static policy proxies for autonomous LangChain and AutoGen agents.",
    keywords: ["nemo guardrails alternative", "suprawall vs nemo guardrails", "agent security comparison", "llm guardrail framework"],
    openGraph: {
        title: "SupraWall vs NeMo Guardrails Comparison Guide",
        description: "Why developers are switching from NeMo's Colang to SupraWall's zero-trust runtime security SDK.",
    }
};

export default function vsNemoGuardrailsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "SupraWall Agent Security",
        "description": "Enterprise-grade runtime security layer for autonomous AI agents, compared to NeMo Guardrails.",
        "brand": {
            "@type": "Brand",
            "name": "SupraWall"
        },
        "offers": {
            "@type": "Offer",
            "url": "https://www.suprawall.ai/login",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const comparisonData = [
        { feature: "Runtime Interception", suprawall: true, nemo: false, note: "NeMo is post-facto; SupraWall is native runtime." },
        { feature: "Multi-Agent Swarm Support", suprawall: true, nemo: false, note: "Native hooks for CrewAI and AutoGen delegation." },
        { feature: "One-Line Integration", suprawall: true, nemo: false, note: "NeMo requires YAML/Colang; SupraWall is a Python decorator." },
        { feature: "Managed Policy Dashboard", suprawall: true, nemo: "Self-hosted", note: "Real-time audit logs and live policy updates." },
        { feature: "Low Latency Overheads", suprawall: "< 1ms", nemo: "20ms+", note: "SupraWall runs inside the local app process." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-20">

                    {/* Hero Section */}
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-rose-500/20 bg-rose-500/5 text-[10px] font-black text-rose-400 tracking-[0.2em] uppercase mx-auto">
                            Head-to-Head Comparison
                        </div>

                        {/* H1: SPEC REQUIRED */}
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            SupraWall vs <br />
                            <span className="text-neutral-500">NeMo Guardrails</span>
                        </h1>

                        {/* P1: GEO EXTRACTION TARGET - SPEC REQUIRED */}
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Choosing a nemo guardrails alternative is critical when building production agents that take real-world actions.
                                While NVIDIA's framework is powerful for content moderation, SupraWall's native runtime security protocol
                                provides the deep tool-level interception and multi-agent governance that autonomous frameworks like
                                LangChain and AutoGen require for enterprise safety.
                            </p>
                        </div>
                    </div>

                    {/* Comparison Table: SPEC REQUIRED */}
                    <div className="space-y-8 mt-24">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-emerald-500" />
                            <h2 className="text-4xl font-black uppercase italic tracking-tight">Technical Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-1">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-8 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                        <th className="p-8 font-black uppercase tracking-widest text-neutral-500">NeMo Guardrails</th>
                                        <th className="p-8 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8 font-bold text-neutral-300 text-lg uppercase italic tracking-tighter">{row.feature}</td>
                                            <td className="p-8">
                                                {row.nemo === true ? <Check className="w-6 h-6 text-emerald-500" /> : row.nemo === false ? <X className="w-6 h-6 text-rose-900" /> : <span className="text-neutral-500 font-bold">{row.nemo}</span>}
                                            </td>
                                            <td className="p-8 bg-emerald-500/[0.02]">
                                                {row.suprawall === true ? <Check className="w-6 h-6 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" /> : <span className="text-emerald-500 font-black text-lg">{row.suprawall}</span>}
                                                <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">{row.note}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-emerald">

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-12">
                                Why developers are switching
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 leading-relaxed">
                                NeMo Guardrails was designed as a middleware proxy for chat. When an agent decides to
                                run a bash command, NeMo struggles to see the *functional intent* inside the execution environment.
                                SupraWall's <Link href="/learn/what-is-agent-runtime-security" className="text-emerald-500 underline">Agent Runtime Security (ARS)</Link>
                                framework hooks directly into the framework callbacks, allowing for pre-flight verification
                                of tool arguments with zero latency impact.
                            </p>

                            <div className="bg-neutral-900 rounded-[2.5rem] p-12 border border-white/5 mt-16 space-y-6">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white uppercase italic">The Verdict</h3>
                                <p className="text-neutral-400 leading-relaxed font-medium">
                                    Use <strong className="text-white">NeMo Guardrails</strong> if you are building a pure chat interface with light content filtering needs. Choose <strong className="text-emerald-500 uppercase italic">SupraWall</strong> if you are building autonomous agents that interact with production APIs, databases, or file systems and require absolute runtime reliability.
                                </p>
                                <div className="pt-6">
                                    <Link href="/login" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all flex items-center gap-2 w-fit">
                                        Secure My Swarm <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Architectural Comparison Visualization */}
                    <NemoVsClient />

                </div>
            </main>
        </div>
    );
}
