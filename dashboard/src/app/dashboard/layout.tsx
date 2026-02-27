"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Shield, BrickWall, Activity, Users, LogOut, Key, FileText, Zap, Settings } from "lucide-react";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                // Ensure user exists in Firestore for the Admin Panel
                setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: user.metadata.creationTime,
                    lastLogin: new Date().toISOString()
                }, { merge: true }).catch(console.error);
            }
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">Loading...</div>;
    }

    const navItems = [
        { name: "Agents", href: "/dashboard", icon: Users },
        { name: "Policies", href: "/dashboard/policies", icon: Shield },
        { name: "Audit Logs", href: "/dashboard/audit", icon: Activity },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const connectNavItems = [
        { label: "Overview", href: "/connect", icon: Shield },
        { label: "Keys", href: "/connect/keys", icon: Key },
        { label: "Analytics", href: "/connect/analytics", icon: Activity },
        { label: "Events", href: "/connect/events", icon: FileText },
    ];

    const resourcesNavItems = [
        { label: "Documentation", href: "/docs", icon: FileText },
        { label: "Self-Host", href: "/docs/self-host", icon: Zap },
        { label: "CLI Tool", href: "/docs/cli", icon: Zap },
        { label: "Spec", href: "/spec", icon: Shield },
    ];

    return (
        <div className="flex h-screen bg-black text-neutral-50 overflow-hidden relative font-sans">
            {/* Subtle Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden selection:bg-neutral-800">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[15000ms]" />
            </div>

            <aside className="w-64 border-r border-white-[0.05] bg-neutral-950/50 backdrop-blur-2xl flex flex-col relative z-20">
                <div className="h-16 flex items-center px-6 border-b border-white/[0.05]">
                    <BrickWall className="w-6 h-6 text-emerald-400 mr-3 animate-pulse" />
                    <span className="font-bold text-lg tracking-tight text-white drop-shadow-sm">SupraWall</span>
                </div>
                <nav className="flex-1 py-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-300 ${isActive ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${isActive ? "scale-110 text-emerald-400" : "group-hover:scale-110 group-hover:text-neutral-200"}`} />
                                <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`}>{item.name}</span>
                            </Link>
                        );
                    })}

                    <div className="mt-6">
                        <p className="px-6 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Connect
                        </p>
                        <div className="space-y-1">
                            {connectNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-300 ${isActive ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${isActive ? "scale-110 text-emerald-400" : "group-hover:scale-110 group-hover:text-neutral-200"}`} />
                                        <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`}>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="px-6 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            Resources
                        </p>
                        <div className="space-y-1">
                            {resourcesNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-300 ${isActive ? "bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 mr-3 transition-transform duration-300 ${isActive ? "scale-110 text-emerald-400" : "group-hover:scale-110 group-hover:text-neutral-200"}`} />
                                        <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`}>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
                <div className="p-4 border-t border-white/[0.05] flex items-center justify-between bg-black/20">
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs text-neutral-500 font-medium tracking-wide uppercase">Logged in as</span>
                        <span className="text-sm font-medium text-neutral-300 truncate mt-0.5">{user.email}</span>
                    </div>
                    <button
                        onClick={() => auth.signOut()}
                        className="p-2.5 text-neutral-400 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
                <div className="p-8 md:p-12 max-w-6xl mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
