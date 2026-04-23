// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Adapter, Agent } from "../types";
import { collection, doc, query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

export class FirebaseAdapter implements Adapter {
    private db: any;

    async connect(connectionString: string): Promise<void> {
        let firebaseConfig;
        try {
            firebaseConfig = JSON.parse(connectionString);
        } catch (e) {
            throw new Error("connectionString for Firebase must be a JSON string of Firebase config.");
        }

        const apps = getApps();
        const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
        this.db = getFirestore(app);
    }

    // Fallback setter for testing or if db was connected externally
    setDb(dbInstance: any) {
        this.db = dbInstance;
    }

    async createAgent(agent: Agent): Promise<Agent> {
        if (!this.db) throw new Error("Firebase DB not initialized.");
        const docRef = await addDoc(collection(this.db, "agents"), agent);
        return { id: docRef.id, ...agent };
    }

    async getAgent(id: string): Promise<Agent | null> {
        if (!this.db) throw new Error("Firebase DB not initialized.");
        const docRef = doc(this.db, "agents", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;
        return { id: docSnap.id, ...docSnap.data() } as Agent;
    }

    async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
        if (!this.db) throw new Error("Firebase DB not initialized.");
        const docRef = doc(this.db, "agents", id);
        await updateDoc(docRef, updates);
        // Re-read the document to return accurate, complete data
        const updated = await getDoc(docRef);
        if (!updated.exists()) throw new Error(`Agent ${id} not found after update`);
        return { id: updated.id, ...updated.data() } as Agent;
    }

    async deleteAgent(id: string): Promise<boolean> {
        if (!this.db) throw new Error("Firebase DB not initialized.");
        const docRef = doc(this.db, "agents", id);
        await deleteDoc(docRef);
        return true;
    }

    async listAgents(filter?: { userId?: string }): Promise<Agent[]> {
        if (!this.db) throw new Error("Firebase DB not initialized.");
        let q = query(collection(this.db, "agents"));

        if (filter?.userId) {
            q = query(collection(this.db, "agents"), where("userId", "==", filter.userId));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Agent));
    }
}
