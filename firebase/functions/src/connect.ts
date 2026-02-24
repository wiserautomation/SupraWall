import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { nanoid } from "nanoid";

const db = admin.firestore();

// ── Types ──────────────────────────────────────────────────────────────────

interface PolicyRule {
    toolPattern: string;
    action: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    conditions?: Record<string, any>;
}

interface RateLimitConfig {
    requestsPerMinute: number;
    requestsPerDay: number;
}

// ── Create a Platform account ──────────────────────────────────────────────

export const createPlatform = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const { name } = data;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new functions.https.HttpsError("invalid-argument", "Platform name is required.");
    }

    // Prevent duplicate platforms per user
    const existing = await db
        .collection("platforms")
        .where("ownerId", "==", context.auth.uid)
        .limit(1)
        .get();

    if (!existing.empty) {
        throw new functions.https.HttpsError(
            "already-exists",
            "You already have a platform account. Upgrade your plan to create additional platforms."
        );
    }

    const platformId = `plt_${nanoid(16)}`;

    await db.collection("platforms").doc(platformId).set({
        platformId,
        ownerId: context.auth.uid,
        name: name.trim(),
        plan: "starter",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        connectEnabled: true,
        totalSubKeys: 0,
        totalCalls: 0,
    });

    // Create default base policy — empty = allow all by default
    await db
        .collection("platforms")
        .doc(platformId)
        .collection("base_policies")
        .doc("default")
        .set({
            rules: [],
            rateLimit: { requestsPerMinute: 60, requestsPerDay: 10000 },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    return { platformId };
});

// ── Get Platform details ───────────────────────────────────────────────────

export const getPlatform = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const snap = await db
        .collection("platforms")
        .where("ownerId", "==", context.auth.uid)
        .limit(1)
        .get();

    if (snap.empty) {
        throw new functions.https.HttpsError("not-found", "No platform found for this account.");
    }

    const platform = snap.docs[0].data();

    // Also fetch base policy
    const policySnap = await db
        .collection("platforms")
        .doc(platform.platformId)
        .collection("base_policies")
        .doc("default")
        .get();

    return {
        ...platform,
        basePolicy: policySnap.exists ? policySnap.data() : null,
    };
});

// ── Update Platform base policy ────────────────────────────────────────────

export const updateBasePolicies = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const { platformId, rules, rateLimit } = data;

    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }

    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }

    const updatePayload: Record<string, any> = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (Array.isArray(rules)) updatePayload.rules = rules;
    if (rateLimit) updatePayload.rateLimit = rateLimit;

    await db
        .collection("platforms")
        .doc(platformId)
        .collection("base_policies")
        .doc("default")
        .update(updatePayload);

    return { success: true };
});

// ── Issue a Connect sub-key for a customer ─────────────────────────────────

export const issueConnectKey = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const {
        platformId,
        customerId,
        customerLabel,
        policyOverrides,
        rateLimitOverride,
    }: {
        platformId: string;
        customerId: string;
        customerLabel?: string;
        policyOverrides?: PolicyRule[];
        rateLimitOverride?: RateLimitConfig;
    } = data;

    if (!platformId || !customerId) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "platformId and customerId are required."
        );
    }

    // Verify platform ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists) {
        throw new functions.https.HttpsError("not-found", "Platform not found.");
    }
    if (platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    if (!platformSnap.data()?.connectEnabled) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "AgentGate Connect is not enabled for this platform."
        );
    }

    // Prevent duplicate sub-key for the same customerId under this platform
    const duplicateSnap = await db
        .collection("connect_keys")
        .where("platformId", "==", platformId)
        .where("customerId", "==", customerId)
        .where("active", "==", true)
        .limit(1)
        .get();

    if (!duplicateSnap.empty) {
        throw new functions.https.HttpsError(
            "already-exists",
            `An active sub-key already exists for customer '${customerId}'. Revoke it first.`
        );
    }

    // Generate the sub-key
    const subKeyId = `agc_${nanoid(24)}`;

    const subKeyData: Record<string, any> = {
        subKeyId,
        platformId,
        customerId,
        customerLabel: customerLabel ?? customerId,
        active: true,
        totalCalls: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUsedAt: null,
    };

    if (Array.isArray(policyOverrides) && policyOverrides.length > 0) {
        subKeyData.policyOverrides = policyOverrides;
    }
    if (rateLimitOverride) {
        subKeyData.rateLimitOverride = rateLimitOverride;
    }

    // Write sub-key and increment platform counter atomically
    const batch = db.batch();
    batch.set(db.collection("connect_keys").doc(subKeyId), subKeyData);
    batch.update(db.collection("platforms").doc(platformId), {
        totalSubKeys: admin.firestore.FieldValue.increment(1),
    });
    await batch.commit();

    return { subKeyId };
});

