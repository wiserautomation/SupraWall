// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Shield, Zap, Terminal, Code2, Layers, Cpu } from "lucide-react";
import Link from "next/link";

export default function AutoGenClient() {
    return (
        <div className="mt-20">
            {/* Visual breakdown of the security layer for AutoGen */}
            <div className="relative p-1 bg-gradient-to-r from-purple-500/20 via-transparent to-indigo-500/20 rounded-[3rem]">
                <div className="bg-black rounded-[2.8rem] p-12 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <Code2 className="w-8 h-8 text-purple-500" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Code Interception</h2>
                            <p className="text-neutral-400 font-medium">
                                AutoGen agents generate and execute code autonomously. SupraWall acts as a proxy between the code-generation agent and the user-proxy execution environment, ensuring safety.
                            </p>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative z-10 font-mono text-xs"
                            >
                                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-[8px] text-neutral-500 ml-2 uppercase">Runtime Monitor</span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-neutral-500">{">"} Analyzing Python Script...</p>
                                    <p className="text-white">import os; os.system("rm -rf /")</p>
                                    <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                        <p className="text-rose-500 font-black uppercase tracking-tighter text-[10px]">Policy Violation:</p>
                                        <p className="text-rose-200 mt-1 italic">"Unsafe OS manipulation detected in autonomous code block."</p>
                                    </div>
                                    <p className="text-rose-500 font-bold mt-2 uppercase tracking-widest text-[8px]">Action: Execution Terminated</p>
                                </div>
                            </motion.div>
                            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl opacity-20 -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
