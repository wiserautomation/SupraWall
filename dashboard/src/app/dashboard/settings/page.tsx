"use client";

import { motion } from "framer-motion";
import { Database, Save, CheckCircle2, Webhook, RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [savedDb, setSavedDb] = useState(false);
    const [savedWebhook, setSavedWebhook] = useState(false);

    const [dbType, setDbType] = useState("firebase");
    const [dbString, setDbString] = useState("");

    const [webhookUrl, setWebhookUrl] = useState("");
    const [webhookSecret, setWebhookSecret] = useState("whsec_test_secret_key_change_me");

    const handleSaveDb = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedDb(true);
        setTimeout(() => setSavedDb(false), 2000);
    };

    const handleSaveWebhook = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedWebhook(true);
        setTimeout(() => setSavedWebhook(false), 2000);
    };

    const handleGenerateSecret = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let str = "whsec_";
        for (let i = 0; i < 24; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setWebhookSecret(str);
    };

    return (
        <div className="max-w-3xl space-y-12 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                <p className="text-neutral-400 text-lg">
                    Manage your core platform integrations, architecture, and subscriptions.
                </p>
            </div>

            {/* DATABASE CONFIG */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Database className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Database Architecture</h2>
                        <p className="text-sm text-neutral-400">AgentGate is database agnostic. Choose your persistence layer.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900 border border-white/[0.05] rounded-xl overflow-hidden"
                >
                    <form onSubmit={handleSaveDb} className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-neutral-300">Persistence Layer</label>
                            <select
                                value={dbType}
                                onChange={(e) => setDbType(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="firebase">Firebase (Cloud Firestore) - Default</option>
                                <option value="postgres">PostgreSQL</option>
                                <option value="mysql">MySQL</option>
                                <option value="mongodb">MongoDB</option>
                                <option value="supabase">Supabase</option>
                            </select>
                        </div>

                        {dbType !== "firebase" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-3"
                            >
                                <label className="text-sm font-medium text-neutral-300">Connection String (URL)</label>
                                <input
                                    type="text"
                                    placeholder={`e.g. ${dbType}://user:pass@localhost:5432/agentgate`}
                                    value={dbString}
                                    onChange={(e) => setDbString(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <p className="text-xs text-neutral-500">Ensure your cloud instance allows external connections from our IP ranges.</p>
                            </motion.div>
                        )}

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${savedDb
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }`}
                            >
                                {savedDb ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> Connected
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Apply Database
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </section>

            {/* WEBHOOKS CONFIG */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Webhook className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Event Webhooks</h2>
                        <p className="text-sm text-neutral-400">Receive real-time push events when policies are triggered or denied.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900 border border-white/[0.05] rounded-xl overflow-hidden"
                >
                    <form onSubmit={handleSaveWebhook} className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-neutral-300">Endpoint URL</label>
                            <input
                                type="url"
                                placeholder="https://your-api.com/webhooks/agentgate"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                            <p className="text-xs text-neutral-500">We send POST requests with application/json payloads. Automatic exponential backoff applies to failed deliveries.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-medium text-neutral-300">Signing Secret</label>
                                <button type="button" onClick={handleGenerateSecret} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                                    <RefreshCcw className="w-3 h-3" /> Roll Secret
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={webhookSecret}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-neutral-400 text-sm font-mono cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-neutral-500">Used to verify the AgentGate-Signature HMAC SHA256 header securely.</p>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${savedWebhook
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }`}
                            >
                                {savedWebhook ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" /> Endpoint Active
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Webhook
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </section>
        </div>
    );
}
