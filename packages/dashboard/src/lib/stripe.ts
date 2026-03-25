// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
});
