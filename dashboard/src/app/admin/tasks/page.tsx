"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    FileText,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Send,
    Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type TaskStatus = 'pending_review' | 'approved' | 'revision' | 'rejected' | 'publishing' | 'published';

interface Task {
    id: string;
    task_number: string;
    type: string;
    status: TaskStatus;
    url?: string;
    primary_keyword?: string;
    secondary_keywords?: string[];
    source_file?: string;
    preview_url?: string;
    content_draft?: string;
    checklist?: Record<string, boolean>;
    human_action?: string;
    human_note?: string;
    agent_response?: string;
    created_at: string;
    updated_at: string;
    reviewed_at?: string;
    published_at?: string;
    batch?: string;
}

export default function TaskReviewPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<string>("pending_review");
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();

        // Subscription
        const channel = supabase
            .channel('task-updates')
            .on('postgres_changes' as any, { event: '*', table: 'tasks' }, (payload: any) => {
                fetchTasks();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setTasks(data);
            const c: Record<string, number> = {};
            data.forEach(t => {
                c[t.status] = (c[t.status] || 0) + 1;
            });
            setCounts(c);
        }
        setLoading(false);
    }

    const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

    const tabs = [
        { id: "all", name: "All" },
        { id: "pending_review", name: "Pending Review" },
        { id: "revision", name: "Revision" },
        { id: "approved", name: "Approved" },
        { id: "published", name: "Published" },
        { id: "rejected", name: "Rejected" },
    ];

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Task Review
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">Review and approve agent-generated content.</p>
                    </div>
                    <div className="flex gap-2">
                        <StatusPill status="pending_review" count={counts.pending_review || 0} />
                        <StatusPill status="published" count={counts.published || 0} />
                        <StatusPill status="revision" count={counts.revision || 0} />
                    </div>
                </div>

                <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab.id
                                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                                }`}
                        >
                            {tab.name}
                            {counts[tab.id] > 0 && tab.id !== 'all' && (
                                <span className="ml-2 bg-neutral-800 text-neutral-400 text-[10px] px-1.5 py-0.5 rounded-md">
                                    {counts[tab.id]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid gap-4">
                {loading ? (
                    <div className="h-64 flex items-center justify-center text-neutral-500">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-neutral-500 bg-neutral-900/20 border border-dashed border-white/10 rounded-2xl">
                        <FileText className="w-8 h-8 opacity-20 mb-2" />
                        <p>No tasks found in this category.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                    ))
                )}
            </div>
        </div>
    );
}

function StatusPill({ status, count }: { status: string, count: number }) {
    const config: Record<string, { label: string, color: string, icon: any }> = {
        pending_review: { label: 'pending', color: 'text-yellow-500 bg-yellow-500/10', icon: Clock },
        published: { label: 'published', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
        revision: { label: 'revision', color: 'text-blue-500 bg-blue-500/10', icon: AlertCircle },
    };
    const c = config[status] || { label: status, color: 'text-gray-500 bg-gray-500/10', icon: Clock };
    const Icon = c.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 ${c.color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">{count} {c.label}</span>
        </div>
    );
}

function TaskCard({ task, onUpdate }: { task: Task, onUpdate: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const handleAction = async (status: TaskStatus, humanNote?: string) => {
        if (status === 'rejected' && !confirm("Are you sure? This cannot be undone.")) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    human_note: humanNote || null,
                    human_action: status === 'approved' ? 'approved content' : status === 'revision' ? 'requested revision' : 'rejected'
                })
            });
            if (res.ok) onUpdate();
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusColors: Record<string, string> = {
        pending_review: "border-yellow-500/50 bg-yellow-500/5",
        approved: "border-emerald-500/50 bg-emerald-500/5",
        revision: "border-blue-500/50 bg-blue-500/5",
        rejected: "border-red-500/50 bg-red-500/5",
        published: "border-purple-500/50 bg-purple-500/5",
    };

    const statusIcons: Record<string, any> = {
        pending_review: Clock,
        approved: CheckCircle2,
        revision: AlertCircle,
        rejected: XCircle,
        published: Eye,
    };

    const Icon = statusIcons[task.status] || Clock;

    return (
        <div className={`overflow-hidden transition-all duration-300 rounded-2xl border ${statusColors[task.status] || "border-white/5 bg-neutral-900/30"}`}>
            {/* Header / Summary */}
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                        <Icon className="w-5 h-5 text-current" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm tracking-tight">{task.task_number}</span>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-neutral-400 font-bold uppercase tracking-widest">{task.batch}</span>
                        </div>
                        <h3 className="font-semibold text-white mt-0.5">{task.url || "New Page"}</h3>
                        <p className="text-xs text-neutral-500">Primary KW: <span className="text-neutral-300">{task.primary_keyword}</span> · {task.type}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-500 tabular-nums">{timeAgo(task.created_at)}</span>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/40"
                    >
                        <div className="divide-y divide-white/5">
                            {/* Checklist Section */}
                            <div className="p-6 grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Checklist</h4>
                                    <div className="space-y-3">
                                        {Object.entries(task.checklist || {}).map(([item, checked]) => (
                                            <div key={item} className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? "bg-emerald-500/20 border-emerald-500/50" : "border-white/10"}`}>
                                                    {checked && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                                </div>
                                                <span className={`text-sm ${checked ? "text-neutral-300" : "text-neutral-500"}`}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Metadata</h4>
                                    <div className="space-y-2">
                                        <MetaItem label="Source" value={task.source_file || 'N/A'} />
                                        <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                                            <span className="text-neutral-500">Live Preview</span>
                                            {task.preview_url ? (
                                                <a href={task.preview_url} target="_blank" className="text-emerald-400 hover:underline flex items-center gap-1">
                                                    Open <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-neutral-700 italic">No preview available</span>
                                            )}
                                        </div>
                                        <div className="pt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Secondary Keywords</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {task.secondary_keywords?.map(kw => (
                                                    <span key={kw} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-neutral-400">{kw}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Draft Section */}
                            <div className="p-6">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Content Draft</h4>
                                <div className="bg-neutral-900 border border-white/5 rounded-xl p-6 prose prose-invert prose-sm max-w-none max-h-[600px] overflow-y-auto custom-scrollbar">
                                    <ReactMarkdown>{task.content_draft || ""}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            {task.status === 'pending_review' && (
                                <div className="p-6 bg-black/20 flex flex-col gap-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Your Decision</h4>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <button
                                                disabled={isSubmitting}
                                                onClick={() => handleAction('approved')}
                                                className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="w-5 h-5" /> Approve Draft
                                            </button>

                                            <button
                                                disabled={isSubmitting}
                                                onClick={() => handleAction('rejected')}
                                                className="w-full h-12 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                <XCircle className="w-5 h-5" /> Reject Task
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Type revision notes here..."
                                                className="w-full h-24 bg-neutral-950 border border-white/5 rounded-xl p-3 text-sm focus:ring-1 focus:ring-emerald-500 outline-none resize-none placeholder:text-neutral-700"
                                            />
                                            <button
                                                disabled={isSubmitting || !note.trim()}
                                                onClick={() => handleAction('revision', note)}
                                                className="w-full h-10 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-400 transition-colors disabled:opacity-50"
                                            >
                                                <Send className="w-4 h-4" /> Send for Revision
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {task.status === 'revision' && task.human_note && (
                                <div className="p-6 bg-blue-500/5 border-l-4 border-blue-500">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">My Last Note</h4>
                                    <p className="text-sm text-neutral-300 italic">"{task.human_note}"</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MetaItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
            <span className="text-neutral-500">{label}</span>
            <span className="text-neutral-300 truncate max-w-[200px]" title={value}>{value}</span>
        </div>
    );
}
