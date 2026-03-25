# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

import os
import requests
from typing import List, Any, Optional

def with_suprawall(tools: List[Any], api_key: Optional[str] = None) -> List[Any]:
    """
    Wraps existing CrewAI (LangChain) tools with suprawall evaluation.
    CrewAI uses LangChain's BaseTool under the hood.
    """
    key = api_key or os.environ.get("SUPRAWALL_API_KEY")
    if not key:
        raise ValueError("SUPRAWALL_API_KEY is required")
        
    api_url = os.environ.get("suprawall_API_URL", "https://api.suprawall.io/v1/evaluate")

    secured_tools = []
    
    for tool in tools:
        original_run = getattr(tool, "_run", None)
        if not original_run:
            secured_tools.append(tool)
            continue
            
        def secure_run(*args, **kwargs):
            tool_name = tool.name
            res = requests.post(api_url, json={
                "agentId": "crewai_agent",
                "toolName": tool_name,
                "arguments": kwargs
            }, headers={"Authorization": f"Bearer {key}"})
            
            if res.status_code == 200:
                decision = res.json().get("decision")
                if decision == "DENY":
                    return f"Action blocked by suprawall Security: Tool '{tool_name}' is explicitly denied."
                elif decision == "REQUIRE_APPROVAL":
                    return f"Action blocked by suprawall: Tool '{tool_name}' requires human approval."
            else:
                return "suprawall uncreachable: Failing Closed."
                
            return original_run(*args, **kwargs)

        tool._run = secure_run
        secured_tools.append(tool)
        
    return secured_tools
