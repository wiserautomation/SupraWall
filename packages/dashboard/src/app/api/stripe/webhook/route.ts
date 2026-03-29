// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

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
        // Detect if this is a V2 "Thin" event (contains 'v2' in object or type)
        const isV2 = payload.includes('"object":"v2.core.event"');
        
        if (isV2) {
            // For now, we acknowledge V2 events to prevent Stripe from retrying, 
            // but our current logic focuses on V1 snapshots for sub management.
            console.log("🛡️ SupraWall: Received Stripe V2 (Thin) Event. Acknowledged.");
            return NextResponse.json({ received: true, style: 'v2' });
        }

        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
        console.error(`[Webhook Signature Check Failed]: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event (Snapshot style)
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as any;
            const userId = session.client_reference_id;
            const subscriptionId = session.subscription;

            // Fetch subscription to get the Item ID (needed for reporting usage)
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const subscriptionItemId = subscription.items.data[0].id;

            // In Stripe SDK v16+, current_period_end is on each subscription item rather than the root
            const periodEnd = (subscription as any).current_period_end
                ?? (subscription.items.data[0] as any)?.current_period_end
                ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

            await db.collection('organizations').doc(userId).set({
                stripeCustomerId: session.customer,
                stripeSubscriptionId: subscriptionId,
                stripeSubscriptionItemId: subscriptionItemId,
                plan: session.metadata?.plan || 'open_source',
                status: 'active',
                hasPaymentMethod: true,
                currentPeriodEnd: admin.firestore.Timestamp.fromMillis(periodEnd * 1000),
            }, { merge: true });

            // Also sync to users collection for evaluate route
            await db.collection('users').doc(userId).set({
                plan: session.metadata?.plan || 'open_source',
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

                // Restore agent permissions on backend — must succeed for billing integrity
                const restoreRes = await fetch(`${process.env.SUPRAWALL_API_URL}/v1/stripe-app/budget-ctrl`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'restore', subscriptionId }),
                });
                if (!restoreRes.ok) {
                    console.error(`[Webhook] Failed to restore agent permissions for sub ${subscriptionId}: ${restoreRes.status}`);
                    return NextResponse.json({ error: 'Backend sync failed' }, { status: 502 });
                }
            }
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as any;
            const subscriptionId = invoice.subscription;

            // Revoke agent permissions — must succeed so Stripe retries on failure
            const revokeRes = await fetch(`${process.env.SUPRAWALL_API_URL}/v1/stripe-app/budget-ctrl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'revoke', subscriptionId }),
            });
            if (!revokeRes.ok) {
                console.error(`[Webhook] Failed to revoke agent permissions for sub ${subscriptionId}: ${revokeRes.status}`);
                return NextResponse.json({ error: 'Backend sync failed' }, { status: 502 });
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
                const subscriptionId = subscription.id;
                await orgQuery.docs[0].ref.update({ status: 'canceled' });

                // Revoke agent permissions on backend — must succeed
                const deleteRevokeRes = await fetch(`${process.env.SUPRAWALL_API_URL}/v1/stripe-app/budget-ctrl`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'revoke', subscriptionId }),
                });
                if (!deleteRevokeRes.ok) {
                    console.error(`[Webhook] Failed to revoke on subscription delete for ${subscriptionId}: ${deleteRevokeRes.status}`);
                    return NextResponse.json({ error: 'Backend sync failed' }, { status: 502 });
                }
            }
            break;
        }
    }

    return NextResponse.json({ received: true });
}
