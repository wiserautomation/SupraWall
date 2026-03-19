import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import GalileoClient from "./GalileoClient";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
    title: "SupraWall vs Galileo | Enforcement vs Observability",
    description:
        "SupraWall and Galileo solve different problems. Galileo monitors agent behavior after the fact. SupraWall enforces security policies in real-time before tool execution.",
    keywords: [
        "suprawall vs galileo",
        "galileo ai agent security",
        "agent observability vs enforcement",
        "galileo agent control alternative",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/vs/galileo",
    },
};

export default function vsGalileoPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How is SupraWall different from Galileo?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Galileo is an observability platform for debugging agent behavior. SupraWall is a runtime security firewall that prevents unauthorized actions before they happen. They serve complementary purposes.",
                },
            },
            {
                "@type": "Question",
                name: "Can I use SupraWall and Galileo together?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Use Galileo for evaluation and behavioral tracing; use SupraWall for enforcement, policy control, and EU AI Act compliance.",
                },
            },
            {
                "@type": "Question",
                name: "Does Galileo block tool calls?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Galileo monitors and evaluates agent actions but does not intercept or block them. If you need enforcement, you need SupraWall.",
                },
            },
        ],
    };

    const comparisonData = [
        {
            feature: "Real-time Action Blocking",
            suprawall: true,
            galileo: false,
            note: "Galileo observes and reports; SupraWall intercepts and blocks.",
        },
        {
            feature: "Policy Engine (ALLOW/DENY)",
            suprawall: true,
            galileo: false,
            note: "Galileo has no enforcement policies, only evaluation metrics.",
        },
        {
            feature: "Human-in-the-Loop Approvals",
            suprawall: true,
            galileo: false,
            note: "SupraWall pauses execution pending human review.",
        },
        {
            feature: "Agent Vault / Secrets",
            suprawall: true,
            galileo: false,
            note: "Galileo doesn't manage credentials.",
        },
        {
            feature: "EU AI Act Compliance Exports",
            suprawall: true,
            galileo: false,
            note: "SupraWall generates Article 12 tamper-proof reports.",
        },
        {
            feature: "Observability / Tracing",
            suprawall: "Action-level",
            galileo: "Deep traces",
            note: "Galileo wins on debugging depth; SupraWall wins on security depth.",
        },
        {
            feature: "Open Source",
            suprawall: false,
            galileo: true,
            note: "Galileo is Apache 2.0; SupraWall is commercial.",
        },
        {
            feature: "Use Case",
            suprawall: "Security Governance",
            galileo: "Eval & Debugging",
            note: "Complementary tools, not direct competitors.",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-20">

                    {/* Hero Section */}
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase mx-auto">
                            Head-to-Head Comparison
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            SupraWall vs <br />
                            <span className="text-neutral-500">Galileo</span>
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Galileo tells you what your agent did wrong. SupraWall stops it from doing wrong in the
                                first place. One is a debugger. The other is a firewall. For teams shipping production agents
                                under EU AI Act scrutiny, the difference is not cosmetic — it is architectural.
                            </p>
                        </div>
                    </div>

                    {/* Comparison Table */}
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
                                        <th className="p-8 font-black uppercase tracking-widest text-neutral-500">Galileo</th>
                                        <th className="p-8 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8 font-bold text-neutral-300 text-lg uppercase italic tracking-tighter">{row.feature}</td>
                                            <td className="p-8">
                                                {row.galileo === true ? (
                                                    <Check className="w-6 h-6 text-emerald-500" />
                                                ) : row.galileo === false ? (
                                                    <X className="w-6 h-6 text-rose-900" />
                                                ) : (
                                                    <span className="text-neutral-500 font-bold">{row.galileo}</span>
                                                )}
                                            </td>
                                            <td className="p-8 bg-emerald-500/[0.02]">
                                                {row.suprawall === true ? (
                                                    <Check className="w-6 h-6 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                                                ) : row.suprawall === false ? (
                                                    <X className="w-6 h-6 text-rose-500" />
                                                ) : (
                                                    <span className="text-emerald-500 font-black text-lg">{row.suprawall}</span>
                                                )}
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

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-12">
                                Observability is not enforcement
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 leading-relaxed">
                                Galileo is excellent at what it does: tracing agent decisions, surfacing evaluation metrics,
                                and helping teams understand why an agent behaved unexpectedly. But observability tools are
                                forensic by nature — they analyze the past. SupraWall's{" "}
                                <Link href="/learn/what-is-agent-runtime-security" className="text-emerald-500 underline">
                                    Agent Runtime Security (ARS)
                                </Link>{" "}
                                framework intercepts every tool call before execution, applying ALLOW/DENY policy rules in real-time
                                so harmful actions never reach the environment in the first place.
                            </p>

                            <div className="bg-neutral-900 rounded-[2.5rem] p-12 border border-white/5 mt-16 space-y-6">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">The Verdict</h3>
                                <p className="text-neutral-400 leading-relaxed font-medium">
                                    Use <strong className="text-white">Galileo</strong> for deep behavioral tracing and post-hoc
                                    evaluation of agent runs. Choose{" "}
                                    <strong className="text-emerald-500 uppercase italic">SupraWall</strong> when you need
                                    real-time enforcement, a built-in secret vault, human-in-the-loop approvals, and
                                    EU AI Act Article 12 compliance exports. The two tools are complementary — but only one
                                    can stop a rogue agent before it deletes production data.
                                </p>
                                <div className="pt-6">
                                    <Link
                                        href="/login"
                                        className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all flex items-center gap-2 w-fit"
                                    >
                                        Start Enforcing Policies <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Architectural Visualization + FAQ */}
                    <GalileoClient />

                </div>
            </main>
        </div>
    );
}
