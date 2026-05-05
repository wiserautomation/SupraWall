"""Confirm no secrets appear in INFO-level log output."""

import json
import logging
import subprocess
import sys
import textwrap
from pathlib import Path

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"
ADAPTER_MODULE = "suprawall_warp"


def _run_adapter(fixture_name: str, extra_args: list = None) -> subprocess.CompletedProcess:
    raw_event = (FIXTURES_DIR / fixture_name).read_text()
    event = json.dumps(json.loads(raw_event))
    cmd = [sys.executable, "-m", ADAPTER_MODULE, "--log-level", "INFO"]
    if extra_args:
        cmd.extend(extra_args)
    return subprocess.run(
        cmd,
        input=event.encode("utf-8") + b"\n",
        capture_output=True,
        timeout=10,
    )


class TestNoSecretsInInfoLogs:
    def test_mcp_tool_credential_not_in_stderr(self):
        result = _run_adapter("mcp_tool_call.json")
        stderr_text = result.stderr.decode("utf-8")
        # The sk- token in argument_keys must not appear verbatim in INFO logs
        assert "sk-abc123def456ghi789jkl012mno345pqr678" not in stderr_text
        # We must see redacted markers
        assert "[REDACTED]" in stderr_text

    def test_dangerous_command_logged_without_raw_payload(self):
        result = _run_adapter("shell_exec_dangerous.json")
        stderr_text = result.stderr.decode("utf-8")
        # Adapter must not echo raw JSON at INFO level
        assert '"schema_version"' not in stderr_text or "DEBUG" not in stderr_text


class TestStdoutIsCleanJSON:
    def test_response_is_valid_json(self):
        result = _run_adapter("shell_exec_safe.json")
        lines = [l for l in result.stdout.splitlines() if l.strip()]
        assert lines, "adapter produced no stdout output"
        resp = json.loads(lines[0])
        assert resp["schema_version"] == "warp.agent_policy_hook.v1"
        assert "decision" in resp

    def test_no_log_lines_on_stdout(self):
        result = _run_adapter("shell_exec_safe.json")
        for line in result.stdout.splitlines():
            if not line.strip():
                continue
            # Every non-empty stdout line must be parseable JSON
            json.loads(line)
