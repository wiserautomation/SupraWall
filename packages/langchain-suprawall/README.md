# langchain-suprawall

`langchain-suprawall` is the official integration package for using the [SupraWall](https://www.supra-wall.com) deterministic security layer with LangChain.

## Installation

```bash
pip install langchain-suprawall
```

## Quickstart

SupraWall intercepts and evaluates tools before they execute, offering zero-trust security for autonomous agents.

```python
from langchain_core.tools import tool
from langchain_suprawall import SupraWallToolWrapper

@tool
def my_sensitive_tool(data: str):
    """A tool that does something sensitive."""
    return f"Processed: {data}"

# Wrap your tool with deterministic security
secured_tool = SupraWallToolWrapper(
    tool=my_sensitive_tool,
    api_key="sw_your_api_key_here"
)

# Use secured_tool in your LangChain agents!
```

## Tool Safety Annotations
All tools exported by `langchain_suprawall` automatically inherit LangChain's standard safety properties and support MCP's `readOnlyHint` and `destructiveHint`.
