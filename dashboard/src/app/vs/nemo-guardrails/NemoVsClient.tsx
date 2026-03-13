"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, Zap, AlertTriangle, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function NemoVsClient() {
    return (
        <div className="mt-20">
            {/* Visual breakdown of the architectural difference */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-500">
                            N
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-neutral-500">NeMo Architecture</h3>
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-neutral-500">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">User Prompt</div>
                        <div className="text-center italic">↓ sends to ↓</div>
                        <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 text-center text-rose-500 font-bold">NeMo Proxy (External)</div>
                        <div className="text-center italic text-neutral-700">Checks against Colang rules...</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">LLM Engine</div>
                    </div>
                    <p className="text-xs text-neutral-600 italic">Adds latency and architectural complexity by requiring a proxy layer outside the application runtime.</p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black">
                            S
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-white italic">SupraWall Architecture</h3>
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-neutral-300">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">User Prompt</div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center text-emerald-500 font-bold">Native SDK Wrapper (Internal)</div>
                        <div className="text-center italic text-emerald-900 leading-none">Zero-latency hook into tool calls...</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">LLM Engine + Action Buffer</div>
                    </div>
                    <p className="text-xs text-emerald-500/60 italic">Integrates directly into your code. No proxies. No YAML. Just secure runtime execution.</p>
                </div>
            </div>
        </div>
    );
}
