import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { ListOrdered, Clock } from "lucide-react";

export default function QueuePage() {
    const queuePath = path.join(process.cwd(), '..', 'publishing_queue.md');
    let content = "";

    try {
        content = fs.readFileSync(queuePath, 'utf8');
    } catch (e) {
        content = "# Queue not found\nThe file `publishing_queue.md` was not found at the root.";
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Publishing Queue</h1>
                    <p className="text-neutral-500 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Live view of the current priority queue.
                    </p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">Active</span>
                </div>
            </header>

            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />

                <div className="prose prose-invert max-w-none prose-h2:text-emerald-400 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-2 prose-li:text-neutral-300">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
