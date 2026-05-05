"""Unit tests for response_builder — all three decision shapes."""

from suprawall_warp.event_schema import SCHEMA_VERSION
from suprawall_warp import response_builder as rb


def test_allow_minimal():
    r = rb.allow()
    assert r["schema_version"] == SCHEMA_VERSION
    assert r["decision"] == "allow"
    assert "reason" not in r
    assert "external_audit_id" not in r


def test_allow_with_fields():
    r = rb.allow(reason="safe command", external_audit_id="audit-123")
    assert r["reason"] == "safe command"
    assert r["external_audit_id"] == "audit-123"


def test_deny_required_reason():
    r = rb.deny(reason="blocked by policy")
    assert r["decision"] == "deny"
    assert r["reason"] == "blocked by policy"


def test_deny_with_audit_id():
    r = rb.deny(reason="blocked", external_audit_id="audit-456")
    assert r["external_audit_id"] == "audit-456"


def test_ask_minimal():
    r = rb.ask()
    assert r["decision"] == "ask"
    assert "reason" not in r


def test_ask_with_reason():
    r = rb.ask(reason="needs approval")
    assert r["reason"] == "needs approval"


def test_timeout_fallback_deny():
    r = rb.timeout_fallback("deny")
    assert r["decision"] == "deny"
    assert r["reason"] == "policy_timeout"


def test_timeout_fallback_ask():
    r = rb.timeout_fallback("ask")
    assert r["decision"] == "ask"


def test_timeout_fallback_allow():
    r = rb.timeout_fallback("allow")
    assert r["decision"] == "allow"
