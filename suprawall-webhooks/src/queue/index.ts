import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { WebhookPayload, WebhookEndpoint } from '../types';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const webhookQueue = new Queue('suprawall-webhooks', {
    connection,
    defaultJobOptions: {
        attempts: 5,        // Automatic retry logic
        backoff: {
            type: 'exponential',
            delay: 1000,    // 1s, 2s, 4s, 8s, 16s...
        },
        removeOnComplete: true, // Keep redis clean
        removeOnFail: false     // Keep failed for debugging / DLQ
    }
});

export interface WebhookJobData {
    endpoint: WebhookEndpoint;
    payload: WebhookPayload;
}

export async function dispatchWebhook(endpoint: WebhookEndpoint, payload: WebhookPayload) {
    if (!endpoint.enabled) return;
    if (!endpoint.events.includes(payload.event)) return; // Filter checks

    // Enqueue the job for resilient delivery
    await webhookQueue.add(\`webhook-\${payload.id}\`, {
        endpoint,
        payload
    });
    
    console.log(\`[Webhook] Enqueued \${payload.event} for \${endpoint.url}\`);
}
