"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap, Terminal, Box, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";

export default function VercelClient() {
    return (
        <div className="mt-20">
            {/* Visual breakdown of the security layer for Vercel AI SDK */}
            <div className="relative p-1 bg-gradient-to-r from-blue-500/20 via-transparent to-indigo-500/20 rounded-[3rem]">
                <div className="bg-black rounded-[2.8rem] p-12 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Triangle className="w-8 h-8 text-blue-500 fill-blue-500/20" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Edge-Level Governance</h2>
                            <p className="text-neutral-400 font-medium">
                                Vercel AI SDK powers high-performance streaming agents. AgentGate integrates with the `tool` definition to provide pre-execution verification at the edge, ensuring zero-latency security.
                            </p>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative z-10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Edge Function</span>
                                    </div>
                                    <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-tighter">RTT: 0.8ms</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-neutral-400">Stream started</span>
                                        <Zap className="w-3 h-3 text-yellow-500" />
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-between relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black text-blue-400 uppercase">Tool Intercepted</p>
                                            <p className="text-[12px] font-bold text-white mt-1">send_email()</p>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-blue-500 relative z-10" />
                                        <div className="absolute inset-0 bg-blue-500/5 transition-all duration-700 w-full" />
                                    </div>
                                    <div className="flex justify-center">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">Policy Verified • Resuming Stream</p>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="absolute -inset-4 bg-blue-500/10 blur-3xl opacity-20 -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Triangle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        </svg>
    );
}
