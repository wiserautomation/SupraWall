// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";
import { ArrowRight, BookOpen, Shield, BrickWall, Code, Server, FastForward, CheckCircle2 } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-2">
                    <BookOpen className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    SupraWall Documentation
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    The open standard for AI agent security. Learn how to secure, monitor, and govern your agents in less than 5 minutes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/docs/quickstart" className="group p-6 rounded-2xl bg-neutral-900 border border-white/5 hover:border-emerald-500/50 hover:bg-neutral-800 transition-all flex flex-col items-start text-left">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                        <FastForward className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">5-Minute Quickstart</h3>
                    <p className="text-neutral-400 text-sm mb-6 flex-1">
                        Get your API key and secure your first agent. The fastest way from zero to secured.
                    </p>
                    <div className="flex items-center text-sm font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                        Get started <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Link>

                <Link href="/spec" className="group p-6 rounded-2xl bg-neutral-900 border border-white/5 hover:border-emerald-500/50 hover:bg-neutral-800 transition-all flex flex-col items-start text-left">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                        <BrickWall className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Policy Spec (AGPS)</h3>
                    <p className="text-neutral-400 text-sm mb-6 flex-1">
                        Read the open standard specification for AI tool permissions and policy formatting.
                    </p>
                    <div className="flex items-center text-sm font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                        Read the standard <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Link>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white tracking-wide">Interactive Framework Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { name: "LangChain", href: "/docs/frameworks/langchain", icon: Code },
                        { name: "LlamaIndex", href: "/docs/frameworks/llamaindex", icon: Code },
                        { name: "AutoGen", href: "/docs/frameworks/autogen", icon: Server },
                        { name: "Vercel AI SDK", href: "/docs/frameworks/vercel-ai", icon: Server },
                        { name: "CrewAI", href: "/docs/frameworks/crewai", icon: Code },
                    ].map((fw) => (
                        <Link key={fw.name} href={fw.href} className="flex items-center p-4 bg-neutral-900 border border-white/5 rounded-xl hover:bg-neutral-800 hover:border-white/20 transition-all group">
                            <fw.icon className="w-5 h-5 text-neutral-400 mr-3 group-hover:text-emerald-400 transition-colors" />
                            <span className="font-semibold text-neutral-200 group-hover:text-white">{fw.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white tracking-wide">Core Concepts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 border border-white/5 rounded-xl bg-black/40">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Allow Policies</h4>
                        <p className="text-sm text-neutral-400">Explicitly allow safe tools like reading files or searching the web without human intervention.</p>
                    </div>
                    <div className="p-5 border border-white/5 rounded-xl bg-black/40">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-rose-500" /> Deny Policies</h4>
                        <p className="text-sm text-neutral-400">Hard-block destructive operations like deleting directories or calling restricted APIs.</p>
                    </div>
                    <div className="p-5 border border-white/5 rounded-xl bg-black/40">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Human Approval</h4>
                        <p className="text-sm text-neutral-400">Pause execution via Webhook or Dashboard when a tool attempts to send emails or drop tables.</p>
                    </div>
                    <div className="p-5 border border-white/5 rounded-xl bg-black/40">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Audit</h4>
                        <p className="text-sm text-neutral-400">Every single decision is logged securely in the cloud to provide an instant trail of AI actions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
