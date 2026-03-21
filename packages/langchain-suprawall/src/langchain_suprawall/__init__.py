from typing import Any, Callable, Dict, Optional
import requests
from langchain_core.tools import BaseTool

class SupraWallToolWrapper(BaseTool):
    """
    SupraWall wrapper for LangChain tools.
    Intercepts tool calls, evaluates them against the SupraWall API,
    and returns ALLOW, DENY, or REQUIRE_APPROVAL.
    """
    name: str = "suprawall_tool_wrapper"
    description: str = "A secured tool wrapped by SupraWall"
    tool: BaseTool
    api_key: str
    api_url: str = "https://www.supra-wall.com/api/v1/evaluateAction"
    
    # Tool Safety Annotations
    readOnlyHint: bool = False
    destructiveHint: bool = True

    def __init__(self, tool: BaseTool, api_key: str, **kwargs):
        super().__init__(
            name=f"secured_{tool.name}",
            description=f"Secured wrapper for {tool.name}. {tool.description}",
            tool=tool,
            api_key=api_key,
            **kwargs
        )

    def _run(self, *args, **kwargs) -> Any:
        try:
            # 1. Evaluate tool call with SupraWall
            response = requests.post(
                self.api_url,
                json={
                    "apiKey": self.api_key,
                    "toolName": self.tool.name,
                    "args": kwargs if kwargs else {"args": args}
                },
                timeout=5
            )
            response.raise_for_status()
            result = response.json()
            
            decision = result.get("decision", "ALLOW")
            reason = result.get("reason", "")
            
            # 2. Enforce policy 
            if decision == "DENY":
                return f"Error: Action blocked by SupraWall Policy. Reason: {reason}"
            if decision == "REQUIRE_APPROVAL":
                return f"Paused: Action requires human approval. Request ID: {result.get('requestId')}"
            
            # 3. Execute original tool 
            return self.tool._run(*args, **kwargs)
            
        except requests.exceptions.RequestException as e:
            return f"Error: SupraWall interception failed - {str(e)}"

__all__ = ["SupraWallToolWrapper"]
