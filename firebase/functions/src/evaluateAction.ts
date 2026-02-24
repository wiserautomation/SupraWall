import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { GoogleGenAI } from "@google/genai";

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

interface PolicyRule {
    toolPattern: string;  // glob or exact, e.g. "delete_*", "send_email"
    action: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    conditions?: Record<string, any>;
}

interface RateLimitConfig {
    requestsPerMinute: number;
    requestsPerDay: number;
}

interface EvaluateResponse {
    decision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL";
    reason?: string;
}

export const evaluateAction = onRequest({ cors: true }, async (req, res) => {
    if (req.method === "OPTIONS") { res.status(204).send(""); return; }
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    const body = req.body;
    const apiKey = body.apiKey;
    const toolName = body.toolName;
    const args = body.args;

    const startTime = Date.now();

    if (!apiKey || !toolName || args === undefined) {
        res.status(400).json({ error: "apiKey and toolName are required." });
        return;
    }

    try {
        // ── Route: Connect sub-key (agc_) ──────────────────────────────────────
        if (apiKey.startsWith("agc_")) {
            const subKeySnap = await db.collection("connect_keys").doc(apiKey).get();

            if (!subKeySnap.exists || !subKeySnap.data()?.active) {
                res.status(401).json({ error: "Invalid or inactive Connect sub-key." });
                return;
            }

            const subKey = subKeySnap.data()!;
            const { platformId, customerId, policyOverrides, rateLimitOverride } = subKey;

            // Load platform base policies
            const basePolicySnap = await db
                .collection("platforms")
                .doc(platformId)
                .collection("base_policies")
                .doc("default")
                .get();

            const baseRules: PolicyRule[] = basePolicySnap.data()?.rules ?? [];
            const baseRateLimit: RateLimitConfig = basePolicySnap.data()?.rateLimit ?? {
                requestsPerMinute: 60,
                requestsPerDay: 10000,
            };

            // Merge: customer overrides WIN over platform base rules
            const effectiveRules: PolicyRule[] = [
                ...(policyOverrides ?? []),
                ...baseRules,
            ];
            const effectiveRateLimit: RateLimitConfig = rateLimitOverride ?? baseRateLimit;

            // Rate limit check
            const rateLimitResult = await checkRateLimit(apiKey, effectiveRateLimit);
            if (!rateLimitResult.allowed) {
                res.status(429).json({ decision: "DENY", reason: "Rate limit exceeded." });
                return;
            }

            // Policy evaluation
            const decision = evaluatePolicies(toolName, args, effectiveRules);

            // Update usage counters and write audit log (non-blocking)
            const latencyMs = Date.now() - startTime;
            Promise.all([
                db.collection("connect_keys").doc(apiKey).update({
                    lastUsedAt: FieldValue.serverTimestamp(),
                    totalCalls: FieldValue.increment(1),
                }),
                db.collection("connect_events").add({
                    platformId,
                    subKeyId: apiKey,
                    customerId,
                    toolName,
                    args: sanitizeArgs(args),
                    decision: decision.decision,
                    reason: decision.reason ?? null,
                    latencyMs,
                    timestamp: FieldValue.serverTimestamp(),
                }),
            ]).catch((e) => console.error("AgentGate: Non-critical write failed:", e));

            res.status(200).json(decision);
            return;
        }

        // ── Route: Regular single-tenant key (ag_) ─────────────────────────────
        if (apiKey.startsWith("ag_") || !apiKey.startsWith("agc_")) {
            const argsString = typeof args === 'string' ? args : JSON.stringify(args);

            // 1. Find the agent by apiKey
            const agentsSnapshot = await db.collection("agents").where("apiKey", "==", apiKey).limit(1).get();

            if (agentsSnapshot.empty) {
                await logAudit("unknown", toolName, argsString, "DENY");
                res.status(403).json({ decision: "DENY", reason: "Invalid API Key" });
                return;
            }

            const agentDoc = agentsSnapshot.docs[0];
            const agentId = agentDoc.id;

            // 2. Query policies for this agent and toolName
            const policiesSnapshot = await db.collection("policies")
                .where("agentId", "==", agentId)
                .where("toolName", "==", toolName)
                .get();

            let finalDecision: "ALLOW" | "DENY" | "REQUIRE_APPROVAL" = "ALLOW";

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
            await logAudit(agentId, toolName, argsString, finalDecision);

            // 5. Return the decision
            res.status(200).json({ decision: finalDecision });
            return;
        }

    } catch (e) {
        console.error("AgentGate evaluateAction error:", e);
        res.status(500).json({ error: "Internal AgentGate error.", decision: "DENY" });
    }
});

// ── Connect Helpers ────────────────────────────────────────────────────────

function evaluatePolicies(
    toolName: string,
    args: any,
    rules: PolicyRule[]
): EvaluateResponse {
    for (const rule of rules) {
        if (matchesPattern(toolName, rule.toolPattern)) {
            return { decision: rule.action, reason: rule.conditions?.reason };
        }
    }
    // Default: ALLOW if no rule matches
    return { decision: "ALLOW" };
}

function matchesPattern(toolName: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern.endsWith("*")) {
        return toolName.startsWith(pattern.slice(0, -1));
    }
    return toolName === pattern;
}

async function checkRateLimit(
    key: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean }> {
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

    const minuteCount = minuteSnap.data()?.count ?? 0;
    const dayCount = daySnap.data()?.count ?? 0;

    if (minuteCount >= config.requestsPerMinute || dayCount >= config.requestsPerDay) {
        return { allowed: false };
    }

    batch.set(minuteRef, { count: minuteCount + 1, expiresAt: new Date(Date.now() + 60_000) }, { merge: true });
    batch.set(dayRef, { count: dayCount + 1, expiresAt: new Date(Date.now() + 86_400_000) }, { merge: true });
    await batch.commit();

    return { allowed: true };
}

function sanitizeArgs(args: any): any {
    if (!args || typeof args !== "object") return args;
    const secretFields = ["password", "token", "secret", "key", "apiKey", "api_key", "authorization"];
    const sanitized = { ...args };
    for (const field of secretFields) {
        if (field in sanitized) sanitized[field] = "[REDACTED]";
    }
    return sanitized;
}

async function logAudit(agentId: string, toolName: string, args: string, decision: string) {
    try {
        await db.collection("audit_logs").add({
            agentId,
            toolName,
            arguments: args,
            decision,
            timestamp: FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Failed to log audit event:", error);
    }
}

export const generatePolicyRegex = onRequest({ cors: true }, async (request, response) => {
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

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are an expert cybersecurity engineer. The user wants to restrict an AI agent using the tool '${toolName}'. They will describe the restriction in plain English: '${prompt}'. Return ONLY a raw Regular Expression string that matches the user's intent. Do not include markdown formatting, backticks, or explanations. If they want to BLOCK something, write a regex that matches the blocked pattern. If they want to ONLY ALLOW something, write a regex that matches the allowed pattern.`;

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
        });

        let regexString = aiResponse.text?.trim() || ".*";

        // Remove markdown formatting if the model slipped it in
        if (regexString.startsWith("\`\`\`")) {
            regexString = regexString.replace(/\`\`\`(regex)?/gi, "").trim();
        }

        response.status(200).json({ regex: regexString });
        return;
    } catch (error) {
        console.error("Error generating regex via Gemini:", error);
        response.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
