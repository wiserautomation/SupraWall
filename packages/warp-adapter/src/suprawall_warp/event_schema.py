# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from enum import Enum
from typing import Annotated, List, Literal, Optional, Union
from uuid import UUID

from pydantic import BaseModel, Field

SCHEMA_VERSION = "warp.agent_policy_hook.v1"


class WarpPermissionDecision(str, Enum):
    allow = "allow"
    ask = "ask"
    deny = "deny"


class WarpPermissionSnapshot(BaseModel):
    decision: WarpPermissionDecision
    reason: Optional[str] = None


# ── Action payloads ─────────────────────────────────────────────────────────


class ExecuteCommandAction(BaseModel):
    command: str
    normalized_command: str
    is_read_only: Optional[bool] = None
    is_risky: Optional[bool] = None


class WriteToLongRunningShellCommandAction(BaseModel):
    block_id: str
    input: str
    mode: str


class ReadFilesAction(BaseModel):
    paths: List[str]
    omitted_path_count: Optional[int] = None


class PolicyDiffStats(BaseModel):
    files_changed: int
    additions: int
    deletions: int


class WriteFilesAction(BaseModel):
    paths: List[str]
    omitted_path_count: Optional[int] = None
    diff_stats: Optional[PolicyDiffStats] = None


class CallMcpToolAction(BaseModel):
    server_id: Optional[UUID] = None
    tool_name: str
    argument_keys: List[str]
    omitted_argument_key_count: Optional[int] = None


class ReadMcpResourceAction(BaseModel):
    server_id: Optional[UUID] = None
    name: str
    uri: Optional[str] = None


# ── Action kind discriminator ────────────────────────────────────────────────


class ActionKind(str, Enum):
    execute_command = "execute_command"
    write_to_long_running_shell_command = "write_to_long_running_shell_command"
    read_files = "read_files"
    write_files = "write_files"
    call_mcp_tool = "call_mcp_tool"
    read_mcp_resource = "read_mcp_resource"


# ── Top-level event ──────────────────────────────────────────────────────────


class WarpEvent(BaseModel):
    schema_version: Literal["warp.agent_policy_hook.v1"]
    event_id: UUID
    conversation_id: str
    action_id: str
    action_kind: ActionKind
    working_directory: Optional[str] = None
    run_until_completion: bool
    hook_autoapproval_enabled: bool
    active_profile_id: Optional[str] = None
    warp_permission: WarpPermissionSnapshot
    action: Annotated[
        Union[
            ExecuteCommandAction,
            WriteToLongRunningShellCommandAction,
            ReadFilesAction,
            WriteFilesAction,
            CallMcpToolAction,
            ReadMcpResourceAction,
        ],
        Field(discriminator=None),
    ]

    def typed_action(
        self,
    ) -> Union[
        ExecuteCommandAction,
        WriteToLongRunningShellCommandAction,
        ReadFilesAction,
        WriteFilesAction,
        CallMcpToolAction,
        ReadMcpResourceAction,
    ]:
        """Re-parse action into its concrete type using action_kind."""
        _map = {
            ActionKind.execute_command: ExecuteCommandAction,
            ActionKind.write_to_long_running_shell_command: WriteToLongRunningShellCommandAction,
            ActionKind.read_files: ReadFilesAction,
            ActionKind.write_files: WriteFilesAction,
            ActionKind.call_mcp_tool: CallMcpToolAction,
            ActionKind.read_mcp_resource: ReadMcpResourceAction,
        }
        cls = _map[self.action_kind]
        return cls.model_validate(self.action.model_dump())
