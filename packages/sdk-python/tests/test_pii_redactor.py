# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""
50-payload PII redactor test corpus.

Acceptance criterion: PiiRedactor must redact every known pattern without
false-negatives on real-world strings and without corrupting safe strings.
"""

import pytest
from suprawall.runtime.trace import PiiRedactor

redactor = PiiRedactor()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def assert_redacted(text: str, label: str) -> None:
    result = redactor.redact(text)
    assert label in result, f"Expected {label!r} in output but got: {result!r}"


def assert_clean(text: str) -> None:
    result = redactor.redact(text)
    assert result == text, f"Safe string was modified unexpectedly: {result!r}"


# ---------------------------------------------------------------------------
# Credentials
# ---------------------------------------------------------------------------

class TestOpenAIKeys:
    def test_bare_key(self):
        assert_redacted("sk-abcdefghijklmnopqrstuv1234567890", "[OPENAI-KEY]")

    def test_key_in_sentence(self):
        assert_redacted("Use api_key='sk-abcdefghijklmnopqrstuv1234567890' here", "[OPENAI-KEY]")

    def test_key_in_json(self):
        assert_redacted('{"api_key": "sk-abcdefghijklmnopqrstuv1234567890"}', "[OPENAI-KEY]")

    def test_project_key_format(self):
        assert_redacted("sk-proj-abcdefghijklmnopqrstuv12345678", "[OPENAI-KEY]")


class TestAWSKeys:
    def test_bare_access_key(self):
        assert_redacted("AKIAIOSFODNN7EXAMPLE", "[AWS-KEY]")

    def test_key_in_env_export(self):
        assert_redacted("export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE", "[AWS-KEY]")

    def test_key_in_dict(self):
        assert_redacted('{"aws_key": "AKIAIOSFODNN7EXAMPLE"}', "[AWS-KEY]")


class TestGitHubTokens:
    def test_personal_access_token(self):
        assert_redacted("ghp_" + "a" * 36, "[GH-TOKEN]")

    def test_oauth_token(self):
        assert_redacted("gho_" + "b" * 36, "[GH-TOKEN]")

    def test_token_in_url(self):
        assert_redacted("https://ghp_" + "a" * 36 + "@github.com/repo", "[GH-TOKEN]")


class TestSlackTokens:
    def test_bot_token(self):
        assert_redacted("xoxb-12345-67890-abcdefghij", "[SLACK-TOKEN]")

    def test_token_in_header(self):
        assert_redacted("Authorization: xoxb-12345-67890-abcdefghij", "[SLACK-TOKEN]")


class TestJWT:
    def test_jwt_token(self):
        token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123"
        assert_redacted(token, "[JWT]")

    def test_bearer_jwt(self):
        token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJ2YWx1ZSJ9.abc123456789"
        assert_redacted(token, "[JWT]")


# ---------------------------------------------------------------------------
# PII
# ---------------------------------------------------------------------------

class TestEmails:
    def test_simple_email(self):
        assert_redacted("contact alex@example.com now", "[EMAIL]")

    def test_email_in_json(self):
        assert_redacted('{"email": "user@domain.co.uk"}', "[EMAIL]")

    def test_email_with_plus(self):
        assert_redacted("Send to user+tag@example.org", "[EMAIL]")

    def test_email_with_dots(self):
        assert_redacted("first.last@sub.domain.com", "[EMAIL]")

    def test_multiple_emails(self):
        result = redactor.redact("From alex@a.com to bob@b.com")
        assert result.count("[EMAIL]") == 2

    def test_email_in_sql(self):
        assert_redacted("SELECT * FROM users WHERE email='victim@corp.io'", "[EMAIL]")


class TestPhoneNumbers:
    def test_us_dashes(self):
        assert_redacted("Call 555-867-5309", "[PHONE]")

    def test_us_dots(self):
        assert_redacted("Phone: 555.867.5309", "[PHONE]")

    def test_us_spaces(self):
        assert_redacted("Reach me at 555 867 5309", "[PHONE]")

    def test_phone_in_sentence(self):
        assert_redacted("Emergency: 911-555-1234", "[PHONE]")


class TestSSN:
    def test_ssn_dashes(self):
        assert_redacted("SSN: 123-45-6789", "[SSN]")

    def test_ssn_in_json(self):
        assert_redacted('{"ssn": "987-65-4321"}', "[SSN]")

    def test_ssn_in_sentence(self):
        assert_redacted("Tax ID is 000-12-3456", "[SSN]")


class TestCreditCards:
    def test_visa_16_digit(self):
        assert_redacted("Card: 4111 1111 1111 1111", "[CC-NUMBER]")

    def test_mastercard_no_spaces(self):
        assert_redacted("MC: 5500000000000004", "[CC-NUMBER]")

    def test_card_with_dashes(self):
        assert_redacted("AMEX: 3714-496353-98431", "[CC-NUMBER]")


# ---------------------------------------------------------------------------
# Nested structure redaction (redact_any)
# ---------------------------------------------------------------------------

class TestNestedRedaction:
    def test_dict_value(self):
        result = redactor.redact_any({"api_key": "sk-abcdefghijklmnopqrstuv1234567890"})
        assert result["api_key"] == "[OPENAI-KEY]"

    def test_list_of_strings(self):
        result = redactor.redact_any(["sk-abcdefghijklmnopqrstuv1234567890", "safe text"])
        assert result[0] == "[OPENAI-KEY]"
        assert result[1] == "safe text"

    def test_nested_dict(self):
        payload = {"user": {"email": "victim@corp.io", "name": "Alice"}}
        result = redactor.redact_any(payload)
        assert result["user"]["email"] == "[EMAIL]"
        assert result["user"]["name"] == "Alice"

    def test_passthrough_int(self):
        assert redactor.redact_any(42) == 42

    def test_passthrough_none(self):
        assert redactor.redact_any(None) is None

    def test_mixed_list(self):
        result = redactor.redact_any([1, "AKIAIOSFODNN7EXAMPLE", {"k": "v"}])
        assert result[0] == 1
        assert result[1] == "[AWS-KEY]"
        assert result[2] == {"k": "v"}


# ---------------------------------------------------------------------------
# Safe strings — must NOT be modified
# ---------------------------------------------------------------------------

class TestSafeStrings:
    def test_plain_text(self):
        assert_clean("Hello, this is a normal message with no PII.")

    def test_short_number(self):
        assert_clean("I need 42 apples.")

    def test_url_no_token(self):
        assert_clean("https://supra-wall.com/docs")

    def test_uuid(self):
        assert_clean("trace-id: 550e8400-e29b-41d4-a716-446655440000")

    def test_json_no_pii(self):
        assert_clean('{"tool": "shell", "command": "ls -la"}')
