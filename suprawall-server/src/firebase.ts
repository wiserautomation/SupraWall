import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
);

if (admin.apps.length === 0) {
    if (Object.keys(serviceAccount).length > 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        // Fallback or skip if not provided (useful for local dev without firebase)
        console.warn("[Firebase] No service account provided. Firestore auth will be disabled.");
    }
}

export const db = admin.apps.length > 0 ? admin.firestore() : null;
