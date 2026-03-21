"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, Check, X, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

function McpConsentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');

    const handleApprove = async () => {
        setLoading(true);
        try {
            // 1. Generate a code (in a real app, this calls an API)
            const response = await fetch('/api/mcp/auth/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, redirectUri })
            });
            
            const { code } = await response.json();
            
            // 2. Redirect back to original requester
            const finalUrl = new URL(redirectUri!);
            finalUrl.searchParams.set('code', code);
            if (state) finalUrl.searchParams.set('state', state);
            
            window.location.href = finalUrl.toString();
        } catch (error) {
            console.error("Auth failed", error);
            setLoading(false);
        }
    };

    return (
        <main className="pt-40 flex justify-center px-6">
            <div className="max-w-md w-full bg-neutral-900/50 border border-white/10 rounded-[2.5rem] p-12 space-y-8 backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Authorize <span className="text-emerald-500">Access</span></h1>
                    <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                        {clientId || "A third-party application"} wants to connect to your SupraWall agents.
                    </p>
                </div>

                <div className="space-y-4 border-y border-white/5 py-8">
                    <div className="flex items-start gap-4">
                        <div className="p-1 bg-emerald-500/20 rounded-full mt-1"><Check className="w-3 h-3 text-emerald-500" /></div>
                        <p className="text-xs uppercase font-black tracking-widest text-neutral-300">Evaluate security policies</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-1 bg-emerald-500/20 rounded-full mt-1"><Check className="w-3 h-3 text-emerald-500" /></div>
                        <p className="text-xs uppercase font-black tracking-widest text-neutral-300">Trigger human approvals</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-1 bg-emerald-500/20 rounded-full mt-1"><Check className="w-3 h-3 text-emerald-500" /></div>
                        <p className="text-xs uppercase font-black tracking-widest text-neutral-300">Read audit log metadata</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        disabled={loading}
                        onClick={handleApprove}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Approve Connection"}
                    </button>
                    <button 
                        onClick={() => router.back()}
                        className="w-full py-5 text-neutral-500 font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-[10px] text-center text-neutral-600 font-bold uppercase tracking-widest italic">
                    By approving, you allow the app above to interact with your SupraWall policies.
                </p>
            </div>
        </main>
    );
}

export default function McpConsentPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />
            <Suspense fallback={<div className="pt-40 text-center uppercase tracking-widest text-xs font-black italic animate-pulse">Loading Identity...</div>}>
                <McpConsentContent />
            </Suspense>
        </div>
    );
}
