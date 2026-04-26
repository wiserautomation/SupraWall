// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { sendTransactionalEmail } from './mailerlite';
import { phase1Templates } from './phase1';
import { BASE_EMAIL_TEMPLATE } from './templates/base';

/**
 * High-level email dispatcher for SupraWall system events (via MailerLite).
 * Encapsulates template rendering and sender selection.
 */

// Mapping of tags to Brevo Template IDs
// In a real production environment, these would be in environment variables or a DB config
const TEMPLATE_MAP: Record<string, number> = {
  "SW-T-001": 1,
  "SW-T-002": 2,
  "SW-HITL-001": 3,
  "SW-HITL-002": 4,
  "SW-HITL-003": 5,
  "SW-A-001": 6,
  "SW-A-003": 7,
  // ... more mappings as templates are created
};

export async function dispatchEmail(
  tag: string, 
  to: string, 
  params: Record<string, any>,
  name?: string
) {
  const templateConfig = phase1Templates.find(t => t.id === tag);
  if (!templateConfig) {
    console.warn(`No template config found for tag: ${tag}`);
    return { success: false, error: "Missing template config" };
  }

  // Determine sender based on tag or category
  const isSecurity = tag.startsWith('SW-A-') || tag.startsWith('SW-HITL-') || tag.startsWith('SW-SYS-');
  const sender = isSecurity 
    ? { name: 'SupraWall Security', email: process.env.EMAIL_SENDER_SECURITY || 'security@supra-wall.com' }
    : { name: 'SupraWall Team', email: process.env.EMAIL_SENDER_TEAM || 'team@supra-wall.com' };

  // Inject content into base template
  let html = BASE_EMAIL_TEMPLATE.replace('{{content}}', templateConfig.content);
  let subject = templateConfig.subject;

  // Simple variable substitution for both subject and html
  Object.keys(params).forEach(key => {
    const value = params[key];
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
    subject = subject.replace(regex, value);
  });

  console.info(`[Email Dispatcher] Dispatching ${tag} to ${to}...`);

  return await sendTransactionalEmail({
    to: { email: to, name },
    from: sender,
    subject: subject,
    html: html
  });
}
