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
    const agentId = "k6AdJqOxJ4NFoA6kWr0J";
    console.log(`Checking Agent ID: ${agentId}`);

    // Check agents collection
    const agentSnap = await db.collection("agents").doc(agentId).get();
    if (agentSnap.exists) {
        console.log("Found in 'agents' collection.");
        console.log(agentSnap.data());
    } else {
        console.log("NOT found in 'agents' collection.");
    }

    // Check connect_keys collection
    const keySnap = await db.collection("connect_keys").doc(agentId).get();
    if (keySnap.exists) {
        console.log("Found in 'connect_keys' collection.");
        console.log(keySnap.data());
    } else {
        console.log("NOT found in 'connect_keys' collection.");
    }
}

run().catch(console.error);
