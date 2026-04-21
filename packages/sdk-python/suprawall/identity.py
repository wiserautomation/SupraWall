# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

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

DEFAULT_REGISTER_URL = "https://www.supra-wall.com/v1/agents"

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
        super().__init__(f"Agent creation failed (HTTP {status_code}): {message}")


@dataclass(frozen=True)
class AgentCredentials:
    """
    Credentials returned after successful agent creation.
    """
    agent_id: str
    agent_api_key: str
    name: str
    created_at: Optional[str] = None
    scopes: List[str] = field(default_factory=list)

    def __repr__(self) -> str:
        masked = self.agent_api_key[:8] + "..." + self.agent_api_key[-4:]
        return (
            f"AgentCredentials(name={self.name!r}, "
            f"agent_id={self.agent_id!r}, "
            f"key={masked})"
        )


@dataclass
class AgentIdentity:
    """
    Manages an agent's identity, including its credentials and scopes.
    """
    credentials: AgentCredentials

    @staticmethod
    def resolve_scopes(scopes: List[str]) -> List[str]:
        """
        Expands preset names (e.g. 'readonly', 'browser') into their
        individual scopes.
        """
        resolved: List[str] = []
        for scope in scopes:
            if scope in SCOPE_PRESETS:
                resolved.extend(SCOPE_PRESETS[scope])
            else:
                resolved.append(scope)
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
        guardrails: Optional[Dict[str, Any]] = None,
        register_url: str = DEFAULT_REGISTER_URL,
        timeout: float = 10.0,
    ) -> "AgentIdentity":
        """
        Register a new agent with the SupraWall backend.
        """
        return await SupraWallAdmin.create_agent(
            api_key=api_key,
            name=name,
            scopes=scopes,
            guardrails=guardrails,
            base_url=register_url.rsplit("/v1/agents", 1)[0],
            timeout=timeout
        )

    @classmethod
    def register_sync(
        cls,
        api_key: str,
        name: str,
        scopes: Optional[List[str]] = None,
        guardrails: Optional[Dict[str, Any]] = None,
        register_url: str = DEFAULT_REGISTER_URL,
        timeout: float = 10.0,
    ) -> "AgentIdentity":
        """
        Synchronous version of register() for non-async contexts.
        """
        return SupraWallAdmin.create_agent_sync(
            api_key=api_key,
            name=name,
            scopes=scopes,
            guardrails=guardrails,
            base_url=register_url.rsplit("/v1/agents", 1)[0],
            timeout=timeout
        )

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

    def to_options(self, **overrides) -> Any:
        """
        Returns a SupraWallOptions configured with this agent's API key.
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


class SupraWallAdmin:
    """
    Administrative client for managing SupraWall agents programmatically.
    """
    @staticmethod
    async def create_agent(
        api_key: str,
        name: str,
        scopes: Optional[List[str]] = None,
        guardrails: Optional[Dict[str, Any]] = None,
        base_url: str = "https://www.supra-wall.com",
        timeout: float = 10.0,
    ) -> "AgentIdentity":
        if not api_key:
            raise ValueError("api_key (sw_admin_...) is required.")
        
        final_scopes = AgentIdentity.resolve_scopes(scopes or ["*:*"])
        payload = {
            "name": name,
            "scopes": final_scopes,
            "guardrails": guardrails or {}
        }

        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                f"{base_url}/v1/agents",
                json=payload,
                headers={"Authorization": f"Bearer {api_key}"}
            )

        if resp.status_code not in (200, 201):
            raise RegistrationError(resp.status_code, resp.text)

        data = resp.json()
        creds = AgentCredentials(
            agent_id=data["id"],
            agent_api_key=data["apiKey"],
            name=data["name"],
            created_at=data.get("createdAt"),
            scopes=final_scopes
        )
        return AgentIdentity(credentials=creds)

    @staticmethod
    def create_agent_sync(
        api_key: str,
        name: str,
        scopes: Optional[List[str]] = None,
        guardrails: Optional[Dict[str, Any]] = None,
        base_url: str = "https://www.supra-wall.com",
        timeout: float = 10.0,
    ) -> "AgentIdentity":
        if not api_key:
            raise ValueError("api_key (sw_admin_...) is required.")
        
        final_scopes = AgentIdentity.resolve_scopes(scopes or ["*:*"])
        payload = {
            "name": name,
            "scopes": final_scopes,
            "guardrails": guardrails or {}
        }

        with httpx.Client(timeout=timeout) as client:
            resp = client.post(
                f"{base_url}/v1/agents",
                json=payload,
                headers={"Authorization": f"Bearer {api_key}"}
            )

        if resp.status_code not in (200, 201):
            raise RegistrationError(resp.status_code, resp.text)

        data = resp.json()
        creds = AgentCredentials(
            agent_id=data["id"],
            agent_api_key=data["apiKey"],
            name=data["name"],
            created_at=data.get("createdAt"),
            scopes=final_scopes
        )
        return AgentIdentity(credentials=creds)

    @staticmethod
    async def list_agents(
        api_key: str,
        base_url: str = "https://www.supra-wall.com",
        timeout: float = 10.0
    ) -> List[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.get(
                f"{base_url}/v1/agents",
                headers={"Authorization": f"Bearer {api_key}"}
            )
        resp.raise_for_status()
        return resp.json()

    @staticmethod
    async def revoke_agent(
        agent_id: str,
        api_key: str,
        base_url: str = "https://www.supra-wall.com",
        timeout: float = 10.0
    ) -> None:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.delete(
                f"{base_url}/v1/agents/{agent_id}",
                headers={"Authorization": f"Bearer {api_key}"}
            )
        resp.raise_for_status()
