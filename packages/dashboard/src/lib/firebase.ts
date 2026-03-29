// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isClient = typeof window !== "undefined";
const hasConfig = !!firebaseConfig.apiKey;

// Initialize Firebase
const app: FirebaseApp = (isClient || !hasConfig) 
    ? (getApps().length ? getApp() : initializeApp(hasConfig ? firebaseConfig : { apiKey: "mock", projectId: "mock" }))
    : ({} as FirebaseApp);

const auth = isClient ? getAuth(app) : ({} as Auth);
const db = isClient ? getFirestore(app) : ({} as Firestore);
const messaging = (isClient && !!firebaseConfig.appId) ? getMessaging(app) : ({} as Messaging);

export { app, auth, db, messaging, firebaseConfig };
