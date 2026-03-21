export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * Admin endpoint to setup the Stripe Billing Meter and Graduated Price.
 * This implements the Board's requested pricing model:
 * - 10k - 500k: $0.002
 * - 500k - 2M: $0.0015
 * - 2M - 10M: $0.001
 * - 10M+: $0.0005
 */
export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Create a Product
        const product = await stripe.products.create({
            name: 'SupraWall Policy Evaluations',
            description: 'Metered usage-based security enforcement for AI agents',
        });

        // 2. Create a Billing Meter
        const meter = await stripe.billing.meters.create({
            display_name: 'Policy Evaluations',
            event_name: 'guarded_operation',
            default_aggregation: { formula: 'sum' },
        });

        // 3. Create a Graduated Price (USD)
        // Note: Stripe Price API uses 'unit_amount_decimal' or 'tiers'
        const price = await stripe.prices.create({
            currency: 'usd',
            recurring: { 
                interval: 'month',
                usage_type: 'metered',
                meter: meter.id 
            },
            product: product.id,
            billing_scheme: 'tiered',
            tiers_mode: 'graduated',
            tiers: [
                {
                    up_to: 10000,
                    unit_amount_decimal: '0', // Free
                },
                {
                    up_to: 500000,
                    unit_amount_decimal: '0.2', // $0.002 (scaled by 100 for cents)
                },
                {
                    up_to: 2000000,
                    unit_amount_decimal: '0.15', // $0.0015
                },
                {
                    up_to: 10000000,
                    unit_amount_decimal: '0.1', // $0.001
                },
                {
                    up_to: 'inf',
                    unit_amount_decimal: '0.05', // $0.0005
                }
            ],
        });

        return NextResponse.json({
            success: true,
            productId: product.id,
            meterId: meter.id,
            priceId: price.id,
            msg: 'Stripe usage-based infrastructure successfully created.'
        });

    } catch (error: any) {
        console.error('Stripe Setup Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
