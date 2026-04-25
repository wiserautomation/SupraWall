# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""LangChain adapter — injects a callback handler that intercepts on_tool_start."""

import logging
from typing import Any, Dict

log = logging.getLogger("suprawall")


def wrap_langchain(agent: Any, engine: Any) -> Any:
    """
    Protects a LangChain agent or AgentExecutor by injecting a SupraWall
    callback handler. Every tool call is checked before execution via
    ``on_tool_start``; violations raise ``SupraWallBlocked``.

    Works with AgentExecutor, LCEL Runnables, and any LangChain object
    that accepts callbacks.
    """
    try:
        from langchain_core.callbacks import BaseCallbackHandler  # type: ignore[import]
    except ImportError:
        try:
            from langchain.callbacks.base import BaseCallbackHandler  # type: ignore[import]
        except ImportError:
            log.warning(
                "[SupraWall] langchain_core not installed. "
                "Falling back to generic wrapper for this agent."
            )
            from suprawall.firewall import _adapt_generic
            return _adapt_generic(agent, engine)

    class _Handler(BaseCallbackHandler):
        raise_error = True  # let exceptions propagate out of AgentExecutor

        def on_tool_start(
            self,
            serialized: Dict[str, Any],
            input_str: str,
            **kwargs: Any,
        ) -> None:
            tool_name = serialized.get("name", "unknown_tool")
            violation = engine.check(tool_name, {"input": input_str})
            if violation:
                from suprawall.firewall import _handle_violation
                _handle_violation(tool_name, violation, engine, {"input": input_str})

    handler = _Handler()

    # Inject into the agent's callbacks list (modify in place, return same object)
    if hasattr(agent, "callbacks"):
        existing = agent.callbacks or []
        agent.callbacks = list(existing) + [handler]
    elif hasattr(agent, "agent") and hasattr(agent.agent, "callbacks"):
        inner = agent.agent
        existing = inner.callbacks or []
        inner.callbacks = list(existing) + [handler]

    log.debug("[SupraWall] LangChain agent protected.")
    return agent
