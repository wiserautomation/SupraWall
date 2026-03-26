require('dotenv').config({ path: '../../.env.local' });
const admin = require('firebase-admin');

const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
const projectId = (process.env.FIREBASE_PROJECT_ID || '').trim() || 'agentguard-1b9e9';
const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').trim();

if (!admin.apps.length) {
    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({ projectId, clientEmail, privateKey })
        });
    } else {
        admin.initializeApp({ projectId });
    }
}
const db = admin.firestore();

async function run() {
    try {
        const apiKey = "ag_Ox6Ulo0KJHcUtVdYZ9-rK9_-1tSthAjo";
        console.log(`\n1. Searching for agent by apiKey=${apiKey}`);
        
        const snap = await db.collection("agents").where("apiKey", "==", apiKey).limit(1).get();
        if (snap.empty) {
            console.log("--> ❌ NOT FOUND in agents collection!");
            return;
        }

        const agentDoc = snap.docs[0];
        const agentId = agentDoc.id;
        const userId = agentDoc.data().userId;
        const tenantId = agentDoc.data().tenantId || 'none';
        
        console.log(`--> ✅ FOUND AGENT:\n    agent.id (Firestore Doc ID) = ${agentId}\n    userId = ${userId}\n    tenantId = ${tenantId}\n    name = ${agentDoc.data().name}`);

        console.log(`\n2. Searching for audit_logs where agentId == "${agentId}"`);
        const logsRef = await db.collection("audit_logs").where("agentId", "==", agentId).orderBy("timestamp", "desc").limit(5).get();
        console.log(`--> Found ${logsRef.size} LOGS`);
        
        logsRef.forEach(d => {
            const data = d.data();
            console.log(`    - log_id=${d.id} decision=${data.decision} tool=${data.toolName} time=${data.timestamp?.toDate()}`);
        });

        console.log(`\n3. What if evaluate wrote the apiKey as agentId instead? Searching audit_logs where agentId == "${apiKey}"`);
        const logsApiKey = await db.collection("audit_logs").where("agentId", "==", apiKey).limit(2).get();
        console.log(`--> Found ${logsApiKey.size} LOGS using apiKey as agentId`);

    } catch (e) {
        console.error("DIAGNOSTIC ERROR:");
        console.error(e);
    }
}
run();
