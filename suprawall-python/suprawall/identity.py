"""
AgentIdentity — Scoped agent registration for the Python SDK.

Provides developer-friendly APIs for registering agents with specific
scopes (permissions) and retrieving their unique credentials.

Example:
    from suprawall.identity import AgentIdentity

    identity = await AgentIdentity.register(
        api_key="ag_org_key",
        name="Email Assistant",
        scopes=["email:send", "crm:read"],
    )

    # Use the scoped agent key in subsequent calls
    options = identity.to_options()
    secured = with_suprawall(my_agent, options)
"""

import re
import secrets
import string
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import httpx

DEFAULT_REGISTER_URL = "https://suprawall.ai/api/agents/register"

# Valid scope format: namespace:action (e.g. crm:read, email:send, *:*)
_SCOPE_RE = re.compile(r"^[\w\-\*]+:[\w\-\*]+$")

# ── Well-known scope presets ──────────────────────────────────────────────────

SCOPE_PRESETS: Dict[str, List[str]] = {
    "readonly": [
        "crm:read",
        "email:read",
        "database:read",
        "files:read",
    ],
    "readwrite": [
        "crm:read", "crm:write",
        "email:read", "email:send",
        "database:read", "database:write",
        "files:read", "files:write",
    ],
    "browser": [
        "browser:navigate",
        "browser:screenshot",
        "browser:click",
    ],
    "full": ["*:*"],
}


class ScopeValidationError(ValueError):
    """Raised when one or more scopes don't match the namespace:action format."""
    pass


class RegistrationError(Exception):
    """Raised when the registration API returns an error."""
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(f"Registration failed (HTTP {status_code}): {message}")


@dataclass(frozen=True)
class AgentCredentials:
    """
    Immutable credentials returned after successful agent registration.
    """
    agent_id: str
    agent_api_key: str
    name: str
    scopes: List[str]

    def __repr__(self) -> str:
        masked = self.agent_api_key[:8] + "..." + self.agent_api_key[-4:]
        return (
            f"AgentCredentials(name={self.name!r}, "
            f"agent_id={self.agent_id!r}, "
            f"key={masked}, "
            f"scopes={self.scopes})"
        )


