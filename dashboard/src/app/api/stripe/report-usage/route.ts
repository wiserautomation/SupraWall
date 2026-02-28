import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    // 1. Verify internal API key for security
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Fetch all active organizations with usage
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

            // 1. Calculate the delta (new work done since last cron run)
            // We only bill after the first 100k operations.
            // If total < 100k, we report nothing.
            // If total > 100k, we report the part above 100k that hasn't been reported yet.

            const totalBillable = Math.max(0, operationsThisMonth - 100000);
            const alreadyReportedBillable = Math.max(0, lastReportedCount - 100000);

            const delta = totalBillable - alreadyReportedBillable;

            // 2. Report to Stripe Billing Meter
            if (delta > 0) {
                await stripe.billing.meterEvents.create({
                    event_name: 'guarded_operation',
                    payload: {
                        value: delta.toString(),
                        stripe_customer_id: customerId,
                    },
                    timestamp: Math.floor(Date.now() / 1000),
                });

                // 3. Update 'lastReportedCount' in Firestore so we don't double-charge
                await doc.ref.update({
                    lastReportedCount: operationsThisMonth
                });

                results.push({ orgId: doc.id, reportedDelta: delta, newTotal: operationsThisMonth });
            }
        }

        return NextResponse.json({
            success: true,
            status: 'Sync complete',
            syncedCustomers: results.length,
            details: results
        });
    } catch (error: any) {
        console.error('Usage Reporting Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
