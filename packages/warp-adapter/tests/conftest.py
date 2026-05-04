import json
import os
from pathlib import Path

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"


def load_fixture(name: str) -> dict:
    return json.loads((FIXTURES_DIR / name).read_text())


@pytest.fixture
def shell_exec_dangerous():
    return load_fixture("shell_exec_dangerous.json")


@pytest.fixture
def shell_exec_safe():
    return load_fixture("shell_exec_safe.json")


@pytest.fixture
def file_write_outside_cwd():
    return load_fixture("file_write_outside_cwd.json")


@pytest.fixture
def mcp_tool_call():
    return load_fixture("mcp_tool_call.json")


@pytest.fixture
def ask_decision_flow():
    return load_fixture("ask_decision_flow.json")
