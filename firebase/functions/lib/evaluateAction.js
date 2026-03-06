"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePolicyRegex = exports.evaluateAction = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const genai_1 = require("@google/genai");
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.evaluateAction = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    const body = req.body;
    const apiKey = body.apiKey;
    const toolName = body.toolName;
    const args = body.args;
    const sessionId = body.sessionId || null;
    const agentRole = body.agentRole || null;
    const startTime = Date.now();
    if (!apiKey || !toolName || args === undefined) {
        res.status(400).json({ error: "apiKey and toolName are required." });
        return;
    }
    try {
        // ── Route: Connect sub-key (agc_) ──────────────────────────────────────
        if (apiKey.startsWith("agc_")) {
            const subKeySnap = await db.collection("connect_keys").doc(apiKey).get();
            if (!subKeySnap.exists || !((_a = subKeySnap.data()) === null || _a === void 0 ? void 0 : _a.active)) {
                res.status(401).json({ error: "Invalid or inactive Connect sub-key." });
                return;
            }
            const subKey = subKeySnap.data();
            const { platformId, customerId, policyOverrides, rateLimitOverride } = subKey;
            // Get platform owner to track billing
            const platformSnap = await db.collection("platforms").doc(platformId).get();
            const platformData = platformSnap.data();
            const ownerId = platformData === null || platformData === void 0 ? void 0 : platformData.ownerId;
            // Load platform base policies
            const basePolicySnap = await db
                .collection("platforms")
                .doc(platformId)
                .collection("base_policies")
                .doc("default")
                .get();
            const baseRules = (_c = (_b = basePolicySnap.data()) === null || _b === void 0 ? void 0 : _b.rules) !== null && _c !== void 0 ? _c : [];
            const baseRateLimit = (_e = (_d = basePolicySnap.data()) === null || _d === void 0 ? void 0 : _d.rateLimit) !== null && _e !== void 0 ? _e : {
                requestsPerMinute: 60,
                requestsPerDay: 10000,
            };
            // Merge: customer overrides WIN over platform base rules
            const effectiveRules = [
                ...(policyOverrides !== null && policyOverrides !== void 0 ? policyOverrides : []),
                ...baseRules,
            ];
            const effectiveRateLimit = rateLimitOverride !== null && rateLimitOverride !== void 0 ? rateLimitOverride : baseRateLimit;
            // Rate limit check
            const rateLimitResult = await checkRateLimit(apiKey, effectiveRateLimit);
            if (!rateLimitResult.allowed) {
                res.status(429).json({ decision: "DENY", reason: "Rate limit exceeded." });
                return;
            }
            // Policy evaluation
            const decision = evaluatePolicies(toolName, args, effectiveRules);
            // Cost estimation
            const estimatedCost = estimateActionCost(args, toolName);
            const latencyMs = Date.now() - startTime;
            // Update usage counters and write audit log (non-blocking)
            const updates = [
                db.collection("connect_keys").doc(apiKey).update({
                    lastUsedAt: firestore_1.FieldValue.serverTimestamp(),
                    totalCalls: firestore_1.FieldValue.increment(1),
                    totalSpendUsd: firestore_1.FieldValue.increment(estimatedCost),
                }),
                db.collection("connect_events").add({
                    platformId,
                    subKeyId: apiKey,
                    customerId,
                    toolName,
                    args: sanitizeArgs(args),
                    decision: decision.decision,
                    reason: (_f = decision.reason) !== null && _f !== void 0 ? _f : null,
                    latencyMs,
                    costUsd: estimatedCost,
                    timestamp: firestore_1.FieldValue.serverTimestamp(),
                })
            ];
            // If we found an owner, increment their monthly billing counter
            if (ownerId) {
                updates.push(db.collection("organizations").doc(ownerId).update({
                    operationsThisMonth: firestore_1.FieldValue.increment(1),
                    lastUsedAt: firestore_1.FieldValue.serverTimestamp(),
                }).catch(err => {
                    // If document doesn't exist yet, we might need to set it, 
                    // but usually it's created on first login/stripe sync.
                    console.warn(`Failed to update organization ${ownerId}:`, err.message);
                }));
            }
            Promise.all(updates).catch((e) => console.error("agentgate: Non-critical write failed:", e));
            res.status(200).json(Object.assign(Object.assign({}, decision), { estimated_cost_usd: estimatedCost }));
            return;
        }
        // ── Route: Regular single-tenant key (ag_) ─────────────────────────────
        if (apiKey.startsWith("ag_") || !apiKey.startsWith("agc_")) {
            const argsString = typeof args === 'string' ? args : JSON.stringify(args);
            // 1. Find the agent by apiKey
            const agentsSnapshot = await db.collection("agents").where("apiKey", "==", apiKey).limit(1).get();
            if (agentsSnapshot.empty) {
                await logAudit("unknown", toolName, argsString, "DENY", 0, "Invalid API Key", sessionId, agentRole);
                res.status(403).json({ decision: "DENY", reason: "Invalid API Key" });
                return;
            }
            const agentDoc = agentsSnapshot.docs[0];
            const agentId = agentDoc.id;
            const userId = agentDoc.data().userId;
            // 2. Query policies for this agent and toolName
            const policiesSnapshot = await db.collection("policies")
                .where("agentId", "==", agentId)
                .where("toolName", "==", toolName)
                .get();
            let finalDecision = "ALLOW";
            // 3. Evaluate policies against regex conditions
            for (const doc of policiesSnapshot.docs) {
                const policy = doc.data();
                const conditionRegex = new RegExp(policy.condition);
                if (conditionRegex.test(argsString)) {
                    finalDecision = policy.ruleType;
                    // If DENY is encountered, we can stop evaluating
                    if (finalDecision === "DENY") {
                        break;
                    }
                }
            }
            // 4. Log the audit event
            const estimatedCost = estimateActionCost(args, toolName);
            // 5. Update usage counters (non-blocking)
            const updates = [
                logAudit(agentId, toolName, argsString, finalDecision, estimatedCost, null, sessionId, agentRole)
            ];
            if (userId) {
                updates.push(db.collection("organizations").doc(userId).update({
                    operationsThisMonth: firestore_1.FieldValue.increment(1),
                    lastUsedAt: firestore_1.FieldValue.serverTimestamp(),
                }).catch(err => console.warn(`Failed to update organization ${userId}:`, err.message)));
            }
            Promise.all(updates).catch(e => console.error("Audit/Usage update failed:", e));
            // 6. Return the decision
            res.status(200).json({ decision: finalDecision, estimated_cost_usd: estimatedCost });
            return;
        }
    }
    catch (e) {
        console.error("agentgate evaluateAction error:", e);
        res.status(500).json({ error: "Internal agentgate error.", decision: "DENY" });
    }
});
// ── Connect Helpers ────────────────────────────────────────────────────────
function evaluatePolicies(toolName, args, rules) {
    var _a;
    for (const rule of rules) {
        if (matchesPattern(toolName, rule.toolPattern)) {
            return { decision: rule.action, reason: (_a = rule.conditions) === null || _a === void 0 ? void 0 : _a.reason };
        }
    }
    // Default: ALLOW if no rule matches
    return { decision: "ALLOW" };
}
function matchesPattern(toolName, pattern) {
    if (pattern === "*")
        return true;
    if (pattern.endsWith("*")) {
        return toolName.startsWith(pattern.slice(0, -1));
    }
    return toolName === pattern;
}
async function checkRateLimit(key, config) {
    var _a, _b, _c, _d;
    const now = new Date();
    const minuteKey = `${key}_${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}${now.getUTCHours()}${now.getUTCMinutes()}`;
    const dayKey = `${key}_${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}`;
    const batch = db.batch();
    const minuteRef = db.collection("rate_limit_counters").doc(minuteKey);
    const dayRef = db.collection("rate_limit_counters").doc(dayKey);
    const [minuteSnap, daySnap] = await Promise.all([
        minuteRef.get(),
        dayRef.get(),
    ]);
    const minuteCount = (_b = (_a = minuteSnap.data()) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
    const dayCount = (_d = (_c = daySnap.data()) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
    if (minuteCount >= config.requestsPerMinute || dayCount >= config.requestsPerDay) {
        return { allowed: false };
    }
    batch.set(minuteRef, { count: minuteCount + 1, expiresAt: new Date(Date.now() + 60000) }, { merge: true });
    batch.set(dayRef, { count: dayCount + 1, expiresAt: new Date(Date.now() + 86400000) }, { merge: true });
    await batch.commit();
    return { allowed: true };
}
/**
 * Rough estimation of agentic 'overhead' cost for a tool call.
 * Based on argument payload size using 1 token ≈ 4 chars.
 * Price base: $0.15/1M tokens (GPT-4o-mini rates) + small fixed base cost.
 */
function estimateActionCost(args, toolName) {
    const payloadLength = JSON.stringify(args || {}).length + toolName.length;
    const tokens = Math.ceil(payloadLength / 4) + 50; // +50 tokens for tool overhead
    const costPerToken = 0.00000015; // $0.15 per 1M tokens
    return parseFloat((tokens * costPerToken).toFixed(8));
}
function sanitizeArgs(args) {
    if (!args || typeof args !== "object")
        return args;
    const secretFields = ["password", "token", "secret", "key", "apiKey", "api_key", "authorization"];
    const sanitized = Object.assign({}, args);
    for (const field of secretFields) {
        if (field in sanitized)
            sanitized[field] = "[REDACTED]";
    }
    return sanitized;
}
async function logAudit(agentId, toolName, args, decision, costUsd = 0, reason = null, sessionId = null, agentRole = null) {
    try {
        await db.collection("audit_logs").add({
            agentId,
            toolName,
            arguments: args,
            decision,
            reason,
            sessionId,
            agentRole,
            cost_usd: costUsd,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
    }
    catch (error) {
        console.error("Failed to log audit event:", error);
    }
}
exports.generatePolicyRegex = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    var _a;
    if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const { prompt, toolName } = request.body;
        if (!prompt || !toolName) {
            response.status(400).json({ error: "Missing required fields: prompt, toolName" });
            return;
        }
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are an expert cybersecurity engineer. The user wants to restrict an AI agent using the tool '${toolName}'. They will describe the restriction in plain English: '${prompt}'. Return ONLY a raw Regular Expression string that matches the user's intent. Do not include markdown formatting, backticks, or explanations. If they want to BLOCK something, write a regex that matches the blocked pattern. If they want to ONLY ALLOW something, write a regex that matches the allowed pattern.`;
        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
        });
        let regexString = ((_a = aiResponse.text) === null || _a === void 0 ? void 0 : _a.trim()) || ".*";
        // Remove markdown formatting if the model slipped it in
        if (regexString.startsWith("\`\`\`")) {
            regexString = regexString.replace(/\`\`\`(regex)?/gi, "").trim();
        }
        response.status(200).json({ regex: regexString });
        return;
    }
    catch (error) {
        console.error("Error generating regex via Gemini:", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
//# sourceMappingURL=evaluateAction.js.map