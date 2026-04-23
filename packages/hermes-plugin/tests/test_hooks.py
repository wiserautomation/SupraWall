import pytest
from unittest.mock import MagicMock, patch
from suprawall.gate import SupraWallOptions
from suprawall_hermes.hooks import make_pre_tool_hook, make_post_tool_hook, _scrub_pii_local

@pytest.fixture
def options():
    return SupraWallOptions(api_key="sw_test_key", on_network_error="fail-closed")

@pytest.fixture
def middleware():
    m = MagicMock()
    m.budget.summary = "$0.00 / unlimited"
    return m

def test_pre_tool_hook_allow(options):
    with patch("suprawall_hermes.hooks._evaluate") as mock_eval:
        mock_eval.return_value = {"decision": "ALLOW"}
        hook = make_pre_tool_hook(options)
        
        res = hook("test_tool", {"arg": 1})
        assert res is None
        mock_eval.assert_called_once()

def test_pre_tool_hook_deny(options):
    with patch("suprawall_hermes.hooks._evaluate") as mock_eval:
        mock_eval.return_value = {"decision": "DENY", "reason": "Security block"}
        hook = make_pre_tool_hook(options)
        
        res = hook("test_tool", {"arg": 1})
        assert res["blocked"] is True
        assert "Security block" in res["reason"]

def test_pre_tool_hook_fail_closed(options):
    with patch("suprawall_hermes.hooks._evaluate") as mock_eval:
        mock_eval.side_effect = Exception("Network down")
        hook = make_pre_tool_hook(options)
        
        res = hook("test_tool", {"arg": 1})
        assert res["blocked"] is True
        assert "fail-closed" in res["reason"]

def test_post_tool_hook_scrubbing(options, middleware):
    hook = make_post_tool_hook(options, middleware)
    input_text = "Contact me at peghin@gmail.com or 555-1234"
    
    res = hook("test_tool", input_text)
    assert "[EMAIL_REDACTED]" in res
    assert "[PHONE_REDACTED]" in res
    assert "gmail.com" not in res

def test_scrub_pii_local_ssn_cc():
    text = "SSN: 123-45-6789, CC: 1234-5678-9012-3456"
    scrubbed = _scrub_pii_local(text)
    assert "[SSN_REDACTED]" in scrubbed
    assert "[CC_REDACTED]" in scrubbed
    assert "123-45-6789" not in scrubbed
