# langchain-suprawall

Deterministic security and governance for LangChain agents. This package provides a callback handler that intercepts tool calls and evaluates them against SupraWall's policy engine.

## Installation

```bash
pip install langchain-suprawall
```

## Quick Start

```python
from langchain_suprawall import SupraWallCallbackHandler
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, load_tools

# 1. Initialize the SupraWall handler
suprawall = SupraWallCallbackHandler(
    api_key="sw_your_api_key",
    agent_id="my_production_agent"
)

# 2. Add to your LangChain agent
llm = ChatOpenAI(temperature=0)
tools = load_tools(["terminal"], llm=llm)
agent = initialize_agent(
    tools, 
    llm, 
    agent="zero-shot-react-description",
    callbacks=[suprawall]
)

# 3. Secure execution
agent.run("List the files in the current directory")
```

## How it works

The `SupraWallCallbackHandler` hooks into `on_tool_start`. Every time the agent attempts to use a tool, the handler:
1. Sends the tool name and arguments to SupraWall.
2. Receives a decision: `ALLOW`, `DENY`, or `REQUIRE_APPROVAL`.
3. If `DENY`, it raises an exception, preventing execution and audit logging the attempt.
4. If `ALLOW`, the tool executes normally.

## Features

- ✅ **Tool Interception**: Stop dangerous actions before they happen.
- ✅ **Human-in-the-Loop**: Pause execution for sensitive tasks.
- ✅ **Audit Logs**: Compliance-ready records of every agent action.

## License
MIT
