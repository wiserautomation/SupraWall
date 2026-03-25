const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY_REDACTED",
    projectId: "agentguard-1b9e9",
    appId: "1:331683417507:web:982a6b7a9ea12771e9de16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    try {
        const snapshot = await getDocs(collection(db, "agents"));
        console.log("Agents loaded:", snapshot.docs.map(d => ({id: d.id, name: d.data().name})));
    } catch(e) {
        console.error("Failed:", e);
    }
}
test();
