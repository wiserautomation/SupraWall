// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { getFirestore } from "../firebase";
import { pool } from "../db";
import { logger } from "../logger";
import * as dotenv from "dotenv";

dotenv.config();

async function migrate() {
    console.log("🚀 Starting Forensic Recovery: Syncing Firestore audit_logs to PostgreSQL...");
    
    const db = getFirestore();
    if (!db) {
        console.error("❌ Firestore not initialized. Check FIREBASE_SERVICE_ACCOUNT.");
        return;
    }

    try {
        const snapshot = await db.collection("audit_logs").get();
        console.log(`📊 Found ${snapshot.size} logs in Firestore.`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const tenantId = data.tenantid || data.tenantId || data.userId || "default-tenant";
            const agentId = data.agentid || data.agentId || "unknown";
            const toolName = data.toolname || data.toolName || "unknown";
            const decision = data.decision || "ALLOW";
            const riskScore = data.riskscore || data.riskScore || 0;
            const costUsd = data.cost_usd || data.costUsd || 0;
            const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date());
            const parameters = data.parameters || data.arguments || "{}";
            const metadata = data.metadata || {};

            // Check if exists in Postgres to avoid duplicates
            // We use timestamp + agentId + toolName as a loose fingerprint
            const check = await pool.query(
                "SELECT id FROM audit_logs WHERE tenantid = $1 AND agentid = $2 AND toolname = $3 AND timestamp = $4",
                [tenantId, agentId, toolName, timestamp.toISOString()]
            );

            if (check.rows.length === 0) {
                await pool.query(
                    "INSERT INTO audit_logs (tenantid, agentid, toolname, parameters, decision, riskscore, cost_usd, metadata, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                    [
                        tenantId,
                        agentId,
                        toolName,
                        typeof parameters === 'string' ? parameters : JSON.stringify(parameters),
                        decision,
                        riskScore,
                        costUsd,
                        JSON.stringify(metadata),
                        timestamp.toISOString()
                    ]
                );
                migratedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`✅ Migration Complete!`);
        console.log(`📈 Migrated: ${migratedCount}`);
        console.log(`⏭️ Skipped (already in DB): ${skippedCount}`);

    } catch (err) {
        console.error("❌ Migration failed:", err);
    }
}

migrate();
