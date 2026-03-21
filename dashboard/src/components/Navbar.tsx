"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
    Shield, ArrowRight, ChevronDown, KeyRound, DollarSign, 
    ShieldCheck, EyeOff, FileText, Bug, Book, Workflow, 
    Users, Globe, ShieldAlert, Zap, Layers
} from "lucide-react";
import Link from "next/link";

export function Navbar() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const features = [
        { href: "/features/vault", icon: <KeyRound className="w-4 h-4 text-emerald-400" />, label: "Credential Vault", desc: "Zero-knowledge secrets" },
        { href: "/features/budget-limits", icon: <DollarSign className="w-4 h-4 text-amber-400" />, label: "Budget Limits", desc: "Hard caps on API spend" },
        { href: "/features/policy-engine", icon: <ShieldCheck className="w-4 h-4 text-blue-400" />, label: "Policy Engine", desc: "Deterministic ALLOW/BLOCK" },
        { href: "/features/pii-shield", icon: <EyeOff className="w-4 h-4 text-purple-400" />, label: "PII Shield", desc: "Outbound data scrubbing" },
        { href: "/features/audit-trail", icon: <FileText className="w-4 h-4 text-cyan-400" />, label: "Audit Trail", desc: "Regulator evidence reports" },
        { href: "/features/prompt-shield", icon: <Bug className="w-4 h-4 text-rose-400" />, label: "Injection Shield", desc: "SDK binary protection" },
    ];

    const resources = [
        { href: "/learn", icon: <Book className="w-4 h-4 text-emerald-400" />, label: "Learning Hub", desc: "The Agent Security Bible" },
        { href: "/blog", icon: <FileText className="w-4 h-4 text-rose-400" />, label: "Engineering Blog", desc: "Latest research & insights" },
        { href: "/integrations", icon: <Workflow className="w-4 h-4 text-purple-400" />, label: "Frameworks", desc: "LangChain, CrewAI, AutoGen" },
        { href: "/vs", icon: <Layers className="w-4 h-4 text-blue-400" />, label: "Comparisons", desc: "SupraWall vs Competitors" },
    ];

    const company = [
        { href: "/about", icon: <Users className="w-4 h-4 text-neutral-400" />, label: "About Us", desc: "Our mission & philosophy" },
        { href: "/security", icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />, label: "Trust Center", desc: "Security & Compliance" },
        { href: "/changelog", icon: <Zap className="w-4 h-4 text-rose-500" />, label: "Changelog", desc: "Product updates" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-3xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-1.5 bg-emerald-600 rounded-lg shadow-[0_0_20px_rgba(5,150,105,0.4)] group-hover:scale-110 transition-transform duration-500">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-black text-2xl tracking-[-0.05em] uppercase italic">SupraWall</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-glow">
                    {/* Features Dropdown */}
                    <Dropdown 
                        label="Platform" 
                        isOpen={openMenu === "platform"} 
                        onOpen={() => setOpenMenu("platform")} 
                        onClose={() => setOpenMenu(null)}
                        items={features}
                    />

                    {/* Resources Dropdown */}
                    <Dropdown 
                        label="Resources" 
                        isOpen={openMenu === "resources"} 
                        onOpen={() => setOpenMenu("resources")} 
                        onClose={() => setOpenMenu(null)}
                        items={resources}
                    />

                    {/* Company Dropdown */}
                    <Dropdown 
                        label="Company" 
                        isOpen={openMenu === "company"} 
                        onOpen={() => setOpenMenu("company")} 
                        onClose={() => setOpenMenu(null)}
                        items={company}
                    />

                    <Link href="/pricing" className="text-neutral-500 hover:text-white transition-colors">Pricing</Link>
                    <Link href="/login" className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95 group flex items-center gap-2">
                        Get Started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

function Dropdown({ label, isOpen, onOpen, onClose, items }: any) {
    return (
        <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
            <button className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors uppercase italic font-bold">
                {label} <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-neutral-950 border border-emerald-500/15 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.06] p-2"
                    >
                        {items.map((f: any, i: number) => (
                            <Link
                                key={f.href}
                                href={f.href}
                                className={`flex items-start gap-4 px-5 py-4 hover:bg-emerald-500/[0.06] transition-all group rounded-2xl`}
                            >
                                <div className="mt-0.5 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white text-[11px] font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors uppercase italic">{f.label}</p>
                                    <p className="text-neutral-500 text-[10px] font-bold normal-case tracking-tight leading-relaxed uppercase italic opacity-80">{f.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
