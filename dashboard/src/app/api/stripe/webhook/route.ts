export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, admin } from '@/lib/firebase-admin';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as any;
            const userId = session.client_reference_id;
            const subscriptionId = session.subscription;

            // Fetch subscription to get the Item ID (needed for reporting usage)
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const subscriptionItemId = subscription.items.data[0].id;

            // In Stripe SDK v18+, current_period_end is on each subscription item
            const periodEnd = (subscription as any).current_period_end
                ?? subscription.items.data[0]?.current_period_end
                ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

            await db.collection('organizations').doc(userId).set({
                stripeCustomerId: session.customer,
                stripeSubscriptionId: subscriptionId,
                stripeSubscriptionItemId: subscriptionItemId,
                status: 'active',
                hasPaymentMethod: true,
                currentPeriodEnd: admin.firestore.Timestamp.fromMillis(periodEnd * 1000),
            }, { merge: true });
            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as any;
            const subscriptionId = invoice.subscription;

            const orgQuery = await db.collection('organizations')
                .where('stripeSubscriptionId', '==', subscriptionId)
                .limit(1)
                .get();

            if (!orgQuery.empty) {
                const orgDoc = orgQuery.docs[0];
                await orgDoc.ref.update({
                    status: 'active',
                });

                // Restore agent permissions on backend
                await fetch(`${process.env.SUPRAWALL_API_URL}/v1/stripe-app/budget-ctrl`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'restore', subscriptionId }),
                });
            }
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as any;
            const subscriptionId = invoice.subscription;

            // Call SupraWall API to revoke agent permissions
            await fetch(`${process.env.SUPRAWALL_API_URL}/v1/stripe-app/budget-ctrl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'revoke', subscriptionId }),
            });
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as any;
            const orgQuery = await db.collection('organizations')
                .where('stripeSubscriptionId', '==', subscription.id)
                .limit(1)
                .get();

            if (!orgQuery.empty) {
                const subscriptionId = subscription.id;
                await orgQuery.docs[0].ref.update({ status: 'canceled' });

                // Revoke agent permissions on backend
                await fetch(`${process.env.SUPRAWALL_API_URL}/v1/stripe-app/budget-ctrl`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'revoke', subscriptionId }),
                });
            }
            break;
        }
    }

    return NextResponse.json({ received: true });
}
