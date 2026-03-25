// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, BrickWall, BookOpen, Key, Terminal, Code, Cpu, Activity, Lightbulb, ExternalLink, Zap, Puzzle, BadgeDollarSign, Sparkles } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const sections = [
        {
            title: "Getting Started",
            items: [
                { name: "Introduction", href: "/docs", icon: BookOpen },
                { name: "Quickstart", href: "/docs/quickstart", icon: Zap },
                { name: "AI Assistant Guide", href: "/docs/ai-assistants", icon: Sparkles },
            ]
        },
        {
            title: "Client Integrations",
            items: [
                { name: "Python SDK", href: "/docs/python", icon: Terminal },
                { name: "Claude (MCP)", href: "/docs/mcp", icon: Puzzle },
                { name: "Browser (OpenClaw)", href: "/docs/integrations/openclaw", icon: Terminal },
                { name: "Stripe Marketplace", href: "/docs/integrations/stripe", icon: BadgeDollarSign },
            ]
        },
        {
            title: "Frameworks (Interactive)",
            items: [
                { name: "LangChain", href: "/docs/frameworks/langchain", icon: Code },
                { name: "LlamaIndex", href: "/docs/frameworks/llamaindex", icon: Code },
                { name: "Vercel AI SDK", href: "/docs/frameworks/vercel-ai", icon: Terminal },
                { name: "AutoGen", href: "/docs/frameworks/autogen", icon: Cpu },
                { name: "CrewAI", href: "/docs/frameworks/crewai", icon: Cpu },
            ]
        },
        {
            title: "Platform",
            items: [
                { name: "API Reference", href: "/docs/api", icon: Key },
                { name: "Policy Patterns", href: "/docs/examples", icon: Lightbulb },
                { name: "Open Spec (AGPS)", href: "/spec", icon: Shield },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden relative font-sans">
            <aside className="w-64 border-r border-white/5 bg-neutral-950 flex flex-col z-20">
                <div className="h-16 flex items-center px-6 border-b border-white/5 bg-black/40">
                    <BrickWall className="w-6 h-6 text-emerald-500 mr-3" />
                    <Link href="/" className="font-bold text-lg tracking-tight text-white drop-shadow-sm hover:text-emerald-400 transition">
                        SupraWall <span className="text-emerald-500/80">Docs</span>
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-4 flex flex-col gap-6 overflow-y-auto">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h4 className="px-2 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                                {section.title}
                            </h4>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon || Activity;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`group flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${isActive ? "text-emerald-400" : "group-hover:text-neutral-200"}`} />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/40">
                    <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors py-2 border border-white/10 rounded-md hover:bg-white/5">
                        <ExternalLink className="w-4 h-4" /> Go to Dashboard
                    </Link>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
                <div className="p-8 md:p-12 max-w-5xl mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
