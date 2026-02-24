import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";

admin.initializeApp();

const db = admin.firestore();

export const evaluateAction = onRequest({ cors: true }, async (request, response) => {
    if (request.method !== "POST") {
        response.status(405).send("Method Not Allowed");
        return;
    }

    try {
        const { apiKey, toolName, args } = request.body;

        // Reject if missing required fields
        if (!apiKey || !toolName || args === undefined) {
            response.status(400).json({ error: "Missing required fields" });
            return;
        }

        const argsString = typeof args === 'string' ? args : JSON.stringify(args);

        // 1. Find the agent by apiKey
        const agentsSnapshot = await db.collection("agents").where("apiKey", "==", apiKey).limit(1).get();

        if (agentsSnapshot.empty) {
            await logAudit("unknown", toolName, argsString, "DENY");
            response.status(403).json({ decision: "DENY", reason: "Invalid API Key" });
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
                // as DENY is usually the most restrictive
                if (finalDecision === "DENY") {
                    break;
                }
            }
        }

        // 4. Log the audit event
        await logAudit(agentId, toolName, argsString, finalDecision);

        // 5. Return the decision
        response.status(200).json({ decision: finalDecision });
        return;
    } catch (error) {
        console.error("Error evaluating action:", error);
        response.status(500).json({ error: "Internal Server Error", decision: "DENY" });
        return;
    }
});

async function logAudit(agentId: string, toolName: string, args: string, decision: string) {
    try {
        await db.collection("audit_logs").add({
            agentId,
            toolName,
            arguments: args,
            decision,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
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
