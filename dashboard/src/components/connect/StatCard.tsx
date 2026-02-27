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
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
                <Icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}
