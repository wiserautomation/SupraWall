# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""Maps Warp v1 events to LocalPolicyEngine.check() calls and back."""

from __future__ import annotations

import uuid
from typing import Optional

from suprawall.local_policy import LocalPolicyEngine

from . import response_builder as rb
from .event_schema import (
    ActionKind,
    CallMcpToolAction,
    ExecuteCommandAction,
    ReadFilesAction,
    ReadMcpResourceAction,
    WarpEvent,
    WriteFilesAction,
    WriteToLongRunningShellCommandAction,
)


def evaluate(event: WarpEvent, engine: LocalPolicyEngine) -> dict:
    """
    Evaluate a WarpEvent against the policy engine.
    Returns a response dict ready to serialize to stdout.
    """
    audit_id = str(uuid.uuid4())

    dispatch = {
        ActionKind.execute_command: _eval_execute_command,
        ActionKind.write_to_long_running_shell_command: _eval_write_to_long_running,
        ActionKind.read_files: _eval_read_files,
        ActionKind.write_files: _eval_write_files,
        ActionKind.call_mcp_tool: _eval_call_mcp_tool,
        ActionKind.read_mcp_resource: _eval_read_mcp_resource,
    }
    handler = dispatch[event.action_kind]
    return handler(event, engine, audit_id)


# ── Per-surface evaluators ───────────────────────────────────────────────────


def _eval_execute_command(event: WarpEvent, engine: LocalPolicyEngine, audit_id: str) -> dict:
    action = ExecuteCommandAction.model_validate(event.action.model_dump())
    # Use normalized_command for deterministic matching; fall back to raw command.
    cmd = action.normalized_command or action.command
    violation = engine.check("shell_exec", cmd)
    return _build_response(violation, audit_id)


def _eval_write_to_long_running(event: WarpEvent, engine: LocalPolicyEngine, audit_id: str) -> dict:
    action = WriteToLongRunningShellCommandAction.model_validate(event.action.model_dump())
    violation = engine.check("shell_exec", action.input)
    return _build_response(violation, audit_id)


def _eval_read_files(event: WarpEvent, engine: LocalPolicyEngine, audit_id: str) -> dict:
    action = ReadFilesAction.model_validate(event.action.model_dump())
    for path in action.paths:
        violation = engine.check("file_read", path)
        if violation:
            return _build_response(violation, audit_id)
    return rb.allow(external_audit_id=audit_id)


def _eval_write_files(event: WarpEvent, engine: LocalPolicyEngine, audit_id: str) -> dict:
    action = WriteFilesAction.model_validate(event.action.model_dump())
    for path in action.paths:
        violation = engine.check("write_file", path)
        if violation:
            return _build_response(violation, audit_id)
    return rb.allow(external_audit_id=audit_id)


def _eval_call_mcp_tool(event: WarpEvent, engine: LocalPolicyEngine, audit_id: str) -> dict:
    action = CallMcpToolAction.model_validate(event.action.model_dump())
    # Check tool name + argument keys joined as args string so credential patterns fire.
    args_str = " ".join(action.argument_keys)
    violation = engine.check(action.tool_name, args_str) or engine.check(
        "mcp_tool", action.tool_name
    )
    return _build_response(violation, audit_id)


def _eval_read_mcp_resource(event: WarpEvent, engine: LocalPolicyEngine, audit_id: str) -> dict:
    action = ReadMcpResourceAction.model_validate(event.action.model_dump())
    args_str = action.uri or action.name
    violation = engine.check("mcp_resource", args_str)
    return _build_response(violation, audit_id)


# ── Decision builder ─────────────────────────────────────────────────────────


def _build_response(violation: Optional[dict], audit_id: str) -> dict:
    if violation is None:
        return rb.allow(external_audit_id=audit_id)

    action = violation.get("action", "deny")
    reason = violation.get("description", violation.get("name", "policy violation"))

    if action == "ask":
        return rb.ask(reason=reason, external_audit_id=audit_id)
    return rb.deny(reason=reason, external_audit_id=audit_id)
