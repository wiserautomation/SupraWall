import os
import requests
from typing import Any, Dict, List, Optional
from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.outputs import LLMResult

class SupraWallCallbackHandler(BaseCallbackHandler):
    """
    SupraWallCallbackHandler for LangChain.
    
    Provides deterministic tool-level security and audit logging by intercepting 
    every tool execution and evaluating it against SupraWall's policy engine.
    """
    
    def __init__(
        self, 
        api_key: Optional[str] = None, 
        api_url: Optional[str] = None,
        agent_id: str = "langchain_python_agent",
        block_on_approval: bool = True
    ):
        self.api_key = api_key or os.getenv("SUPRAWALL_API_KEY")
        if not self.api_key:
            raise ValueError("[SupraWall] SUPRAWALL_API_KEY is required.")
            
        self.api_url = api_url or os.getenv("SUPRAWALL_API_URL") or "https://api.supra-wall.com/v1/evaluate"
        self.agent_id = agent_id
        self.block_on_approval = block_on_approval

    def on_tool_start(
        self, 
        serialized: Dict[str, Any], 
        input_str: str, 
        **kwargs: Any
    ) -> Any:
        tool_name = serialized.get("name", "unknown")
        
        try:
            response = requests.post(
                self.api_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                },
                json={
                    "agentId": self.agent_id,
                    "toolName": tool_name,
                    "arguments": input_str
                },
                timeout=5
            )
            
            if response.status_code != 200:
                raise Exception(f"[SupraWall] Policy server error ({response.status_code}). Failing closed.")
                
            data = response.json()
            decision = data.get("decision")
            reason = data.get("reason", "")
            
            if decision == "DENY":
                raise Exception(f"[SupraWall] Policy Violation: Tool '{tool_name}' is denied. {reason}")
            elif decision == "REQUIRE_APPROVAL" and self.block_on_approval:
                raise Exception(f"[SupraWall] Policy Violation: Tool '{tool_name}' requires human approval.")
                
        except Exception as e:
            if "[SupraWall]" in str(e):
                raise e
            raise Exception(f"[SupraWall] Security Interception Error: {str(e)}")

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> Any:
        """Optional: Log token usage or end-of-turn metrics to SupraWall."""
        pass
