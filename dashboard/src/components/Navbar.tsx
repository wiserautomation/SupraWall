"use client";

import { motion } from "framer-motion";
import { BrickWall, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/60 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-1.5 bg-emerald-600 rounded-lg shadow-[0_0_20px_rgba(5,150,105,0.4)] group-hover:scale-110 transition-transform duration-500">
                        <BrickWall className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-black text-2xl tracking-[ -0.05em] uppercase italic">SupraWall</span>
                </Link>

                <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest">
                    <Link href="/docs" className="text-neutral-500 hover:text-white transition-colors">Documentation</Link>
                    <Link href="/learn/what-is-agent-runtime-security" className="text-neutral-500 hover:text-white transition-colors">Security Hub</Link>
                    <Link href="/#integrations" className="text-neutral-500 hover:text-white transition-colors">Integrations</Link>
                    <Link href="/spec" className="text-neutral-500 hover:text-white transition-colors">AGPS Spec</Link>
                    <div className="h-4 w-px bg-white/10" />
                    <Link href="/login" className="text-neutral-500 hover:text-white transition-colors">Sign In</Link>
                    <Link href="/login" className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-95 group flex items-center gap-2">
                        Get Started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
