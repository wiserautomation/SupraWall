import os
import requests
from typing import Any, Dict, List, Optional
from langchain_core.callbacks import BaseCallbackHandler

class agentgateCallbackHandler(BaseCallbackHandler):
    """Callback handler to enforce agentgate policies in LangChain."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("AGENTGATE_API_KEY")
        if not self.api_key:
            raise ValueError("AGENTGATE_API_KEY is required")
        self.api_url = os.environ.get("agentgate_API_URL", "https://api.agentgate.io/v1/evaluate")

    def on_tool_start(self, serialized: Dict[str, Any], input_str: str, **kwargs: Any) -> Any:
        tool_name = serialized.get("name")
        res = requests.post(self.api_url, json={
            "agentId": "langchain_agent",
            "toolName": tool_name,
            "arguments": input_str
        }, headers={"Authorization": f"Bearer {self.api_key}"})
        
        if res.status_code == 200:
            decision = res.json().get("decision")
            if decision == "DENY":
                raise Exception(f"agentgate Policy Violation: Tool '{tool_name}' is explicitly denied.")
            elif decision == "REQUIRE_APPROVAL":
                raise Exception(f"agentgate: Tool '{tool_name}' requires human approval.")
        else:
            raise Exception("agentgate Unreachable: Failing closed.")

class agentgateToolkit:
    """Convenience class to inject agentgate into LangChain agents."""
    def __init__(self, api_key: Optional[str] = None):
        self.callback = agentgateCallbackHandler(api_key=api_key)

    def get_callbacks(self):
        return [self.callback]
