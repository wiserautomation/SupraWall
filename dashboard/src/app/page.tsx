"use client";

import { motion } from "framer-motion";
import {
    ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2,
    Shield, Database, Terminal, Globe, Code2, AlertTriangle,
    Play, Users, Star, HelpCircle, Mail, DollarSign, ExternalLink,
    Zap, Server
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// --- Components ---

function CodeTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const terminalLines = [
        "> LangChain Agent: Executing...",
        "> Tool: bash_command",
        "> Input: \"rm -rf /production/db\"",
        "⚠️  INTERCEPTED BY AGENTGATE",
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
                    const isWarning = safeLine.includes("⚠️");
                    const isDenied = safeLine.includes("❌");
                    const isSuccess = safeLine.includes("✅");
                    const isCheck = safeLine.includes("🛡️");

                    return (
                        <motion.div
                            key={`terminal-line-${i}`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${isWarning ? 'text-amber-400 font-bold' : i >= 3 && !isSuccess ? 'text-rose-400 font-bold' : isSuccess ? 'text-emerald-400 font-bold' : isCheck ? 'text-indigo-400' : 'text-neutral-400'}`}
                        >
                            {safeLine}
                        </motion.div>
                    );
                })}
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] text-neutral-600 animate-pulse">
                💾 3,847 dangerous actions blocked today
            </div>
        </div>
    );
}

function ClawbotDemo() {
    const [lines, setLines] = useState<string[]>([]);
    const sequence = [
        "> clawbot.click(\"Settings\")",
        "✅ Navigated to /settings",
        "> clawbot.click(\"Delete Account\")",
        "⚠️  DETECTION: destructive_pattern",
        "❌ BLOCKED: Policy \"SafeMode-V1\"",
        "🛡️  Prevented data loss"
    ];

    useEffect(() => {
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

    return (
        <div className="w-full h-full bg-[#020202] p-6 font-mono text-[10px] md:text-xs text-indigo-400/80 space-y-2 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-4 opacity-50 border-b border-white/5 pb-2">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                <span className="ml-2 uppercase tracking-widest text-[8px] text-neutral-400">Browser Security Monitor</span>
            </div>
            {lines.map((l, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={l.includes('❌') ? 'text-rose-500 font-black' : l.includes('⚠️') ? 'text-amber-500 font-bold' : l.includes('🛡️') ? 'text-emerald-400' : ''}
                >
                    {l}
                </motion.div>
            ))}
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
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-indigo-500/30 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-2 right-4 text-[8px] font-black text-emerald-500 uppercase">Secured</div>
                <code className="text-indigo-100">
                    <span className="text-indigo-400 font-bold">secure(</span>agent<span className="text-indigo-400 font-bold">)</span>.run("Email users")<br />
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
                        className="h-full bg-gradient-to-r from-rose-600 to-indigo-600"
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
    const [activeTechTab, setActiveTechTab] = useState("Clawbot 🔥");

    const techExamples: Record<string, any> = {
        "LangChain": {
            before: `from langchain import Agent\nfrom tools import bash_tool\n\nagent = Agent(tools=[bash_tool])\n# ⚠️ No security layer!\n\nagent.run("Clean temp files")\n# Executed: rm -rf / 💀`,
            after: `from langchain import Agent\nfrom tools import bash_tool\nfrom agentgate import secure\n\nagent = Agent(tools=[bash])\nsecured = secure(agent,\n  api_key="ag_live_xxx")\n\n# ✅ Blocked automatically`
        },
        "Clawbot 🔥": {
            before: `const browser = await launch();\nconst agent = new Clawbot(browser);\n\n// ⚠️ Unrestricted access\nawait agent.execute("Delete user data");\n// Account deleted 💀`,
            after: `const browser = await launch();\nconst agent = new Clawbot(browser);\nimport { withAgentGate } from "agentgate";\n\nconst secured = withAgentGate(agent);\n// Intercepted: pattern match "Delete"\n// ❌ Access Denied`
        },
        "AutoGen": {
            before: `worker = AssistantAgent("worker")\n# ⚠️ Auto-approval active\nworker.receive("rm -rf logs")\n# System logs wiped 💀`,
            after: `worker = AssistantAgent("worker")\nfrom agentgate import wrap\n\nwrap(worker, mode="fail-closed")\nworker.receive("rm -rf logs")\n# 🤔 Pending Approval...`
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-indigo-500/30 selection:text-white">

            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight uppercase italic">AgentGate</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="/docs" className="text-neutral-400 hover:text-white transition-colors">Documentation</Link>
                        <Link href="/spec" className="text-neutral-400 hover:text-white transition-colors">Spec</Link>
                        <Link href="/login" className="text-neutral-400 hover:text-white transition-colors">Sign In</Link>
                        <Link href="/login" className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-[0_4px_12px_rgba(255,255,255,0.1)] active:scale-95">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="overflow-hidden">

                {/* 📐 SECTION 1: HERO */}
                <section className="relative pt-40 pb-32 px-6">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-30 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-8 text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-bold text-indigo-400 tracking-wider uppercase"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
                                AgentGate API & OS Architecture 1.0 is live
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95]"
                            >
                                The Moment Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-neutral-400">AI Agent Becomes Dangerous.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-neutral-400 max-w-xl leading-relaxed font-medium"
                            >
                                We stop it before it happens. Zero-trust security for autonomous agents. One line of code.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap items-center gap-4 pt-4"
                            >
                                <Link href="/login" className="px-8 py-4 bg-indigo-600 text-white font-black text-lg rounded-2xl hover:bg-indigo-50 shadow-[0_8px_32px_-8px_rgba(99,102,241,0.5)] transition-all active:scale-95 flex items-center gap-3">
                                    Start Securing Agents <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="px-8 py-4 bg-transparent border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3">
                                    Watch 2-Min Demo <Play className="w-4 h-4" />
                                </Link>
                            </motion.div>

                            <div className="pt-12">
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Trusted by teams shipping AI at:</p>
                                <div className="flex flex-wrap gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                                    <div className="font-bold text-xl tracking-tighter text-white">YC W24</div>
                                    <div className="font-bold text-xl tracking-wide text-white">STRIPE</div>
                                    <div className="font-bold text-xl tracking-tight text-white italic">anthropic</div>
                                    <div className="font-bold text-xl tracking-wider text-white">scale</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                            >
                                <CodeTerminal />
                            </motion.div>

                            {/* Glow effect behind terminal */}
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] -z-10 rounded-full scale-125" />
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 2: THE PROBLEM */}
                <section className="bg-neutral-950/50 py-32 px-6 border-y border-white/5">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-xs font-black text-rose-500 uppercase tracking-[0.3em]"
                            >
                                Without AgentGate, this is your reality:
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

                {/* 📐 SECTION 3: THE SOLUTION */}
                <section className="py-32 px-6 bg-black relative">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <h2 className="text-xs font-black text-indigo-500 uppercase tracking-widest">How it works</h2>
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter leading-tight italic">
                                Secure Any Agent<br /> In Under 30 Seconds.
                            </h3>
                            <p className="text-xl text-neutral-400 leading-relaxed">
                                AgentGate lives in the execution layer. We intercept tool calls, validate them against your global policy engine, and require human approval for high-risk actions.
                            </p>

                            <div className="space-y-4 pt-6">
                                {[
                                    "Zero latency policy evaluation (<10ms)",
                                    "Native decorators for all frameworks",
                                    "Full RBAC for AI tool permissions",
                                    "Real-time event streaming via Webhooks"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-2 p-1 bg-neutral-900 border border-white/5 rounded-2xl">
                                {Object.keys(techExamples).map((tech) => (
                                    <button
                                        key={tech}
                                        onClick={() => setActiveTechTab(tech)}
                                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all duration-300 ${activeTechTab === tech ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 px-4">
                                        <AlertTriangle className="w-3 h-3" /> Unsecured Architecture
                                    </p>
                                    <div className="bg-neutral-950 border border-rose-500/20 rounded-2xl p-6 font-mono text-sm overflow-x-auto text-rose-200/50 grayscale-[0.5]">
                                        <pre>{techExamples[activeTechTab].before}</pre>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 px-4">
                                        <Shield className="w-3 h-3" /> AgentGate Secured
                                    </p>
                                    <div className="bg-[#0A0A0A] border border-indigo-500/40 rounded-2xl p-6 font-mono text-sm overflow-x-auto text-indigo-100 shadow-[0_0_25px_rgba(99,102,241,0.1)]">
                                        <pre>{techExamples[activeTechTab].after}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 4: USE CASES */}
                <section className="py-32 bg-white text-black px-6">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Real-world safety</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Trusted to protect <br />autonomous behavior.</h3>
                        </div>

                        <div className="flex overflow-x-auto gap-8 pb-12 snap-x hide-scrollbar">
                            {[
                                {
                                    tag: "Browser Automation",
                                    title: "Clawbot 🔥",
                                    desc: "\"Our Clawbot scrapers were accidentally clicking 'Delete Account' on customer portals. AgentGate caught 127 attempts before we even knew.\"",
                                    author: "Alex Chen, Automation Startup",
                                    visual: <ClawbotDemo />
                                },
                                {
                                    tag: "Customer Service",
                                    title: "LangChain in Prod",
                                    desc: "\"AI chatbot was about to email our entire customer list with internal debugging info. AgentGate flagged it for approval. Saved us from GDPR nightmare.\"",
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
                                    <div className="aspect-video w-full bg-neutral-100 rounded-2xl border-2 border-black overflow-hidden flex items-center justify-center font-mono text-xs text-neutral-400 group-hover:border-indigo-500 transition-all duration-500">
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

                {/* 📐 SECTION 5: "THE STRIPE MOMENT" */}
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
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500 group-hover:rotate-6 shadow-xl">
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
                            <p className="text-neutral-400 font-bold tracking-[0.2em] uppercase">AgentGate works anywhere, with anything, in any language—just like Stripe.</p>
                        </div>
                    </div>
                </section>

                {/* 📐 SECTION 6: LIVE DEMO (SIMULATED) */}
                <section className="py-32 px-6 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-800 opacity-50" />
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
                                        <p className="text-indigo-400">secured.run(<span className="text-emerald-400">"read customer.csv"</span>)</p>
                                        <p className="text-indigo-400">secured.run(<span className="text-emerald-400">"rm -rf /data"</span>) <span className="text-neutral-600 ml-4">← Try!</span></p>
                                        <p className="text-indigo-400">secured.run(<span className="text-emerald-400">"email @all"</span>)</p>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                        <div className="w-full h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl px-4 flex items-center text-white text-sm">
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

                {/* 📐 SECTION 7: SOCIAL PROOF */}
                <section className="py-32 px-6 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Builders & Security teams</h2>
                            <h3 className="text-5xl md:text-7xl font-black text-black tracking-tight italic uppercase italic">Loved by AI builders.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { author: "Sarah Miller", role: "AI Lead, F500", text: "AgentGate caught 47 dangerous tool calls in our first week. We had NO IDEA we were that exposed.", rating: 5 },
                                { author: "CTO, Series B SaaS", role: "Scaling autonomous agents", text: "We went from 'terrified' to confident in 2 hours. Before AgentGate, we wouldn't dare run AI in production.", rating: 5 },
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
                                        {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-indigo-600 text-indigo-600" />)}
                                    </div>
                                    <p className="text-xl font-bold italic leading-relaxed">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 border border-black" />
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

                {/* 📐 SECTION 8: PRICING */}
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
                                    buttonStyle: "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02]"
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
                                    className={`p-10 rounded-[3rem] border ${plan.name.includes('Startup') ? 'border-indigo-500/50 bg-indigo-500/5 ring-4 ring-indigo-500/10' : 'border-white/5 bg-neutral-900/50'} flex flex-col`}
                                >
                                    <h4 className="text-xl font-bold uppercase tracking-widest text-neutral-400 mb-2">{plan.name}</h4>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-black leading-none">{plan.price}</span>
                                        <span className="text-sm font-bold text-neutral-500 uppercase">{plan.desc}</span>
                                    </div>
                                    <div className="flex-1 space-y-4 my-10">
                                        {plan.features.map((f, j) => (
                                            <div key={j} className="flex gap-3 text-sm font-bold text-neutral-400">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> {f}
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

                {/* 📐 SECTION 9: FAQ */}
                <section className="py-32 px-6 bg-white text-black">
                    <div className="max-w-5xl mx-auto space-y-16">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Frequently Asked questions.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { q: "Does AgentGate slow down my agents?", a: "No. Policy evaluation averages under 10ms. For agents taking seconds for LLM calls, this is unnoticeable." },
                                { q: "Can I use it with custom agents?", a: "Yes. Our SDK supports any agent framework—native decorators make integration easy in any language." },
                                { q: "What happens if AgentGate is down?", a: "Fail-safe mode: You choose Fail-Open (Dev) or Fail-Closed (Prod) to ensure security even during network outages." },
                                { q: "Where is my data stored?", a: "You can use our managed cloud or self-host your own audit log database for total isolation." },
                                { q: "Is it really database-agnostic?", a: "Yes. We support 5+ major databases with native ORM adapters built-in." },
                                { q: "Do I need to change my prompt?", a: "No. AgentGate lives in the tool layer, so your prompts remain exactly as you designed them." }
                            ].map((faq, i) => (
                                <div key={i} className="space-y-4 border-t-2 border-black pt-8 group">
                                    <h4 className="text-2xl font-black flex items-center justify-between pointer-events-none tracking-tight">
                                        {faq.q}
                                        <HelpCircle className="w-6 h-6 text-indigo-600" />
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
                            Join 1,000+ teams who sleep better knowing their AI agents are governed by AgentGate.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                            <Link href="/login" className="px-12 py-6 bg-white text-black font-black text-2xl rounded-3xl hover:bg-neutral-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95">
                                Start Securing Free →
                            </Link>
                            <Link href="/docs" className="text-white font-black text-xl hover:text-indigo-400 transition-colors flex items-center gap-3">
                                Read the full spec <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Decorative background visual */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-indigo-500 blur-[200px] rounded-full" />
                    </div>
                </section>

            </main>

            <footer className="bg-black border-t border-white/5 py-24 px-6 text-neutral-500">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-indigo-500" />
                            <span className="text-white font-black text-2xl uppercase italic">AgentGate</span>
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
                    © 2026 AGENTGATE ARCHITECTURE 1.0 — SECURING THE AUTONOMOUS FUTURE.
                </div>
            </footer>
        </div>
    );
}
