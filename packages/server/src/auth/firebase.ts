// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { AuthProvider, AgentInfo } from "./types";

/**
 * Firebase Auth Provider (Optional)
 *
 * For users who want to authenticate agents via Firebase Firestore.
 * Requires firebase-admin to be installed and FIREBASE_SERVICE_ACCOUNT to be set.
 *
 * Install: npm install firebase-admin
 * Config: Set FIREBASE_SERVICE_ACCOUNT env var with the JSON service account.
 */
export class FirebaseAuthProvider implements AuthProvider {
    private db: FirebaseFirestore.Firestore | null = null;

    constructor() {
        try {
            // Dynamic import to avoid requiring firebase-admin as a hard dependency
            const admin = require("firebase-admin");
            const serviceAccount = JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
            );

            if (admin.apps.length === 0 && Object.keys(serviceAccount).length > 0) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
            }

            this.db = admin.apps.length > 0 ? admin.firestore() : null;

            if (!this.db) {
                console.warn("[FirebaseAuth] No Firebase service account provided. Provider inactive.");
            }
        } catch (error) {
            console.warn("[FirebaseAuth] firebase-admin not installed. Use PostgresAuthProvider instead.");
            this.db = null;
        }
    }

    async validateApiKey(apiKey: string): Promise<AgentInfo | null> {
        if (!this.db) return null;

        try {
            const agentsRef = this.db.collection("agents");
            const snapshot = await agentsRef.where("apiKey", "==", apiKey).limit(1).get();

            if (snapshot.empty) {
                return null;
            }

            const agentData = snapshot.docs[0].data();

            if (agentData.status === "inactive") {
                return null;
            }

            return {
                id: snapshot.docs[0].id,
                tenantId: agentData.tenantId || "default-tenant",
                name: agentData.name,
                scopes: agentData.scopes || [],
                max_cost_usd: agentData.max_cost_usd || 10,
                status: agentData.status,
            };
        } catch (error) {
            console.error("[FirebaseAuth] Error validating API key:", error);
            return null;
        }
    }

    async getAgentById(agentId: string): Promise<AgentInfo | null> {
        if (!this.db) return null;

        try {
            const doc = await this.db.collection("agents").doc(agentId).get();
            if (!doc.exists) return null;

            const data = doc.data()!;
            return {
                id: doc.id,
                tenantId: data.tenantId || "default-tenant",
                name: data.name,
                scopes: data.scopes || [],
                max_cost_usd: data.max_cost_usd || 10,
                status: data.status,
            };
        } catch (error) {
            console.error("[FirebaseAuth] Error getting agent:", error);
            return null;
        }
    }
}
