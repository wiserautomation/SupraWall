"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePolicyRegex = exports.evaluateAction = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const genai_1 = require("@google/genai");
const crypto = require("crypto");
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
    const model = body.model || "gpt-4o-mini";
    const inputTokens = body.inputTokens || 0;
    const outputTokens = body.outputTokens || 0;
    const clientReportedCost = body.costUsd || null;
    const isLoopDetectedByClient = body.isLoop || false;
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
            const estimatedCost = clientReportedCost !== null && clientReportedCost !== void 0 ? clientReportedCost : estimateActionCost(args, toolName, model, inputTokens, outputTokens);
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
                    isLoop: isLoopDetectedByClient,
                    timestamp: firestore_1.FieldValue.serverTimestamp(),
                }),
                // ── Global Stats Update (for ROI Counter) ──
                db.collection("global_stats").doc("aggregate").update({
                    totalInteractions: firestore_1.FieldValue.increment(1),
                    totalDollarsSaved: decision.decision === "DENY" ? firestore_1.FieldValue.increment(2.50) : firestore_1.FieldValue.increment(0),
                    rogueActionsBlocked: decision.decision === "DENY" ? firestore_1.FieldValue.increment(1) : firestore_1.FieldValue.increment(0),
                }).catch(() => {
                    // Fallback to set if doc doesn't exist
                    db.collection("global_stats").doc("aggregate").set({
                        totalInteractions: 1,
                        totalDollarsSaved: decision.decision === "DENY" ? 2.50 : 0,
                        rogueActionsBlocked: decision.decision === "DENY" ? 1 : 0
                    }, { merge: true });
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
            const agentData = agentDoc.data();
            // ── 1.5 Agent Status Check ──
            if (agentData.status && agentData.status !== 'active') {
                await logAudit(agentId, toolName, argsString, "DENY", 0, `Agent is ${agentData.status}`, sessionId, agentRole);
                res.status(403).json({ decision: "DENY", reason: `Agent is ${agentData.status}. Contact your administrator.` });
                return;
            }
            // ── 1.6 Scope Enforcement (Principle of Least Privilege) ──
            const agentScopes = agentData.scopes;
            if (agentScopes && agentScopes.length > 0) {
                const hasScope = agentScopes.some(scope => {
                    if (scope === '*:*')
                        return true; // wildcard: all access
                    const [ns, action] = scope.split(':');
                    if (action === '*') {
                        // namespace wildcard: e.g. "crm:*" matches "crm:read", "crm:write"
                        return toolName.startsWith(ns + ':') || toolName.startsWith(ns + '_');
                    }
                    // exact match or prefix match (e.g., scope "email:send" matches tool "email:send" or "email_send")
                    return toolName === scope || toolName === `${ns}_${action}`;
                });
                if (!hasScope) {
                    const reason = `Agent lacks scope for tool '${toolName}'. Granted scopes: [${agentScopes.join(', ')}]`;
                    await logAudit(agentId, toolName, argsString, "DENY", 0, reason, sessionId, agentRole);
                    res.status(403).json({ decision: "DENY", reason });
                    return;
                }
            }
            // ── 1.7 Scope Limits Enforcement (Per-Scope Rate Limiting) ──
            const scopeLimits = agentData.scopeLimits;
            if (scopeLimits) {
                // Find the matching scope limit for this tool
                const matchingLimit = Object.entries(scopeLimits).find(([scopeKey]) => {
                    if (scopeKey === '*:*')
                        return true;
                    const [ns, action] = scopeKey.split(':');
                    if (action === '*') {
                        return toolName.startsWith(ns + ':') || toolName.startsWith(ns + '_');
                    }
                    return toolName === scopeKey || toolName === `${ns}_${action}`;
                });
                if (matchingLimit) {
                    const [scopeKey, limits] = matchingLimit;
                    // Check each time-window limit
                    const timeWindows = [
                        { key: 'max_per_minute', label: 'minute', ms: 60 * 1000 },
                        { key: 'max_per_hour', label: 'hour', ms: 60 * 60 * 1000 },
                        { key: 'max_per_day', label: 'day', ms: 24 * 60 * 60 * 1000 },
                    ];
                    for (const tw of timeWindows) {
                        const maxCalls = limits[tw.key];
                        if (maxCalls !== undefined && maxCalls !== null) {
                            const since = new Date(Date.now() - tw.ms);
                            const recentCalls = await db.collection("audit_logs")
                                .where("agentId", "==", agentId)
                                .where("toolName", "==", toolName)
                                .where("decision", "==", "ALLOW")
                                .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(since))
                                .count()
                                .get();
                            const count = recentCalls.data().count;
                            if (count >= maxCalls) {
                                const reason = `Scope limit exceeded for '${scopeKey}': ${count}/${maxCalls} calls per ${tw.label}. Try again later.`;
                                await logAudit(agentId, toolName, argsString, "DENY", 0, reason, sessionId, agentRole);
                                res.status(429).json({ decision: "DENY", reason });
                                return;
                            }
                        }
                    }
                }
            }
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
            // 4. Cost estimation (moved up)
            const estimatedCost = clientReportedCost !== null && clientReportedCost !== void 0 ? clientReportedCost : estimateActionCost(args, toolName, model, inputTokens, outputTokens);
            // ── 5. Handle Approval Flow ──
            if (finalDecision === "REQUIRE_APPROVAL") {
                // Check if an identical pending request already exists for this agent
                const existingReq = await db.collection("approvalRequests")
                    .where("agentId", "==", agentId)
                    .where("toolName", "==", toolName)
                    .where("arguments", "==", argsString)
                    .where("status", "==", "pending")
                    .limit(1)
                    .get();
                let requestId;
                if (!existingReq.empty) {
                    requestId = existingReq.docs[0].id;
                }
                else {
                    const newReq = await db.collection("approvalRequests").add({
                        userId, // shared with the organization owner
                        agentId,
                        agentName: agentData.name || "Unknown Agent",
                        toolName,
                        arguments: argsString,
                        sessionId,
                        agentRole,
                        status: "pending",
                        createdAt: firestore_1.FieldValue.serverTimestamp(),
                        expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24h
                        estimatedCostUsd: estimatedCost
                    });
                    requestId = newReq.id;
                    // ── Trigger Slack Notification ──
                    const orgSnap = await db.collection("organizations").doc(userId).get();
                    const orgData = orgSnap.data();
                    const slackUrl = orgData === null || orgData === void 0 ? void 0 : orgData.slackWebhookUrl;
                    const contactEmail = (orgData === null || orgData === void 0 ? void 0 : orgData.contactEmail) || (orgData === null || orgData === void 0 ? void 0 : orgData.email);
                    if (slackUrl) {
                        try {
                            await sendSlackNotification(slackUrl, {
                                requestId,
                                agentName: agentData.name || "Unknown Agent",
                                toolName,
                                arguments: argsString,
                                estimatedCost
                            });
                        }
                        catch (err) {
                            console.error("[AgentGate] Slack notification failed:", err);
                        }
                    }
                    // ── Trigger Email Alert ──
                    if (contactEmail && (orgData === null || orgData === void 0 ? void 0 : orgData.emailAlertsEnabled) !== false) {
                        try {
                            await sendEmailNotification(contactEmail, {
                                requestId,
                                agentName: agentData.name || "Unknown Agent",
                                toolName,
                                arguments: argsString,
                                estimatedCost
                            });
                        }
                        catch (err) {
                            console.error("[AgentGate] Email alert failed:", err);
                        }
                    }
                }
                await logAudit(agentId, toolName, argsString, "PAUSED", estimatedCost, "Awaiting human approval", sessionId, agentRole);
                res.json({ decision: "REQUIRE_APPROVAL", reason: "This action requires human approval.", requestId });
                return;
            }
            // 6. Update usage counters (non-blocking)
            const updates = [
                logAudit(agentId, toolName, argsString, finalDecision, estimatedCost, null, sessionId, agentRole, isLoopDetectedByClient)
            ];
            if (userId) {
                updates.push(db.collection("organizations").doc(userId).update({
                    operationsThisMonth: firestore_1.FieldValue.increment(1),
                    lastUsedAt: firestore_1.FieldValue.serverTimestamp(),
                }).catch(err => console.warn(`Failed to update organization ${userId}:`, err.message)));
            }
            // Also update agent level stats
            updates.push(db.collection("agents").doc(agentId).update({
                totalCalls: firestore_1.FieldValue.increment(1),
                totalSpendUsd: firestore_1.FieldValue.increment(estimatedCost),
                lastUsedAt: firestore_1.FieldValue.serverTimestamp()
            }).catch(err => console.warn(`Failed to update agent ${agentId}:`, err.message)));
            Promise.all(updates).catch(e => console.error("Audit/Usage update failed:", e));
            // 6. Return the decision
            res.status(200).json({
                decision: finalDecision,
                estimated_cost_usd: estimatedCost,
                is_loop: isLoopDetectedByClient
            });
            return;
        }
    }
    catch (e) {
        console.error("AgentGate evaluateAction error:", e);
        res.status(500).json({ error: "Internal AgentGate error.", decision: "DENY" });
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
 * Enhanced estimation of agentic 'overhead' cost for a tool call.
 */
function estimateActionCost(args, toolName, model = "gpt-4o-mini", inTokens = 0, outTokens = 0) {
    // If tokens provided, use them
    if (inTokens > 0 || outTokens > 0) {
        const rates = {
            "gpt-4o": { in: 0.005, out: 0.015 },
            "gpt-4o-mini": { in: 0.00015, out: 0.0006 },
            "claude-3-5-sonnet": { in: 0.003, out: 0.015 },
            "gemini-1.5-pro": { in: 0.00125, out: 0.005 },
        };
        const key = Object.keys(rates).find(k => model.toLowerCase().includes(k)) || "gpt-4o-mini";
        const rate = rates[key];
        return (inTokens / 1000 * rate.in) + (outTokens / 1000 * rate.out);
    }
    // Heuristic fallback
    const payloadLength = JSON.stringify(args || {}).length + toolName.length;
    const tokens = Math.ceil(payloadLength / 4) + 50; // +50 tokens for tool overhead
    const costPerToken = 0.00000015; // $0.15 per 1M tokens
    return parseFloat((tokens * costPerToken).toFixed(8));
}
async function sendSlackNotification(url, data) {
    const dashboardUrl = "https://agent-gate.vercel.app/approvals";
    // Slack Block Kit message for a premium look
    const payload = {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🛡️ AgentGate: Action Approval Required",
                    emoji: true
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Agent:* ${data.agentName}\n*Tool:* \`${data.toolName}\`\n*Estimated Cost:* $${data.estimatedCost.toFixed(4)}`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Arguments:*\n\`\`\`${data.arguments.slice(0, 1000)}${data.arguments.length > 1000 ? '...' : ''}\`\`\``
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Review in Dashboard",
                            emoji: true
                        },
                        url: dashboardUrl,
                        style: "primary",
                        action_id: "review_action"
                    }
                ]
            }
        ]
    };
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
    }
}
async function sendEmailNotification(email, data) {
    console.log(`[AgentGate] 📧 Sending email alert to ${email} for request ${data.requestId}`);
    // In production, use @sendgrid/mail or resend here.
    // This demonstrates the integration hook.
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
// ── Forensic Risk Scoring ───────────────────────────────────────────────
const HIGH_RISK_TOOLS = ['delete', 'drop', 'remove', 'destroy', 'execute', 'eval', 'exec', 'sudo', 'admin', 'transfer', 'payment', 'withdraw'];
const SENSITIVE_ARG_PATTERNS = [/password/i, /secret/i, /token/i, /api.?key/i, /authorization/i, /credit.?card/i, /ssn/i, /\broot\b/i, /\/etc\//i];
function computeRiskScore(toolName, args, decision, costUsd, isLoop) {
    let score = 0;
    const factors = [];
    // Tool name sensitivity
    const toolLower = toolName.toLowerCase();
    if (HIGH_RISK_TOOLS.some(t => toolLower.includes(t))) {
        score += 35;
        factors.push(`High-risk tool pattern: '${toolName}'`);
    }
    // Decision-based risk
    if (decision === 'DENY') {
        score += 25;
        factors.push('Action was denied by policy');
    }
    else if (decision === 'PAUSED' || decision === 'REQUIRE_APPROVAL') {
        score += 15;
        factors.push('Action required human approval');
    }
    // Cost-based risk
    if (costUsd > 0.10) {
        score += 15;
        factors.push(`High estimated cost: $${costUsd.toFixed(4)}`);
    }
    else if (costUsd > 0.01) {
        score += 5;
        factors.push(`Moderate cost: $${costUsd.toFixed(4)}`);
    }
    // Argument sensitivity scan
    for (const pattern of SENSITIVE_ARG_PATTERNS) {
        if (pattern.test(args)) {
            score += 10;
            factors.push(`Sensitive data pattern detected in arguments`);
            break; // only count once
        }
    }
    // Loop detection
    if (isLoop) {
        score += 20;
        factors.push('Detected as part of a loop pattern');
    }
    // Payload size risk
    if (args.length > 5000) {
        score += 5;
        factors.push(`Large payload: ${args.length} chars`);
    }
    return { score: Math.min(score, 100), factors };
}
// ── Forensic Audit Logger (Tamper-Proof Hash Chain) ─────────────────────
let _lastHash = 'GENESIS'; // In-memory cache of last hash for chain linking
let _sequenceCounter = 0;
async function logAudit(agentId, toolName, args, decision, costUsd = 0, reason = null, sessionId = null, agentRole = null, isLoop = false) {
    try {
        // 1. Compute risk score
        const { score: riskScore, factors: riskFactors } = computeRiskScore(toolName, args, decision, costUsd, isLoop);
        // 2. Get previous hash for chain integrity
        // Fetch the latest log to get its hash (or use in-memory cache for perf)
        if (_lastHash === 'GENESIS') {
            const lastLogSnap = await db.collection("audit_logs")
                .orderBy("sequenceNumber", "desc")
                .limit(1)
                .get();
            if (!lastLogSnap.empty) {
                _lastHash = lastLogSnap.docs[0].data().integrityHash || 'GENESIS';
                _sequenceCounter = (lastLogSnap.docs[0].data().sequenceNumber || 0);
            }
        }
        _sequenceCounter++;
        // 3. Build the canonical payload for hashing
        const canonicalPayload = JSON.stringify({
            seq: _sequenceCounter,
            prev: _lastHash,
            agentId, toolName, args, decision, reason, sessionId, agentRole, costUsd, isLoop, riskScore
        });
        // 4. Compute SHA-256 integrity hash
        const integrityHash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');
        // 5. Write the forensic log entry
        await db.collection("audit_logs").add({
            agentId,
            toolName,
            arguments: args,
            decision,
            reason,
            sessionId,
            agentRole,
            cost_usd: costUsd,
            is_loop: isLoop,
            // Forensic fields
            integrityHash,
            previousHash: _lastHash,
            sequenceNumber: _sequenceCounter,
            riskScore,
            riskFactors,
            timestamp: firestore_1.FieldValue.serverTimestamp()
        });
        // 6. Update chain state
        _lastHash = integrityHash;
    }
    catch (error) {
        console.error("Failed to log forensic audit event:", error);
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