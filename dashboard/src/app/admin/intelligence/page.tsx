"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    Plus,
    Calendar,
    ArrowUpRight
} from "lucide-react";

interface Brief {
    id: string;
    week_start: string;
    metrics: {
        top100: { last: number, now: number };
        top20: { last: number, now: number };
        indexed: { last: number, now: number };
        refDom: { last: number, now: number };
        llmCit: { last: number, now: number };
    };
    wins: string[];
    problems: string[];
    opportunities: string[];
    actions: Array<{
        priority: 'P0' | 'P1' | 'P2';
        title: string;
        description: string;
        type: string;
        url?: string;
    }>;
    created_at: string;
}

export default function IntelligencePage() {
    const [brief, setBrief] = useState<Brief | null>(null);
    const [loading, setLoading] = useState(true);
    const [addedActions, setAddedActions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchLatestBrief();
    }, []);

    async function fetchLatestBrief() {
        const res = await fetch('/api/intelligence');
        if (res.ok) {
            const data = await res.json();
            if (data.id) setBrief(data);
        }
        setLoading(false);
    }

    const addToQueue = async (actionId: string, action: any) => {
        setAddedActions(prev => ({ ...prev, [actionId]: true }));

        // 1. Create task via API
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                task_number: `ACTION-${Date.now().toString().slice(-4)}`,
                type: 'queue_addition',
                status: 'pending_review',
                url: action.url || '/',
                primary_keyword: action.title,
                human_note: `Recommended Action from Intelligence Brief: ${action.description}`,
                batch: 'Intelligence'
            })
        });
    };

    if (loading) return <div className="h-64 flex items-center justify-center text-neutral-500">Loading intelligence...</div>;

    if (!brief) return (
        <div className="h-96 flex flex-col items-center justify-center text-neutral-500 bg-neutral-900/20 border border-dashed border-white/10 rounded-2xl">
            <BarChart3 className="w-12 h-12 opacity-20 mb-4" />
            <p className="text-xl font-medium">No intelligence briefs found.</p>
            <p className="text-sm">Antigravity will generate the first brief on Monday.</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Intelligence Brief
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">LIVE</span>
                    </h1>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Week starting: {new Date(brief.week_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-700">Last Synced</p>
                    <p className="text-xs text-neutral-500">{new Date(brief.created_at).toLocaleTimeString()}</p>
                </div>
            </header>

            {/* Metrics Section */}
            <section className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Core Metrics</h2>
                </div>
                <div className="grid grid-cols-5 divide-x divide-white/5">
                    <MetricBox label="Top 100" metrics={brief.metrics.top100} />
                    <MetricBox label="Top 20" metrics={brief.metrics.top20} />
                    <MetricBox label="Indexed Pages" metrics={brief.metrics.indexed} />
                    <MetricBox label="Referring Domains" metrics={brief.metrics.refDom} />
                    <MetricBox label="LLM Mentions" metrics={brief.metrics.llmCit} />
                </div>
            </section>

            {/* Findings Section */}
            <div className="grid grid-cols-3 gap-6">
                <FindingsBox title="Wins" icon={CheckCircle} items={brief.wins} color="text-emerald-400" bgColor="bg-emerald-500/5" shadow="shadow-emerald-500/5" />
                <FindingsBox title="Problems" icon={AlertTriangle} items={brief.problems} color="text-red-400" bgColor="bg-red-500/5" shadow="shadow-red-500/5" />
                <FindingsBox title="Opportunities" icon={Lightbulb} items={brief.opportunities} color="text-yellow-400" bgColor="bg-yellow-500/5" shadow="shadow-yellow-500/5" />
            </div>

            {/* Recommended Actions */}
            <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Recommended Actions</h2>
                <div className="grid gap-4">
                    {brief.actions.map((action, i) => (
                        <ActionCard
                            key={i}
                            action={action}
                            isAdded={!!addedActions[`${i}`]}
                            onAdd={() => addToQueue(`${i}`, action)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function MetricBox({ label, metrics }: { label: string, metrics: { last: number, now: number } }) {
    const diff = metrics.now - metrics.last;
    return (
        <div className="p-6">
            <p className="text-xs text-neutral-600 font-medium whitespace-nowrap">{label}</p>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-mono font-bold">{metrics.now}</span>
                {diff !== 0 && (
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${diff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(diff)}
                    </span>
                )}
            </div>
            <p className="text-[10px] text-neutral-700 mt-1">prev: {metrics.last}</p>
        </div>
    );
}

function FindingsBox({ title, icon: Icon, items, color, bgColor, shadow }: any) {
    return (
        <div className={`p-6 rounded-2xl border border-white/5 ${bgColor} ${shadow} space-y-4`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <h3 className="font-bold text-white tracking-tight">{title}</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-neutral-400 leading-relaxed">
                        <span className="text-neutral-700 mt-1.5">•</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ActionCard({ action, isAdded, onAdd }: { action: any, isAdded: boolean, onAdd: () => void }) {
    const priorityColors = {
        P0: "bg-red-500/20 text-red-400 border-red-500/30",
        P1: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        P2: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };

    return (
        <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-neutral-900/60 transition-colors">
            <div className="flex gap-6 items-center">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-black ${priorityColors[action.priority as keyof typeof priorityColors]}`}>
                    {action.priority}
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg tracking-tight flex items-center gap-2">
                        {action.title}
                        {action.url && <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-emerald-500 transition-colors" />}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 max-w-xl">{action.description}</p>
                </div>
            </div>
            <button
                onClick={onAdd}
                disabled={isAdded}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${isAdded
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-white text-black hover:bg-emerald-500 hover:text-white"
                    }`}
            >
                {isAdded ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAdded ? "Added" : "Add to Queue"}
            </button>
        </div>
    );
}
