# SupraWall LangChain

[![PyPI version](https://badge.fury.io/py/suprawall-langchain.svg)](https://badge.fury.io/py/suprawall-langchain)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SupraWall LangChain** is a native integration for LangChain that adds a zero-trust security layer to your AI agents. It intercepts every tool call and enforces granular policies (Allow, Deny, Require Approval) before execution.

## Installation

```bash
pip install suprawall-langchain
```

## Quick Start

### Using Callback Handler

The `SupraWallLangChainCallback` can be injected into any LangChain agent or runnable.

```python
from suprawall_langchain import SupraWallLangChainCallback
from suprawall import SupraWallOptions
from langchain.agents import AgentExecutor

# 1. Configure the security layer
options = SupraWallOptions(
    api_key="ag_your_agent_key_here",
    on_network_error="fail-closed"
)

# 2. Create the callback
sw_callback = SupraWallLangChainCallback(options)

# 3. Add to your agent
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    callbacks=[sw_callback]
)

# Every tool call is now checked against SupraWall policies
agent_executor.invoke({"input": "Perform a secure operation"})
```

### Using the Universal Decorator

For CrewAI or complex LangGraph setups, use the `@secure` decorator.

```python
from suprawall_langchain import secure

@secure(api_key="ag_...")
def my_secure_agent():
    # Returns any LangChain agent or Crew
    return Crew(...)

# All tools invoked by this agent are now protected
my_secure_agent().kickoff()
```

## Features

- **Runtime Interception**: Checks policies *before* tool execution.
- **Vault Integration**: Automatically injects secrets into tool arguments and scrubs them from outputs.
- **Fail-Safe Modes**: Configure `fail-open` or `fail-closed` behavior for network issues.
- **Async Support**: Native support for `ainvoke` and async tool execution.

## Documentation

For full documentation and policy management, visit [suprawall.ai](https://suprawall.ai).
