# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""LangGraph adapter — guards tool nodes inside a compiled state graph."""

import functools
import logging
from typing import Any

log = logging.getLogger("suprawall")

_GUARDED_ATTR = "_suprawall_guarded"


def wrap_langgraph(graph: Any, engine: Any) -> Any:
    """
    Protects a LangGraph CompiledStateGraph.

    Walks the graph's ToolNode instances and wraps each tool's ``_run`` /
    ``run`` method. Raises ``SupraWallBlocked`` before the tool executes.
    """
    _guard_graph_tools(graph, engine)
    log.debug("[SupraWall] LangGraph graph protected.")
    return graph


def _guard_graph_tools(graph: Any, engine: Any) -> None:
    nodes = getattr(graph, "nodes", {})
    for _node_name, node in nodes.items():
        if not _is_tool_node(node):
            continue

        # ToolNode stores tools in tools_by_name (dict) or tools (list)
        tools_by_name = getattr(node, "tools_by_name", None)
        if tools_by_name:
            tools = list(tools_by_name.values())
        else:
            tools = list(getattr(node, "tools", []))

        for tool in tools:
            _guard_tool(tool, engine)


def _is_tool_node(node: Any) -> bool:
    return type(node).__name__ == "ToolNode" or hasattr(node, "tools_by_name")


def _guard_tool(tool: Any, engine: Any) -> None:
    if getattr(tool, _GUARDED_ATTR, False):
        return

    method_name = "_run" if hasattr(tool, "_run") else ("run" if hasattr(tool, "run") else None)
    if not method_name:
        return

    original = getattr(tool, method_name)
    tool_name = getattr(tool, "name", type(tool).__name__)

    @functools.wraps(original)
    def _guarded(*args, **kwargs):
        call_args = list(args) + [kwargs]
        violation = engine.check(tool_name, call_args)
        if violation:
            from suprawall.firewall import _handle_violation
            _handle_violation(tool_name, violation, engine, {"args": list(args), "kwargs": kwargs})
        return original(*args, **kwargs)

    setattr(tool, method_name, _guarded)
    setattr(tool, _GUARDED_ATTR, True)
