// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import AppShell from "@/components/layout/Shell";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Key, Activity, FileText } from "lucide-react";

export default function ConnectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { label: "Overview", href: "/connect", icon: Shield },
        { label: "Sub-Keys", href: "/connect/keys", icon: Key },
        { label: "Analytics", href: "/connect/analytics", icon: Activity },
        { label: "Audit Log", href: "/connect/events", icon: FileText },
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Connect Tabs */}
                <div className="flex items-center gap-1 border-b border-white/[0.08] pb-px overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-wider transition-all relative whitespace-nowrap ${isActive
                                    ? "text-emerald-400"
                                    : "text-neutral-500 hover:text-neutral-300"
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="relative">
                    {children}
                </div>
            </div>
        </AppShell>
    );
}
