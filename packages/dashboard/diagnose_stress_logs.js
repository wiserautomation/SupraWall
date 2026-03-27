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
    console.log("Fetching latest 10 audit logs from Firestore...");
    const snap = await db.collection("audit_logs").orderBy("timestamp", "desc").limit(10).get();
    
    if (snap.empty) {
        console.log("No logs found at all.");
        return;
    }

    snap.docs.forEach(doc => {
        const data = doc.data();
        console.log(`\nLog ID: ${doc.id}`);
        console.log(`Agent ID: ${data.agentId}`);
        console.log(`Tool: ${data.toolName}`);
        console.log(`Decision: ${data.decision}`);
        console.log(`Reason: ${data.reason}`);
        console.log(`Session ID: ${data.sessionId}`);
        console.log(`Timestamp: ${data.timestamp ? data.timestamp.toDate() : 'N/A'}`);
    });
}

run().catch(console.error);
