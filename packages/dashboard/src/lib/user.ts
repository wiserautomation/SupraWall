// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { getAdminAuth, getAdminDb } from "./firebase-admin";

export async function getUserEmail(userId: string): Promise<string | null> {
    try {
        const user = await getAdminAuth().getUser(userId);
        return user.email || null;
    } catch (error) {
        console.error(`Error fetching user email for ${userId}:`, error);
        return null;
    }
}

/**
 * Resolves the effective tenant ID for a user.
 * If the user has a 'tenantId' field in their Firestore user document, returns it.
 * Otherwise, returns the user's UID.
 */
export async function getEffectiveTenantId(userId: string): Promise<string> {
    try {
        const db = getAdminDb();
        const userDoc = await db.collection("users").doc(userId).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            if (data?.tenantId) return data.tenantId;
        }
    } catch (error) {
        console.warn(`[Identity] Failed to resolve tenantId for ${userId}, falling back to UID:`, error);
    }
    return userId;
}

export async function getTenantAdminEmails(tenantId: string): Promise<string[]> {
    // In a real multi-tenant app, you'd query the DB for users associated with this tenant
    // For now, we'll return the system admins as a fallback if no tenant-specific admins are found.
    // This is a placeholder for real tenant isolation logic.
    return [process.env.DEFAULT_ADMIN_EMAIL || 'admin@supra-wall.com'];
}