@dataclass
class AgentIdentity:
    """
    Manages an agent's identity, including its credentials and scopes.

    Create via the register() class method to register a new agent,
    or via from_credentials() to use an existing agent.

    Example:
        # Register a new agent
        identity = await AgentIdentity.register(
            api_key="ag_org_key",
            name="Email Bot",
            scopes=["email:send"],
        )

        # Or re-use existing credentials
        identity = AgentIdentity.from_credentials(
            agent_api_key="ag_xxxxx",
            scopes=["email:send"],
        )

        # Integrate with SupraWall
        options = identity.to_options()
    """
    credentials: AgentCredentials

    @staticmethod
    def validate_scopes(scopes: List[str]) -> None:
        """
        Validates that all scopes follow the namespace:action format.
        Raises ScopeValidationError on failure.
        """
        invalid = [s for s in scopes if not _SCOPE_RE.match(s)]
        if invalid:
            raise ScopeValidationError(
                f"Invalid scope format(s): {invalid}. "
                "Scopes must be 'namespace:action' (e.g. 'crm:read', 'email:send', '*:*')."
            )

    @staticmethod
    def resolve_scopes(scopes: List[str]) -> List[str]:
        """
        Expands preset names (e.g. 'readonly', 'browser') into their
        individual scopes, and validates the rest.
        """
        resolved: List[str] = []
        for scope in scopes:
            if scope in SCOPE_PRESETS:
                resolved.extend(SCOPE_PRESETS[scope])
            else:
                resolved.append(scope)
        # Deduplicate while preserving order
        seen: set = set()
        deduped = []
        for s in resolved:
            if s not in seen:
                seen.add(s)
                deduped.append(s)
        return deduped

    @classmethod
    async def register(
        cls,
        api_key: str,
        name: str,
        scopes: Optional[List[str]] = None,
        scope_limits: Optional[Dict[str, Any]] = None,
        register_url: str = DEFAULT_REGISTER_URL,
        timeout: float = 10.0,
    ) -> "AgentIdentity":
        """
        Register a new agent with the SupraWall backend.

        Args:
            api_key:      The organization's master API key (ag_...).
            name:         Human-readable name for the agent.
            scopes:       List of scopes (e.g. ["crm:read", "email:send"]).
                          Can include preset names like "readonly" or "browser".
            scope_limits: Optional per-scope rate limits, e.g.
                          {"email:send": {"max_per_hour": 10}}.
            register_url: Override the registration endpoint URL.
            timeout:      HTTP request timeout in seconds.

        Returns:
            An AgentIdentity instance with the agent's credentials.

        Raises:
            ScopeValidationError: If scopes have invalid format.
            RegistrationError: If the server rejects the registration.
        """
        if not api_key or not api_key.startswith("ag_"):
            raise ValueError(
                "api_key must be a valid organization API key (starting with 'ag_')."
            )
        if not name or not name.strip():
            raise ValueError("Agent name must not be empty.")

        # Resolve and validate scopes
        final_scopes = cls.resolve_scopes(scopes or [])
        if final_scopes:
            cls.validate_scopes(final_scopes)

        payload: Dict[str, Any] = {
            "apiKey": api_key,
            "name": name.strip(),
        }
        if final_scopes:
            payload["scopes"] = final_scopes
        if scope_limits:
            payload["scopeLimits"] = scope_limits

        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(register_url, json=payload)

        # Next.js API returns 201 Created for positive registration
        if resp.status_code not in (200, 201):
            try:
                err = resp.json().get("error", resp.text)
            except Exception:
                err = resp.text
            raise RegistrationError(resp.status_code, str(err))

        data = resp.json()

        creds = AgentCredentials(
            agent_id=data["id"],
            agent_api_key=data["apiKey"],
            name=name.strip(),
            scopes=final_scopes or [],
        )
        return cls(credentials=creds)

    @classmethod
    def register_sync(
        cls,
        api_key: str,
        name: str,
        scopes: Optional[List[str]] = None,
        scope_limits: Optional[Dict[str, Any]] = None,
        register_url: str = DEFAULT_REGISTER_URL,
        timeout: float = 10.0,
    ) -> "AgentIdentity":
        """
        Synchronous version of register() for non-async contexts.
        """
        if not api_key or not api_key.startswith("ag_"):
            raise ValueError(
                "api_key must be a valid organization API key (starting with 'ag_')."
            )
        if not name or not name.strip():
            raise ValueError("Agent name must not be empty.")

        final_scopes = cls.resolve_scopes(scopes or [])
        if final_scopes:
            cls.validate_scopes(final_scopes)

        payload: Dict[str, Any] = {
            "apiKey": api_key,
            "name": name.strip(),
        }
        if final_scopes:
            payload["scopes"] = final_scopes
        if scope_limits:
            payload["scopeLimits"] = scope_limits

        with httpx.Client(timeout=timeout) as client:
            resp = client.post(register_url, json=payload)

        if resp.status_code not in (200, 201):
            try:
                err = resp.json().get("error", resp.text)
            except Exception:
                err = resp.text
            raise RegistrationError(resp.status_code, str(err))

        data = resp.json()

        creds = AgentCredentials(
            agent_id=data["id"],
            agent_api_key=data["apiKey"],
            name=name.strip(),
            scopes=final_scopes or [],
        )
        return cls(credentials=creds)

    @classmethod
    def from_credentials(
        cls,
        agent_api_key: str,
        scopes: Optional[List[str]] = None,
        agent_id: str = "",
        name: str = "",
    ) -> "AgentIdentity":
        """
        Create an AgentIdentity from existing credentials (no API call).
        """
        creds = AgentCredentials(
            agent_id=agent_id,
            agent_api_key=agent_api_key,
            name=name,
            scopes=scopes or [],
        )
        return cls(credentials=creds)

    def to_options(self, **overrides) -> "SupraWallOptions":
        """
        Returns a SupraWallOptions configured with this agent's API key.
        Extra keyword arguments are forwarded as option overrides.
        """
        from .gate import SupraWallOptions
        return SupraWallOptions(
            api_key=self.credentials.agent_api_key,
            **overrides,
        )

    @property
    def api_key(self) -> str:
        return self.credentials.agent_api_key

    @property
    def agent_id(self) -> str:
        return self.credentials.agent_id

    @property
    def name(self) -> str:
        return self.credentials.name

    @property
    def scopes(self) -> List[str]:
        return self.credentials.scopes
