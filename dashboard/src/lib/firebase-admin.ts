
import admin from 'firebase-admin';

function getFirebaseAdmin(): admin.app.App {
    if (admin.apps.length > 0 && admin.apps[0] !== null) return admin.apps[0] as admin.app.App;

    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // ⚠️ IMPORTANT: The Firebase project ID is 'agentguard-1b9e9'. 
    // DO NOT change this to 'suprawall-1b9e9' as that project does not exist.
    const projectId = (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agentguard-1b9e9')?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

    if (projectId && clientEmail && privateKey) {
        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } else {
        console.warn("Firebase Admin environment variables are missing. Using default credentials with project ID:", projectId);
        // If we are in Vercel or local with GOOGLE_APPLICATION_CREDENTIALS, this works.
        // Otherwise it will still fail, but at least we tried.
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
