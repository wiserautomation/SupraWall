const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const rawKey = process.env.FIREBASE_PRIVATE_KEY;
console.log("Raw key start (50 chars):", JSON.stringify(rawKey.substring(0, 50)));

const processedKey = rawKey.replace(/\\n/g, '\n');
console.log("Processed key start (50 chars):", JSON.stringify(processedKey.substring(0, 50)));

const admin = require('firebase-admin');
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: processedKey,
        }),
    });
    console.log("Initialization successful.");
} catch (e) {
    console.log("Initialization error:", e.message);
}
