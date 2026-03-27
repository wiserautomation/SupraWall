require('dotenv').config({ path: '../../.env.local' });
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}
const db = admin.firestore();

async function run() {
    const apiKey = "ag_Ox6Ulo0KJHcUtVdYZ9-rK9_-1tSthAjo";
    console.log(`Searching for agent with API Key: ${apiKey}`);

    const snap = await db.collection("agents").where("apiKey", "==", apiKey).get();
    if (snap.empty) {
        console.log("No agent found with this API Key.");
    } else {
        const agent = snap.docs[0].data();
        console.log("Found agent:");
        console.log(`Agent ID: ${snap.docs[0].id}`);
        console.log(`User ID (Owner): ${agent.userId}`);
        console.log(`Name: ${agent.name}`);
    }
}

run().catch(console.error);
