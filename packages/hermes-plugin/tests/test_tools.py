import pytest
from unittest.mock import MagicMock, patch
from suprawall.gate import SupraWallOptions
from suprawall_hermes.tools import handle_vault_get, handle_suprawall_check

@pytest.fixture
def options():
    return SupraWallOptions(api_key="sw_test_key")

def test_handle_vault_get_success(options):
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"value": "secret123"}
        mock_post.return_value = mock_resp
        
        handler = handle_vault_get(options)
        res = handler("MY_SECRET")
        assert res == "secret123"

def test_handle_vault_get_not_found(options):
    with patch("httpx.Client.post") as mock_post:
        mock_resp = MagicMock()
        mock_resp.status_code = 404
        mock_post.return_value = mock_resp
        
        handler = handle_vault_get(options)
        res = handler("MISSING")
        assert "not found" in res or "HTTP 404" in res

def test_handle_suprawall_check_allow(options):
    with patch("suprawall_hermes.tools._evaluate") as mock_eval:
        mock_eval.return_value = {"decision": "ALLOW"}
        handler = handle_suprawall_check(options)
        
        res = handler("delete_user", {"id": 1})
        assert res == "ALLOW"

def test_handle_suprawall_check_deny(options):
    with patch("suprawall_hermes.tools._evaluate") as mock_eval:
        mock_eval.return_value = {"decision": "DENY", "reason": "Blocked"}
        handler = handle_suprawall_check(options)
        
        res = handler("delete_user", {"id": 1})
        assert "DENY: Blocked" in res
