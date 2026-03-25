// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import * as crypto from 'crypto';
import { WebhookPayload } from '../types';

/**
 * Signs the payload exactly like Stripe does.
 * Format:
 * t=1614556800,v1=...signature...
 */
export function signWebhookPayload(payload: WebhookPayload, secret: string, timestamp: number = Math.floor(Date.now() / 1000)): string {
    const payloadString = JSON.stringify(payload);

    // Create the string to sign: timestamp + '.' + JSON payload
    const signedPayload = `${timestamp}.${payloadString}`;
    
    // HMAC SHA256 signature
    const signature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload, 'utf8')
        .digest('hex');
    
    // Return standard format: t=... timestamp ...,v1=... signature ...
    return `t=${timestamp},v1=${signature}`;
}

/**
 * For users: verify a webhook
 */
export function verifySignature(payloadString: string, headerSignature: string, secret: string): boolean {
    try {
        const parts = headerSignature.split(',');
        const t = parts.find(p => p.startsWith('t='))?.split('=')[1];
        const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];
        
        if (!t || !v1) return false;
        
        const signedPayload = `${t}.${payloadString}`;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(signedPayload, 'utf8')
            .digest('hex');
            
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(v1)
        );
    } catch (e) {
        return false;
    }
}
