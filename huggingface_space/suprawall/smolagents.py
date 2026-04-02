# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

import functools
import logging
from typing import Any, Optional
from .gate import _evaluate, _evaluate_async, _handle_decision, SupraWallOptions

log = logging.getLogger("suprawall")

def wrap_smolagents(agent: Any, options: SupraWallOptions) -> Any:
    """
    Wraps a smolagents Agent (CodeAgent or ToolCallingAgent) with SupraWall security.
    
    This replaces the tool execution logic to ensure every tool call is validated
    by SupraWall before running.
    
    Args:
        agent: The smolagents agent instance.
        options: SupraWallOptions for configuration.
    """
    if not hasattr(agent, "tools"):
        log.warning("[SupraWall] Agent does not appear to be a smolagents agent (no 'tools' attribute).")
        return agent

    # smolagents tools are stored in a dictionary: tool_name -> tool_object
    for tool_name, tool in agent.tools.items():
        original_forward = tool.forward
        
        @functools.wraps(original_forward)
        def secured_forward(*args, **kwargs):
            # 1. Evaluate with SupraWall
            # Combine args and kwargs for evaluation
            # smolagents tools usually take keyword arguments
            eval_args = kwargs.copy()
            if args:
                eval_args["_args"] = args
                
            data = _evaluate(tool_name, eval_args, options)
            blocked = _handle_decision(
                data.get("decision"), 
                data.get("reason"), 
                tool_name, 
                data.get("semanticScore"), 
                data.get("semanticReasoning")
            )
            
            if blocked is not None:
                # If blocked, we return the error message to the agent
                # smolagents handles strings as tool outputs
                return blocked
                
            # 2. Proceed with original tool execution
            return original_forward(*args, **kwargs)

        # Handle async tools if necessary
        import inspect
        if inspect.iscoroutinefunction(original_forward):
            @functools.wraps(original_forward)
            async def secured_forward_async(*args, **kwargs):
                eval_args = kwargs.copy()
                if args:
                    eval_args["_args"] = args

                data = await _evaluate_async(tool_name, eval_args, options)
                blocked = _handle_decision(
                    data.get("decision"), 
                    data.get("reason"), 
                    tool_name, 
                    data.get("semanticScore"), 
                    data.get("semanticReasoning")
                )
                
                if blocked is not None:
                    return blocked
                    
                return await original_forward(*args, **kwargs)
            
            tool.forward = secured_forward_async
        else:
            tool.forward = secured_forward

    log.info(f"[SupraWall] Secured {len(agent.tools)} tools for smolagents agent.")
    return agent
