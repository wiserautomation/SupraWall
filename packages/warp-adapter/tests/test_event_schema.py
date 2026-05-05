"""Round-trip parsing tests for every v1 event fixture."""

import json
from pathlib import Path

import pytest

from suprawall_warp.event_schema import (
    ActionKind,
    CallMcpToolAction,
    ExecuteCommandAction,
    WarpEvent,
    WriteFilesAction,
)

FIXTURES_DIR = Path(__file__).parent / "fixtures"


def _load(name: str) -> dict:
    return json.loads((FIXTURES_DIR / name).read_text())


def _round_trip(data: dict) -> dict:
    event = WarpEvent.model_validate(data)
    return json.loads(event.model_dump_json(exclude_none=True))


class TestShellExecDangerous:
    def test_parses(self, shell_exec_dangerous):
        event = WarpEvent.model_validate(shell_exec_dangerous)
        assert event.action_kind == ActionKind.execute_command
        assert event.schema_version == "warp.agent_policy_hook.v1"

    def test_typed_action(self, shell_exec_dangerous):
        event = WarpEvent.model_validate(shell_exec_dangerous)
        action = event.typed_action()
        assert isinstance(action, ExecuteCommandAction)
        assert "rm -rf" in action.normalized_command
        assert action.is_risky is True

    def test_round_trip(self, shell_exec_dangerous):
        rt = _round_trip(shell_exec_dangerous)
        assert rt["action_kind"] == "execute_command"
        assert rt["schema_version"] == "warp.agent_policy_hook.v1"


class TestShellExecSafe:
    def test_parses(self, shell_exec_safe):
        event = WarpEvent.model_validate(shell_exec_safe)
        assert event.action_kind == ActionKind.execute_command
        assert event.warp_permission.decision.value == "allow"

    def test_round_trip(self, shell_exec_safe):
        rt = _round_trip(shell_exec_safe)
        assert rt["warp_permission"]["decision"] == "allow"


class TestFileWriteOutsideCwd:
    def test_parses(self, file_write_outside_cwd):
        event = WarpEvent.model_validate(file_write_outside_cwd)
        assert event.action_kind == ActionKind.write_files

    def test_typed_action(self, file_write_outside_cwd):
        event = WarpEvent.model_validate(file_write_outside_cwd)
        action = event.typed_action()
        assert isinstance(action, WriteFilesAction)
        assert any("/etc/" in p for p in action.paths)
        assert action.diff_stats is not None

    def test_round_trip(self, file_write_outside_cwd):
        rt = _round_trip(file_write_outside_cwd)
        assert rt["action_kind"] == "write_files"


class TestMcpToolCall:
    def test_parses(self, mcp_tool_call):
        event = WarpEvent.model_validate(mcp_tool_call)
        assert event.action_kind == ActionKind.call_mcp_tool

    def test_typed_action(self, mcp_tool_call):
        event = WarpEvent.model_validate(mcp_tool_call)
        action = event.typed_action()
        assert isinstance(action, CallMcpToolAction)
        assert action.tool_name == "send_http_request"
        assert action.server_id is not None

    def test_round_trip(self, mcp_tool_call):
        rt = _round_trip(mcp_tool_call)
        assert rt["action"]["tool_name"] == "send_http_request"


class TestAskDecisionFlow:
    def test_parses(self, ask_decision_flow):
        event = WarpEvent.model_validate(ask_decision_flow)
        assert event.run_until_completion is True

    def test_round_trip(self, ask_decision_flow):
        rt = _round_trip(ask_decision_flow)
        assert rt["run_until_completion"] is True
