# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""OpenAI Agents SDK adapter — guards each tool's callable before invocation."""

import functools
import inspect
import logging
from typing import Any

log = logging.getLogger("suprawall")

_GUARDED_ATTR = "_suprawall_guarded"


def wrap_openai(agent: Any, engine: Any) -> Any:
    """
    Protects an OpenAI Agents SDK Agent.

    Wraps the ``fn`` (or ``on_invoke_tool``) callable on each tool object
    so policy is evaluated before the function runs.
    """
    for tool in getattr(agent, "tools", []) or []:
        _guard_tool(tool, engine)

    log.debug("[SupraWall] OpenAI Agents SDK agent protected.")
    return agent


def _guard_tool(tool: Any, engine: Any) -> None:
    if getattr(tool, _GUARDED_ATTR, False):
        return

    # The SDK uses either `fn` or `on_invoke_tool` for the underlying callable.
    attr_name = "fn" if hasattr(tool, "fn") else (
        "on_invoke_tool" if hasattr(tool, "on_invoke_tool") else None
    )
    if not attr_name:
        return

    original = getattr(tool, attr_name)
    tool_name = getattr(tool, "name", type(tool).__name__)

    if inspect.iscoroutinefunction(original):
        @functools.wraps(original)
        async def _guarded_async(*args, **kwargs):
            call_args = {"args": list(args), "kwargs": kwargs}
            violation = engine.check(tool_name, call_args)
            if violation:
                from suprawall.firewall import _handle_violation
                _handle_violation(tool_name, violation, engine, call_args)
            return await original(*args, **kwargs)
        setattr(tool, attr_name, _guarded_async)
    else:
        @functools.wraps(original)
        def _guarded(*args, **kwargs):
            call_args = {"args": list(args), "kwargs": kwargs}
            violation = engine.check(tool_name, call_args)
            if violation:
                from suprawall.firewall import _handle_violation
                _handle_violation(tool_name, violation, engine, call_args)
            return original(*args, **kwargs)
        setattr(tool, attr_name, _guarded)

    setattr(tool, _GUARDED_ATTR, True)
