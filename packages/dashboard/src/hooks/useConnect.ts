// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import type {
    Platform,
    ConnectKey,
    ConnectEvent,
    ConnectAnalytics,
    PolicyRule,
    RateLimitConfig,
} from "@/types/connect";



export function usePlatform() {
    const [user] = useAuthState(auth);
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlatform = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/platforms?userId=${user.uid}`);
            if (response.status === 404) {
                setPlatform(null);
            } else if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to load platform.");
            } else {
                const data = await response.json();
                setPlatform(data as Platform);
            }
        } catch (e: any) {
            setError(e?.message ?? "Failed to load platform.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchPlatform(); }, [fetchPlatform]);

    const createPlatform = async (name: string) => {
        if (!user) throw new Error("Not authenticated");
        const response = await fetch("/api/v1/platforms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.uid, name })
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to create platform.");
        }
        
        await fetchPlatform();
        return await response.json();
    };

    const updateBasePolicies = async (
        platformId: string,
        rules: PolicyRule[],
        rateLimit: RateLimitConfig
    ) => {
        // Mocked policy update logic
        console.log("Updating base policies (Mock):", { platformId, rules, rateLimit });
        await fetchPlatform();
    };

    return { platform, loading, error, refetch: fetchPlatform, createPlatform, updateBasePolicies };
}

export function useConnectKeys(platformId: string | undefined) {
    const [keys, setKeys] = useState<ConnectKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchKeys = useCallback(async () => {
        if (!platformId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/v1/platforms/keys?platformId=${platformId}`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to load keys.");
            }
            const data = await response.json();
            setKeys(data.keys);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load keys.");
        } finally {
            setLoading(false);
        }
    }, [platformId]);

    useEffect(() => { fetchKeys(); }, [fetchKeys]);

    const issueKey = async (params: {
        platformId: string;
        customerId: string;
        customerLabel?: string;
        policyOverrides?: PolicyRule[];
        rateLimitOverride?: RateLimitConfig;
    }) => {
        const response = await fetch("/api/v1/platforms/keys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to issue key.");
        }
        
        await fetchKeys();
        const data = await response.json();
        return data.subKeyId as string;
    };

    const revokeKey = async (subKeyId: string) => {
        const response = await fetch(`/api/v1/platforms/keys?subKeyId=${subKeyId}`, {
            method: "DELETE"
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to revoke key.");
        }
        await fetchKeys();
    };

    return { keys, loading, error, refetch: fetchKeys, issueKey, revokeKey };
}

export function useConnectAnalytics(platformId: string | undefined, days = 7) {
    const [analytics, setAnalytics] = useState<ConnectAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!platformId) return;
        setLoading(true);
        
        // Mock analytics data for now to prevent UI crashes
        const mockAnalytics: ConnectAnalytics = {
            totalEvents: 0,
            byDecision: { ALLOW: 0, DENY: 0, REQUIRE_APPROVAL: 0 },
            topCustomers: [],
            topTools: [],
            avgLatencyMs: 0,
            periodDays: days,
            since: new Date().toISOString()
        };
        
        setAnalytics(mockAnalytics);
        setLoading(false);
    }, [platformId, days]);

    return { analytics, loading, error };
}

export function useConnectEvents(platformId: string | undefined, filters?: {
    customerId?: string;
    decision?: string;
    limitDays?: number;
}) {
    const [events, setEvents] = useState<ConnectEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!platformId) return;
        setLoading(true);
        setEvents([]);
        setLoading(false);
    }, [platformId, filters?.customerId, filters?.decision, filters?.limitDays]);

    return { events, loading, error };
}
