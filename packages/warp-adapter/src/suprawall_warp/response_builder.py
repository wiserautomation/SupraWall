# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from typing import Optional

from .event_schema import SCHEMA_VERSION


def allow(reason: Optional[str] = None, external_audit_id: Optional[str] = None) -> dict:
    resp: dict = {"schema_version": SCHEMA_VERSION, "decision": "allow"}
    if reason:
        resp["reason"] = reason
    if external_audit_id:
        resp["external_audit_id"] = external_audit_id
    return resp


def deny(reason: str, external_audit_id: Optional[str] = None) -> dict:
    resp: dict = {"schema_version": SCHEMA_VERSION, "decision": "deny", "reason": reason}
    if external_audit_id:
        resp["external_audit_id"] = external_audit_id
    return resp


def ask(reason: Optional[str] = None, external_audit_id: Optional[str] = None) -> dict:
    resp: dict = {"schema_version": SCHEMA_VERSION, "decision": "ask"}
    if reason:
        resp["reason"] = reason
    if external_audit_id:
        resp["external_audit_id"] = external_audit_id
    return resp


def timeout_fallback(unavailable_behavior: str, audit_id: Optional[str] = None) -> dict:
    """Return the response Warp expects when the adapter exceeds its timeout budget."""
    if unavailable_behavior == "allow":
        return allow(reason="policy_timeout", external_audit_id=audit_id)
    if unavailable_behavior == "deny":
        return deny(reason="policy_timeout", external_audit_id=audit_id)
    return ask(reason="policy_timeout", external_audit_id=audit_id)
