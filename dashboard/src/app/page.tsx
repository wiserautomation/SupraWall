"use client";

import { motion } from "framer-motion";
import {
    ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2,
    Shield, BrickWall, Database, Terminal, Globe, Code2, AlertTriangle,
    Play, Users, Star, HelpCircle, Mail, DollarSign, ExternalLink,
    Zap, Server, Bot, Layers, Triangle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";

// --- Components ---

function CodeTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const terminalLines = [
        "> LangChain Agent: Executing...",
        "> Tool: bash_command",
        "> Input: \"rm -rf /production/db\"",
        "⚠️  INTERCEPTED BY SUPRAWALL",
        "🛡️  Policy Check Running...",
        "❌ DENIED - Destructive Action",
        "🚨 Alert sent to admin",
        "✅ Database protected",
    ];

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let index = 0;
        let isRunning = true;

        const tick = () => {
            if (!isRunning) return;

            if (index < terminalLines.length) {
                const line = terminalLines[index];
                setLines(prev => [...prev, line]);
                index++;
                setTimeout(tick, 800);
            } else {
                setTimeout(() => {
                    if (!isRunning) return;
                    setLines([]);
                    index = 0;
                    tick();
                }, 2000);
            }
        };

        tick();
        return () => { isRunning = false; };
    }, []);

    if (!mounted) {
        return <div className="w-full max-w-lg aspect-square md:aspect-video bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-sm relative" />;
    }

    return (
        <div suppressHydrationWarning className="w-full max-w-lg aspect-square md:aspect-video bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-sm relative">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-[10px] text-neutral-500 uppercase tracking-widest">AI Agent Execution Log</span>
            </div>
            <div className="p-6 space-y-2">
                {lines.map((line, i) => {
                    const safeLine = line || "";
                    const isWarning = safeLine?.includes("⚠️");
                    const isDenied = safeLine?.includes("❌");
                    const isSuccess = safeLine?.includes("✅");
                    const isCheck = safeLine?.includes("🛡️");

                    return (
                        <motion.div
                            key={`terminal-line-${i}`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${isWarning ? 'text-amber-400 font-bold' : i >= 3 && !isSuccess ? 'text-rose-400 font-bold' : isSuccess ? 'text-emerald-400 font-bold' : isCheck ? 'text-emerald-400' : 'text-neutral-400'}`}
                        >
                            {safeLine}
                        </motion.div>
                    );
                })}
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] text-neutral-600">
                💾 Local Security Policy v2.4
            </div>
        </div>
    );
}

function ClawbotDemo() {
    const [lines, setLines] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const sequence = [
        "> clawbot.click(\"Settings\")",
        "✅ Navigated to /settings",
        "> clawbot.click(\"Delete Account\")",
        "⚠️  DETECTION: destructive_pattern",
        "❌ BLOCKED: Policy \"SafeMode-V1\"",
        "🛡️  Prevented data loss"
    ];

    useEffect(() => {
        setMounted(true);
        let i = 0;
        let isRunning = true;
        const tick = () => {
            if (!isRunning) return;
            if (i < sequence.length) {
                setLines(prev => [...prev, sequence[i]]);
                i++;
                setTimeout(tick, 1000);
            } else {
                setTimeout(() => {
                    if (!isRunning) return;
                    setLines([]);
                    i = 0;
                    tick();
                }, 3000);
            }
        };
        tick();
        return () => { isRunning = false; };
    }, []);

    if (!mounted) {
        return <div className="w-full h-full bg-[#020202] p-6 font-mono text-[10px] md:text-xs text-emerald-400/80 space-y-2 overflow-hidden" />;
    }

    return (
        <div suppressHydrationWarning className="w-full h-full bg-[#020202] p-6 font-mono text-[10px] md:text-xs text-emerald-400/80 space-y-2 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-4 opacity-50 border-b border-white/5 pb-2">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                <span className="ml-2 uppercase tracking-widest text-[8px] text-neutral-400">Browser Security Monitor</span>
            </div>
            {lines.map((l, i) => {
                const safeL = l || "";
                return (
                    <motion.div
                        key={`clawbot-line-${i}`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={safeL?.includes('❌') ? 'text-rose-500 font-black' : safeL?.includes('⚠️') ? 'text-amber-500 font-bold' : safeL?.includes('🛡️') ? 'text-emerald-400' : ''}
                    >
                        {safeL}
                    </motion.div>
                );
            })}
        </div>
    );
}

function LangChainDemo() {
    return (
        <div className="w-full h-full bg-neutral-900 grid grid-rows-2 gap-1 p-4 font-mono text-[10px] md:text-xs">
            <div className="bg-black/40 p-4 rounded-xl border border-rose-500/20 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute top-2 right-4 text-[8px] font-black text-rose-500 uppercase">Unsecured</div>
                <code className="text-rose-200/40">
                    agent.run("Email users")<br />
                    <span className="text-rose-500 animate-pulse font-bold"># 💀 Internal debug data leaked</span>
                </code>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-2 right-4 text-[8px] font-black text-emerald-500 uppercase">Secured</div>
                <code className="text-emerald-100">
                    <span className="text-emerald-400 font-bold">secure(</span>agent<span className="text-emerald-400 font-bold">)</span>.run("Email users")<br />
                    <span className="text-emerald-400 font-bold"># ✅ Data Sanitized & Blocked</span>
                </code>
            </div>
        </div>
    );
}

function AutoGenDemo() {
    return (
        <div className="w-full h-full bg-[#050505] p-6 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    <span>Threats Prevented</span>
                    <span className="text-rose-500 font-black">127 blocked</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '74%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-rose-600 to-emerald-600"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Loss Prevented</p>
                    <p className="text-2xl font-black text-white tracking-tighter">$847K</p>
                </div>
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Integrity Score</p>
                    <p className="text-2xl font-black text-emerald-500 tracking-tighter">100%</p>
                </div>
            </div>
        </div>
    );
}

// --- Main Page ---

export default function LandingPage() {
    const [activeTechTab, setActiveTechTab] = useState("TypeScript");

    const techExamples: Record<string, any> = {
        "TypeScript": {
            before: `const agent = createAgent();\n// ⚠️ No governance window\nawait agent.invoke({ task: "..." });\n// Unrestricted tool usage 💀`,
            after: `import { protect } from "@suprawall/sdk";\n\n// 🛡️ Zero-Config Protection\nconst secured = protect(myAgent);\n\n// Every action is now governed\nawait secured.invoke({ task: "..." });\n// ✅ Tools intercepted & audited`
        },
        "Python": {
            before: `from crewai import Agent\n\n# ⚠️ Autonomous swarm risk\nagent = Agent(...)\nagent.start()\n# Unlimited tool access 💀`,
            after: `from suprawall import secure\n\n# 🛡️ Native Framework evolution\n@secure(api_key="ag_...")\ndef run_swarm():\n    # Agent is automatically protected\n    return Agent(...)\n\n# ✅ Destructive acts blocked`
        },
        "MCP": {
            before: `const server = new Server(...);\n// ⚠️ Direct tool execution\nserver.on("call_tool", ...);\n# No per-user policy 💀`,
            after: `import { secureMCP } from "suprawall";\n\n// 🛡️ Secure Model Context Protocol\nconst secured = secureMCP(server);\n\n// ✅ Tool calls governed via cloud\nawait secured.start();`
        },
        "Browser": {
            before: `const agent = new Clawbot(browser);\n// ⚠️ Unlimited navigation/clicks\nawait agent.execute("Delete AWS Account");\n# System wiped 💀`,
            after: `import { secureClaw } from "@suprawall/claw";\n\n// 🛡️ Native Browser Guard\nconst secured = secureClaw(agent);\n\n// ✅ High-risk actions intercepted\nawait secured.execute("Delete AWS Account");\n# ❌ Access Denied: Dangerous Command`
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-white">

            <Navbar />

            <main className="overflow-hidden">

                {/* 📐 SECTION 1: HERO */}
                <section className="relative pt-40 pb-32 px-6">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-30 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-600/20 blur-[150px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-8 text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-400 tracking-wider uppercase"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                                Security Infrastructure for AI Agents.
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-[90px] font-extrabold tracking-tight text-white leading-[0.9] uppercase italic"
                            >
                                We Block Your Agent <br />
                                <span className="text-emerald-500">from going Rogue.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-relaxed font-medium"
                            >
                                The security shim for LangChain, AutoGen, CrewAI, and OpenClaw. Prevent rogue behavior with zero-trust tool governance.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap items-center gap-4 pt-4"
                            >
                                <Link href="/login" className="px-8 py-4 bg-emerald-600 text-white font-black text-lg rounded-2xl hover:bg-emerald-50 shadow-[0_8px_32px_-8px_rgba(99,102,241,0.5)] transition-all active:scale-95 flex flex-col items-center justify-center">
                                    <div className="flex items-center gap-3">
                                        Start Securing Agents <ArrowRight className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] opacity-60 font-medium">No credit card required</span>
                                </Link>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="pt-8 flex flex-col gap-6"
                            >
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm max-w-md relative group">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />)}
                                    </div>
                                    <p className="text-lg font-medium text-neutral-300 italic mb-6 leading-relaxed">
                                        "Essential for anyone running Claw agents in production. Caught 30 dangerous clicks before they happened."
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                        <div className="w-10 h-10 rounded-full border border-emerald-500/30 overflow-hidden bg-neutral-800">
                                            <img src="/reviewer.png" alt="Max Haining" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">— @maxhaining</p>
                                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Creator of OpenClaw</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>


                        </div>

                        <div className="lg:col-span-5 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <CodeTerminal />
                                <div className="mt-6 flex items-center gap-2 justify-center lg:justify-start">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                                        LIVE: 3,847 dangerous actions blocked today
                                    </span>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/5">
                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Trusted by teams shipping AI at:</p>
                                    <div className="flex flex-wrap gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                        <div className="font-bold text-xl tracking-tighter text-white">YC W24</div>
                                        <div className="font-bold text-xl tracking-wide text-white">STRIPE</div>
                                        <div className="font-bold text-xl tracking-tight text-white italic">anthropic</div>
                                        <div className="font-bold text-xl tracking-wider text-white">scale</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Glow effect behind terminal */}
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] -z-10 rounded-full scale-125" />
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 1.5: FRAMEWORK CLOUD */}
                <section className="pb-24 px-6 border-b border-white/5 bg-black">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] mb-12 text-center">Powering Safety for the Agent Ecosystem</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                            <span className="text-3xl font-black tracking-tighter text-white">LangChain</span>
                            <span className="text-3xl font-black uppercase italic text-white">AutoGen</span>
                            <span className="text-3xl font-black tracking-tight text-white italic">CrewAI</span>
                            <span className="text-3xl font-black text-white">LlamaIndex</span>
                            <span className="text-3xl font-black tracking-widest text-white">OpenClaw</span>
                        </div>
                    </div>
                </section>
                <section className="bg-neutral-950/50 py-32 px-6 border-y border-white/5">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-xs font-black text-rose-500 uppercase tracking-[0.3em]"
                            >
                                Without SupraWall, this is your reality:
                            </motion.h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Real incidents. Real consequences.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <AlertTriangle className="w-8 h-8 text-rose-500" />,
                                    title: "Data Destruction",
                                    body: "\"Our LangChain agent deleted 3 years of customer data in staging during a simple cleanup task.\"",
                                    author: "CTO, SaaS Co (Series B)"
                                },
                                {
                                    icon: <DollarSign className="w-8 h-8 text-rose-500" />,
                                    title: "Runaway Spending",
                                    body: "\"AI agent bought $50K of AWS GPU instances in 2 hours during an autonomous research loop loop.\"",
                                    author: "DevOps Lead, AI Startup"
                                },
                                {
                                    icon: <Mail className="w-8 h-8 text-rose-500" />,
                                    title: "Mass PII Leak",
                                    body: "\"A support chatbot leaked 10,000 internal documents to public users via prompt injection.\"",
                                    author: "Security Team, E-commerce"
                                }
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group hover:border-rose-500/30 transition-all duration-500"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                                        {card.icon}
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <div className="inline-flex px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold tracking-widest uppercase">Real Incident</div>
                                        <blockquote className="text-xl text-neutral-200 font-medium leading-relaxed italic">
                                            {card.body}
                                        </blockquote>
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-sm font-bold text-white">— {card.author}</p>
                                        </div>
                                    </div>

                                    {/* Subtle Red Warning Gradient */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-neutral-500 text-lg font-medium">These aren't hypotheticals. These happened last month.</p>
                            <p className="text-white text-xl font-black mt-2">Your AI agents have the keys to everything. Do you trust them?</p>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 3: THE SOLUTION - SHIFTED UP */}
                <section className="py-32 px-6 bg-black relative border-b border-white/5">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-xs font-black text-emerald-500 uppercase tracking-widest"
                            >
                                Security Infrastructure
                            </motion.div>
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight italic">
                                Safe Mode for <br />Your Agent Runtime.
                            </h3>
                            <p className="text-xl text-neutral-400 leading-relaxed max-w-lg font-medium">
                                SupraWall acts as a <span className="text-white">secure proxy</span> between your LLM and your tools. It intercepts every action, applies your policies, and enforces human-in-the-loop governance.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                {[
                                    { title: "One-Line Integration", desc: "Just wrap your agent." },
                                    { title: "Universal Support", desc: "Any framework, any LLM." },
                                    { title: "Zero Latency", desc: "< 10ms policy checks." },
                                    { title: "Full Audit Trail", desc: "Signed logs for SOC2." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-tight">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            {item.title}
                                        </div>
                                        <p className="text-xs text-neutral-500 font-medium">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-2 p-1 bg-neutral-900/50 border border-white/5 rounded-2xl backdrop-blur-sm">
                                {Object.keys(techExamples).map((tech) => (
                                    <button
                                        key={tech}
                                        onClick={() => setActiveTechTab(tech)}
                                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTechTab === tech ? 'bg-emerald-600 text-white shadow-xl' : 'text-neutral-500 hover:text-white'}`}
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-3">
                                    <div className="bg-[#0A0A0A] border border-emerald-500/40 rounded-[2.5rem] p-10 font-mono text-xs md:text-sm overflow-x-auto text-emerald-100 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative group">
                                        <div className="absolute top-6 right-8 p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                            SECURED
                                        </div>
                                        <pre className="leading-relaxed opacity-90">{techExamples[activeTechTab].after}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 4: INTEGRATIONS */}
                <section id="integrations" className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-20 space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase"
                            >
                                Framework Native
                            </motion.div>
                            <h3 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">Integration Hub.</h3>
                            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
                                We integrate with the tools you already use. Zero configuration required to start securing your agents.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "LangChain",
                                    href: "/integrations/langchain",
                                    desc: "Official callback handler for AgentExecutor and LCEL chains.",
                                    icon: Layers,
                                    color: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
                                    iconColor: "text-emerald-500",
                                    badge: "Popular"
                                },
                                {
                                    name: "OpenClaw",
                                    href: "/integrations/openclaw",
                                    desc: "Native browser interception for autonomous page actions.",
                                    icon: Globe,
                                    color: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
                                    iconColor: "text-blue-500",
                                    badge: "Verified"
                                },
                                {
                                    name: "AutoGen",
                                    href: "/integrations/autogen",
                                    desc: "Govern multi-agent conversations and Docker code execution.",
                                    icon: Bot,
                                    color: "hover:border-purple-600/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.15)]",
                                    iconColor: "text-purple-500",
                                    badge: "Enterprise"
                                },
                                {
                                    name: "Vercel AI SDK",
                                    href: "/integrations/vercel",
                                    desc: "Bridge tool calls to edge-secured policies with no latency.",
                                    icon: Triangle,
                                    color: "hover:border-slate-300/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]",
                                    iconColor: "text-white",
                                    badge: "Native"
                                },
                                {
                                    name: "MCP Servers",
                                    href: "/docs/mcp",
                                    desc: "Middleware for Model Context Protocol tools and resources.",
                                    icon: Zap,
                                    color: "hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
                                    iconColor: "text-amber-500",
                                    badge: "Standard"
                                },
                                {
                                    name: "CrewAI",
                                    href: "/integrations/crewai",
                                    desc: "Role-based tool permissions for autonomous agent swarms.",
                                    icon: Users,
                                    color: "hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
                                    iconColor: "text-orange-500",
                                    badge: "New"
                                }
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`group p-10 rounded-[3rem] border border-white/5 bg-white/[0.01] flex flex-col gap-8 transition-all duration-700 ${item.color} hover:bg-white/[0.03] active:scale-95`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={`p-4 rounded-2xl bg-white/[0.03] group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                            <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">{item.badge}</span>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black text-white italic tracking-tighter">{item.name}</h4>
                                        <p className="text-neutral-500 font-medium leading-relaxed group-hover:text-neutral-300 transition-colors uppercase text-[10px] tracking-widest">{item.desc}</p>
                                    </div>
                                    <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase text-emerald-500 tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                                        Read Adapter Specs <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 5: USE CASES */}
                <section className="py-32 bg-white text-black px-6">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em]">Real-world safety</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Trusted to protect <br />autonomous behavior.</h3>
                        </div>

                        <div className="flex overflow-x-auto gap-8 pb-12 snap-x hide-scrollbar">
                            {[
                                {
                                    tag: "Browser Automation",
                                    title: "Clawbot 🔥",
                                    desc: "\"Our Clawbot scrapers were accidentally clicking 'Delete Account' on customer portals. SupraWall caught 127 attempts before we even knew.\"",
                                    author: "Alex Chen, Automation Startup",
                                    visual: <ClawbotDemo />
                                },
                                {
                                    tag: "Customer Service",
                                    title: "LangChain in Prod",
                                    desc: "\"AI chatbot was about to email our entire customer list with internal debugging info. SupraWall flagged it for approval. Saved us from GDPR nightmare.\"",
                                    author: "Maria Santos, Head of Security",
                                    visual: <LangChainDemo />
                                },
                                {
                                    tag: "DevOps / SRE",
                                    title: "AutoGen Control",
                                    desc: "\"Coding agent tried to push to main branch with AWS credentials in the code. Policy blocked it, saved our Series A.\"",
                                    author: "David Kim, Engineering Lead",
                                    visual: <AutoGenDemo />
                                }
                            ].map((card, i) => (
                                <div key={i} className="min-w-[320px] md:min-w-[450px] snap-center p-8 border-2 border-black rounded-[2.5rem] space-y-8 hover:bg-neutral-50 transition-colors group">
                                    <div className="aspect-video w-full bg-neutral-100 rounded-2xl border-2 border-black overflow-hidden flex items-center justify-center font-mono text-xs text-neutral-400 group-hover:border-emerald-500 transition-all duration-500">
                                        {card.visual}
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest py-1 px-3 border border-black rounded-full">{card.tag}</span>
                                        <p className="text-2xl font-bold leading-tight">{card.desc}</p>
                                        <div className="pt-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-black shrink-0" />
                                            <div>
                                                <p className="font-black text-sm">{card.author}</p>
                                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest leading-none">Case Study →</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 6: "THE STRIPE MOMENT" */}
                <section className="py-40 px-6 bg-[#050505] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

                    <div className="max-w-7xl mx-auto relative z-10 space-y-24">
                        <div className="text-center space-y-6">
                            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic">BUILT FOR SCALE.</h2>
                            <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-medium">
                                The architecture you need to scale zero-trust autonomous agents across your entire organization.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
                            {[
                                { icon: <Globe className="w-7 h-7" />, title: "8 Languages", desc: "Native SDKs for Python, TypeScript, Go, Ruby, PHP, Java, Rust, and C#. Built by developers, for developers." },
                                { icon: <Database className="w-7 h-7" />, title: "5 Databases", desc: "First-class ORM adapters for PostgreSQL, MySQL, MongoDB, Supabase, and Firebase." },
                                { icon: <Terminal className="w-7 h-7" />, title: "Local Dev & CLI", desc: "Work offline on airplanes. Spin up the isolated SQLite local dev server and manage policies from your terminal." },
                                { icon: <Code2 className="w-7 h-7" />, title: "Framework Native", desc: "Drop-in plugins for LangChain, LlamaIndex, AutoGen, Vercel AI, and CrewAI." },
                                { icon: <Activity className="w-7 h-7" />, title: "Live Webhooks", desc: "Stripe-grade real-time event streaming with HMAC SHA256 signatures for manual interaction." },
                                { icon: <Box className="w-7 h-7" />, title: "Drop-in UI", desc: "React, Vue, Svelte + iFrame embed components for instant policy builders and audit logs." },
                                { icon: <Lock className="w-7 h-7" />, title: "SOC2 Compliance", desc: "Instantly audit every tool execution. Perfect for security questionnaires and compliance audits." },
                                { icon: <Zap className="w-7 h-7" />, title: "Zero Config", desc: "Starts securing your agent in seconds with sensible defaults for destructive tool detection." },
                                { icon: <Server className="w-7 h-7" />, title: "Self-Host Ready", desc: "Deploy via Docker in your own VPC. Keep your audit logs and policy data completely isolated." }
                            ].map((feature, i) => (
                                <div key={i} className="space-y-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-all duration-500 group-hover:rotate-6 shadow-xl">
                                        {feature.icon}
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-2xl font-bold text-white tracking-tight">{feature.title}</h4>
                                        <p className="text-neutral-500 leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-20 border-t border-white/5">
                            <p className="text-neutral-400 font-bold tracking-[0.2em] uppercase">SupraWall works anywhere, with anything, in any language—just like Stripe.</p>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 7: LIVE DEMO (SIMULATED) */}
                <section className="py-32 px-6 bg-emerald-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-purple-800 opacity-50" />
                    <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 text-white">
                            <h2 className="text-6xl font-black italic tracking-tighter">SEE IT IN<br />ACTION.</h2>
                            <p className="text-xl opacity-90 font-medium max-w-lg leading-relaxed">
                                Our interactive engine intercepts tool calls in real-time. Try typing a destructive command to see how our global policy engine handles it.
                            </p>
                            <div className="p-8 border border-white/20 rounded-3xl bg-white/10 backdrop-blur-md space-y-6 shadow-2xl">
                                <h4 className="font-black text-sm uppercase tracking-widest">Interactive Output Log</h4>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex items-start gap-3">
                                        <span className="text-emerald-400 shrink-0">🟢</span>
                                        <div>
                                            <p className="font-bold">ALLOWED: read_customer_csv</p>
                                            <p className="opacity-60 text-xs mt-1">Policy: "Allow read operations from secure buckets"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-rose-400 shrink-0">❌</span>
                                        <div>
                                            <p className="font-bold text-rose-300">DENIED: rm -rf /data</p>
                                            <p className="opacity-60 text-xs mt-1">Policy: "Block restricted Unix commands globally"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-amber-400 shrink-0">🤔</span>
                                        <div>
                                            <p className="font-bold text-amber-200">PENDING: email @all_customers</p>
                                            <p className="opacity-60 text-xs mt-1">Policy: "Sensitive communications require human approval"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="w-full h-[500px] bg-neutral-950 rounded-[3rem] border-[12px] border-white/10 shadow-2xl relative overflow-hidden p-8 font-mono">
                                <div className="space-y-4">
                                    <p className="text-neutral-500"># Try these commands in our engine:</p>
                                    <div className="space-y-1">
                                        <p className="text-emerald-400">secured.run(<span className="text-emerald-400">"read customer.csv"</span>)</p>
                                        <p className="text-emerald-400">secured.run(<span className="text-emerald-400">"rm -rf /data"</span>) <span className="text-neutral-600 ml-4">← Try!</span></p>
                                        <p className="text-emerald-400">secured.run(<span className="text-emerald-400">"email @all"</span>)</p>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                        <div className="w-full h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-xl px-4 flex items-center text-white text-sm">
                                            secured.run("rm -rf /data")
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all shadow-xl"
                                        >
                                            Execute Policy Check →
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Cursor/Hint */}
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 bg-white text-black text-[10px] font-black uppercase py-1 px-2 rounded -rotate-12 shadow-xl animate-bounce">Live Terminal</div>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 8: SOCIAL PROOF */}
                <section className="py-32 px-6 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Builders & Security teams</h2>
                            <h3 className="text-5xl md:text-7xl font-black text-black tracking-tight italic uppercase italic">Loved by AI builders.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { author: "Sarah Miller", role: "AI Lead, F500", text: "SupraWall caught 47 dangerous tool calls in our first week. We had NO IDEA we were that exposed.", rating: 5 },
                                { author: "CTO, Series B SaaS", role: "Scaling autonomous agents", text: "We went from 'terrified' to confident in 2 hours. Before SupraWall, we wouldn't dare run AI in production.", rating: 5 },
                                { author: "Dev, YC W24", role: "Early Adopter", text: "The Stripe of AI security—that's not marketing, it's true. Integration took 30 minutes. Scales to 50 agents.", rating: 5 },
                                { author: "Maria Rodriguez", role: "SecOps at FinTech", text: "Finally, a way to audit what LLMs are actually doing. Essential for any SOC2 regulated environment.", rating: 5 },
                                { author: "Engineering Lead", role: "Fortune 100", text: "Native SDKs for 8 languages was the sealer. We could unify our entire Python and Rust agent stack.", rating: 5 },
                                { author: "AI Researcher", role: "Open Source Contributor", text: "Best-in-class support for MCP servers. Intercepting tool calls is the only way to build safe autonomous agents.", rating: 5 }
                            ].map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="p-10 border-2 border-black rounded-[3rem] space-y-6 hover:bg-neutral-50 transition-colors"
                                >
                                    <div className="flex gap-1">
                                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-emerald-600 text-emerald-600" />)}
                                    </div>
                                    <p className="text-xl font-bold italic leading-relaxed">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-black" />
                                        <div>
                                            <p className="font-black text-sm uppercase">{t.author}</p>
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 9: PRICING */}
                <section className="py-40 px-6 bg-[#030303] text-white">
                    <div className="max-w-7xl mx-auto space-y-24">
                        <div className="text-center space-y-6">
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter italic">CHOOSE YOUR SCALE.</h2>
                            <p className="text-xl text-neutral-400 font-medium">Pricing that scales with you, from developer to enterprise.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Developer",
                                    price: "$0",
                                    desc: "Free Forever",
                                    features: ["1,000 tool calls / mo", "1 connected agent", "All database adapters", "Open Source server", "Community support"],
                                    cta: "Start Free",
                                    buttonStyle: "border border-white/20 text-white hover:bg-white/5"
                                },
                                {
                                    name: "Startup ⭐",
                                    price: "$99",
                                    desc: "Per month",
                                    features: ["100K tool calls / mo", "Unlimited agents", "Team dashboard", "Webhook endpoints", "Priority support", "Audit log persistence"],
                                    cta: "Start 14-day Free Trial",
                                    buttonStyle: "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:scale-[1.02]"
                                },
                                {
                                    name: "Enterprise",
                                    price: "Custom",
                                    desc: "Global Scale",
                                    features: ["Unlimited tool calls", "Dedicated support instance", "SLA guarantees", "Custom deployment (VPC)", "Team training", "Full RBAC control"],
                                    cta: "Contact Sales",
                                    buttonStyle: "bg-white text-black hover:bg-neutral-200"
                                }
                            ].map((plan, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-10 rounded-[3rem] border ${plan.name?.includes('Startup') ? 'border-emerald-500/50 bg-emerald-500/5 ring-4 ring-emerald-500/10' : 'border-white/5 bg-neutral-900/50'} flex flex-col`}
                                >
                                    <h4 className="text-xl font-bold uppercase tracking-widest text-neutral-400 mb-2">{plan.name}</h4>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black leading-none">{plan.price}</span>
                                        <span className="text-sm font-bold text-neutral-500 uppercase">{plan.desc}</span>
                                    </div>
                                    <div className="flex-1 space-y-4 my-10">
                                        {plan.features.map((f, j) => (
                                            <div key={j} className="flex gap-3 text-sm font-bold text-neutral-400">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                    <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${plan.buttonStyle}`}>
                                        {plan.cta}
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-10 opacity-60 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            <div>✅ No credit card required</div>
                            <div>✅ Cancel anytime</div>
                            <div>✅ 14-day money-back guarantee</div>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 10: FAQ */}
                <section className="py-32 px-6 bg-white text-black">
                    <div className="max-w-5xl mx-auto space-y-16">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Frequently Asked questions.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { q: "Does SupraWall slow down my agents?", a: "No. Policy evaluation averages under 10ms. For agents taking seconds for LLM calls, this is unnoticeable." },
                                { q: "Can I use it with custom agents?", a: "Yes. Our SDK supports any agent framework—native decorators make integration easy in any language." },
                                { q: "What happens if SupraWall is down?", a: "Fail-safe mode: You choose Fail-Open (Dev) or Fail-Closed (Prod) to ensure security even during network outages." },
                                { q: "Where is my data stored?", a: "You can use our managed cloud or self-host your own audit log database for total isolation." },
                                { q: "Is it really database-agnostic?", a: "Yes. We support 5+ major databases with native ORM adapters built-in." },
                                { q: "Do I need to change my prompt?", a: "No. SupraWall lives in the tool layer, so your prompts remain exactly as you designed them." }
                            ].map((faq, i) => (
                                <div key={i} className="space-y-4 border-t-2 border-black pt-8 group">
                                    <h4 className="text-2xl font-black flex items-center justify-between pointer-events-none tracking-tight">
                                        {faq.q}
                                        <HelpCircle className="w-6 h-6 text-emerald-600" />
                                    </h4>
                                    <p className="text-neutral-500 font-bold leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FINAL CALL TO ACTION */}
                <section className="py-40 px-6 bg-black relative">
                    <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                        <h2 className="text-6xl md:text-[7rem] font-black text-white italic tracking-tighter leading-[0.85] italic">STOP GUESSING. START SECURING.</h2>
                        <p className="text-2xl text-neutral-400 font-medium max-w-2xl mx-auto">
                            Join 1,000+ teams who sleep better knowing their AI agents are governed by SupraWall.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                            <Link href="/login" className="px-12 py-6 bg-white text-black font-black text-2xl rounded-3xl hover:bg-neutral-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95">
                                Start Securing Free →
                            </Link>
                            <Link href="/docs" className="text-white font-black text-xl hover:text-emerald-400 transition-colors flex items-center gap-3">
                                Read the full spec <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Decorative background visual */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-emerald-500 blur-[200px] rounded-full" />
                    </div>
                </section>

            </main>

            <footer className="bg-black border-t border-white/5 py-24 px-6 text-neutral-500">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <BrickWall className="w-6 h-6 text-emerald-500" />
                            <span className="text-white font-black text-2xl uppercase italic">SupraWall</span>
                        </div>
                        <p className="max-w-sm text-sm font-medium leading-relaxed">
                            The security standard for autonomous AI agents. Built for scale, security, and developer speed.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-6">Product</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="/spec" className="hover:text-white transition-colors">Spec</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-6">SDKs</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="#" className="hover:text-white transition-colors">Python</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">TypeScript</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Golang</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Rust</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="#" className="hover:text-white transition-colors">GitHub</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Discord</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Enterprise</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-24 text-[10px] font-black uppercase tracking-[0.5em] text-center opacity-30">
                    © 2026 SUPRAWALL ARCHITECTURE 1.0 — SECURING THE AUTONOMOUS FUTURE.
                </div>
            </footer>
        </div>
    );
}
