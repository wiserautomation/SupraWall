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
    const emails: string[] = [];

    try {
        // 1. Try to resolve the tenantId as a Firebase UID
        const user = await getAdminAuth().getUser(tenantId);
        if (user.email) {
            emails.push(user.email);
        }
    } catch (error) {
        // tenantId might not be a UID or user doesn't exist
    }

    // 2. Fallback to ADMIN_EMAILS environment variable
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.DEFAULT_ADMIN_EMAIL || '')
        .split(',')
        .map(e => e.trim())
        .filter(Boolean);
    
    if (adminEmails.length > 0) {
        emails.push(...adminEmails);
    }

    // 3. Last resort fallback
    if (emails.length === 0) {
        emails.push('admin@supra-wall.com');
    }

    // Return unique emails
    return [...new Set(emails)];
}
