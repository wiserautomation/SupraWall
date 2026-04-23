// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyAuthFull, unauthorizedResponse } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
    try {
        // SECURITY: Authenticate — userId and email come from the verified token
        const authResult = await verifyAuthFull(req);
        if (!authResult) return unauthorizedResponse();

        const userId = authResult.uid;
        const email = authResult.email;
        const { plan } = await req.json();

        // Map plan to price IDs (Base + Metered)
        let basePriceId = "";
        let meteredPriceId = "";

        if (plan === 'developer') {
            basePriceId = process.env.STRIPE_DEVELOPER_PRICE_ID!;
            meteredPriceId = process.env.STRIPE_DEVELOPER_METERED_PRICE_ID!;
        } else if (plan === 'team') {
            basePriceId = process.env.STRIPE_TEAM_PRICE_ID!;
            meteredPriceId = process.env.STRIPE_TEAM_METERED_PRICE_ID!;
        } else if (plan === 'business') {
            basePriceId = process.env.STRIPE_BUSINESS_PRICE_ID!;
            meteredPriceId = process.env.STRIPE_BUSINESS_METERED_PRICE_ID!;
        }

        if (!basePriceId || !meteredPriceId) {
            console.error(`Missing Price IDs for plan: ${plan}`);
            return NextResponse.json({ error: 'Infrastructure Error: Missing Price IDs' }, { status: 500 });
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

        // 2. Create Checkout Session for Base + Metered Subscription
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            billing_address_collection: 'auto',
            line_items: [
                { price: basePriceId, quantity: 1 },
                { price: meteredPriceId } // Metered pricing (tracked via usage records)
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
