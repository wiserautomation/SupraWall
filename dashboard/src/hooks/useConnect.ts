import { useState, useEffect, useCallback } from "react";
import { app } from "@/lib/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import type {
    Platform,
    ConnectKey,
    ConnectEvent,
    ConnectAnalytics,
    PolicyRule,
    RateLimitConfig,
} from "@/types/connect";

const getFunctionsInstance = () => {
    if (!app) return null;
    const functions = getFunctions(app, "us-central1");
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }
    return functions;
};

const functions = getFunctionsInstance();

export function usePlatform() {
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlatform = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fn = httpsCallable(functions!, "getPlatform");
            const result = await fn({});
            setPlatform(result.data as Platform);
        } catch (e: any) {
            if (e?.code === "not-found") {
                setPlatform(null); // No platform yet — show setup screen
            } else {
                setError(e?.message ?? "Failed to load platform.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPlatform(); }, [fetchPlatform]);

    const createPlatform = async (name: string) => {
        const fn = httpsCallable(functions!, "createPlatform");
        const result = await fn({ name });
        await fetchPlatform();
        return result.data;
    };

    const updateBasePolicies = async (
        platformId: string,
        rules: PolicyRule[],
        rateLimit: RateLimitConfig
    ) => {
        const fn = httpsCallable(functions!, "updateBasePolicies");
        await fn({ platformId, rules, rateLimit });
        await fetchPlatform();
    };

    return { platform, loading, error, refetch: fetchPlatform, createPlatform, updateBasePolicies };
}

export function useConnectKeys(platformId: string | undefined) {
    const [keys, setKeys] = useState<ConnectKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchKeys = useCallback(async () => {
        if (!platformId || !functions) return;
        setLoading(true);
        setError(null);
        try {
            const fn = httpsCallable(functions!, "listConnectKeys");
            const result = await fn({ platformId });
            setKeys((result.data as any).keys);
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
        const fn = httpsCallable(functions!, "issueConnectKey");
        const result = await fn(params);
        await fetchKeys();
        return (result.data as any).subKeyId as string;
    };

    const revokeKey = async (subKeyId: string) => {
        const fn = httpsCallable(functions!, "revokeConnectKey");
        await fn({ subKeyId });
        await fetchKeys();
    };

    return { keys, loading, error, refetch: fetchKeys, issueKey, revokeKey };
}

export function useConnectAnalytics(platformId: string | undefined, days = 7) {
    const [analytics, setAnalytics] = useState<ConnectAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!platformId || !functions) return;
        setLoading(true);
        const fn = httpsCallable(functions!, "getConnectAnalytics");
        fn({ platformId, limitDays: days })
            .then((r) => setAnalytics(r.data as ConnectAnalytics))
            .catch((e) => setError(e?.message ?? "Failed to load analytics."))
            .finally(() => setLoading(false));
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
        if (!platformId || !functions) return;
        setLoading(true);
        const fn = httpsCallable(functions!, "getConnectEvents");
        fn({ platformId, ...filters })
            .then((r) => setEvents((r.data as any).events))
            .catch((e) => setError(e?.message ?? "Failed to load events."))
            .finally(() => setLoading(false));
    }, [platformId, filters?.customerId, filters?.decision, filters?.limitDays]);

    return { events, loading, error };
}
