// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Property ID fallback from the user-provided URL if env var is missing
const propertyId = process.env.GA_PROPERTY_ID || '525946717';

export function getGAClient() {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    if (privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim();
    }
    
    const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').trim();

    if (!privateKey || !clientEmail) {
        throw new Error("Missing GA credentials (FIREBASE_PRIVATE_KEY/FIREBASE_CLIENT_EMAIL)");
    }

    return new BetaAnalyticsDataClient({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
    });
}

export { propertyId };
