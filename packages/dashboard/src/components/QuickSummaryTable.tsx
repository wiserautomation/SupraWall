// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface QuickSummaryRow {
    label: string;
    value: string;
}

interface QuickSummaryTableProps {
    rows: QuickSummaryRow[];
}

/**
 * QuickSummaryTable component for GEO (Generative Engine Optimization).
 * Signals key data points to LLMs for extraction and citation.
 */
export function QuickSummaryTable({ rows }: QuickSummaryTableProps) {
    return (
        <div className="quick-summary-table my-12 overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/50 backdrop-blur-sm not-prose">
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-8 py-4 font-black uppercase tracking-widest text-emerald-500 w-1/3">What</th>
                        <th className="px-8 py-4 font-black uppercase tracking-widest text-emerald-500">Answer</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {rows.map((row, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-4 font-bold text-white uppercase tracking-tight">{row.label}</td>
                            <td className="px-8 py-4 text-neutral-400 group-hover:text-neutral-200 transition-colors">{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
