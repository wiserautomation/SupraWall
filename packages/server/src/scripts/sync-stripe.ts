// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia" as any,
});

const TIER_PRICING = [
    {
        tier: "developer",
        name: "SupraWall Developer",
        base_price: 3900, // $39.00
        overage_rate: 0.003,
        eval_limit: 25000,
        description: "For solo builders ready to move to the cloud. Includes 25K evaluations."
    },
    {
        tier: "team",
        name: "SupraWall Team",
        base_price: 7900, // $79.00
        overage_rate: 0.002,
        eval_limit: 250000,
        description: "For teams scaling AI security infrastructure. Includes 250K evaluations."
    },
    {
        tier: "business",
        name: "SupraWall Business",
        base_price: 24900, // $249.00
        overage_rate: 0.001,
        eval_limit: 2000000,
        description: "Professional grade security for growth companies. Includes 2M evaluations."
    }
];

export async function syncStripe() {
    console.log("🚀 Starting SupraWall pricing synchronization with Stripe...");
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error("❌ STRIPE_SECRET_KEY is missing from environment.");
        process.exit(1);
    }

    const priceIds: Record<string, { base: string; metered?: string }> = {};

    for (const tier of TIER_PRICING) {
        console.log(`\n📦 Provisioning Tier: ${tier.name}...`);

        // 1. Create or Update Product
        const product = await stripe.products.create({
            name: tier.name,
            description: tier.description,
            metadata: { suprawall_tier: tier.tier },
        });

        // 2. Create Base Recurring Price
        const basePrice = await stripe.prices.create({
            product: product.id,
            unit_amount: tier.base_price,
            currency: "usd",
            recurring: { interval: "month" },
            nickname: `${tier.name} (Base Fee)`,
        });

        // 3. Create Metered Overage Price
        const meteredPrice = await stripe.prices.create({
            product: product.id,
            unit_amount_decimal: (tier.overage_rate * 100).toString(), // $0.002 -> 0.2 cents
            currency: "usd",
            recurring: { 
                interval: "month",
                usage_type: "metered",
                aggregate_usage: "sum"
            },
            nickname: `${tier.name} Evaluation Overages (Per Unit)`,
        } as any);

        priceIds[tier.tier] = {
            base: basePrice.id,
            metered: meteredPrice.id
        };

        console.log(`✅ Base Price created: ${basePrice.id}`);
        console.log(`✅ Metered Price created: ${meteredPrice.id}`);
    }

    console.log("\n✨ Synchronization Complete! Add these to your .env file:");
    console.log("---------------------------------------------------------");
    for (const [tier, ids] of Object.entries(priceIds)) {
        console.log(`STRIPE_PRICE_${tier.toUpperCase()}="${ids.base}"`);
        console.log(`STRIPE_PRICE_${tier.toUpperCase()}_METERED="${ids.metered}"`);
    }
    console.log("---------------------------------------------------------");
}

if (require.main === module) {
    syncStripe().catch(console.error);
}
