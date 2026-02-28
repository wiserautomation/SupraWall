import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };

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
