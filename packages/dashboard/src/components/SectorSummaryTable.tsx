// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ComplianceEntry } from '@/data/compliance-matrix';

interface SectorSummaryTableProps {
    entries: ComplianceEntry[];
    dictionary: any;
}

export function SectorSummaryTable({ entries, dictionary }: SectorSummaryTableProps) {
    const common = dictionary?.complianceTemplates?.common || {};

    return (
        <div className="sector-summary-table my-12 overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/40 backdrop-blur-xl">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-blue-500 w-[40%]">{common.reqHeader || 'Requirement'}</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-blue-500">{common.artHeader || 'Article'}</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-blue-500">{common.complexityHeader || 'Complexity'}</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-emerald-500 text-right">{common.templateHeader || 'Template'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                    {entries.map((entry, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors translate-z-0">
                            <td className="px-6 py-5 text-white tracking-tight leading-snug">{entry.requirement}</td>
                            <td className="px-6 py-5 text-neutral-500 font-mono">{entry.article}</td>
                            <td className="px-6 py-5">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ${
                                    entry.severity === 'critical' 
                                    ? 'bg-red-400/10 text-red-400 ring-red-400/20' 
                                    : entry.severity === 'high'
                                    ? 'bg-orange-400/10 text-orange-400 ring-orange-400/20'
                                    : 'bg-blue-400/10 text-blue-400 ring-blue-400/20'
                                }`}>
                                    {entry.severity.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-x-2 text-emerald-400 font-black tracking-tighter uppercase italic">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    {common.preconfigured}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
