"""End-to-end: WarpEvent → LocalPolicyEngine → response dict."""

import pytest

from suprawall.local_policy import LocalPolicyEngine
from suprawall_warp.event_schema import WarpEvent
from suprawall_warp.policy_bridge import evaluate


@pytest.fixture
def default_engine():
    return LocalPolicyEngine()


@pytest.fixture
def ask_engine(tmp_path):
    policy = tmp_path / "policy.yaml"
    policy.write_text(
        "rules:\n"
        "  - name: ask-production-writes\n"
        "    description: Production config changes require human confirmation.\n"
        "    tool_pattern: 'write_file'\n"
        "    args_pattern: 'production'\n"
        "    action: ask\n"
    )
    return LocalPolicyEngine(str(policy))


class TestShellExecDangerous:
    def test_deny(self, shell_exec_dangerous, default_engine):
        event = WarpEvent.model_validate(shell_exec_dangerous)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "deny"
        assert "external_audit_id" in resp

    def test_reason_present(self, shell_exec_dangerous, default_engine):
        event = WarpEvent.model_validate(shell_exec_dangerous)
        resp = evaluate(event, default_engine)
        assert resp.get("reason")


class TestShellExecSafe:
    def test_allow(self, shell_exec_safe, default_engine):
        event = WarpEvent.model_validate(shell_exec_safe)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "allow"


class TestFileWriteOutsideCwd:
    def test_deny(self, file_write_outside_cwd, default_engine):
        event = WarpEvent.model_validate(file_write_outside_cwd)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "deny"


class TestMcpToolCallWithCredential:
    def test_deny_secret_exfil(self, mcp_tool_call, default_engine):
        # fixture has sk-abc123... in argument_keys — triggers no-secret-exfil rule
        event = WarpEvent.model_validate(mcp_tool_call)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "deny"


class TestAskDecisionFlow:
    def test_ask_returned(self, ask_decision_flow, ask_engine):
        event = WarpEvent.model_validate(ask_decision_flow)
        resp = evaluate(event, ask_engine)
        assert resp["decision"] == "ask"
        assert resp.get("reason") == "Production config changes require human confirmation."

    def test_ask_has_audit_id(self, ask_decision_flow, ask_engine):
        event = WarpEvent.model_validate(ask_decision_flow)
        resp = evaluate(event, ask_engine)
        assert "external_audit_id" in resp

    def test_ask_has_all_required_fields(self, ask_decision_flow, ask_engine):
        event = WarpEvent.model_validate(ask_decision_flow)
        resp = evaluate(event, ask_engine)
        assert resp["schema_version"] == "warp.agent_policy_hook.v1"
        assert resp["decision"] == "ask"
        assert "reason" in resp
        assert "external_audit_id" in resp


class TestTimeoutBehavior:
    def test_timeout_fires_and_denies(self, shell_exec_safe, default_engine, monkeypatch):
        import time
        from concurrent.futures import ThreadPoolExecutor
        from suprawall_warp.adapter import _evaluate_with_timeout
        from suprawall_warp.config import AdapterConfig
        
        # Mock policy evaluation to be slow
        def slow_check(*args, **kwargs):
            time.sleep(0.5)
            return None
        monkeypatch.setattr(default_engine, "check", slow_check)
        
        cfg = AdapterConfig(policy_file=None, timeout_ms=50, log_level="INFO", unavailable_behavior="deny")
        event = WarpEvent.model_validate(shell_exec_safe)
        
        with ThreadPoolExecutor(max_workers=1) as pool:
            resp = _evaluate_with_timeout(event, default_engine, pool, cfg)
            
        assert resp["decision"] == "deny"
        assert resp["reason"] == "policy_timeout"


class TestWriteLongRunning:
    def test_allow(self, write_long_running, default_engine):
        event = WarpEvent.model_validate(write_long_running)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "allow"


class TestReadFiles:
    def test_allow(self, read_files, default_engine):
        event = WarpEvent.model_validate(read_files)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "allow"


class TestReadMcpResource:
    def test_allow(self, read_mcp_resource, default_engine):
        event = WarpEvent.model_validate(read_mcp_resource)
        resp = evaluate(event, default_engine)
        assert resp["decision"] == "allow"


class TestResponseSchema:
    def test_schema_version_always_present(self, shell_exec_safe, default_engine):
        event = WarpEvent.model_validate(shell_exec_safe)
        resp = evaluate(event, default_engine)
        assert resp["schema_version"] == "warp.agent_policy_hook.v1"
