// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Shield, 
    ArrowRight, 
    Zap, 
    CheckCircle2, 
    ChevronRight, 
    Loader2,
    Users,
    Activity,
    Lock,
    Cpu,
    Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BetaLandingPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        framework: "langchain",
        agentsCount: "",
        mainRisk: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="relative pt-32 pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-600/10 blur-[180px] rounded-full translate-y-[-50%]" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full translate-x-[30%] translate-y-[30%]" />
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    {/* Content Column */}
                    <div className="space-y-12">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                            Private Beta Access
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                                The <span className="text-emerald-500">Waitlist</span> <br />
                                Is Open.
                            </h1>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-xl">
                                We are onboarding design partners in small batches to ensure each team has direct support from our founding engineers.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6"
                        >
                            {[
                                { title: "Free Team Tier", desc: "$79/mo value during beta", icon: Zap },
                                { title: "Roadmap Input", desc: "Influence core features", icon: Activity },
                                { title: "Direct Support", desc: "Line to founders", icon: Users },
                                { title: "Priority Onboarding", desc: "Skip the public line", icon: ArrowRight }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-all group">
                                    <div className="p-3 rounded-2xl bg-white/5 text-emerald-500 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-white text-xs uppercase tracking-widest leading-none">{item.title}</h3>
                                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Form Column */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full opacity-50" />
                        
                        <div className="bg-[#080808] border border-white/10 rounded-[3.5rem] p-10 md:p-14 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                            
                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Request Received.</h2>
                                            <p className="text-neutral-400 font-medium">We&apos;ve added you to the queue. An engineer will reach out to schedule your onboarding session.</p>
                                        </div>
                                        <Button 
                                            onClick={() => setStatus("idle")}
                                            className="bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-xl border border-white/10"
                                        >
                                            Submit Another Request
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit} 
                                        className="space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Onboarding Request</h2>
                                            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">All fields are mandatory for qualification.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">First Name</label>
                                                <Input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-14 bg-black border-white/10 focus:border-emerald-500/50 text-white rounded-xl font-bold"
                                                    placeholder="Alex"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Surname</label>
                                                <Input
                                                    name="surname"
                                                    value={formData.surname}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-14 bg-black border-white/10 focus:border-emerald-500/50 text-white rounded-xl font-bold"
                                                    placeholder="Operator"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Professional Email</label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="h-14 bg-black border-white/10 focus:border-emerald-500/50 text-white rounded-xl font-bold"
                                                placeholder="alex@company.com"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Framework</label>
                                                <select
                                                    name="framework"
                                                    value={formData.framework}
                                                    onChange={handleChange}
                                                    className="flex h-14 w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none"
                                                >
                                                    <option value="langchain">LangChain</option>
                                                    <option value="crewai">CrewAI</option>
                                                    <option value="autogen">AutoGen</option>
                                                    <option value="vercel-ai">Vercel AI SDK</option>
                                                    <option value="llamaindex">LlamaIndex</option>
                                                    <option value="other">Other / Custom</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Agents in Prod</label>
                                                <Input
                                                    name="agentsCount"
                                                    type="number"
                                                    value={formData.agentsCount}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-14 bg-black border-white/10 focus:border-emerald-500/50 text-white rounded-xl font-bold"
                                                    placeholder="e.g. 5"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Primary Security Concern</label>
                                            <textarea
                                                name="mainRisk"
                                                value={formData.mainRisk}
                                                onChange={handleChange}
                                                required
                                                className="w-full min-h-[120px] bg-black border border-white/10 focus:border-emerald-500/50 text-white rounded-xl font-bold p-4 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                                placeholder="e.g. Preventing unauthorized database access or cost runs..."
                                            />
                                        </div>

                                        {status === "error" && (
                                            <p className="text-rose-500 text-xs font-black uppercase tracking-widest text-center">Connection failed. Please try again.</p>
                                        )}

                                        <Button 
                                            disabled={status === "submitting"}
                                            className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.1em] text-lg rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            {status === "submitting" ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            ) : (
                                                <>Request Access <ArrowRight className="w-5 h-5" /></>
                                            )}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
