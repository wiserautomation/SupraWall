export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';

async function handleUsageReport(req: Request) {
    // Verify the CRON_SECRET so only Vercel (or an authorized caller) can trigger this
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch all active organisations
        const orgsSnapshot = await db.collection('organizations')
            .where('status', '==', 'active')
            .get();

        const results = [];

        for (const doc of orgsSnapshot.docs) {
            const data = doc.data();
            const operationsThisMonth = data.operationsThisMonth || 0;
            const lastReportedCount = data.lastReportedCount || 0;
            const customerId = data.stripeCustomerId;

            if (!customerId) continue;

            // Only bill operations above the 100 000 free-tier ceiling
            const totalBillable = Math.max(0, operationsThisMonth - 100_000);
            const alreadyReportedBillable = Math.max(0, lastReportedCount - 100_000);
            const delta = totalBillable - alreadyReportedBillable;

            if (delta > 0) {
                // Push the delta to Stripe Billing Meter
                await stripe.billing.meterEvents.create({
                    event_name: 'guarded_operation',
                    payload: {
                        value: delta.toString(),
                        stripe_customer_id: customerId,
                    },
                    timestamp: Math.floor(Date.now() / 1000),
                });

                // Update Firestore so we don't double-charge on the next run
                await doc.ref.update({ lastReportedCount: operationsThisMonth });

                results.push({ orgId: doc.id, reportedDelta: delta, newTotal: operationsThisMonth });
            }
        }

        return NextResponse.json({
            success: true,
            status: 'Sync complete',
            syncedCustomers: results.length,
            details: results,
        });
    } catch (error: any) {
        console.error('Usage Reporting Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Vercel cron jobs call with GET — this is the primary trigger
export async function GET(req: Request) {
    return handleUsageReport(req);
}

// POST kept for manual / programmatic triggers
export async function POST(req: Request) {
    return handleUsageReport(req);
}
