import os
import httpx
import json
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_exponential
from mcp.server.fastmcp import FastMCP

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mcp-suprawall")

# Initialize FastMCP
mcp = FastMCP("SUPRA-WALL Security")

API_BASE = "https://api.suprawall.ai/v1"
API_KEY = os.environ.get("SUPRAWALL_API_KEY")

# --- Schemas for Validation ---
class ToolPayload(BaseModel):
    tool_name: str
    payload: Dict[str, Any]

class PolicyRequest(BaseModel):
    rule: str

# --- Internal Helpers ---
def get_headers():
    if not API_KEY:
        raise ValueError("SUPRAWALL_API_KEY environment variable is not set.")
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-MCP-Version": "1.0.0"
    }

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def call_suprawall_api(method: str, endpoint: str, data: Optional[Dict] = None):
    async with httpx.AsyncClient(timeout=10.0) as client:
        if method == "POST":
            response = await client.post(f"{API_BASE}/{endpoint}", headers=get_headers(), json=data)
        else:
            response = await client.get(f"{API_BASE}/{endpoint}", headers=get_headers())
        
        response.raise_for_status()
        return response.json()

# --- Tools ---

@mcp.tool()
async def suprawall_health_check() -> Dict[str, Any]:
    """Check connectivity to the SUPRA-WALL Security Plane."""
    try:
        # Simple ping to policy list
        await call_suprawall_api("GET", "policies")
        return {"status": "HEALTHY", "message": "Security plane connected."}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "UNREACHABLE", "error": str(e)}

@mcp.tool()
async def suprawall_check(tool_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates a tool execution against live security policies.
    Returns ALLOW or BLOCK with a deterministic reason.
    """
    try:
        # Pydantic validation
        validated = ToolPayload(tool_name=tool_name, payload=payload)
        
        result = await call_suprawall_api("POST", "evaluate", {
            "toolName": validated.tool_name,
            "args": validated.payload,
            "platform": "cowork_mcp"
        })
        return result
    except Exception as e:
        logger.warning(f"Intercept error: {str(e)}. Defaulting to FAIL-SAFE BLOCK.")
        return {
            "decision": "BLOCK",
            "reason": f"Security Handshake Failed: {str(e)}. No unvalidated execution allowed."
        }

@mcp.tool()
async def suprawall_get_policies() -> List[Dict[str, Any]]:
    """Retrieves all active security guardrails and budget caps."""
    try:
        data = await call_suprawall_api("GET", "policies")
        return data.get("policies", [])
    except Exception as e:
        return [{"error": f"Failed to retrieve policies: {str(e)}"}]

@mcp.tool()
async def suprawall_add_policy(rule_text: str) -> str:
    """Adds a new deterministic security rule (e.g., 'block DELETE where table=prod')."""
    try:
        req = PolicyRequest(rule=rule_text)
        await call_suprawall_api("POST", "policies", {"rule": req.rule})
        return f"Policy successfully deployed: {rule_text}"
    except Exception as e:
        return f"Policy deployment failed: {str(e)}"

@mcp.tool()
async def suprawall_get_audit_log(limit: int = 10) -> List[Dict[str, Any]]:
    """Fetches the cryptographically-signed audit trail for compliance review."""
    try:
        data = await call_suprawall_api("GET", f"audit?limit={limit}")
        return data.get("logs", [])
    except Exception as e:
        return [{"error": f"Failed to fetch audit log: {str(e)}"}]

if __name__ == "__main__":
    mcp.run()
