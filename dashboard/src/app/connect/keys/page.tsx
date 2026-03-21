"use client";

import { useState } from "react";
import { usePlatform, useConnectKeys } from "@/hooks/useConnect";
import { EmptyState } from "@/components/connect/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Key, Plus, Trash2, Copy, Check, AlertTriangle, Shield, User, Globe, Activity } from "lucide-react";
import type { ConnectKey } from "@/types/connect";
import { sendGAEvent } from "@next/third-parties/google";

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="ml-2 p-1.5 rounded-lg hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/10"
        >
            {copied
                ? <Check className="w-3 h-3 text-emerald-400" />
                : <Copy className="w-3 h-3 text-neutral-500 hover:text-neutral-300" />
            }
        </button>
    );
}

function IssueKeyDialog({
    platformId,
    onIssue,
}: {
    platformId: string;
    onIssue: (params: any) => Promise<string>;
}) {
    const [open, setOpen] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [customerLabel, setCustomerLabel] = useState("");
    const [loading, setLoading] = useState(false);
    const [newKey, setNewKey] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleIssue = async () => {
        if (!customerId.trim()) return;
        setLoading(true);
        setError("");
        try {
            const subKeyId = await onIssue({
                platformId,
                customerId: customerId.trim(),
                customerLabel: customerLabel.trim() || customerId.trim(),
            });
            setNewKey(subKeyId);
            sendGAEvent('event', 'issue_connect_key', { platform_id: platformId });
        } catch (e: any) {
            setError(e?.message ?? "Failed to issue key.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setCustomerId("");
            setCustomerLabel("");
            setNewKey(null);
            setError("");
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else setOpen(true); }}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] px-6">
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Issue Sub-Key
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-white/[0.08] text-white">
                <DialogHeader>
                    <DialogTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-400" />
                        Issue Connect Sub-Key
                    </DialogTitle>
                </DialogHeader>

                {newKey ? (
                    <div className="space-y-6 py-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 mb-1">
                                Initialization Successful
                            </p>
                            <p className="text-[11px] text-neutral-400 uppercase tracking-tight">
                                Copy this key now. It will never be displayed in full again.
                            </p>
                        </div>
                        <div className="flex items-center bg-black border border-white/[0.08] rounded-xl px-4 py-3.5 font-mono text-[11px] text-emerald-400 group relative">
                            <span className="flex-1 select-all break-all">{newKey}</span>
                            <CopyButton text={newKey} />
                        </div>
                        <div className="p-4 bg-white/[0.05] border border-white/10 rounded-xl">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider leading-relaxed">
                                Deploy this key to your customer's environment. It inherits all platform-level security policies automatically.
                            </p>
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] h-11" onClick={handleClose}>Complete Deployment</Button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="customer-id" className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Customer Identifier</Label>
                            <Input
                                id="customer-id"
                                placeholder="e.g. customer_042"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="bg-black border-white/[0.08] focus:border-emerald-500/30 h-10 text-[12px]"
                            />
                            <p className="text-[9px] text-neutral-600 uppercase tracking-tight">
                                Your internal UID for this customer.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-label" className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Human Label (Optional)</Label>
                            <Input
                                id="customer-label"
                                placeholder="e.g. Acme Corp — Production"
                                value={customerLabel}
                                onChange={(e) => setCustomerLabel(e.target.value)}
                                className="bg-black border-white/[0.08] focus:border-emerald-500/30 h-10 text-[12px]"
                            />
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] text-rose-400 uppercase tracking-wider font-bold">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 border-white/[0.08] hover:bg-white/[0.05] text-neutral-400 font-black uppercase tracking-widest text-[10px]"
                                onClick={handleClose}
                            >
                                Abort
                            </Button>
                            <Button
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px]"
                                disabled={loading || !customerId.trim()}
                                onClick={handleIssue}
                            >
                                {loading ? "Generating..." : "Issue Token"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function RevokeButton({
    subKey,
    onRevoke,
}: {
    subKey: ConnectKey;
    onRevoke: (subKeyId: string) => Promise<void>;
}) {
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    if (confirming) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest animate-pulse">Confirm?</span>
                <button
                    className="text-[10px] text-white bg-rose-600 px-3 py-1 rounded font-black uppercase tracking-widest hover:bg-rose-500 transition-colors"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onRevoke(subKey.subKeyId);
                        setLoading(false);
                        setConfirming(false);
                    }}
                >
                    {loading ? "..." : "YES"}
                </button>
                <button
                    className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-black"
                    onClick={() => setConfirming(false)}
                >
                    NO
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="p-2 rounded-lg hover:bg-rose-500/10 text-neutral-600 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
            title="Revoke and invalidate key"
        >
            <Trash2 className="w-3.5 h-3.5" />
        </button>
    );
}

