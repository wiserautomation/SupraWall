import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * Scheduled function to reset usage counters for all organizations
 * Runs at 00:00 on the 1st day of every month.
 */
export const resetMonthlyUsage = onSchedule("0 0 1 * *", async (event) => {
    const orgsSnapshot = await db.collection("organizations").get();

    let batch = db.batch();
    let count = 0;
    let committedCount = 0;

    for (const doc of orgsSnapshot.docs) {
        batch.update(doc.ref, {
            operationsThisMonth: 0,
            lastReportedCount: 0,
            resetAt: admin.firestore.FieldValue.serverTimestamp()
        });
        count++;

        // Firestore batch limit is 500 operations
        if (count === 500) {
            await batch.commit();
            committedCount += count;
            batch = db.batch();
            count = 0;
        }
    }

    if (count > 0) {
        await batch.commit();
        committedCount += count;
    }

    console.log(`[Billing] Successfully reset monthly usage for ${committedCount} organizations.`);
});

/**
 * Cleanup old audit logs and events based on pricing tier retention limits.
 * runs at 03:00 every day.
 */
export const cleanupOldLogs = onSchedule("0 3 * * *", async (event) => {
    const now = new Date();

    // Retention limits:
    // Starter (not 'active'): 30 days
    // Production ('active'): 365 days
    const freeRetentionDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const paidRetentionDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

    const collections = ["audit_logs", "connect_events"];
    let totalDeletedCount = 0;

    // Process organizations to know their IDs/userIDs
    const orgsSnapshot = await db.collection("organizations").get();
    const activeOrgIds = new Set(orgsSnapshot.docs
        .filter(doc => doc.data().status === "active")
        .map(doc => doc.id));

    for (const collectionName of collections) {
        // 1. Delete logs older than 365 days (max retention for anyone)
        const veryOldLogs = await db.collection(collectionName)
            .where("timestamp", "<", paidRetentionDate)
            .limit(500)
            .get();

        if (!veryOldLogs.empty) {
            const batch = db.batch();
            veryOldLogs.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            totalDeletedCount += veryOldLogs.size;
        }

        // 2. Delete logs older than 30 days for Starter tier
        const moderatelyOldLogs = await db.collection(collectionName)
            .where("timestamp", "<", freeRetentionDate)
            .limit(500)
            .get();

        if (!moderatelyOldLogs.empty) {
            const batch = db.batch();
            let count = 0;

            for (const doc of moderatelyOldLogs.docs) {
                const data = doc.data();
                const orgId = data.platformId || data.userId || data.ownerId;
                // Note: and fallback for checking agentId to find userId

                // For simplicity: If it doesn't clearly belong to an active org, cleanup after 30 days.
                if (!orgId || !activeOrgIds.has(orgId)) {
                    batch.delete(doc.ref);
                    count++;
                }
            }
            if (count > 0) {
                await batch.commit();
                totalDeletedCount += count;
            }
        }
    }

    console.log(`[Billing] Cleanup complete. Deleted ${totalDeletedCount} expired documents.`);
});
