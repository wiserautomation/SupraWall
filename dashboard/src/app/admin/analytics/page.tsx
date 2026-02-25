"use client";

import { Database } from "lucide-react";

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                <Database className="w-8 h-8 text-indigo-500" />
                Advanced Analytics
            </h1>
            <p className="text-neutral-400 text-sm">Detailed system metrics, conversion funnels, and revenue tracking will appear here.</p>
            <div className="h-64 border border-white/5 rounded-xl border-dashed flex items-center justify-center text-neutral-500 bg-white/[0.01]">
                Analytics Engine Coming Soon
            </div>
        </div>
    );
}