export default function ConnectKeysPage() {
    const { platform, loading: platformLoading } = usePlatform();
    const {
        keys,
        loading: keysLoading,
        issueKey,
        revokeKey,
    } = useConnectKeys(platform?.platformId);

    if (platformLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Shield className="w-8 h-8 text-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 animate-pulse">Syncing Cryptography...</p>
                </div>
            </div>
        );
    }

    if (!platform) {
        return (
            <EmptyState
                icon={Key}
                title="Infrastructure Not Initialized"
                description="Initialize your SupraWall Connect platform to begin issuing customer sub-keys."
                action={
                    <Link href="/connect">
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] px-8 py-6 h-auto">
                            Initialize Connect
                        </Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Sub-Keys</h1>
                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        {keys.length} active cryptographiC tokens issued
                    </p>
                </div>
                <IssueKeyDialog
                    platformId={platform.platformId}
                    onIssue={issueKey}
                />
            </div>

            {/* Keys table */}
            {keysLoading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                </div>
            ) : keys.length === 0 ? (
                <EmptyState
                    icon={Key}
                    title="No sub-keys issued"
                    description="Your customers will need a sub-key to integrate their agents with your platform governance."
                    action={
                        <IssueKeyDialog
                            platformId={platform.platformId}
                            onIssue={issueKey}
                        />
                    }
                />
            ) : (
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/[0.08] bg-white/[0.01]">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 h-12">
                                    Customer Entity
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 h-12">
                                    Token Fragment
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 h-12">
                                    Invocations
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 h-12">
                                    Last Activity
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 h-12">
                                    Overrides
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-500 h-12">
                                    Issued
                                </TableHead>
                                <TableHead className="h-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.map((key) => (
                                <TableRow key={key.subKeyId} className="border-white/[0.08] group hover:bg-white/[0.01] transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                <User className="w-3.5 h-3.5 text-emerald-400 opacity-60" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">
                                                    {key.customerLabel}
                                                </p>
                                                <p className="text-[9px] text-neutral-600 font-mono">
                                                    {key.customerId}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <code className="text-[10px] bg-black border border-white/[0.08] px-2 py-1.5 rounded-lg font-mono text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                                                {key.subKeyId.slice(0, 16)}...
                                            </code>
                                            <CopyButton text={key.subKeyId} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-3 h-3 text-neutral-700" />
                                            <span className="text-[11px] font-black text-neutral-300 tabular-nums">
                                                {key.totalCalls.toLocaleString()}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                                            {key.lastUsedAt
                                                ? new Date(key.lastUsedAt).toLocaleDateString()
                                                : "No Activity"
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {key.hasPolicyOverrides && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md
                                                    text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    Policy+
                                                </span>
                                            )}
                                            {key.hasRateLimitOverride && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md
                                                    text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    Rate+
                                                </span>
                                            )}
                                            {!key.hasPolicyOverrides && !key.hasRateLimitOverride && (
                                                <span className="text-[9px] text-neutral-700 font-black uppercase tracking-widest">Default</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] text-neutral-600 font-medium">
                                            {key.createdAt
                                                ? new Date(key.createdAt).toLocaleDateString()
                                                : "—"
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <RevokeButton subKey={key} onRevoke={revokeKey} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Explainer / Info box */}
            <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-emerald-500/[0.04] transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all" />
                <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    Sub-Key Architecture Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">01. Issue Cryptographic Token</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-tight">
                            Generate a unique <code className="text-emerald-400 bg-black/50 px-1 rounded">agc_</code> token per customer entity.
                        </p>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">02. Universal SDK Integration</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-tight">
                            Customers embed the key into <code className="text-emerald-400 bg-black/50 px-1 rounded">SupraWall-JS</code> exactly like a standard API key.
                        </p>
                    </div>
                    <div className="space-y-2 text-right md:text-left">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">03. Automated Governance</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-tight">
                            Your master security policies filter every agent call. You maintain ultimate control.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
