"""
SupraWall integration for LangChain.

Provides a LangChain CallbackHandler that enforces SupraWall policies
at the tool level — before any tool executes. Works with all LangChain
agent types: AgentExecutor, LangGraph, create_react_agent, etc.

Install:
    pip install suprawall langchain-core

Example:
    from suprawall import SupraWallLangChainCallback, SupraWallOptions
    from langchain.agents import AgentExecutor

    callback = SupraWallLangChainCallback(
        SupraWallOptions(api_key="ag_your_key_here")
    )

    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        callbacks=[callback],
    )
    agent_executor.invoke({"input": "Delete all temp files"})
"""

import logging
from typing import Any, Dict, List, Optional
from uuid import UUID

log = logging.getLogger("suprawall.langchain")

try:
    from langchain_core.callbacks.base import BaseCallbackHandler
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    class BaseCallbackHandler:  # type: ignore
        pass

from .gate import SupraWallOptions, _evaluate, _evaluate_async, _handle_decision
import functools

def secure(api_key: Optional[str] = None, **options):
    """
    A "Zero Config" universal decorator to protect any AI agent.
    
    Usage:
        @secure(api_key="ag_...")
        def my_crew():
            return Crew(agents=[...], tasks=[...])
    """
    from .gate import protect as universal_protect
    
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # 1. Execute the factory function
            agent = func(*args, **kwargs)
            
            # 2. Universal protection detection
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
        elif isinstance(agent, list): # Handle case where callbacks is being modified
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
        self.raise_error = True  # Required to halt LangChain execution on error

    # ── Sync callback ──────────────────────────────────────────────────────

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
        """
        Called by LangChain before every tool execution.
        We intercept here and block if SupraWall denies the action.
        """
        tool_name = serialized.get("name") or serialized.get("id", ["unknown"])[-1]
        args = inputs or {"input": input_str}

        try:
            import httpx
            data = _evaluate(tool_name, args, self.options)
        except httpx.RequestError as e:
            log.error(f"[SupraWall] Network error during tool check: {e}")
            if self.options.on_network_error == "fail-closed":
                raise PermissionError(
                    f"[SupraWall] Unreachable. Tool '{tool_name}' blocked (fail-closed)."
                )
            log.warning(
                f"[SupraWall] Proceeding without policy check for '{tool_name}' (fail-open). "
                "Set on_network_error='fail-closed' in production."
            )
            return  # fail-open: let LangChain continue

        decision = data.get("decision")
        reason = data.get("reason")
        blocked = _handle_decision(decision, reason, tool_name)

        if blocked is not None:
            raise PermissionError(blocked)

        # ALLOW — return normally, LangChain proceeds with the tool call

    def on_tool_end(
        self,
        output: Any,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        """Called after a tool finishes. No-op for SupraWall — hook available for future use."""
        pass

    def on_tool_error(
        self,
        error: BaseException,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        """Called when a tool raises an exception."""
        log.error(f"[SupraWall] Tool error observed: {error}")

    # ── Async callback ─────────────────────────────────────────────────────

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
        """
        Async version of on_tool_start.
        Used when LangChain runs in async mode (ainvoke, astream, etc.).
        """
        tool_name = serialized.get("name") or serialized.get("id", ["unknown"])[-1]
        args = inputs or {"input": input_str}

        try:
            import httpx
            data = await _evaluate_async(tool_name, args, self.options)
        except httpx.RequestError as e:
            log.error(f"[SupraWall] Async network error during tool check: {e}")
            if self.options.on_network_error == "fail-closed":
                raise PermissionError(
                    f"[SupraWall] Unreachable. Tool '{tool_name}' blocked (fail-closed)."
                )
            log.warning(
                f"[SupraWall] Proceeding without async policy check for '{tool_name}' (fail-open)."
            )
            return

        decision = data.get("decision")
        reason = data.get("reason")
        blocked = _handle_decision(decision, reason, tool_name)

        if blocked is not None:
            raise PermissionError(blocked)
