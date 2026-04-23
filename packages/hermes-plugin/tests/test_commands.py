import pytest
from unittest.mock import MagicMock, patch
from suprawall_hermes.commands import handle_suprawall_command

@pytest.fixture
def middleware():
    m = MagicMock()
    m.budget.summary = "Session spend: $0.00 / $5.00"
    m.options.on_network_error = "fail-closed"
    m.options.loop_detection = True
    return m

def test_command_status(middleware):
    handler = handle_suprawall_command(middleware)
    with patch("suprawall_hermes.commands.get_audit_log") as mock_audit:
        mock_audit.return_value = []
        res = handler("status")
        assert "ACTIVE" in res
        assert "$0.00 / $5.00" in res
        assert "fail-closed" in res

def test_command_budget(middleware):
    handler = handle_suprawall_command(middleware)
    res = handler("budget")
    assert "$0.00 / $5.00" in res

def test_command_audit_empty(middleware):
    handler = handle_suprawall_command(middleware)
    with patch("suprawall_hermes.commands.get_audit_log") as mock_audit:
        mock_audit.return_value = []
        res = handler("audit")
        assert "No tool calls" in res

def test_command_audit_entries(middleware):
    handler = handle_suprawall_command(middleware)
    with patch("suprawall_hermes.commands.get_audit_log") as mock_audit:
        mock_audit.return_value = [{"tool": "read_file", "budget": "$0.01"}]
        res = handler("audit")
        assert "read_file" in res
        assert "$0.01" in res

def test_command_unknown(middleware):
    handler = handle_suprawall_command(middleware)
    res = handler("nonsense")
    assert "Usage: /suprawall" in res
