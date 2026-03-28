// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { logger } from "./logger";

/**
 * Global Firebase Admin instance for the server.
 * Used for mirroring audit logs to Firestore for real-time dashboard updates.
 */
let db: any = null;
export let admin: any = null;

try {
    admin = require("firebase-admin");
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountEnv) {
        const serviceAccount = JSON.parse(serviceAccountEnv);
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            logger.info("[Firebase] Admin SDK initialized via FIREBASE_SERVICE_ACCOUNT.");
        }
        db = admin.firestore();
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                }),
            });
            logger.info("[Firebase] Admin SDK initialized via separate env vars.");
        }
        db = admin.firestore();
    } else {
        logger.warn("[Firebase] No Firebase credentials found. Real-time dashboard sync disabled.");
    }
} catch (e) {
    logger.error("[Firebase] Initialization error:", { error: e });
}

export const getFirestore = () => db;

/**
 * Mirror an audit log to Firestore.
 * This ensures the dashboard (which is Firestore-native) sees data from the backend.
 */
export const logToFirestore = async (collection: string, data: any) => {
    if (!db) return;
    try {
        // Ensure timestamp is a proper Date object
        const record = {
            ...data,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            // Sync mapping: ensure both tenantId and userId exist for dashboard compatibility
            userId: data.tenantid || data.userId || "default-tenant",
            tenantId: data.tenantid || data.tenantId || "default-tenant",
        };
        
        await db.collection(collection).add(record);
    } catch (e) {
        logger.error(`[Firebase] Failed to write to ${collection}:`, { error: e });
    }
};
