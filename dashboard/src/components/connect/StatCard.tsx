import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/[0.05] p-5 flex items-start gap-4 hover:border-emerald-500/20 transition-all group">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">{title}</p>
                <p className="text-xl font-bold text-white mt-1">{value}</p>
                {subtitle && <p className="text-[10px] text-neutral-600 mt-1 uppercase tracking-tight">{subtitle}</p>}
            </div>
        </div>
    );
}