// ── Revoke a Connect sub-key ───────────────────────────────────────────────

export const revokeConnectKey = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const { subKeyId } = data;
    if (!subKeyId) {
        throw new functions.https.HttpsError("invalid-argument", "subKeyId is required.");
    }

    const subKeySnap = await db.collection("connect_keys").doc(subKeyId).get();
    if (!subKeySnap.exists) {
        throw new functions.https.HttpsError("not-found", "Sub-key not found.");
    }

    const { platformId } = subKeySnap.data()!;

    // Verify platform ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }

    await db.collection("connect_keys").doc(subKeyId).update({
        active: false,
        revokedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
});

// ── List all sub-keys for a platform ──────────────────────────────────────

export const listConnectKeys = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const { platformId, includeRevoked = false } = data;
    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }

    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }

    let query = db
        .collection("connect_keys")
        .where("platformId", "==", platformId)
        .orderBy("createdAt", "desc");

    if (!includeRevoked) {
        query = query.where("active", "==", true) as any;
    }

    const snap = await query.limit(200).get();

    const keys = snap.docs.map((doc) => {
        const d = doc.data();
        return {
            subKeyId: d.subKeyId,
            customerId: d.customerId,
            customerLabel: d.customerLabel,
            active: d.active,
            totalCalls: d.totalCalls,
            createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
            lastUsedAt: d.lastUsedAt?.toDate?.()?.toISOString() ?? null,
            hasPolicyOverrides: Array.isArray(d.policyOverrides) && d.policyOverrides.length > 0,
            hasRateLimitOverride: !!d.rateLimitOverride,
        };
    });

    return { keys };
});

// ── Update overrides for a specific sub-key ────────────────────────────────

export const updateConnectKey = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const { subKeyId, policyOverrides, rateLimitOverride, customerLabel } = data;
    if (!subKeyId) {
        throw new functions.https.HttpsError("invalid-argument", "subKeyId is required.");
    }

    const subKeySnap = await db.collection("connect_keys").doc(subKeyId).get();
    if (!subKeySnap.exists) {
        throw new functions.https.HttpsError("not-found", "Sub-key not found.");
    }

    const { platformId } = subKeySnap.data()!;

    // Verify ownership via platform
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }

    const updatePayload: Record<string, any> = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (typeof customerLabel === "string") updatePayload.customerLabel = customerLabel;
    if (Array.isArray(policyOverrides)) updatePayload.policyOverrides = policyOverrides;
    if (rateLimitOverride !== undefined) updatePayload.rateLimitOverride = rateLimitOverride;

    await db.collection("connect_keys").doc(subKeyId).update(updatePayload);

    return { success: true };
});

// ── Get usage analytics for a platform ────────────────────────────────────

export const getConnectAnalytics = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const { platformId, limitDays = 7 } = data;
    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }

    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }

    const since = new Date();
    since.setDate(since.getDate() - Math.min(limitDays, 90));

    const eventsSnap = await db
        .collection("connect_events")
        .where("platformId", "==", platformId)
        .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(since))
        .orderBy("timestamp", "desc")
        .limit(1000)
        .get();

    // Aggregate stats
    const byDecision: Record<string, number> = { ALLOW: 0, DENY: 0, REQUIRE_APPROVAL: 0 };
    const byCustomer: Record<string, number> = {};
    const byTool: Record<string, number> = {};
    let totalLatencyMs = 0;
    let latencyCount = 0;

    eventsSnap.docs.forEach((doc) => {
        const d = doc.data();
        byDecision[d.decision] = (byDecision[d.decision] ?? 0) + 1;
        byCustomer[d.customerId] = (byCustomer[d.customerId] ?? 0) + 1;
        byTool[d.toolName] = (byTool[d.toolName] ?? 0) + 1;
        if (typeof d.latencyMs === "number") {
            totalLatencyMs += d.latencyMs;
            latencyCount++;
        }
    });

    const topCustomers = Object.entries(byCustomer)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([customerId, calls]) => ({ customerId, calls }));

    const topTools = Object.entries(byTool)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([toolName, calls]) => ({ toolName, calls }));

    const avgLatencyMs = latencyCount > 0
        ? Math.round(totalLatencyMs / latencyCount)
        : 0;

    return {
        totalEvents: eventsSnap.size,
        byDecision,
        topCustomers,
        topTools,
        avgLatencyMs,
        periodDays: limitDays,
        since: since.toISOString(),
    };
});

