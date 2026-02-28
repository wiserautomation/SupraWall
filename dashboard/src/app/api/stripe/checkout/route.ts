export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { userId, email } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        // Note: The product/price must be configured as 'metered' in Stripe Dashboard
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: process.env.STRIPE_METERED_PRICE_ID, // E.g. price_123...
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${req.headers.get('origin')}/pricing?canceled=true`,
            client_reference_id: userId,
            subscription_data: {
                metadata: { firebaseUserId: userId },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
