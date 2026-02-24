"""
AgentGate integration for LangChain.

Provides a LangChain CallbackHandler that enforces AgentGate policies
at the tool level — before any tool executes. Works with all LangChain
agent types: AgentExecutor, LangGraph, create_react_agent, etc.

Install:
    pip install agentgate langchain-core

Example:
    from agentgate import AgentGateLangChainCallback, AgentGateOptions
    from langchain.agents import AgentExecutor

    callback = AgentGateLangChainCallback(
        AgentGateOptions(api_key="ag_your_key_here")
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

log = logging.getLogger("agentgate.langchain")

try:
    from langchain_core.callbacks.base import BaseCallbackHandler
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    class BaseCallbackHandler:  # type: ignore
        pass

from .gate import AgentGateOptions, _evaluate, _evaluate_async, _handle_decision


class AgentGateLangChainCallback(BaseCallbackHandler):
    """
    LangChain CallbackHandler that enforces AgentGate policies on every tool call.

    Raises a PermissionError to halt execution if a tool is DENIED.
    For REQUIRE_APPROVAL, raises a PermissionError with approval instructions.
    """

    def __init__(self, options: AgentGateOptions):
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
        We intercept here and block if AgentGate denies the action.
        """
        tool_name = serialized.get("name") or serialized.get("id", ["unknown"])[-1]
        args = inputs or {"input": input_str}

        try:
            import httpx
            data = _evaluate(tool_name, args, self.options)
        except httpx.RequestError as e:
            log.error(f"[AgentGate] Network error during tool check: {e}")
            if self.options.on_network_error == "fail-closed":
                raise PermissionError(
                    f"[AgentGate] Unreachable. Tool '{tool_name}' blocked (fail-closed)."
                )
            log.warning(
                f"[AgentGate] Proceeding without policy check for '{tool_name}' (fail-open). "
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
        """Called after a tool finishes. No-op for AgentGate — hook available for future use."""
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
        log.error(f"[AgentGate] Tool error observed: {error}")

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
            log.error(f"[AgentGate] Async network error during tool check: {e}")
            if self.options.on_network_error == "fail-closed":
                raise PermissionError(
                    f"[AgentGate] Unreachable. Tool '{tool_name}' blocked (fail-closed)."
                )
            log.warning(
                f"[AgentGate] Proceeding without async policy check for '{tool_name}' (fail-open)."
            )
            return

        decision = data.get("decision")
        reason = data.get("reason")
        blocked = _handle_decision(decision, reason, tool_name)

        if blocked is not None:
            raise PermissionError(blocked)
