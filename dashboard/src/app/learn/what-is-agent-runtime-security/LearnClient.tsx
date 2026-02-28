"use client";

import { motion } from "framer-motion";

export default function LearnClient() {
    return (
        <div className="mt-20">
            {/* Visual breakdown of the security layer */}
            <div className="relative p-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-rose-500/20 rounded-[3rem]">
                <div className="bg-black rounded-[2.8rem] p-12 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="text-4xl font-black text-rose-500 italic uppercase tracking-tighter">Autonomous Agent</div>
                            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Unfiltered Intent</p>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="p-8 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)] aspect-square flex flex-col justify-center items-center"
                        >
                            <div className="text-xl font-black text-white italic uppercase">SupraWall</div>
                            <div className="text-[8px] text-emerald-400 font-bold uppercase tracking-[0.3em] mt-2">Governance Shim</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="text-4xl font-black text-emerald-500 italic uppercase tracking-tighter">Secured Runtime</div>
                            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Verified Execution</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
