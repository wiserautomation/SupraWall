// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import Stripe from 'stripe';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing. Dashboard cannot initialize payment processing.");
}

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2026-02-25.clover',
});
