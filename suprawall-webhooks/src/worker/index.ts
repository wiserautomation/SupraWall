import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { WebhookJobData } from '../queue';
import { signWebhookPayload } from '../utils/signature';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const worker = new Worker('suprawall-webhooks', async (job: Job<WebhookJobData>) => {
    const { endpoint, payload } = job.data;

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signWebhookPayload(payload, endpoint.secret, timestamp);

    console.log(\`[Worker] Attempting delivery of \${payload.id} to \${endpoint.url} (Attempt \${job.attemptsMade + 1})\`);
    
    const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'SupraWall-Signature': signature,
            'User-Agent': 'SupraWall-Webhook/1.0'
        },
        body: JSON.stringify(payload),
        // Timeout to prevent hanging connections
        signal: AbortSignal.timeout(10000) 
    });

    if (!response.ok) {
        throw new Error(\`Delivery failed with status \${response.status}: \${response.statusText}\`);
    }

    console.log(\`[Worker] Successfully delivered \${payload.id} to \${endpoint.url}\`);
    return true;
}, { connection });

worker.on('failed', (job, err) => {
    if (job) {
        console.warn(\`[Worker] Job \${job.id} failed: \${err.message}\`);
    } else {
        console.error('[Worker] Unknown failure:', err);
    }
});

console.log('[Worker] Webhook delivery worker started and listening to queue...');
