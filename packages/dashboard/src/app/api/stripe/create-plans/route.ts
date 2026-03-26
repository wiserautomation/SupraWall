// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * Admin endpoint to create the 3 Cloud subscription products in Stripe.
 * Run once to set up the billing plans, then store the price IDs in env vars.
 *
 * POST /api/stripe/create-plans
 * Authorization: Bearer <CRON_SECRET>
 */
export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // ---- Cloud Starter: $49/mo ----
        const starterProduct = await stripe.products.create({
            name: 'SupraWall Cloud Starter',
            description: 'Up to 50K evaluations/mo included. Unlimited agents, Cloud Vault, full dashboard.',
            metadata: { tier: 'cloud', plan: 'starter' },
        });
        const starterPrice = await stripe.prices.create({
            currency: 'usd',
            product: starterProduct.id,
            recurring: { interval: 'month' },
            unit_amount: 4900, // $49.00
        });

        // ---- Cloud Growth: $149/mo ----
        const growthProduct = await stripe.products.create({
            name: 'SupraWall Cloud Growth',
            description: 'Up to 500K evaluations/mo included. Slack approvals, PDF compliance, priority support.',
            metadata: { tier: 'cloud', plan: 'growth' },
        });
        const growthPrice = await stripe.prices.create({
            currency: 'usd',
            product: growthProduct.id,
            recurring: { interval: 'month' },
            unit_amount: 14900, // $149.00
        });

        // ---- Cloud Scale: $499/mo ----
        const scaleProduct = await stripe.products.create({
            name: 'SupraWall Cloud Scale',
            description: 'Up to 5M evaluations/mo included. HSM Vault, custom threat models, SSO.',
            metadata: { tier: 'cloud', plan: 'scale' },
        });
        const scalePrice = await stripe.prices.create({
            currency: 'usd',
            product: scaleProduct.id,
            recurring: { interval: 'month' },
            unit_amount: 49900, // $499.00
        });

        return NextResponse.json({
            success: true,
            plans: {
                starter: { productId: starterProduct.id, priceId: starterPrice.id, amount: '$49/mo' },
                growth:  { productId: growthProduct.id,  priceId: growthPrice.id,  amount: '$149/mo' },
                scale:   { productId: scaleProduct.id,   priceId: scalePrice.id,   amount: '$499/mo' },
            },
            msg: 'Cloud subscription plans created. Store the priceIds as STRIPE_CLOUD_STARTER_PRICE_ID, STRIPE_CLOUD_GROWTH_PRICE_ID, STRIPE_CLOUD_SCALE_PRICE_ID.',
        });
    } catch (error: any) {
        console.error('Stripe Create Plans Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
