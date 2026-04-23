// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { 
    Shield, CheckCircle2, AlertTriangle, ArrowRight,
    Lock, Scale, Database, Eye, ClipboardList
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/app/HomeClient";
import { complianceMatrix } from "@/data/compliance-matrix";

export default function EUAIActPillarClient({ dictionary, lang }: { dictionary: any, lang: string }) {
    const t = dictionary.euAiActPillar || {};
    const countdownT = t.countdown || {};
    
    // ⏰ COUNTDOWN LOGIC
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number }>({ d: 0, h: 0, m: 0, s: 0 });
    const targetDate = new Date("2026-08-02T00:00:00").getTime();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // 🛡️ FILTERED MATRIX
    const filteredMatrix = complianceMatrix.filter(m => m.regulation === 'EU_AI_ACT');

    return (
        <main className="overflow-hidden bg-[#030303] text-white">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>{t.hero?.badge || "August 2026 Roadmap"}</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             {t.hero?.title} <br />
                             <span className="text-emerald-500 font-bold italic underline decoration-white/10 italic">{t.hero?.emphasis}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             {t.hero?.description}
                        </p>
                    </div>
                </div>
            </section>

             {/* ⏰ THE COUNTDOWN */}
             <section className="py-20 px-6 border-y border-white/5 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto space-y-12">
                     <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 text-rose-500 font-black uppercase text-xs tracking-widest animate-pulse">
                            <AlertTriangle className="w-4 h-4" /> Final Enforcement Window
                        </div>
                        <p className="text-neutral-500 text-sm font-black uppercase tracking-widest">{countdownT.label}</p>
                     </div>

                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                         {[
                            { val: timeLeft.d, label: countdownT.days },
                            { val: timeLeft.h, label: countdownT.hours },
                            { val: timeLeft.m, label: countdownT.minutes },
                            { val: timeLeft.s, label: countdownT.seconds }
                         ].map(item => (
                            <div key={item.label} className="p-8 rounded-[2rem] bg-neutral-900 border border-white/5 text-center space-y-2">
                                <div className="text-6xl font-black italic tracking-tighter text-white tabular-nums">{item.val}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{item.label}</div>
                            </div>
                         ))}
                     </div>
                </div>
             </section>

             {/* 🛡️ THE EU AI ACT MATRIX */}
             <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter uppercase italic leading-none">Article Mapping</h2>
                            <p className="text-neutral-500 text-lg font-bold italic uppercase tracking-tighter leading-snug">
                                Every autonomous action must have a corresponding compliance record.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-900/20 backdrop-blur-2xl shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Article</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Requirement</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-400">Evidence Generated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredMatrix.map((item, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-8">
                                                <div className="text-emerald-500 font-black text-xl italic tracking-tighter uppercase">{item.article}</div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-white text-sm font-bold leading-relaxed max-w-md">{item.requirement}</p>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3 text-neutral-500 group-hover:text-white transition-colors">
                                                    <ClipboardList className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.evidenceGenerated}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

             {/* 🎯 FINAL CTA */}
             <section className="py-48 px-6 bg-black relative text-center">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <TagBadge>Regulator Ready</TagBadge>
                    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                        START YOUR <br />
                        <span className="text-emerald-500 font-bold italic underline decoration-white/10 uppercase italic">AUDIT TRAIL</span>
                    </h2>
                    <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto font-bold uppercase italic italic font-bold">
                        Implement Articles 12 & 14 in 60 seconds with our official framework SDKs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                        <Link href={`/${lang}/login`} className="px-16 py-8 bg-white text-black font-black text-3xl rounded-3xl hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_100px_rgba(255,255,255,0.1)] tracking-tighter flex items-center gap-4 group italic">
                             Get Protected <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
