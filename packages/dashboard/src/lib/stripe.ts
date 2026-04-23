// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import Stripe from 'stripe';

// Lazy singleton: defer validation to first use so that Next.js can build
// pages that don't touch Stripe without requiring the key at build time.
// The missing-key error will surface at runtime when a billing route is hit.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === 'sk_test_placeholder') {
      throw new Error(
        '[Stripe] STRIPE_SECRET_KEY is missing or is still the placeholder value. ' +
        'Set a real key in your Vercel environment variables.'
      );
    }
    _stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' });
  }
  return _stripe;
}

// Backwards-compat export for any code that already imports `stripe` directly.
// Accessing this in a request handler (not at module scope) is safe.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});
