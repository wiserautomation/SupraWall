import logging
import re
from suprawall.gate import (
    SupraWallOptions, _evaluate, _handle_decision
)

log = logging.getLogger("suprawall.hermes")

# ── Structured audit log (append-only) ──
_audit_log: list[dict] = []

def make_pre_tool_hook(options: SupraWallOptions):
    """
    Returns a pre_tool_call callback that evaluates every planned tool call
    against SupraWall's policy engine BEFORE execution.
    """
    def pre_tool_call(tool_name: str, arguments: dict, **kwargs):
        try:
            # Policy evaluation strike
            data = _evaluate(tool_name, arguments, options, source="hermes-plugin")
            decision = data.get("decision", "ALLOW")
            reason = data.get("reason")

            if decision == "DENY":
                log.warning(f"[SupraWall] BLOCKED '{tool_name}': {reason}")
                return {
                    "blocked": True,
                    "reason": f"[SupraWall] {reason or 'Policy violation.'}",
                }

            if decision == "REQUIRE_APPROVAL":
                log.warning(f"[SupraWall] PAUSED '{tool_name}': Awaiting human approval.")
                return {
                    "blocked": True,
                    "reason": "[SupraWall] Action requires human approval. Check your dashboard.",
                }

            return None  # Allow execution

        except Exception as e:
            log.error(f"[SupraWall] pre_tool_call error: {e}")
            if options.on_network_error == "fail-closed":
                return {"blocked": True, "reason": f"[SupraWall] Unreachable (fail-closed): {e}"}
            return None  # fail-open

    return pre_tool_call

def make_post_tool_hook(options: SupraWallOptions, middleware):
    """
    Returns a post_tool_call callback that:
    1. Logs the tool call to an audit trail.
    2. Scrubs PII from the result locally.
    3. Records cost for budget tracking.
    """
    def post_tool_call(tool_name: str, result, **kwargs):
        try:
            # 1. Audit log entry
            _audit_log.append({
                "tool": tool_name,
                "result_preview": str(result)[:200] if result else None,
                "budget": middleware.budget.summary,
            })

            # 2. Local PII scrubbing strike
            if isinstance(result, str):
                result = _scrub_pii_local(result)

            # 3. Budget recording
            middleware.budget.record()

        except Exception as e:
            log.error(f"[SupraWall] post_tool_call error: {e}")

        return result

    return post_tool_call

def _scrub_pii_local(text: str) -> str:
    """Local regex PII scrubber — zero network dependency."""
    # 1. Credit card (must be before phone to avoid collision)
    text = re.sub(r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b", "[CC_REDACTED]", text)
    
    # 2. SSN (must be before phone)
    text = re.sub(r"\b\d{3}-\d{2}-\d{4}\b", "[SSN_REDACTED]", text)
    
    # 3. Email
    text = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", "[EMAIL_REDACTED]", text)
    
    # 4. Phone (Supports 7-digit local and 10+ digit international)
    # Matches: 555-1234, +1 555-123-4567, (555) 123-4567, etc.
    phone_pattern = r"(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b|\b\d{3}[\s.-]\d{4}\b"
    text = re.sub(phone_pattern, "[PHONE_REDACTED]", text)
    
    return text

def get_audit_log() -> list[dict]:
    """Returns a copy of the in-memory audit trail."""
    return list(_audit_log)
