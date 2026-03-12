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

export function SwarmVisualization() {
    return (
        <div suppressHydrationWarning className="w-full max-w-lg aspect-square bg-[#0D0D0D] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden font-mono text-sm relative group text-left">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent mix-blend-overlay pointer-events-none z-10" />
            <img
                src="/network-nodes.png"
                alt="SupraWall Secure Agent Infrastructure"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
            />
            <div className="absolute bottom-6 left-6 z-20">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-xs font-bold text-white tracking-widest uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    SupraWall Node Active
                </div>
            </div>
        </div>
    );
}


export function ClawbotDemo() {
    const [lines, setLines] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const sequence = [
        "> agent.click(\"Settings\")",
        "✅ Navigated to /settings",
        "> agent.click(\"Delete Production DB\")",
        "⚠️  DETECTION: destructive_command",
        "❌ BLOCKED: Policy \"Anti-Data-Loss\"",
        "🛡️  SupraWall Intercepted."
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
                <span className="ml-2 uppercase tracking-widest text-[8px] text-neutral-400">Agent Interceptor Monitor</span>
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
            after: `import { secure_agent } from "suprawall";\n\n// 🛡️ Zero-Trust Interception\nconst secured = secure_agent(myAgent, {\n  api_key: "sw_..."\n});\n\n// Every action is now governed\nawait secured.invoke({ task: "..." });\n// ✅ Tools intercepted & audited`
        },
        "Python": {
            before: `from crewai import Agent\n\n# ⚠️ Autonomous swarm risk\nagent = Agent(...)\nagent.start()\n# Unlimited tool access 💀`,
            after: `from suprawall import secure_agent\n\n# 🛡️ Hard-coded security shim\nsecured = secure_agent(my_agent, api_key="sw_...")\n\n# Agent is automatically protected\n# ✅ Destructive acts blocked deterministically`
        },
        "MCP": {
            before: `const server = new Server(...);\n// ⚠️ Direct tool execution\nserver.on("call_tool", ...);\n# No per-user policy 💀`,
            after: `import { secure_mcp } from "suprawall";\n\n// 🛡️ Secure Model Context Protocol\nconst secured = secure_mcp(server);\n\n// ✅ Tool calls governed via SupraWall\nawait secured.start();`
        },
        "Vercel AI": {
            before: `const { text } = await generateText({...});\n// ⚠️ No pre-execution check\n# System at mercy of LLM 💀`,
            after: `import { secure } from "suprawall";\n\n// 🛡️ Middleware protection\nconst { text } = await secure(generateText)({\n  ...config\n});\n\n// ✅ Fail-safe security layer`
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
                            SECURED BY SUPRAWALL
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
