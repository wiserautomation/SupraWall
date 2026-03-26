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

async function diagnose() {
    console.log("=== DIAGNOSTIC START ===\n");

    try {
        // 1. Find the agent with the test API key
        console.log("1. Looking for agent with key ag_Ox6Ulo0KJHcUtVdYZ9-rK9_-1tSthAjo ...");
        const agentSnap = await db.collection("agents").where("apiKey", "==", "ag_Ox6Ulo0KJHcUtVdYZ9-rK9_-1tSthAjo").limit(1).get();
        
        let agentId, userId;
        if (agentSnap.empty) {
            console.log("   ❌ Agent NOT FOUND with that key");
        } else {
            const agent = agentSnap.docs[0];
            agentId = agent.id;
            userId = agent.data().userId;
            console.log(`   ✅ Agent found: id=${agentId}, userId=${userId}, name=${agent.data().name}`);
        }

        // 2. Check total audit_logs
        console.log("\n2. Checking recent audit_logs...");
        const allLogs = await db.collection("audit_logs").orderBy("timestamp", "desc").limit(5).get();
        console.log(`   Found ${allLogs.size} recent logs`);
        allLogs.docs.forEach((doc, i) => {
            const d = doc.data();
            console.log(`   [${i}] id=${doc.id} agentId=${d.agentId} decision=${d.decision} toolName=${d.toolName} time=${d.timestamp?.toDate?.()}`);
        });

        if (agentId) {
            console.log(`\n3. Checking audit_logs specially for agentId=${agentId}...`);
            const agentLogs = await db.collection("audit_logs").where("agentId", "==", agentId).limit(5).get();
            console.log(`   Found ${agentLogs.size} logs for this exact agentId`);
        }

    } catch(e) {
        console.error("DIAGNOSTIC ERROR:", e);
    }

    console.log("\n=== DIAGNOSTIC END ===");
    process.exit(0);
}

diagnose();
