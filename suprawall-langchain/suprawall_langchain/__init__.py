"""
SupraWall integration for LangChain.

Provides a LangChain CallbackHandler that enforces SupraWall policies
at the tool level — before any tool executes. Works with all LangChain
agent types: AgentExecutor, LangGraph, create_react_agent, etc.
"""

import logging
from typing import Any, Dict, List, Optional
from uuid import UUID
import functools

# SupraWall core imports
from suprawall.gate import (
    SupraWallOptions, 
    _evaluate, 
    _evaluate_async, 
    _handle_decision, 
    _scrub_response, 
    _scrub_response_async,
    protect as universal_protect
)

log = logging.getLogger("suprawall.langchain")

try:
    from langchain_core.callbacks.base import BaseCallbackHandler
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    class BaseCallbackHandler:  # type: ignore
        pass

def secure(api_key: Optional[str] = None, **options):
    """
    A "Zero Config" universal decorator to protect any AI agent.
    
    Usage:
        @secure(api_key="ag_...")
        def my_agent_factory():
            return create_react_agent(...)
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            agent = func(*args, **kwargs)
            sw_options = SupraWallOptions(api_key=api_key, **options)
            return universal_protect(agent, sw_options)
        return wrapper
    return decorator

def wrap_langchain(agent: Any, options: SupraWallOptions) -> Any:
    """Native LangChain callback injection."""
    callback = SupraWallLangChainCallback(options)
    
    # Handles AgentExecutor and most LangChain Runnables
    if hasattr(agent, "callbacks"):
        if agent.callbacks is None:
            agent.callbacks = [callback]
        elif isinstance(agent.callbacks, list):
             agent.callbacks.append(callback)
    
    # Fallback for newer LCEL Runnables that might store callbacks in config
    if hasattr(agent, "with_config"):
        return agent.with_config({"callbacks": [callback]})
        
    return agent


class SupraWallLangChainCallback(BaseCallbackHandler):
    """
    LangChain CallbackHandler that enforces SupraWall policies on every tool call.

    Raises a PermissionError to halt execution if a tool is DENIED.
    For REQUIRE_APPROVAL, raises a PermissionError with approval instructions.
    """

    def __init__(self, options: SupraWallOptions):
        if not LANGCHAIN_AVAILABLE:
            raise ImportError(
                "langchain-core is not installed. "
                "Run: pip install langchain-core"
            )
        super().__init__()
        self.options = options
        self.raise_error = True 
        # Vault: track injected secrets per run_id for post-execution scrubbing
        self._vault_run_state: dict = {}  # run_id -> {"injectedSecrets": [...]}

    def on_tool_start(
        self,
        serialized: Dict[str, Any],
        input_str: str,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        inputs: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> None:
        tool_name = serialized.get("name") or serialized.get("id", ["unknown"])[-1]
        args = inputs or {"input": input_str}

        try:
            import httpx
            data = _evaluate(tool_name, args, self.options)
        except Exception as e:
            log.error(f"[SupraWall] Network error during tool check: {e}")
            if self.options.on_network_error == "fail-closed":
                raise PermissionError(
                    f"[SupraWall] Unreachable. Tool '{tool_name}' blocked (fail-closed)."
                )
            return

        decision = data.get("decision")
        reason = data.get("reason")
        blocked = _handle_decision(decision, reason, tool_name)

        if blocked is not None:
            raise PermissionError(blocked)

        if data.get("vaultInjected") and data.get("injectedSecrets"):
            self._vault_run_state[str(run_id)] = {
                "injectedSecrets": data["injectedSecrets"],
            }

    def on_tool_end(
        self,
        output: Any,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        run_key = str(run_id)
        vault_state = self._vault_run_state.pop(run_key, None)
        if vault_state and vault_state.get("injectedSecrets"):
            scrubbed = _scrub_response(output, vault_state["injectedSecrets"], self.options)
            if isinstance(output, dict):
                output.clear()
                output.update(scrubbed if isinstance(scrubbed, dict) else {"output": scrubbed})
            log.debug(f"[SupraWall] Vault: scrubbed tool output for run {run_key}")

    async def on_tool_start_async(
        self,
        serialized: Dict[str, Any],
        input_str: str,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
        inputs: Optional[Dict[str, Any]] = None,
        **kwargs: Any,
    ) -> None:
        tool_name = serialized.get("name") or serialized.get("id", ["unknown"])[-1]
        args = inputs or {"input": input_str}

        try:
            data = await _evaluate_async(tool_name, args, self.options)
        except Exception as e:
            log.error(f"[SupraWall] Async network error during tool check: {e}")
            if self.options.on_network_error == "fail-closed":
                raise PermissionError(
                    f"[SupraWall] Unreachable. Tool '{tool_name}' blocked (fail-closed)."
                )
            return

        decision = data.get("decision")
        reason = data.get("reason")
        blocked = _handle_decision(decision, reason, tool_name)

        if blocked is not None:
            raise PermissionError(blocked)

        if data.get("vaultInjected") and data.get("injectedSecrets"):
            self._vault_run_state[str(run_id)] = {
                "injectedSecrets": data["injectedSecrets"],
            }

    async def on_tool_end_async(
        self,
        output: Any,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        run_key = str(run_id)
        vault_state = self._vault_run_state.pop(run_key, None)
        if vault_state and vault_state.get("injectedSecrets"):
            scrubbed = await _scrub_response_async(output, vault_state["injectedSecrets"], self.options)
            if isinstance(output, dict):
                output.clear()
                output.update(scrubbed if isinstance(scrubbed, dict) else {"output": scrubbed})
            log.debug(f"[SupraWall] Vault: scrubbed tool output for run {run_key}")
