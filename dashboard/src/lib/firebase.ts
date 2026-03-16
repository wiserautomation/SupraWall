import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if the config is present
const isClient = typeof window !== "undefined";
const hasConfig = !!firebaseConfig.apiKey;

// Lazy initialization to prevent SSR issues
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp {
    if (!isClient) {
        // Return a dummy app for SSR to prevent crashes
        return { name: "[DEFAULT]-mock", options: {}, automaticDataCollectionEnabled: false } as FirebaseApp;
    }
    
    if (!_app) {
        if (!hasConfig) {
            console.warn("Firebase config missing. Using mock app.");
            _app = initializeApp({ apiKey: "mock-key", projectId: "mock-project" });
        } else {
            _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        }
    }
    return _app;
}

// Proxies allow us to export these as objects while delaying initialization until first access.
// This preserves the current import syntax across the codebase while fixing the SSR leak.

export const app = new Proxy({} as FirebaseApp, {
    get: (target, prop) => {
        return (getFirebaseApp() as any)[prop];
    }
});

export const auth = new Proxy({} as Auth, {
    get: (target, prop) => {
        if (!_auth && isClient) {
            _auth = getAuth(getFirebaseApp());
        }
        return (_auth as any || {})[prop];
    }
});

export const db = new Proxy({} as Firestore, {
    get: (target, prop) => {
        if (!_db && isClient) {
            _db = getFirestore(getFirebaseApp());
        }
        return (_db as any || {})[prop];
    }
});

export { firebaseConfig };
