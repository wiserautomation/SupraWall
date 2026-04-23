---
name: suprawall:security-policy
trigger: When the agent is about to execute a tool that interacts with
  external APIs, databases, file systems, or credentials.
---

## Security Policy Reasoning

Before executing any tool that touches external systems, follow this checklist:

1. **Credential Safety**: Never hardcode API keys or passwords in tool arguments.
   Use `suprawall_vault_get` to retrieve secrets from the vault.

2. **Pre-Execution Check**: For destructive operations (DELETE, DROP, rm -rf,
   send_email, transfer_funds), call `suprawall_check` first to verify
   the action is permitted by security policy.

3. **PII Awareness**: Never include real email addresses, phone numbers,
   SSNs, or credit card numbers in tool arguments or outputs.
   SupraWall will scrub these automatically, but avoid generating them.

4. **Budget Consciousness**: Check `/suprawall budget` periodically.
   If you're approaching the cost limit, prioritize efficiency.

5. **Escalation**: If `suprawall_check` returns REQUIRE_APPROVAL,
   inform the user that a human must approve the action via the
   SupraWall dashboard before it can proceed.
