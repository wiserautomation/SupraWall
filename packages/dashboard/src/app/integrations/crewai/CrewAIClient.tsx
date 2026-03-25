// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Shield, Zap, Terminal, Layers, Box, Cpu } from "lucide-react";
import Link from "next/link";

export default function CrewAIClient() {
    return (
        <div className="mt-20">
            {/* Visual breakdown of the security layer for CrewAI */}
            <div className="relative p-1 bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 rounded-[3rem]">
                <div className="bg-black rounded-[2.8rem] p-12 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                <Users className="w-8 h-8 text-orange-500" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Role-Based Interception</h2>
                            <p className="text-neutral-400 font-medium">
                                In CrewAI, agents perform tasks based on predefined roles. SupraWall maps these roles to verified tool permissions, preventing privilege escalation.
                            </p>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-neutral-900 border border-white/5 rounded-3xl p-8 relative z-10"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">R</div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-white">Researcher Agent</p>
                                        <p className="text-[10px] text-neutral-500 font-bold uppercase">Role: Information Retrieval</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Terminal className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-neutral-300">google_search</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-emerald-500">Allowed</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 opacity-50">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-rose-500" />
                                            <span className="text-xs font-bold text-neutral-300">refund_customer</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-rose-500">Blocked</span>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="absolute -inset-4 bg-orange-500/20 blur-3xl opacity-20 -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
