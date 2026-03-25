// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import admin from 'firebase-admin';

function getFirebaseAdmin(): admin.app.App {
    if (admin.apps.length > 0 && admin.apps[0] !== null) return admin.apps[0] as admin.app.App;

    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    if (privateKey) {
        // Handle escaped newlines and remove surrounding quotes if any
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
    }

    // ⚠️ Read from env var with fallback — MUST match the client-side Firebase project
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim() || 'agentguard-1b9e9';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

    console.log(`[Firebase Admin] Initializing with projectId: ${projectId}, clientEmail: ${clientEmail?.substring(0, 20)}...`);
    console.log(`[Firebase Admin] Private Key Info: length=${privateKey?.length}, startsWith=${privateKey?.substring(0, 30)}, endsWith=${privateKey?.substring(privateKey.length - 20)}`);


    if (projectId && clientEmail && privateKey) {
        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } else {
        console.warn("[Firebase Admin] Environment variables are missing. Using default credentials with project ID:", projectId);
        return admin.initializeApp({ projectId });
    }
}

export function getAdminDb() {
    const app = getFirebaseAdmin();
    return app.firestore();
}

export function getAdminAuth() {
    const app = getFirebaseAdmin();
    return app.auth();
}

// Convenience aliases — safe to use inside route handlers (force-dynamic routes)
export const db = {
    collection: (...args: Parameters<ReturnType<typeof admin.firestore>['collection']>) =>
        getAdminDb().collection(...args),
    doc: (...args: Parameters<ReturnType<typeof admin.firestore>['doc']>) =>
        getAdminDb().doc(...args),
    runTransaction: <T>(updateFunction: (transaction: admin.firestore.Transaction) => Promise<T>): Promise<T> =>
        getAdminDb().runTransaction(updateFunction),
    batch: () => getAdminDb().batch(),
};

export { admin };


export interface OrganizationData {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripeSubscriptionItemId: string; // Needed to report usage to Stripe
    status: 'active' | 'past_due' | 'canceled';
    currentPeriodEnd: admin.firestore.Timestamp;
    operationsThisMonth: number; // Increment this on every SDK call
    lastReportedCount: number;   // Last total pushed to Stripe meters
    hasPaymentMethod: boolean;
    userId: string;
}
