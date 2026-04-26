# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""
Anthropic adapter — guards tool dispatch for custom Anthropic tool-calling agents.

Anthropic's Python SDK exposes tool_use blocks in message responses; there is no
standard agent wrapper. This adapter protects common patterns:
  - agents with a ``tools`` list of callables / tool dicts
  - custom agent classes that expose ``invoke`` / ``run`` / ``__call__``
"""

import functools
import inspect
import logging
from typing import Any

log = logging.getLogger("suprawall")

_GUARDED_ATTR = "_suprawall_guarded"


def wrap_anthropic(agent: Any, engine: Any) -> Any:
    """
    Protects an Anthropic-based agent.

    If the agent exposes a ``tools`` attribute (list of callables or objects
    with a ``fn`` attribute), each tool is wrapped. Falls back to wrapping
    ``invoke`` / ``run`` / ``__call__`` for custom agent classes.
    """
    tools = getattr(agent, "tools", None)
    if isinstance(tools, (list, tuple)):
        for tool in tools:
            if callable(tool) and not isinstance(tool, type):
                _guard_callable_tool(tool, engine, agent)
            elif hasattr(tool, "fn"):
                _guard_attr_tool(tool, "fn", engine)

    # Also wrap the agent's own dispatch method for belt-and-suspenders coverage
    for method_name in ("invoke", "run", "__call__"):
        original = getattr(agent, method_name, None)
        if not callable(original) or getattr(original, _GUARDED_ATTR, False):
            continue

        if inspect.iscoroutinefunction(original):
            @functools.wraps(original)
            async def _async(*args, _o=original, _e=engine, _mn=method_name, **kwargs):
                call_args = {"args": list(args), "kwargs": kwargs}
                violation = _e.check(f"anthropic.{_mn}", call_args)
                if violation:
                    from suprawall.firewall import _handle_violation
                    _handle_violation(f"anthropic.{_mn}", violation, _e, call_args)
                return await _o(*args, **kwargs)
            setattr(agent, method_name, _async)
            setattr(getattr(agent, method_name), _GUARDED_ATTR, True)
        else:
            @functools.wraps(original)
            def _sync(*args, _o=original, _e=engine, _mn=method_name, **kwargs):
                call_args = {"args": list(args), "kwargs": kwargs}
                violation = _e.check(f"anthropic.{_mn}", call_args)
                if violation:
                    from suprawall.firewall import _handle_violation
                    _handle_violation(f"anthropic.{_mn}", violation, _e, call_args)
                return _o(*args, **kwargs)
            setattr(agent, method_name, _sync)
            setattr(getattr(agent, method_name), _GUARDED_ATTR, True)
        break

    log.debug("[SupraWall] Anthropic agent protected.")
    return agent


def _guard_attr_tool(tool: Any, attr_name: str, engine: Any) -> None:
    if getattr(tool, _GUARDED_ATTR, False):
        return
    original = getattr(tool, attr_name)
    tool_name = getattr(tool, "name", getattr(original, "__name__", "anthropic_tool"))

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


def _guard_callable_tool(fn: Any, engine: Any, agent: Any) -> None:
    fn_name = getattr(fn, "__name__", "anthropic_tool")
    if not hasattr(agent, "tools") or not isinstance(agent.tools, list):
        return

    @functools.wraps(fn)
    def _guarded(*args, **kwargs):
        violation = engine.check(fn_name, list(args) + [kwargs])
        if violation:
            from suprawall.firewall import _handle_violation
            _handle_violation(fn_name, violation, engine, list(args) + [kwargs])
        return fn(*args, **kwargs)

    idx = agent.tools.index(fn)
    agent.tools[idx] = _guarded
