// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Shield, Activity, Users, LogOut, Key, FileText, Zap, Settings, UserCheck, ShieldCheck, LayoutDashboard, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BackgroundParticles() {
    const particles = useMemo(() =>
        Array.from({ length: 7 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 1 + Math.random() * 2,
            duration: 15 + Math.random() * 10,
            delay: Math.random() * 5,
            driftX: (Math.random() - 0.5) * 60,
        })), []);

    return (
        <>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-emerald-500/20"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -180, 0],
                        x: [0, p.driftX, 0],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: user.metadata.creationTime,
                    lastLogin: new Date().toISOString()
                }, { merge: true }).catch(console.error);
            }
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Shield className="w-8 h-8 text-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 animate-pulse">Authenticating...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Agents", href: "/dashboard/agents", icon: Users },
        { name: "Monitoring", href: "/dashboard/monitoring", icon: Activity },
        { name: "Threat Intel", href: "/dashboard/threats", icon: Shield },
        { name: "Integrations", href: "/dashboard/integrations", icon: Zap },
        { name: "Policies", href: "/dashboard/policies", icon: Shield },
        { name: "Compliance", href: "/dashboard/compliance", icon: ShieldCheck },
        { name: "Vault", href: "/dashboard/vault", icon: Lock },
        { name: "Approvals", href: "/dashboard/approvals", icon: UserCheck },
        { name: "Team", href: "/dashboard/team", icon: Users },
        { name: "Audit Logs", href: "/dashboard/audit", icon: Activity },
        { name: "Simulation", href: "/dashboard/simulation", icon: Zap },
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
        { label: "Self-Host", href: "/self-host", icon: Zap },
        { label: "CLI Tool", href: "/docs/typescript", icon: Zap },
        { label: "Spec", href: "/spec", icon: Shield },
    ];

    return (
        <div className="flex h-screen bg-black text-neutral-50 overflow-hidden relative font-sans">
            {/* Background effects layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Ambient glow blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/8 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10000ms' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '15000ms' }} />

                {/* Animated scanning grid */}
                <div className="absolute inset-0 opacity-[0.025]" style={{
                    backgroundImage: 'linear-gradient(rgba(16,185,129,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.8) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    animation: 'grid-scan 4s linear infinite',
                }} />

                {/* Horizontal scan line */}
                <div className="absolute left-0 right-0 h-[1px] z-10" style={{
                    background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)',
                    animation: 'scan-down 6s ease-in-out infinite',
                }} />

                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '256px 256px',
                    }}
                />

                {/* Floating particles */}
                <BackgroundParticles />
            </div>

            {/* Sidebar — enhanced glassmorphism */}
            <aside className="w-64 border-r border-emerald-500/20 bg-neutral-950/75 backdrop-blur-3xl saturate-150 flex flex-col relative z-20">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <div className="h-16 flex items-center px-5 border-b border-white/[0.08]">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="relative">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <span className="font-black text-base uppercase tracking-tighter italic text-white">SupraWall</span>
                    </Link>
                    <div className="ml-auto">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/60 border border-emerald-500/20 px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                </div>

                <nav className="flex-1 py-1 flex flex-col gap-0.5 overflow-y-auto min-h-0 custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group relative flex items-center px-5 py-2.5 mx-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-emerald-500/10 text-white border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                    : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.05] border border-transparent"
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                )}
                                <Icon className={`w-3.5 h-3.5 mr-3 transition-all duration-200 ${isActive ? "text-emerald-400" : "group-hover:text-neutral-300"}`} />
                                <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`}>{item.name}</span>
                            </Link>
                        );
                    })}

                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                        <p className="px-5 mb-2 text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.25em]">
                            Connect
                        </p>
                        <div className="space-y-0.5">
                            {connectNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative flex items-center px-5 py-2.5 mx-2 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-emerald-500/10 text-white border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                            : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.05] border border-transparent"
                                            }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        )}
                                        <Icon className={`w-3.5 h-3.5 mr-3 ${isActive ? "text-emerald-400" : "group-hover:text-neutral-300"}`} />
                                        <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? "text-white" : "group-hover:text-white"}`}>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/[0.08] pb-6">
                        <p className="px-5 mb-2 text-[9px] font-black text-neutral-500 uppercase tracking-[0.25em]">
                            Resources
                        </p>
                        <div className="space-y-0.5">
                            {resourcesNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative flex items-center px-5 py-2.5 mx-2 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-emerald-500/10 text-white border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                            : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.05] border border-transparent"
                                            }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 rounded-r shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        )}
                                        <Icon className={`w-3.5 h-3.5 mr-3 ${isActive ? "text-emerald-400" : "group-hover:text-neutral-300"}`} />
                                        <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? "text-white" : "group-hover:text-white"}`}>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                <div className="p-3 border-t border-white/[0.08] bg-black/40">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-black text-emerald-400 uppercase">
                                {user.email?.[0]?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.15em]">Operator</span>
                            <span className="text-[11px] font-medium text-neutral-300 truncate">{user.email}</span>
                        </div>
                        <button
                            onClick={() => auth.signOut()}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-rose-500/20 flex-shrink-0"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content with page transitions */}
            <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
                <div className="p-8 md:p-10 max-w-6xl mx-auto min-h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
