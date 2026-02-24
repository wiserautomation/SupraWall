"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyPlatformWebhook = exports.getConnectEvents = exports.getConnectAnalytics = exports.updateConnectKey = exports.listConnectKeys = exports.revokeConnectKey = exports.issueConnectKey = exports.updateBasePolicies = exports.getPlatform = exports.createPlatform = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const nanoid_1 = require("nanoid");
const db = admin.firestore();
// ── Create a Platform account ──────────────────────────────────────────────
exports.createPlatform = functions.https.onCall(async (data, context) => {
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
        throw new functions.https.HttpsError("already-exists", "You already have a platform account. Upgrade your plan to create additional platforms.");
    }
    const platformId = `plt_${(0, nanoid_1.nanoid)(16)}`;
    await db.collection("platforms").doc(platformId).set({
        platformId,
        ownerId: context.auth.uid,
        name: name.trim(),
        plan: "starter",
        createdAt: firestore_1.FieldValue.serverTimestamp(),
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { platformId };
});
// ── Get Platform details ───────────────────────────────────────────────────
exports.getPlatform = functions.https.onCall(async (data, context) => {
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
    return Object.assign(Object.assign({}, platform), { basePolicy: policySnap.exists ? policySnap.data() : null });
});
// ── Update Platform base policy ────────────────────────────────────────────
exports.updateBasePolicies = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }
    const { platformId, rules, rateLimit } = data;
    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }
    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || ((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    const updatePayload = {
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    };
    if (Array.isArray(rules))
        updatePayload.rules = rules;
    if (rateLimit)
        updatePayload.rateLimit = rateLimit;
    await db
        .collection("platforms")
        .doc(platformId)
        .collection("base_policies")
        .doc("default")
        .update(updatePayload);
    return { success: true };
});
// ── Issue a Connect sub-key for a customer ─────────────────────────────────
exports.issueConnectKey = functions.https.onCall(async (data, context) => {
    var _a, _b;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }
    const { platformId, customerId, customerLabel, policyOverrides, rateLimitOverride, } = data;
    if (!platformId || !customerId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId and customerId are required.");
    }
    // Verify platform ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists) {
        throw new functions.https.HttpsError("not-found", "Platform not found.");
    }
    if (((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    if (!((_b = platformSnap.data()) === null || _b === void 0 ? void 0 : _b.connectEnabled)) {
        throw new functions.https.HttpsError("failed-precondition", "AgentGate Connect is not enabled for this platform.");
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
        throw new functions.https.HttpsError("already-exists", `An active sub-key already exists for customer '${customerId}'. Revoke it first.`);
    }
    // Generate the sub-key
    const subKeyId = `agc_${(0, nanoid_1.nanoid)(24)}`;
    const subKeyData = {
        subKeyId,
        platformId,
        customerId,
        customerLabel: customerLabel !== null && customerLabel !== void 0 ? customerLabel : customerId,
        active: true,
        totalCalls: 0,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
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
        totalSubKeys: firestore_1.FieldValue.increment(1),
    });
    await batch.commit();
    return { subKeyId };
});
// ── Revoke a Connect sub-key ───────────────────────────────────────────────
exports.revokeConnectKey = functions.https.onCall(async (data, context) => {
    var _a;
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
    const { platformId } = subKeySnap.data();
    // Verify platform ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || ((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    await db.collection("connect_keys").doc(subKeyId).update({
        active: false,
        revokedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
// ── List all sub-keys for a platform ──────────────────────────────────────
exports.listConnectKeys = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }
    const { platformId, includeRevoked = false } = data;
    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }
    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || ((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    let query = db
        .collection("connect_keys")
        .where("platformId", "==", platformId)
        .orderBy("createdAt", "desc");
    if (!includeRevoked) {
        query = query.where("active", "==", true);
    }
    const snap = await query.limit(200).get();
    const keys = snap.docs.map((doc) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const d = doc.data();
        return {
            subKeyId: d.subKeyId,
            customerId: d.customerId,
            customerLabel: d.customerLabel,
            active: d.active,
            totalCalls: d.totalCalls,
            createdAt: (_d = (_c = (_b = (_a = d.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.toISOString()) !== null && _d !== void 0 ? _d : null,
            lastUsedAt: (_h = (_g = (_f = (_e = d.lastUsedAt) === null || _e === void 0 ? void 0 : _e.toDate) === null || _f === void 0 ? void 0 : _f.call(_e)) === null || _g === void 0 ? void 0 : _g.toISOString()) !== null && _h !== void 0 ? _h : null,
            hasPolicyOverrides: Array.isArray(d.policyOverrides) && d.policyOverrides.length > 0,
            hasRateLimitOverride: !!d.rateLimitOverride,
        };
    });
    return { keys };
});
// ── Update overrides for a specific sub-key ────────────────────────────────
exports.updateConnectKey = functions.https.onCall(async (data, context) => {
    var _a;
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
    const { platformId } = subKeySnap.data();
    // Verify ownership via platform
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || ((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    const updatePayload = {
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    };
    if (typeof customerLabel === "string")
        updatePayload.customerLabel = customerLabel;
    if (Array.isArray(policyOverrides))
        updatePayload.policyOverrides = policyOverrides;
    if (rateLimitOverride !== undefined)
        updatePayload.rateLimitOverride = rateLimitOverride;
    await db.collection("connect_keys").doc(subKeyId).update(updatePayload);
    return { success: true };
});
// ── Get usage analytics for a platform ────────────────────────────────────
exports.getConnectAnalytics = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }
    const { platformId, limitDays = 7 } = data;
    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }
    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || ((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    const since = new Date();
    since.setDate(since.getDate() - Math.min(limitDays, 90));
    const eventsSnap = await db
        .collection("connect_events")
        .where("platformId", "==", platformId)
        .where("timestamp", ">=", firestore_1.Timestamp.fromDate(since))
        .orderBy("timestamp", "desc")
        .limit(1000)
        .get();
    // Aggregate stats
    const byDecision = { ALLOW: 0, DENY: 0, REQUIRE_APPROVAL: 0 };
    const byCustomer = {};
    const byTool = {};
    let totalLatencyMs = 0;
    let latencyCount = 0;
    eventsSnap.docs.forEach((doc) => {
        var _a, _b, _c;
        const d = doc.data();
        byDecision[d.decision] = ((_a = byDecision[d.decision]) !== null && _a !== void 0 ? _a : 0) + 1;
        byCustomer[d.customerId] = ((_b = byCustomer[d.customerId]) !== null && _b !== void 0 ? _b : 0) + 1;
        byTool[d.toolName] = ((_c = byTool[d.toolName]) !== null && _c !== void 0 ? _c : 0) + 1;
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
exports.getConnectEvents = functions.https.onCall(async (data, context) => {
    var _a;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Login required.");
    }
    const { platformId, customerId, decision, limitDays = 1, pageSize = 50, } = data;
    if (!platformId) {
        throw new functions.https.HttpsError("invalid-argument", "platformId is required.");
    }
    // Verify ownership
    const platformSnap = await db.collection("platforms").doc(platformId).get();
    if (!platformSnap.exists || ((_a = platformSnap.data()) === null || _a === void 0 ? void 0 : _a.ownerId) !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Access denied.");
    }
    const since = new Date();
    since.setDate(since.getDate() - Math.min(limitDays, 90));
    let query = db
        .collection("connect_events")
        .where("platformId", "==", platformId)
        .where("timestamp", ">=", firestore_1.Timestamp.fromDate(since));
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
        var _a, _b, _c, _d, _e;
        const d = doc.data();
        return {
            eventId: doc.id,
            customerId: d.customerId,
            subKeyId: d.subKeyId,
            toolName: d.toolName,
            args: d.args,
            decision: d.decision,
            reason: (_a = d.reason) !== null && _a !== void 0 ? _a : null,
            latencyMs: d.latencyMs,
            timestamp: (_e = (_d = (_c = (_b = d.timestamp) === null || _b === void 0 ? void 0 : _b.toDate) === null || _c === void 0 ? void 0 : _c.call(_b)) === null || _d === void 0 ? void 0 : _d.toISOString()) !== null && _e !== void 0 ? _e : null,
        };
    });
    return { events };
});
// ── Webhook: notify platform on DENY / REQUIRE_APPROVAL ───────────────────
// This is triggered by a Firestore onCreate on connect_events,
// not a callable — it fires automatically after evaluateAction writes the event.
exports.notifyPlatformWebhook = functions.firestore
    .document("connect_events/{eventId}")
    .onCreate(async (snap) => {
    var _a, _b, _c, _d, _e;
    const event = snap.data();
    // Only fire webhook for non-ALLOW decisions
    if (event.decision === "ALLOW")
        return null;
    const platformSnap = await db
        .collection("platforms")
        .doc(event.platformId)
        .get();
    if (!platformSnap.exists)
        return null;
    const { webhookUrl } = platformSnap.data();
    if (!webhookUrl)
        return null;
    try {
        const payload = {
            event: "agentgate.policy_decision",
            decision: event.decision,
            platformId: event.platformId,
            customerId: event.customerId,
            subKeyId: event.subKeyId,
            toolName: event.toolName,
            reason: (_a = event.reason) !== null && _a !== void 0 ? _a : null,
            timestamp: (_e = (_d = (_c = (_b = event.timestamp) === null || _b === void 0 ? void 0 : _b.toDate) === null || _c === void 0 ? void 0 : _c.call(_b)) === null || _d === void 0 ? void 0 : _d.toISOString()) !== null && _e !== void 0 ? _e : new Date().toISOString(),
        };
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-AgentGate-Webhook": "1",
                // HMAC signature for webhook verification (platform can validate)
                "X-AgentGate-Signature": generateWebhookSignature(JSON.stringify(payload), event.platformId),
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000), // 5s timeout
        });
        if (!response.ok) {
            console.error(`[AgentGate] Webhook delivery failed for platform ${event.platformId}: ` +
                `HTTP ${response.status}`);
        }
    }
    catch (e) {
        // Non-fatal — webhook delivery failures must never affect policy evaluation
        console.error(`[AgentGate] Webhook error for platform ${event.platformId}:`, e);
    }
    return null;
});
// ── Helper: generate HMAC signature for webhook payloads ──────────────────
function generateWebhookSignature(payload, platformId) {
    var _a, _b;
    const crypto = require("crypto");
    // In production: store a per-platform webhook secret in Firestore or Secret Manager
    // For now: use platformId + a server-side salt from environment config
    const secret = `${platformId}_${(_b = (_a = functions.config().agentgate) === null || _a === void 0 ? void 0 : _a.webhook_salt) !== null && _b !== void 0 ? _b : "dev_salt"}`;
    return crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
}
//# sourceMappingURL=connect.js.map