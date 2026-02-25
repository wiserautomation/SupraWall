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
import { Key, Plus, Trash2, Copy, Check, AlertTriangle } from "lucide-react";
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
            className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
        >
            {copied
                ? <Check className="w-3 h-3 text-green-600" />
                : <Copy className="w-3 h-3 text-gray-400" />
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
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Issue Sub-Key
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Issue a Connect Sub-Key</DialogTitle>
                </DialogHeader>

                {newKey ? (
                    <div className="space-y-4">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-1">
                                Sub-key issued successfully
                            </p>
                            <p className="text-xs text-green-700">
                                Copy this key now — it will not be shown again in full.
                            </p>
                        </div>
                        <div className="flex items-center bg-gray-900 text-green-400 rounded-lg px-4 py-3
              font-mono text-sm overflow-x-auto">
                            <span className="flex-1 select-all">{newKey}</span>
                            <CopyButton text={newKey} />
                        </div>
                        <p className="text-xs text-gray-500">
                            Give this key to your customer. They use it exactly like a regular
                            AgentGate API key — just with your platform policies enforced.
                        </p>
                        <Button className="w-full" onClick={handleClose}>Done</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="customer-id">Customer ID</Label>
                            <Input
                                id="customer-id"
                                placeholder="e.g. customer_42 or acme-corp"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Your internal ID for this customer. Used in analytics and audit logs.
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="customer-label">Label (optional)</Label>
                            <Input
                                id="customer-label"
                                placeholder="e.g. Acme Corp — Production"
                                value={customerLabel}
                                onChange={(e) => setCustomerLabel(e.target.value)}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Human-readable name shown in your dashboard.
                            </p>
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200
                rounded-lg text-sm text-red-700">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                disabled={loading || !customerId.trim()}
                                onClick={handleIssue}
                            >
                                {loading ? "Issuing..." : "Issue Key"}
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
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Revoke?</span>
                <button
                    className="text-xs text-red-600 underline font-medium"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onRevoke(subKey.subKeyId);
                        setLoading(false);
                        setConfirming(false);
                    }}
                >
                    {loading ? "Revoking..." : "Yes"}
                </button>
                <button
                    className="text-xs text-gray-400 underline"
                    onClick={() => setConfirming(false)}
                >
                    No
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600
        transition-colors"
            title="Revoke key"
        >
            <Trash2 className="w-4 h-4" />
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!platform) {
        return (
            <EmptyState
                icon={Key}
                title="No platform set up"
                description="Set up AgentGate Connect first before issuing sub-keys."
                action={
                    <a href="/connect">
                        <Button>Go to Connect Setup</Button>
                    </a>
                }
            />
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sub-Keys</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {keys.length} active key{keys.length !== 1 ? "s" : ""} issued
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
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                </div>
            ) : keys.length === 0 ? (
                <EmptyState
                    icon={Key}
                    title="No sub-keys yet"
                    description="Issue your first sub-key to start governing a customer's agents."
                    action={
                        <IssueKeyDialog
                            platformId={platform.platformId}
                            onIssue={issueKey}
                        />
                    }
                />
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="text-xs font-semibold text-gray-600">
                                    Customer
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-gray-600">
                                    Sub-Key
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-gray-600">
                                    Total Calls
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-gray-600">
                                    Last Used
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-gray-600">
                                    Overrides
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-gray-600">
                                    Issued
                                </TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.map((key) => (
                                <TableRow key={key.subKeyId} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {key.customerLabel}
                                            </p>
                                            <p className="text-xs text-gray-400 font-mono">
                                                {key.customerId}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">
                                                {key.subKeyId.slice(0, 16)}...
                                            </code>
                                            <CopyButton text={key.subKeyId} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-gray-700">
                                            {key.totalCalls.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-gray-500">
                                            {key.lastUsedAt
                                                ? new Date(key.lastUsedAt).toLocaleDateString()
                                                : "Never"
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {key.hasPolicyOverrides && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded
                          text-xs bg-purple-100 text-purple-700 border border-purple-200">
                                                    Policy
                                                </span>
                                            )}
                                            {key.hasRateLimitOverride && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded
                          text-xs bg-blue-100 text-blue-700 border border-blue-200">
                                                    Rate limit
                                                </span>
                                            )}
                                            {!key.hasPolicyOverrides && !key.hasRateLimitOverride && (
                                                <span className="text-xs text-gray-400">Platform defaults</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-gray-500">
                                            {key.createdAt
                                                ? new Date(key.createdAt).toLocaleDateString()
                                                : "—"
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <RevokeButton subKey={key} onRevoke={revokeKey} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Info box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mt-6">
                <h3 className="text-sm font-semibold text-indigo-800 mb-2">
                    How sub-keys work
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-indigo-700">
                    <div>
                        <p className="font-medium mb-1">1. Issue a sub-key</p>
                        <p className="text-indigo-600">
                            Each customer gets a unique <code className="bg-indigo-100 px-1 rounded">
                                agc_</code> key tied to your platform.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium mb-1">2. Customer installs SDK</p>
                        <p className="text-indigo-600">
                            They use the key with <code className="bg-indigo-100 px-1 rounded">
                                agentgate</code> exactly like a regular API key.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium mb-1">3. You govern everything</p>
                        <p className="text-indigo-600">
                            Your platform policies apply to every agent call they make.
                            You see all activity here.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
