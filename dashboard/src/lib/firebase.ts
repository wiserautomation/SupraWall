import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (typeof window !== "undefined") {
    console.log("Firebase Config Check:", {
        hasApiKey: !!firebaseConfig.apiKey,
        hasProjectId: !!firebaseConfig.projectId,
        env: process.env.NODE_ENV
    });
}

// Initialize Firebase only if the config is present
// Initialize Firebase
const isClient = typeof window !== "undefined";
const hasConfig = !!firebaseConfig.apiKey;

export const app: FirebaseApp = 
    (isClient && hasConfig)
        ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
        : initializeApp({ 
            apiKey: "mock-key", 
            authDomain: "mock.firebaseapp.com",
            projectId: "mock-project",
            storageBucket: "mock.appspot.com",
            messagingSenderId: "123",
            appId: "1:123:web:mock"
        });

if (isClient && hasConfig) {
    console.log("Firebase initialized successfully on the client.");
} else if (isClient) {
    console.warn("Firebase configuration missing or incomplete. Using fallback/mock initialization.");
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Helper to check if we are in mock mode
(db as any)._isMock = !hasConfig;

// Enable offline persistence on the client
if (typeof window !== "undefined" && app && db && !(db as any)._isMock) {
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            console.warn("Firestore persistence failed-precondition: Multiple tabs open.");
        } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            console.warn("Firestore persistence unimplemented by browser.");
        } else {
            console.error("Firestore persistence error:", err);
        }
    });
}

export { auth, db };
