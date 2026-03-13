"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Shield, Activity, Users, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">Loading...</div>;
    }

    const navItems = [
        { name: "Agents", href: "/dashboard", icon: Users },
        { name: "Policies", href: "/dashboard/policies", icon: Shield },
        { name: "Audit Logs", href: "/dashboard/audit", icon: Activity },
    ];

    return (
        <div className="flex h-screen bg-neutral-950 text-neutral-50 overflow-hidden">
            <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-neutral-800">
                    <Shield className="w-6 h-6 text-indigo-500 mr-3" />
                    <span className="font-bold text-lg tracking-tight">suprawall</span>
                </div>
                <nav className="flex-1 py-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-6 py-2.5 mx-2 rounded-md transition-colors ${isActive ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-3" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs text-neutral-500 font-medium">Logged in as</span>
                        <span className="text-sm font-medium truncate">{user.email}</span>
                    </div>
                    <button
                        onClick={() => auth.signOut()}
                        className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