// ── Get audit log events for a platform ───────────────────────────────────

export const getConnectEvents = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }

    const {
        platformId,
        customerId,
        decision,
        limitDays = 1,
        pageSize = 50,
    } = data;

    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }

    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || platformSnap.data()?.ownerId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }

    const since = new Date();
    since.setDate(since.getDate() - Math.min(limitDays, 90));

    let query: admin.firestore.Query = db
        .collection("connect_events")
        .where("platformId", "==", platformId)
        .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(since));

    // Optional filters
    if (customerId) {
        query = query.where("customerId", "==", customerId);
    }
    if (decision && ["ALLOW", "DENY", "REQUIRE_APPROVAL"].includes(decision)) {
        query = query.where("decision", "==", decision);
    }

    const eventsSnap = await query
        .orderBy("timestamp", "desc")
        .limit(Math.min(pageSize, 200))
        .get();

    const events = eventsSnap.docs.map((doc) => {
        const d = doc.data();
        return {
            eventId: doc.id,
            customerId: d.customerId,
            subKeyId: d.subKeyId,
            toolName: d.toolName,
            args: d.args,
            decision: d.decision,
            reason: d.reason ?? null,
            latencyMs: d.latencyMs,
            timestamp: d.timestamp?.toDate?.()?.toISOString() ?? null,
        };
    });

    return { events };
});

// ── Webhook: notify platform on DENY / REQUIRE_APPROVAL ───────────────────
// This is triggered by a Firestore onCreate on connect_events,
// not a callable — it fires automatically after evaluateAction writes the event.

export const notifyPlatformWebhook = functions.firestore
    .document("connect_events/{eventId}")
    .onCreate(async (snap) => {
        const event = snap.data();

        // Only fire webhook for non-ALLOW decisions
        if (event.decision === "ALLOW") return null;

        const platformSnap = await db
            .collection("platforms")
            .doc(event.platformId)
            .get();

        if (!platformSnap.exists) return null;

        const { webhookUrl } = platformSnap.data()!;
        if (!webhookUrl) return null;

        try {
            const payload = {
                event: "agentgate.policy_decision",
                decision: event.decision,
                platformId: event.platformId,
                customerId: event.customerId,
                subKeyId: event.subKeyId,
                toolName: event.toolName,
                reason: event.reason ?? null,
                timestamp: event.timestamp?.toDate?.()?.toISOString() ?? new Date().toISOString(),
            };

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-AgentGate-Webhook": "1",
                    // HMAC signature for webhook verification (platform can validate)
                    "X-AgentGate-Signature": generateWebhookSignature(
                        JSON.stringify(payload),
                        event.platformId
                    ),
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(5000), // 5s timeout
            });

            if (!response.ok) {
                console.error(
                    `[AgentGate] Webhook delivery failed for platform ${event.platformId}: ` +
                    `HTTP ${response.status}`
                );
            }
        } catch (e) {
            // Non-fatal — webhook delivery failures must never affect policy evaluation
            console.error(
                `[AgentGate] Webhook error for platform ${event.platformId}:`, e
            );
        }

        return null;
    });

// ── Helper: generate HMAC signature for webhook payloads ──────────────────

function generateWebhookSignature(payload: string, platformId: string): string {
    const crypto = require("crypto");
    // In production: store a per-platform webhook secret in Firestore or Secret Manager
    // For now: use platformId + a server-side salt from environment config
    const secret = `${platformId}_${functions.config().agentgate?.webhook_salt ?? "dev_salt"}`;
    return crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
}
