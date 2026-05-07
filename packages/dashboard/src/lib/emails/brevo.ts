// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Brevo Transactional Email Client for SupraWall.
 * Handles delivery of security alerts, HITL approvals, and system notifications.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export interface BrevoEmailOptions {
  to: {
    email: string;
    name?: string;
  };
  from: {
    email: string;
    name?: string;
  };
  subject: string;
  html: string;
  variables?: Record<string, any>;
}

export async function sendTransactionalEmail(options: BrevoEmailOptions) {
  // Dry run mode for local development without API keys
  if (process.env.EMAIL_DRY_RUN === 'true') {
    console.info('[Email Dry Run] Skipping API call. Payload:', JSON.stringify({
      to: options.to,
      from: options.from,
      subject: options.subject
    }, null, 2));
    return { success: true, data: { message: 'Dry run successful' } };
  }

  const apiKey = process.env.BREVO_API_KEY || process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not defined in environment variables');
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          email: options.from.email,
          name: options.from.name
        },
        to: [
          {
            email: options.to.email,
            name: options.to.name
          }
        ],
        subject: options.subject,
        htmlContent: options.html,
        params: options.variables
      }),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error('Brevo API error (POST email):', {
        status: response.status,
        data,
        sentFrom: options.from.email,
        sentTo: options.to.email
      });
      throw new Error(data.message || `Failed to send email via Brevo (Status: ${response.status})`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Brevo send error:', error);
    return { success: false, error };
  }
}
