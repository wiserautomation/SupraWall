"use client";

import { motion } from "framer-motion";
import { Grid, Power, ShieldCheck, Cpu, Zap } from "lucide-react";
import Link from "next/link";

export default function IntegrationsDashboardPage() {
    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic heading-glow">Framework Integrations</h1>
                <p className="text-neutral-400 text-sm">One-click security for your agentic ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frameworks.map((fw, i) => (
                    <motion.div
                        key={fw.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-8 rounded-[32px] bg-neutral-900/50 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col items-start gap-4 card-hover light-sweep"
                    >
                        <div className={`p-3 rounded-2xl ${fw.color} bg-opacity-20 group-hover:ring-2 group-hover:ring-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300`}>
                            <fw.icon className={`w-6 h-6 ${fw.textColor}`} />
                        </div>
                        <div className="space-y-1 mt-2">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{fw.name}</h3>
                            <p className="text-neutral-400 text-xs leading-relaxed">{fw.desc}</p>
                        </div>
                        <div className="w-full h-px bg-emerald-500/10 my-4" />
                        <Link href={fw.href} className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                            Configure Integration →
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const frameworks = [
    {
        name: "SupraWall Connect",
        desc: "Universal sub-key generator for secure, one-click framework integration.",
        icon: Zap,
        color: "bg-emerald-500",
        textColor: "text-emerald-400",
        href: "/dashboard/integrations/connect"
    },
    {
        name: "LangChain",
        desc: "Secure LangGraph and LCEL chains with native @secure decorators.",
        icon: Power,
        color: "bg-emerald-500",
        textColor: "text-emerald-400",
        href: "/integrations/langchain"
    },
    {
        name: "Vercel AI SDK",
        desc: "Zero-latency tool interception for Next.js AI applications.",
        icon: Cpu,
        color: "bg-white",
        textColor: "text-white",
        href: "/integrations/vercel"
    },
    {
        name: "CrewAI",
        desc: "Govern autonomous agent swarms and enterprise collaboration.",
        icon: ShieldCheck,
        color: "bg-blue-500",
        textColor: "text-blue-400",
        href: "/integrations/crewai"
    },
    {
        name: "OpenClaw",
        desc: "Native browser-environment protection for autonomous browsing.",
        icon: Grid,
        color: "bg-purple-500",
        textColor: "text-purple-400",
        href: "/integrations/openclaw"
    }
];
