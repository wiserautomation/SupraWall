import pytest
from suprawall import SupraWallOptions, with_suprawall, SupraWallMiddleware
from suprawall.identity import AgentIdentity

def test_options_rename():
    opts = SupraWallOptions(api_key="ag_test", on_network_error="fail-closed")
    assert opts.api_key == "ag_test"
    assert opts.on_network_error == "fail-closed"

def test_middleware_init():
    opts = SupraWallOptions(api_key="ag_test")
    middleware = SupraWallMiddleware(opts)
    assert middleware.options == opts

def test_with_suprawall_exists():
    assert with_suprawall is not None

def test_agent_identity_rename():
    identity = AgentIdentity.from_credentials(agent_api_key="ag_agent", scopes=["email:send"])
    assert identity.api_key == "ag_agent"
    assert identity.scopes == ["email:send"]
    
    # Test to_options correctly returns SupraWallOptions
    opts = identity.to_options(max_cost_usd=10.0)
    assert isinstance(opts, SupraWallOptions)
    assert opts.api_key == "ag_agent"
    assert opts.max_cost_usd == 10.0
