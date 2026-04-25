# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""CrewAI adapter — guards each tool's _run method on Agents and Crews."""

import functools
import logging
from typing import Any

log = logging.getLogger("suprawall")

_GUARDED_ATTR = "_suprawall_guarded"


def wrap_crewai(agent_or_crew: Any, engine: Any) -> Any:
    """
    Protects a CrewAI Agent or Crew.

    For a Crew, recurses into each member Agent. For an Agent, wraps
    every tool's ``_run`` method so policy is evaluated before execution.
    """
    if hasattr(agent_or_crew, "agents") and hasattr(agent_or_crew, "tasks"):
        # Crew object — protect each member
        for member in agent_or_crew.agents or []:
            wrap_crewai(member, engine)
    elif hasattr(agent_or_crew, "tools"):
        for tool in agent_or_crew.tools or []:
            _guard_tool(tool, engine)

    log.debug("[SupraWall] CrewAI agent/crew protected.")
    return agent_or_crew


def _guard_tool(tool: Any, engine: Any) -> None:
    if getattr(tool, _GUARDED_ATTR, False):
        return

    original = getattr(tool, "_run", None)
    if not original:
        return

    tool_name = getattr(tool, "name", type(tool).__name__)

    @functools.wraps(original)
    def _guarded(*args, **kwargs):
        call_args = kwargs or list(args)
        violation = engine.check(tool_name, call_args)
        if violation:
            from suprawall.firewall import _handle_violation
            _handle_violation(tool_name, violation, engine, call_args if isinstance(call_args, dict) else {"args": call_args})
        return original(*args, **kwargs)

    tool._run = _guarded
    setattr(tool, _GUARDED_ATTR, True)
