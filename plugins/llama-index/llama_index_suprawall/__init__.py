# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

import os
import requests
from typing import Optional, List, Any

class SupraWallOptions:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("SUPRAWALL_API_KEY")
        if not self.api_key:
            raise ValueError("SUPRAWALL_API_KEY is required")
        self.api_url = os.environ.get("suprawall_API_URL", "https://api.suprawall.io/v1/evaluate")

class SupraWallLlamaIndex:
    """Wrapper to secure LlamaIndex tools."""
    
    @classmethod
    def wrap_tools(cls, tools: List[Any], options: Optional[SupraWallOptions] = None) -> List[Any]:
        opts = options or SupraWallOptions()
        
        secured_tools = []
        for tool in tools:
            original_fn = getattr(tool, "fn", None)
            if not original_fn:
                secured_tools.append(tool)
                continue
                
            def secured_fn(*args, **kwargs):
                res = requests.post(opts.api_url, json={
                    "agentId": "llama_index_agent",
                    "toolName": tool.metadata.name,
                    "arguments": kwargs
                }, headers={"Authorization": f"Bearer {opts.api_key}"})
                
                if res.status_code == 200:
                    decision = res.json().get("decision")
                    if decision == "DENY":
                        raise Exception(f"suprawall Policy Violation: Tool '{tool.metadata.name}' is explicitly denied.")
                    elif decision == "REQUIRE_APPROVAL":
                        raise Exception(f"suprawall: Tool '{tool.metadata.name}' requires human approval.")
                else:
                    raise Exception("suprawall Unreachable: Failing closed.")
                
                return original_fn(*args, **kwargs)
            
            tool.fn = secured_fn
            secured_tools.append(tool)
            
        return secured_tools

class SupraWallAgent:
    """Convenience class for ReActAgent wrapped by suprawall."""
    
    @classmethod
    def from_llm(cls, llm: Any, tools: List[Any], api_key: Optional[str] = None, **kwargs):
        from llama_index.core.agent import ReActAgent
        opts = SupraWallOptions(api_key=api_key)
        secured_tools = SupraWallLlamaIndex.wrap_tools(tools, opts)
        return ReActAgent.from_tools(secured_tools, llm=llm, **kwargs)
