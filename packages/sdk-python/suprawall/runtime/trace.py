# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""
Trace capture, PII redaction, and shareable-trace upload.

This module is responsible for:
  - Building a structured Trace from a blocked tool call.
  - Stripping PII and credentials before any data leaves the machine.
  - Computing a deterministic audit hash that the server can verify.
  - Uploading opt-in traces to supra-wall.com/trace/{id}.
  - Saving traces locally as JSON.
"""

import hashlib
import json
import os
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TRACE_UPLOAD_URL = "https://www.supra-wall.com/api/v1/traces"
TRACE_VIEW_BASE = "https://supra-wall.com/trace"
CONSENT_FILE = os.path.expanduser("~/.suprawall/share-consent")
TELEMETRY_CONSENT_FILE = os.path.expanduser("~/.suprawall/telemetry-consent")
LOCAL_TRACES_DIR = "suprawall-traces"
SDK_VERSION = "1.1.0"
TELEMETRY_ENDPOINT = "https://www.supra-wall.com/api/v1/telemetry/event"


# ---------------------------------------------------------------------------
# Trace ID
# ---------------------------------------------------------------------------

def generate_trace_id() -> str:
    """
    Generates a short, human-pronounceable trace ID like 'A-00847'.

    Format: single uppercase letter + dash + 5 digits.
    Gives ~2.6M unique IDs — sufficient for v1 (collision risk <1% at 100K traces).
    """
    import random
    import string
    letter = random.choice(string.ascii_uppercase)
    number = random.randint(10000, 99999)
    return f"{letter}-{number:05d}"


# ---------------------------------------------------------------------------
# PII Redactor
# ---------------------------------------------------------------------------

class PiiRedactor:
    """
    Strips PII and credential patterns from strings and dicts.

    Applied to agent_reasoning and attempted_action.args *before* the trace
    is serialised or leaves the user's machine.
    """

    # Each entry: (regex_pattern, replacement_label)
    _PATTERNS: list = [
        # Credentials — must come before generic patterns
        (r"sk-[a-zA-Z0-9]{20,}", "[OPENAI-KEY]"),
        (r"AKIA[A-Z0-9]{16}", "[AWS-KEY]"),
        (r"gh[po]_[a-zA-Z0-9]{36,}", "[GH-TOKEN]"),
        (r"xoxb-[a-zA-Z0-9\-]{10,}", "[SLACK-TOKEN]"),
        (r"eyJhbGci[a-zA-Z0-9._\-]{20,}", "[JWT]"),
        # PII
        (r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}\b", "[EMAIL]"),
        (r"\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b", "[PHONE]"),
        (r"\b\d{3}-\d{2}-\d{4}\b", "[SSN]"),
        (r"\b(?:\d[ \-]?){13,16}\b", "[CC-NUMBER]"),
    ]

    def redact(self, text: str) -> str:
        for pattern, label in self._PATTERNS:
            text = re.sub(pattern, label, text)
        return text

    def redact_any(self, value: Any) -> Any:
        if isinstance(value, str):
            return self.redact(value)
        if isinstance(value, dict):
            return {k: self.redact_any(v) for k, v in value.items()}
        if isinstance(value, (list, tuple)):
            return [self.redact_any(i) for i in value]
        return value


# ---------------------------------------------------------------------------
# Trace dataclass
# ---------------------------------------------------------------------------

@dataclass
class Trace:
    """
    Immutable record of a blocked tool call.

    All fields are PII-redacted before construction.
    The audit_hash is computed over a canonical JSON representation and
    verified by the server on upload — tampered traces are rejected.
    """
    id: str
    blocked_at: datetime
    framework: str
    attempted_action: dict        # {tool: str, args: dict} — redacted
    agent_reasoning: str          # chain-of-thought leading to the block — redacted
    matched_policy: dict          # {rule: str, reason: str}
    environment: str
    sdk_version: str
    audit_hash: str = field(default="", compare=False)

    def __post_init__(self) -> None:
        if not self.audit_hash:
            self.audit_hash = compute_audit_hash(self)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "blocked_at": self.blocked_at.isoformat(),
            "framework": self.framework,
            "attempted_action": self.attempted_action,
            "agent_reasoning": self.agent_reasoning,
            "matched_policy": self.matched_policy,
            "environment": self.environment,
            "sdk_version": self.sdk_version,
            "audit_hash": self.audit_hash,
        }


# ---------------------------------------------------------------------------
# Audit hash
# ---------------------------------------------------------------------------

def compute_audit_hash(trace: Trace) -> str:
    """
    SHA-256 of the canonical JSON of the trace (excluding audit_hash itself).

    Canonicalisation: json.dumps with sort_keys=True and no extra whitespace.
    The server recomputes this and rejects uploads where it does not match.
    """
    canonical = json.dumps(
        {
            "id": trace.id,
            "blocked_at": (
                trace.blocked_at.isoformat()
                if hasattr(trace.blocked_at, "isoformat")
                else str(trace.blocked_at)
            ),
            "framework": trace.framework,
            "attempted_action": trace.attempted_action,
            "agent_reasoning": trace.agent_reasoning,
            "matched_policy": trace.matched_policy,
            "environment": trace.environment,
            "sdk_version": trace.sdk_version,
        },
        sort_keys=True,
        separators=(",", ":"),
        default=str,
    )
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Consent
# ---------------------------------------------------------------------------

def has_consent() -> bool:
    try:
        with open(CONSENT_FILE) as fh:
            data = json.load(fh)
        return data.get("consent") is True
    except Exception:
        return False


def prompt_and_store_consent(trace_id: str, public: bool) -> None:
    """
    Prints a clear explanation and waits for user confirmation.
    Raises RuntimeError if the user declines.
    """
    visibility = "public (anyone with the URL can view it)" if public else "private (token-gated)"
    print(
        f"\nSupraWall: This will upload a redacted trace to {TRACE_VIEW_BASE}/{trace_id}",
        file=sys.stderr,
    )
    print(
        f"           Visibility: {visibility}",
        file=sys.stderr,
    )
    print(
        "           PII, API keys, emails, and phone numbers are stripped before upload.",
        file=sys.stderr,
    )
    answer = input("           Continue? [y/N]: ").strip().lower()
    if answer != "y":
        raise RuntimeError("SupraWall: share_url() cancelled by user.")
    os.makedirs(os.path.dirname(CONSENT_FILE), exist_ok=True)
    with open(CONSENT_FILE, "w") as fh:
        json.dump(
            {"consent": True, "granted_at": datetime.now(timezone.utc).isoformat()},
            fh,
        )


def has_telemetry_consent() -> bool:
    try:
        with open(TELEMETRY_CONSENT_FILE) as fh:
            data = json.load(fh)
        return data.get("consent") is True
    except Exception:
        return False


def prompt_and_store_telemetry_consent() -> None:
    """
    Prints a clear explanation and waits for user confirmation for anonymous telemetry.
    """
    print(
        "\nSupraWall: Would you like to enable anonymous telemetry?",
        file=sys.stderr,
    )
    print(
        "           This sends a simple ping when an attack is blocked to help us",
        file=sys.stderr,
    )
    print(
        "           show a real-time 'attacks blocked' counter on our homepage.",
        file=sys.stderr,
    )
    print(
        "           No PII, no code, and no tool arguments are ever sent.",
        file=sys.stderr,
    )
    answer = input("           Enable anonymous telemetry? [y/N]: ").strip().lower()
    consent = (answer == "y")
    os.makedirs(os.path.dirname(TELEMETRY_CONSENT_FILE), exist_ok=True)
    with open(TELEMETRY_CONSENT_FILE, "w") as fh:
        json.dump(
            {"consent": consent, "decided_at": datetime.now(timezone.utc).isoformat()},
            fh,
        )


# ---------------------------------------------------------------------------
# Upload
# ---------------------------------------------------------------------------

def upload_trace(trace: Trace, public: bool) -> dict:
    """
    Posts the trace to the SupraWall API.
    Returns {url, secret_token} from the server response.
    """
    try:
        import httpx
    except ImportError as exc:
        raise ImportError("Install httpx to use share_url(): pip install httpx") from exc

    payload = {**trace.to_dict(), "public": public}
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.post(
                TRACE_UPLOAD_URL,
                json=payload,
                headers={
                    "Content-Type": "application/json",
                    "X-SupraWall-SDK": f"python-{SDK_VERSION}",
                },
            )
    except httpx.RequestError as exc:
        raise RuntimeError(
            f"SupraWall: share_url() could not reach {TRACE_UPLOAD_URL}: {exc}"
        ) from exc

    if resp.status_code == 429:
        raise RuntimeError(
            "SupraWall: share_url() rate limited (10 traces/hour). Try again later."
        )
    if resp.status_code >= 400:
        raise RuntimeError(
            f"SupraWall: share_url() server error {resp.status_code}: {resp.text[:200]}"
        )

    return resp.json()


# ---------------------------------------------------------------------------
# Save-local helper
# ---------------------------------------------------------------------------

def save_trace_locally(trace: Trace, directory: str = LOCAL_TRACES_DIR) -> str:
    """
    Writes the trace JSON to ./{directory}/{trace.id}.json. No network.
    Returns the absolute path of the saved file.
    """
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, f"{trace.id}.json")
    with open(path, "w") as fh:
        json.dump(trace.to_dict(), fh, indent=2, default=str)
    return os.path.abspath(path)
