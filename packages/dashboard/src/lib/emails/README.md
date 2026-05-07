# SupraWall Email System

This directory contains the core logic for the SupraWall Transactional Email System, integrated via **Brevo**.

## Components
- `brevo.ts`: Low-level API client for Brevo SMTP Transactional API (v3).
- `dispatcher.ts`: High-level utility to send emails by tag (e.g., `SW-A-003`). Handles template injection and variable substitution.
- `phase1.ts`: Content and metadata for the critical Phase 1 templates (Security, Budget, HITL).
- `templates/`: HTML/TS base templates using the "Technical Noir" design system.

## Configuration
The system requires the following environment variables:
- `BREVO_API_KEY`: API token from Brevo (SMTP v3).
- `EMAIL_DRY_RUN`: Set to `true` for local development to skip API calls and log to console.
- `ADMIN_EMAILS`: Comma-separated list of fallback administrator emails.

## Usage
Use the `dispatchEmail` function from the dispatcher:

```typescript
import { dispatchEmail } from '@/lib/emails/dispatcher';

await dispatchEmail("SW-A-003", "peghin@gmail.com", {
  agent_name: "DefenseAgent",
  threat_type: "SQL Injection",
  tool_target: "database_query"
});
```

## Local Testing
A test script is provided to verify connectivity and template rendering:

```bash
# In the dashboard package
EMAIL_DRY_RUN=true npx jiti src/lib/emails/test-brevo.js
```

## Templates
Templates are defined in `phase1.ts`. Each template has a unique ID (e.g., `SW-A-001`) and supports variable substitution using `{{variable_name}}` syntax.
