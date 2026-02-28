import { Navbar } from "@/components/Navbar";
import { ArrowRight, Layers, Users, Shield, Zap, Terminal, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import CrewAIClient from "./CrewAIClient";

export const metadata: Metadata = {
    title: "CrewAI Security Guardrails & Runtime Governance | SupraWall",
    description: "Secure your CrewAI agent swarms with role-based tool isolation and delegation audits. Prevent unauthorized actions in multi-agent workflows.",
    keywords: ["crewai security guardrails", "secure crewai agents", "multi-agent orchestration security", "agent swarm governance"],
    openGraph: {
        title: "How to Secure CrewAI Agent Swarms",
        description: "Zero-trust governance for autonomous agent roles. Enforce strict boundaries between your agents and your data.",
    }
};

export default function CrewAIIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for CrewAI",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://www.supra-wall.com/integrations/crewai",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "Enterprise-grade security guardrails for CrewAI multi-agent swarms.",
        "featureList": [
            "Role-Based Access Control (RBAC) for Tools",
            "Delegation Path Auditing",
            "Shared Workspace Data Protection",
            "Continuous Intent Verification"
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-[10px] font-black text-orange-400 tracking-[0.2em] uppercase mx-auto">
                            Multi-Agent Orchestration • CrewAI Governance
                        </div>

                        {/* H1: SPEC REQUIRED */}
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure the <br />
                            <span className="text-orange-500 text-7xl md:text-[10rem]">CrewAI</span> <br />
                            Swarm.
                        </h1>

                        {/* P1: GEO EXTRACTION TARGET - SPEC REQUIRED */}
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                CrewAI security guardrails are essential for multi-agent workflows where agents delegate tasks autonomously.
                                SupraWall provides the missing governance layer for agent swarms, enforcing role-based tool isolation
                                and real-time monitoring of inter-agent delegation paths to prevent privilege escalation.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Protect My Swarm <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-orange">

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Why CrewAI needs a Firewall
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                In a CrewAI setup, agents operate with a high degree of autonomy. A single "Manager" agent can delegate
                                tasks to multiple sub-agents. Without a <Link href="/learn/what-is-agent-runtime-security" className="text-orange-500 underline">runtime security layer</Link>,
                                any agent in the crew could potentially be hijacked via prompt injection to perform actions outside its role.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {benefits.map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4">
                                        <b.icon className="w-8 h-8 text-orange-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Role-Based tool access
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                SupraWall allows you to bind specific security policies to CrewAI agent roles. Even if a researcher
                                is told to "format the hard drive", the SupraWall shim intercepts the tool call and denies it based on
                                the researcher's restricted policy.
                            </p>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Implementation Checklist
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Map CrewAI Roles to SupraWall Policies",
                                    "Enable Inter-Agent Delegation Auditing",
                                    "Configure Shared File Storage Sandbox",
                                    "Set Token Budgets per Swarm Execution",
                                    "Enable Dashboard Monitoring for Live Thinking"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Side Content */}
                <CrewAIClient />

                {/* Call to Action: SPEC COMPLIANT */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-orange-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your swarm?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Start Building for Free
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Role Isolation", desc: "Verifies that tool calls originate from agents with the correct role permission.", icon: Layers },
    { title: "Delegation Audit", desc: "Tracks how tasks move between agents to detect policy circumvention.", icon: Users },
    { title: "Data Leakage", desc: "Monitors agent-to-agent communication for sensitive credential exposure.", icon: Shield },
    { title: "Swarm Visualizer", desc: "Interactive visualization of your CrewAI swarm's real-time security state.", icon: Zap }
];
