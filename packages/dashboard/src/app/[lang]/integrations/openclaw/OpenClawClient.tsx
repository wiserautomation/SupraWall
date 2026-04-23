// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Monitor, Shield, Zap, Search, Eye, Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function OpenClawClient() {
    return (
        <div className="mt-20">
            {/* Visual breakdown of the security layer for OpenClaw */}
            <div className="relative p-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-blue-500/20 rounded-[3rem]">
                <div className="bg-black rounded-[2.8rem] p-12 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <Globe className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Browser-Level Interception</h2>
                            <p className="text-neutral-400 font-medium">
                                OpenClaw agents interact with the web via browser automation. SupraWall's shim intercepts actions at the CDP level, analyzing the DOM context before clicks or keyboard events are emitted.
                            </p>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative z-10"
                            >
                                <div className="flex items-center gap-2 mb-6 text-neutral-500 font-mono text-[10px]">
                                    <Lock className="w-3 h-3" /> https://console.aws.amazon.com/settings
                                </div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-white/5 rounded-lg w-3/4 animate-pulse" />
                                    <div className="h-8 bg-white/5 rounded-lg w-1/2 animate-pulse" />
                                    <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase text-neutral-400">Action: click("delete-account")</span>
                                            <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-2 py-1 rounded">Action Denied</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 mt-2">Policy: Restricted destruction actions on cloud providers.</p>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl opacity-20 -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
