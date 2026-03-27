// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { userId, email, plan } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Map plan to price ID
        let priceId = process.env.STRIPE_METERED_PRICE_ID; // Default / Business
        if (plan === 'starter') priceId = process.env.STRIPE_STARTER_PRICE_ID;
        if (plan === 'growth') priceId = process.env.STRIPE_GROWTH_PRICE_ID;
        if (plan === 'business') priceId = process.env.STRIPE_BUSINESS_PRICE_ID;

        if (!priceId) {
            console.error(`No price ID found for plan: ${plan}`);
            return NextResponse.json({ error: 'Invalid plan selection' }, { status: 400 });
        }

        // 1. Create or retrieve Stripe Customer
        const customers = await stripe.customers.list({ email, limit: 1 });
        let customerId = customers.data[0]?.id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: { firebaseUserId: userId },
            });
            customerId = customer.id;
        }

        // 2. Create Checkout Session for Metered Subscription
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: priceId,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
            client_reference_id: userId,
            subscription_data: {
                metadata: { firebaseUserId: userId, plan },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
