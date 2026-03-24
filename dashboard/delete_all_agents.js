const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey) {
    // If it contains literal \n characters, replace them with actual newlines
    if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

const db = admin.firestore();

async function deleteAllAgents() {
    console.log("Fetching all agents...");
    const snapshot = await db.collection("agents").get();
    
    if (snapshot.empty) {
        console.log("No agents found.");
        return;
    }

    console.log(`Found ${snapshot.docs.length} agents. Deleting...`);
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("All agents deleted successfully.");
}

deleteAllAgents().catch((e) => {
    console.error("Execution error:", e.message || e);
    if (e.stack) console.error(e.stack);
});
