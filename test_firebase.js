
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Try to load env
const envPath = path.resolve(__dirname, 'dashboard', '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

Object.assign(process.env, envConfig);

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        })
    });
    console.log("Firebase initialized successfully with project ID: ", process.env.FIREBASE_PROJECT_ID);
    
    const db = admin.firestore();
    db.collection('agents').limit(1).get().then(snap => {
        console.log("Connection successful! Found documents: ", snap.size);
        process.exit(0);
    }).catch(e => {
        console.error("Connection failed: ", e);
        process.exit(1);
    });
} catch (e) {
    console.error("Initialization failed: ", e);
    process.exit(1);
}
