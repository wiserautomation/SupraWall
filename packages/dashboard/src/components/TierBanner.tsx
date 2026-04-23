// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

'use client';

import React from 'react';
import { AlertTriangle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export type Tier = 'open_source' | 'developer' | 'team' | 'business' | 'enterprise';

interface TierUsage {
    current: number;
    max: number;      // Infinity = unlimited
    label: string;    // e.g. "Agents", "Vault secrets", "Evaluations"
    upgradeFeature: string; // human-readable Cloud feature name
}

interface TierBannerProps {
    tier: Tier;
    usages?: TierUsage[];
    compact?: boolean; // shows just a slim bar instead of full card
}

export function TierBanner({ tier, usages = [], compact = false }: TierBannerProps) {
    // Show OSS badge in compact mode
    if (tier === 'open_source' && compact) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Open Source Edition</span>
            </div>
        );
    }

    // Only show nudges for Open Source and Developer tiers
    const isNudgeTier = tier === 'open_source' || tier === 'developer';
    if (!isNudgeTier) return null;

    const warnings = usages.filter(u => isFinite(u.max) && u.current / u.max >= 0.8);
    const atLimit  = usages.filter(u => isFinite(u.max) && u.current >= u.max);

    const tierLabel = tier === 'open_source' ? 'Open Source' : 'Developer';
    const upgradeTier = tier === 'open_source' ? 'Developer' : 'Team';

    if (compact) {
        return (
            <div className={`flex items-center gap-3 px-4 py-2 ${atLimit.length > 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'} border rounded-xl text-[11px] font-bold uppercase tracking-widest`}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tierLabel} Tier</span>
                {warnings.map((u, i) => (
                    <span key={i} className="text-white/60">
                        · {u.label}: {u.current.toLocaleString()}/{u.max.toLocaleString()}
                    </span>
                ))}
                <Link href="/pricing" className="ml-auto flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
                    Upgrade <ArrowUpRight className="w-3 h-3" />
                </Link>
            </div>
        );
    }

    if (atLimit.length === 0 && warnings.length === 0 && tier !== 'open_source') return null;

    // Special case for OSS: show the banner even if not at limit to highlight the self-hosted nature
    return (
        <div className={`mb-6 p-5 rounded-2xl border ${atLimit.length > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
            <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${atLimit.length > 0 ? 'text-red-400' : 'text-amber-400'}`} />
                <div>
                    <p className={`text-[11px] font-black uppercase tracking-widest ${atLimit.length > 0 ? 'text-red-400' : 'text-amber-400'}`}>
                        {atLimit.length > 0 ? `${tierLabel} Limit Reached` : `Upgrade to ${upgradeTier}`}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-1">
                        {tier === 'open_source' 
                            ? "You are running the SupraWall Open Source Edition. Start your cloud journey for unlimited scale."
                            : `Upgrade to the ${upgradeTier} plan for more agents and advanced threat detection.`}
                    </p>
                </div>
                <Link
                    href="/pricing"
                    className="ml-auto flex-shrink-0 px-4 py-1.5 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center gap-1"
                >
                    Upgrade <ArrowUpRight className="w-3 h-3" />
                </Link>
            </div>

            {usages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {usages.filter(u => isFinite(u.max)).map((u, i) => {
                        const pct = Math.min(1, u.current / u.max);
                        const isOver = pct >= 1;
                        const isWarn = pct >= 0.8;
                        return (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{u.label}</span>
                                    <span className={`text-[10px] font-black ${isOver ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-neutral-400'}`}>
                                        {u.current.toLocaleString()}/{u.max.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${pct * 100}%` }}
                                    />
                                </div>
                                <p className="text-[9px] text-neutral-600 italic">{u.upgradeFeature}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
