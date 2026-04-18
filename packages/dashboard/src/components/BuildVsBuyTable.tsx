// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { TemplateConfig } from '@/data/compliance-matrix';

interface BuildVsBuyTableProps {
    config: TemplateConfig;
    dictionary: any;
}

export function BuildVsBuyTable({ config, dictionary }: BuildVsBuyTableProps) {
    const hub = dictionary.complianceTemplates.hub.buildVsBuy;

    return (
        <div className="build-vs-buy-table my-12 overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-neutral-900 via-black to-blue-950/20 backdrop-blur-xl">
            <div className="px-8 py-10 border-b border-white/5">
                <h3 className="text-2xl font-black text-white tracking-tight">{hub.title}</h3>
                <p className="mt-2 text-neutral-400 font-medium">{hub.subtitle}</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-8 py-5 font-black uppercase tracking-tight text-neutral-500">{hub.headers.approach}</th>
                            <th className="px-8 py-5 font-black uppercase tracking-tight text-neutral-500">{hub.headers.time}</th>
                            <th className="px-8 py-5 font-black uppercase tracking-tight text-neutral-500">{hub.headers.cost}</th>
                            <th className="px-8 py-5 font-black uppercase tracking-tight text-neutral-500">{hub.headers.maint}</th>
                            <th className="px-8 py-5 font-black uppercase tracking-tight text-neutral-500">{hub.headers.evidence}</th>
                            <th className="px-8 py-5 font-black uppercase tracking-tight text-neutral-500">{hub.headers.audit}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {/* DIY Row */}
                        <tr className="group hover:bg-white/[0.01] transition-colors">
                            <td className="px-8 py-6 font-bold text-neutral-300">{hub.rows.diy.name}</td>
                            <td className="px-8 py-6 text-neutral-400 font-medium">{config.diyEngineeringWeeks.min}–{config.diyEngineeringWeeks.max} weeks</td>
                            <td className="px-8 py-6 text-neutral-400 font-medium font-mono text-xs">€{config.diyCostEur.min.toLocaleString()}–€{config.diyCostEur.max.toLocaleString()}</td>
                            <td className="px-8 py-6 text-neutral-400 font-medium">{hub.rows.diy.maint}</td>
                            <td className="px-8 py-6 text-neutral-400 font-medium">{hub.rows.diy.evidence}</td>
                            <td className="px-8 py-6">
                                <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 py-1 text-xs font-black text-red-400 ring-1 ring-inset ring-red-400/20">
                                    {hub.rows.diy.audit.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                        
                        {/* SupraWall Row */}
                        <tr className="bg-blue-500/[0.05] ring-1 ring-inset ring-blue-500/10">
                            <td className="px-8 py-8">
                                <div className="flex items-center gap-x-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="font-black text-white text-lg tracking-tighter">{hub.rows.suprawall.name}</span>
                                </div>
                            </td>
                            <td className="px-8 py-8">
                                <span className="font-black text-emerald-400 text-lg tracking-tighter italic">15 MINS</span>
                            </td>
                            <td className="px-8 py-8 text-white font-bold">{hub.rows.suprawall.cost}</td>
                            <td className="px-8 py-8 text-neutral-300 font-medium">{hub.rows.suprawall.maint}</td>
                            <td className="px-8 py-8 text-neutral-300 font-medium">{hub.rows.suprawall.evidence}</td>
                            <td className="px-8 py-8">
                                <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-400 ring-1 ring-inset ring-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                    {hub.rows.suprawall.audit.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
