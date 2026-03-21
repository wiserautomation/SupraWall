import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <div className="p-4 bg-emerald-500/5 rounded-full mb-4 border border-emerald-500/10">
                <Icon className="w-8 h-8 text-emerald-500/40" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">{title}</h3>
            <p className="text-[11px] text-neutral-500 max-w-sm mb-6 uppercase tracking-wider leading-relaxed">{description}</p>
            {action}
        </div>
    );
}
