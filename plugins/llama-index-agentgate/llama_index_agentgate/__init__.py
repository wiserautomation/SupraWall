import os
import requests
from typing import Optional, List, Any

class agentgateOptions:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("AGENTGATE_API_KEY")
        if not self.api_key:
            raise ValueError("AGENTGATE_API_KEY is required")
        self.api_url = os.environ.get("agentgate_API_URL", "https://api.agentgate.io/v1/evaluate")

class agentgateLlamaIndex:
    """Wrapper to secure LlamaIndex tools."""
    
    @classmethod
    def wrap_tools(cls, tools: List[Any], options: Optional[agentgateOptions] = None) -> List[Any]:
        opts = options or agentgateOptions()
        
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
                        raise Exception(f"agentgate Policy Violation: Tool '{tool.metadata.name}' is explicitly denied.")
                    elif decision == "REQUIRE_APPROVAL":
                        raise Exception(f"agentgate: Tool '{tool.metadata.name}' requires human approval.")
                else:
                    raise Exception("agentgate Unreachable: Failing closed.")
                
                return original_fn(*args, **kwargs)
            
            tool.fn = secured_fn
            secured_tools.append(tool)
            
        return secured_tools

class agentgateAgent:
    """Convenience class for ReActAgent wrapped by agentgate."""
    
    @classmethod
    def from_llm(cls, llm: Any, tools: List[Any], api_key: Optional[str] = None, **kwargs):
        from llama_index.core.agent import ReActAgent
        opts = agentgateOptions(api_key=api_key)
        secured_tools = agentgateLlamaIndex.wrap_tools(tools, opts)
        return ReActAgent.from_tools(secured_tools, llm=llm, **kwargs)
