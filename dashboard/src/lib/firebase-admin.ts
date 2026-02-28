import admin from 'firebase-admin';

function getFirebaseAdmin() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID!,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
                privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
            }),
        });
    }
    return admin;
}

export function getAdminDb() {
    return getFirebaseAdmin().firestore();
}

export function getAdminAuth() {
    return getFirebaseAdmin().auth();
}

// Convenience aliases — safe to use inside route handlers (force-dynamic routes)
export const db = {
    collection: (...args: Parameters<ReturnType<typeof admin.firestore>['collection']>) =>
        getAdminDb().collection(...args),
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
