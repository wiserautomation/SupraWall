import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';
import admin from 'firebase-admin';

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

            await db.collection('organizations').doc(userId).set({
                stripeCustomerId: session.customer,
                stripeSubscriptionId: subscriptionId,
                stripeSubscriptionItemId: subscriptionItemId,
                status: 'active',
                hasPaymentMethod: true,
                currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
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
                    // Reset local counter if needed, or rely on Stripe's period management
                });
            }
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as any;
            const orgQuery = await db.collection('organizations')
                .where('stripeSubscriptionId', '==', subscription.id)
                .limit(1)
                .get();

            if (!orgQuery.empty) {
                await orgQuery.docs[0].ref.update({ status: 'canceled' });
            }
            break;
        }
    }

    return NextResponse.json({ received: true });
}
