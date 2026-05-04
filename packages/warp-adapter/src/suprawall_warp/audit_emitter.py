# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""Writes redacted JSONL audit records to stderr for v0.1.

v0.2 will route these to a configurable SupraWall audit sink instead.
"""

from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Optional

from .event_schema import WarpEvent

log = logging.getLogger("suprawall.audit")


def emit(event: WarpEvent, response: dict, hook_name: str = "suprawall-warp-adapter") -> None:
    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "hook": hook_name,
        "event_id": str(event.event_id),
        "conversation_id": event.conversation_id,
        "action_id": event.action_id,
        "action_kind": event.action_kind.value,
        "decision": response.get("decision"),
        "reason": response.get("reason"),
        "external_audit_id": response.get("external_audit_id"),
    }
    # Audit goes to stderr so it never pollutes the stdout protocol channel.
    print(json.dumps(record), file=sys.stderr, flush=True)
    log.debug("audit: %s", record)
