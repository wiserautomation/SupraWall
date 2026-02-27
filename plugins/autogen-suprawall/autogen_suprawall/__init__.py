import os
import requests
from typing import Callable, Any, Dict

def with_suprawall(func: Callable, api_key: str = None) -> Callable:
    """
    Wraps an AutoGen registered tool with SupraWall evaluation.
    Usage:
        @user_proxy.register_for_execution()
        @with_suprawall
        def my_tool(command: str):
            ...
    """
    key = api_key or os.environ.get("SUPRAWALL_API_KEY")
    if not key:
        raise ValueError("SUPRAWALL_API_KEY is required")
    api_url = os.environ.get("SUPRAWALL_API_URL", "https://api.suprawall.io/v1/evaluate")

    def wrapper(*args, **kwargs):
        tool_name = func.__name__
        res = requests.post(api_url, json={
            "agentId": "autogen_agent",
            "toolName": tool_name,
            "arguments": kwargs
        }, headers={"Authorization": f"Bearer {key}"})
        
        if res.status_code == 200:
            decision = res.json().get("decision")
            if decision == "DENY":
                return f"Error: SupraWall Policy Violation. Tool '{tool_name}' explicitly denied."
            elif decision == "REQUIRE_APPROVAL":
                return f"Error: SupraWall Policy Violation. Tool '{tool_name}' requires human approval."
        else:
            return "Error: SupraWall Unreachable. Failing closed."
            
        return func(*args, **kwargs)
    return wrapper
