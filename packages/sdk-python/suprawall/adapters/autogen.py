# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""AutoGen adapter — wraps generate_reply and registered tool functions."""

import functools
import inspect
import logging
from typing import Any

log = logging.getLogger("suprawall")


def wrap_autogen(agent: Any, engine: Any) -> Any:
    """
    Protects an AutoGen ConversableAgent / AssistantAgent.

    Wraps ``generate_reply`` to intercept function-call arguments, and
    patches every entry in ``_function_map`` so individual tools are
    checked before execution.
    """
    _wrap_generate_reply(agent, engine)
    _wrap_function_map(agent, engine)
    log.debug("[SupraWall] AutoGen agent protected.")
    return agent


def _wrap_generate_reply(agent: Any, engine: Any) -> None:
    original = getattr(agent, "generate_reply", None)
    if not original:
        return

    if inspect.iscoroutinefunction(original):
        @functools.wraps(original)
        async def _secured(*args, **kwargs):
            _check_fn_call_kwargs(kwargs, engine)
            return await original(*args, **kwargs)
        agent.generate_reply = _secured
    else:
        @functools.wraps(original)
        def _secured(*args, **kwargs):  # type: ignore[misc]
            _check_fn_call_kwargs(kwargs, engine)
            return original(*args, **kwargs)
        agent.generate_reply = _secured


def _check_fn_call_kwargs(kwargs: dict, engine: Any) -> None:
    fn_call = kwargs.get("function_call") or {}
    if not isinstance(fn_call, dict):
        return
    tool_name = fn_call.get("name", "autogen_reply")
    fn_args = fn_call.get("arguments", {})
    violation = engine.check(tool_name, fn_args)
    if violation:
        from suprawall.firewall import _handle_violation
        _handle_violation(tool_name, violation, engine, fn_args)


def _wrap_function_map(agent: Any, engine: Any) -> None:
    fn_map = getattr(agent, "_function_map", None)
    if not isinstance(fn_map, dict):
        return
    for fn_name in list(fn_map):
        fn = fn_map[fn_name]
        fn_map[fn_name] = _guarded(fn, fn_name, engine)


def _guarded(fn: Any, fn_name: str, engine: Any):
    @functools.wraps(fn)
    def _wrapper(*args, **kwargs):
        violation = engine.check(fn_name, {"args": list(args), "kwargs": kwargs})
        if violation:
            from suprawall.firewall import _handle_violation
            _handle_violation(fn_name, violation, engine, {"args": list(args), "kwargs": kwargs})
        return fn(*args, **kwargs)
    return _wrapper
