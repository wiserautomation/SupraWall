import logging
import httpx
from suprawall.gate import SupraWallOptions, _evaluate

log = logging.getLogger("suprawall.hermes")

# ── Tool: suprawall_vault_get ──

VAULT_SCHEMA = {
    "type": "function",
    "function": {
        "name": "suprawall_vault_get",
        "description": (
            "Retrieve a secret from the SupraWall vault. "
            "Use this instead of hardcoding API keys or passwords. "
            "Returns the secret value for the given name."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "secret_name": {
                    "type": "string",
                    "description": "The name of the secret to retrieve (e.g. 'GITHUB_TOKEN').",
                },
            },
            "required": ["secret_name"],
        },
    },
}

def handle_vault_get(options: SupraWallOptions):
    def _handler(secret_name: str, **kwargs):
        vault_url = options.cloud_function_url.replace("/v1/evaluate", "/v1/vault/get")
        try:
            with httpx.Client(timeout=options.timeout) as client:
                resp = client.post(
                    vault_url,
                    json={
                        "tenantId": options.tenant_id,
                        "secretName": secret_name,
                    },
                    headers={"Authorization": f"Bearer {options.api_key}"},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("value", "[vault: secret not found]")
                return f"[vault error: HTTP {resp.status_code}]"
        except Exception as e:
            log.error(f"[SupraWall] Vault retrieval failed: {e}")
            return f"[vault error: {e}]"
    return _handler

# ── Tool: suprawall_check ──

CHECK_SCHEMA = {
    "type": "function",
    "function": {
        "name": "suprawall_check",
        "description": (
            "Check whether a planned action is allowed by SupraWall security policies. "
            "Returns ALLOW, DENY, or REQUIRE_APPROVAL."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "tool_name": {
                    "type": "string",
                    "description": "The name of the tool you plan to call.",
                },
                "arguments": {
                    "type": "object",
                    "description": "The arguments you plan to pass to the tool.",
                },
            },
            "required": ["tool_name"],
        },
    },
}

def handle_suprawall_check(options: SupraWallOptions):
    def _handler(tool_name: str, arguments: dict = None, **kwargs):
        try:
            data = _evaluate(tool_name, arguments or {}, options, source="hermes-check-tool")
            decision = data.get("decision", "ALLOW")
            reason = data.get("reason", "")
            return f"{decision}: {reason}" if reason else decision
        except Exception as e:
            log.error(f"[SupraWall] Policy check failed: {e}")
            return f"ERROR: {e}"
    return _handler
