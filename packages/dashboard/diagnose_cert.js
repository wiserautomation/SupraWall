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
    const certId = "SW-CERT-MN8KCYRK";
    console.log(`Checking Certificate ID: ${certId}`);

    const snap = await db.collection("certificates").doc(certId).get();
    if (snap.exists) {
        console.log("Found certificate:");
        console.log(JSON.stringify(snap.data(), null, 2));
    } else {
        console.log("Certificate NOT found.");
        
        // Let's check if there are ANY certificates
        const allSnap = await db.collection("certificates").limit(5).get();
        console.log(`Total certificates in collection: ${allSnap.size}`);
        allSnap.docs.forEach(doc => console.log(` - ${doc.id}`));
    }
}

run().catch(console.error);
