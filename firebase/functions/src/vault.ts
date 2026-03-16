import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// ── Encryption Helpers ──────────────────────────────────────────────────

export function encryptSecret(plaintext: string): string {
  const encryptionKey = process.env.VAULT_ENCRYPTION_KEY;
  if (!encryptionKey) throw new Error("VAULT_ENCRYPTION_KEY is not set");
  
  const key = Buffer.from(encryptionKey, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecret(stored: string): string {
  const encryptionKey = process.env.VAULT_ENCRYPTION_KEY;
  if (!encryptionKey) throw new Error("VAULT_ENCRYPTION_KEY is not set");

  const key = Buffer.from(encryptionKey, 'hex');
  const [ivHex, authTagHex, cipherHex] = stored.split(':');
  if (!ivHex || !authTagHex || !cipherHex) throw new Error("Invalid stored secret format");

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const ciphertext = Buffer.from(cipherHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext) + decipher.final('utf8');
}

// ── Audit Logging Helper ────────────────────────────────────────────────

export function logVaultAccess(
    tenantId: string, 
    agentId: string, 
    secretName: string, 
    toolName: string, 
    action: "INJECTED" | "DENIED" | "RATE_LIMITED" | "EXPIRED" | "NOT_FOUND" | "ROTATED" | "DELETED"
) {
    // Non-blocking fire and forget
    const logEntry = {
        tenantId,
        agent_id: agentId,
        secret_name: secretName,
        tool_name: toolName,
        action,
        created_at: new Date().toISOString()
    };

    db.collection('vault_access_log').add(logEntry).catch(e => {
        console.error("[VAULT] Audit log failed:", e);
    });
}

// ── Main API Handler ────────────────────────────────────────────────────

export const vaultApi = onRequest({ cors: true }, async (req, res) => {
    // Basic Routing Logic
    const path = req.path || "";
    const method = req.method;
    const tenantId = (req.headers["x-tenant-id"] as string) || (req.query.tenantId as string);

    if (!tenantId) {
        res.status(400).json({ error: "Missing tenantId" });
        return;
    }

    try {
        // ROUTE 1: GET /api/v1/vault/secrets
        if (method === "GET" && path.endsWith("/api/v1/vault/secrets")) {
            const secretsSnap = await db.collection("vault_secrets")
                .where("tenantId", "==", tenantId)
                .get();
            
            const secrets = secretsSnap.docs.map(doc => {
                const data = doc.data();
                const { encrypted_value, ...rest } = data; // Never expose encrypted value
                return { id: doc.id, ...rest };
            });

            res.status(200).json(secrets);
            return;
        }

        // ROUTE 2: POST /api/v1/vault/secrets
        if (method === "POST" && path.endsWith("/api/v1/vault/secrets")) {
            const { secretName, secretValue, secretType, description, expiresAt, assignedAgents } = req.body;

            if (!secretName || !/^[A-Z0-9_]+$/.test(secretName)) {
                res.status(400).json({ error: "Invalid secretName. Must be UPPER_SNAKE_CASE." });
                return;
            }

            if (!secretValue) {
                res.status(400).json({ error: "secretValue is required." });
                return;
            }

            const validTypes = ["api_key", "credentials", "oauth", "custom"];
            const finalType = secretType && validTypes.includes(secretType) ? secretType : "api_key";

            // Check uniqueness
            const existingSnap = await db.collection("vault_secrets")
                .where("tenantId", "==", tenantId)
                .where("secret_name", "==", secretName)
                .limit(1)
                .get();
            
            if (!existingSnap.empty) {
                res.status(409).json({ error: "Secret name already exists for this tenant." });
                return;
            }

            const encrypted = encryptSecret(secretValue);
            const now = new Date().toISOString();

            const docRef = await db.collection("vault_secrets").add({
                tenantId,
                secret_name: secretName,
                secret_type: finalType,
                encrypted_value: encrypted,
                description: description || null,
                expires_at: expiresAt || null,
                assigned_agents: assignedAgents || [],
                last_rotated_at: now,
                created_at: now
            });

            res.status(201).json({ 
                id: docRef.id, 
                secret_name: secretName, 
                token: "$SUPRAWALL_VAULT_" + secretName 
            });
            return;
        }

        // ROUTE 3: DELETE /api/v1/vault/secrets/:id
        if (method === "DELETE" && path.match(/\/api\/v1\/vault\/secrets\/[^\/]+$/)) {
            const secretId = path.split("/").pop()!;
            const secretRef = db.collection("vault_secrets").doc(secretId);
            const secretSnap = await secretRef.get();

            if (!secretSnap.exists || secretSnap.data()?.tenantId !== tenantId) {
                res.status(404).json({ error: "Secret not found." });
                return;
            }

            const secretName = secretSnap.data()?.secret_name;

            // Delete rules
            const rulesSnap = await db.collection("vault_rules")
                .where("tenantId", "==", tenantId)
                .where("secret_id", "==", secretId)
                .get();
            
            const batch = db.batch();
            batch.delete(secretRef);
            rulesSnap.docs.forEach(doc => {
                batch.delete(doc.ref);
                const agentId = doc.data().agent_id;
                logVaultAccess(tenantId, agentId, secretName, "system", "DELETED");
            });

            await batch.commit();
            res.status(200).json({ success: true });
            return;
        }

        // ROUTE 4: PUT /api/v1/vault/secrets/:id/rotate
        if (method === "PUT" && path.match(/\/api\/v1\/vault\/secrets\/[^\/]+\/rotate$/)) {
            const parts = path.split("/");
            const secretId = parts[parts.length - 2];
            const { newValue } = req.body;

            const secretRef = db.collection("vault_secrets").doc(secretId);
            const secretSnap = await secretRef.get();

            if (!secretSnap.exists || secretSnap.data()?.tenantId !== tenantId) {
                res.status(404).json({ error: "Secret not found." });
                return;
            }

            const encrypted = encryptSecret(newValue);
            const now = new Date().toISOString();

            await secretRef.update({
                encrypted_value: encrypted,
                last_rotated_at: now
            });

            logVaultAccess(tenantId, "all", secretSnap.data()?.secret_name, "system", "ROTATED");

            res.status(200).json({ success: true, last_rotated_at: now });
            return;
        }

        // ROUTE 5: GET /api/v1/vault/rules
        if (method === "GET" && path.endsWith("/api/v1/vault/rules")) {
            const rulesSnap = await db.collection("vault_rules")
                .where("tenantId", "==", tenantId)
                .get();
            
            const rules = rulesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(rules);
            return;
        }

        // ROUTE 6: POST /api/v1/vault/rules
        if (method === "POST" && path.endsWith("/api/v1/vault/rules")) {
            const { agentId, secretId, allowedTools, maxUsesPerHour, requiresApproval } = req.body;

            // Validate secret
            const secretSnap = await db.collection("vault_secrets").doc(secretId).get();
            if (!secretSnap.exists || secretSnap.data()?.tenantId !== tenantId) {
                res.status(404).json({ error: "Secret not found." });
                return;
            }

            // Validate agent
            const agentSnap = await db.collection("agents").doc(agentId).get();
            if (!agentSnap.exists || agentSnap.data()?.userId !== tenantId) {
                res.status(404).json({ error: "Agent not found." });
                return;
            }

            // Check duplicate
            const secretName = secretSnap.data()?.secret_name;
            const existingRule = await db.collection("vault_rules")
                .where("tenantId", "==", tenantId)
                .where("agent_id", "==", agentId)
                .where("secret_id", "==", secretId)
                .limit(1)
                .get();
            
            if (!existingRule.empty) {
                res.status(409).json({ error: "Rule already exists for this agent and secret." });
                return;
            }

            const ruleData = {
                tenantId,
                agent_id: agentId,
                secret_id: secretId,
                secret_name: secretName,
                allowed_tools: allowedTools || [],
                max_uses_per_hour: maxUsesPerHour || 0,
                requires_approval: !!requiresApproval,
                created_at: new Date().toISOString()
            };

            const docRef = await db.collection("vault_rules").add(ruleData);
            res.status(201).json({ id: docRef.id, ...ruleData });
            return;
        }

        // ROUTE 7: DELETE /api/v1/vault/rules/:id
        if (method === "DELETE" && path.match(/\/api\/v1\/vault\/rules\/[^\/]+$/)) {
            const ruleId = path.split("/").pop()!;
            const ruleRef = db.collection("vault_rules").doc(ruleId);
            const ruleSnap = await ruleRef.get();

            if (!ruleSnap.exists || ruleSnap.data()?.tenantId !== tenantId) {
                res.status(404).json({ error: "Rule not found." });
                return;
            }

            await ruleRef.delete();
            res.status(200).json({ success: true });
            return;
        }

        // ROUTE 8: GET /api/v1/vault/log
        if (method === "GET" && path.endsWith("/api/v1/vault/log")) {
            const limit = parseInt(req.query.limit as string) || 50;
            const logSnap = await db.collection("vault_access_log")
                .where("tenantId", "==", tenantId)
                .orderBy("created_at", "desc")
                .limit(limit)
                .get();
            
            const logs = logSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(logs);
            return;
        }

        res.status(404).json({ error: "Route not found" });

    } catch (e: any) {
        console.error("[VAULT API ERROR]", e);
        res.status(500).json({ error: "Internal Server Error", message: e.message });
    }
});
