"use client";

import { motion } from "framer-motion";
import { 
    Zap, DollarSign, Bug, ArrowRight, ShieldCheck, 
    Layers, Globe, Briefcase, Heart, Scale
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

const USE_CASE_CARDS = [
    {
        title: "Financial Cost Control",
        href: "/use-cases/cost-control",
        desc: "Prevent agents from entering infinite spending loops on expensive models like GPT-4o.",
        pill: "Finance",
        icon: <DollarSign className="w-8 h-8 text-amber-500" />
    },
    {
        title: "Prompt Injection Mitigation",
        href: "/use-cases/prompt-injection",
        desc: "Protecting sensitive customer data from indirect prompt injection via search results.",
        pill: "Cross-Industry",
        icon: <Bug className="w-8 h-8 text-rose-500" />
    }
];

const UPCOMING_VERTICALS = [
    { title: "Healthcare", desc: "HIPAA-grade PII scrubbing for medical diagnosis agents.", icon: <Heart className="w-6 h-6" />, color: "rose" },
    { title: "Legal AI", desc: "Regulator-ready audit trails for legal brief automation.", icon: <Scale className="w-6 h-6" />, color: "emerald" },
    { title: "E-Commerce", desc: "Secure agent-to-agent negotiation and checkout security.", icon: <Briefcase className="w-6 h-6" />, color: "purple" }
];

export default function UseCasesHubClient() {
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-amber-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>Real World Defense</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[90px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             The Chaos <br />
                             <span className="text-amber-500 font-bold italic underline decoration-white/10 uppercase italic">Intercepted.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             From financial circuit breakers to legal grade auditing, explore how SupraWall protects the most regulated agents on earth.
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 CORE USE CASES GRID */}
            <section className="py-24 px-6 md:px-0">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                   {USE_CASE_CARDS.map((art, i) => (
                       <Link 
                            key={art.href} 
                            href={art.href}
                            className="group p-1 bg-neutral-900 border border-white/5 rounded-[4rem] hover:border-amber-500/30 transition-all hover:bg-neutral-900/60 overflow-hidden relative shadow-2xl"
                       >
                            <div className="p-12 space-y-8 h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">{art.icon}</div>
                                    <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none group-hover:text-amber-400 transition-colors">{art.title}</h3>
                                    <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-snug">{art.desc}</p>
                                </div>
                                <div className="flex items-center gap-2 text-white/50 font-black uppercase tracking-widest text-xs group-hover:text-amber-500 transition-all">
                                    READ CASE STUDY <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                       </Link>
                   ))}
                </div>
            </section>

             {/* 🎯 INDUSTRY VERTICALS SECTION */}
             <section className="py-40 px-6 bg-black relative border-y border-white/5">
                 <div className="max-w-7xl mx-auto space-y-24">
                    <div className="text-center space-y-6">
                        <TagBadge>Regulated Verticals</TagBadge>
                        <h2 className="text-5xl md:text-[6rem] font-black italic uppercase tracking-tighter leading-[0.8] text-glow">
                             Every Sector. <br />
                             <span className="text-neutral-500 font-bold italic">Protected.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {UPCOMING_VERTICALS.map((v, i) => (
                            <div key={v.title} className="p-10 rounded-[3rem] bg-neutral-900/20 border border-white/5 space-y-6 hover:border-white/10 transition-all group grayscale opacity-50 hover:grayscale-0 hover:opacity-100">
                                <div className={`p-4 rounded-xl bg-${v.color}-500/10 text-${v.color}-500 w-fit`}>{v.icon}</div>
                                <div className="space-y-4">
                                     <h4 className="text-2xl font-black italic uppercase text-white tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">{v.title}</h4>
                                     <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest leading-relaxed italic">{v.desc}</p>
                                </div>
                                <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-neutral-800">Available Summer 2026</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
