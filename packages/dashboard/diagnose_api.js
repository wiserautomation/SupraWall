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
    const userId = "lEmuTYpa8mUqpREQYphKMG6JzlR2";
    console.log(`Testing audit-firestore logic for userId: ${userId}`);

    // Step 1: Get agents
    const agentsSnap = await db.collection("agents").where("userId", "==", userId).get();
    const agentIds = agentsSnap.docs.map(doc => doc.id);

    console.log(`Found ${agentIds.length} agents:`, agentIds);

    // Step 2: Get connect keys
    const platformsSnap = await db.collection("platforms").where("ownerId", "==", userId).get();
    for (const pDoc of platformsSnap.docs) {
        const keysSnap = await db.collection("connect_keys").where("platformId", "==", pDoc.id).get();
        keysSnap.docs.forEach(kDoc => agentIds.push(kDoc.id));
    }

    console.log(`Total agents + connect keys: ${agentIds.length}`);

    if (agentIds.length === 0) {
        console.log("No agent IDs found.");
        return;
    }

    // Step 3: Fetch logs
    const batches = [];
    for (let i = 0; i < agentIds.length; i += 30) {
        batches.push(agentIds.slice(i, i + 30));
    }

    let allLogs = [];
    let fetchErrors = [];
    for (const batch of batches) {
        try {
            const logsSnap = await db.collection("audit_logs")
                .where("agentId", "in", batch)
                .limit(200)
                .get();
                
            logsSnap.docs.forEach(doc => {
                allLogs.push({ id: doc.id, ...doc.data() });
            });
        } catch (err) {
            console.error("Batch query error:", err.message);
            fetchErrors.push(err.message);
        }
    }

    console.log(`Successfully fetched ${allLogs.length} logs for this user.`);
    if (allLogs.length > 0) {
        // Find stress test logs
        const stressLogs = allLogs.filter(l => l.sessionId && l.sessionId.includes('stress_test'));
        console.log(`Found ${stressLogs.length} logs with 'stress_test' in sessionId.`);
        if (stressLogs.length > 0) {
            console.log("Sample stress log:", stressLogs[0]);
        } else {
             const threatLogs = allLogs.filter(l => l.decision === 'DENY');
             console.log(`Found ${threatLogs.length} DENY logs instead.`);
             if (threatLogs.length > 0) {
                console.log("Sample DENY log:", threatLogs[0]);
             }
        }
    }
}

run().catch(console.error);
