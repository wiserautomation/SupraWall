"use client";

import { motion } from "framer-motion";
import {
    ArrowRight, Box, Lock, Activity, ChevronRight, CheckCircle2,
    Shield, BrickWall, Database, Terminal, Globe, Code2, AlertTriangle,
    Play, Users, Star, HelpCircle, Mail, DollarSign, ExternalLink,
    Zap, Server, Bot, Layers, Triangle, RefreshCw, Coins
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// --- Components ---

export function CodeTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const terminalLines = [
        "> LangChain Agent: Executing...",
        "> Tool: send_email (instance #1)",
        "> Tool: send_email (instance #2)",
        "> Tool: send_email (instance #3)",
        "⚠️  LOOP DETECTED: 3x consecutive calls",
        "🛡️  Circuit Breaker Triggered",
        "❌ BLOCKED - infinite loop prevented",
        "✅ Saved $2.40 in API credits",
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
        <div suppressHydrationWarning className="w-full max-w-lg aspect-square md:aspect-video bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-mono text-sm relative text-left">
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

export function ClawbotDemo() {
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
        return <div className="w-full h-full bg-[#020202] p-6 font-mono text-[10px] md:text-xs text-emerald-400/80 space-y-2 overflow-hidden text-left" />;
    }

    return (
        <div suppressHydrationWarning className="w-full h-full bg-[#020202] p-6 font-mono text-[10px] md:text-xs text-emerald-400/80 space-y-2 overflow-hidden text-left">
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

export function TechTabs() {
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

            <div className="grid grid-cols-1 gap-4 text-left">
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
    );
}

export function AnimatedBox({ children, initial, whileInView, animate, transition, className }: any) {
    return (
        <motion.div
            initial={initial}
            whileInView={whileInView}
            animate={animate}
            transition={transition}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function TagBadge({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-400 tracking-wider uppercase">
            {children}
        </div>
    );
}
