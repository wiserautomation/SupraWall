# suprawall

The security gateway for AI agents.
Enforce authentication, rate limiting, and policy controls
between users and AI agents — in one line of code.

## Install

```bash
pip install suprawall-sdk
```

With LangChain:
```bash
pip install "suprawall-sdk[langchain]"
```

With OpenAI Agents SDK:
```bash
pip install "suprawall-sdk[openai]"
```

Everything:
```bash
pip install "suprawall-sdk[all]"
```

## Quickstart

Get your free API key at https://suprawall.ai/

### Any agent (generic)
```python
from suprawall import with_suprawall, SupraWallOptions

secured = with_suprawall(my_agent, SupraWallOptions(
    api_key="ag_your_key_here"
))
result = secured.run("delete_file", {"path": "/etc/passwd"})
```

### LangChain
```python
from suprawall import SupraWallLangChainCallback, SupraWallOptions
from langchain.agents import AgentExecutor

callback = SupraWallLangChainCallback(
    SupraWallOptions(api_key="ag_your_key_here")
)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    callbacks=[callback],
)
```

### OpenAI Agents SDK
```python
from suprawall import wrap_openai_agent, SupraWallOptions
from agents import Agent, Runner

secured = wrap_openai_agent(agent, SupraWallOptions(
    api_key="ag_your_key_here"
))
result = await Runner.run(secured, "Send email to all users")
```

### MCP middleware
```python
from suprawall import SupraWallMiddleware, SupraWallOptions

gate = SupraWallMiddleware(SupraWallOptions(api_key="ag_your_key_here"))

# Inline check
result = gate.check("send_email", args, lambda: send_email(args))

# As a decorator
@gate.guard()
def delete_user(user_id: str):
    ...
```

## Fail-open vs Fail-closed
```python
# Development (default)
SupraWallOptions(api_key="ag_xxx", on_network_error="fail-open")

# Production (recommended)
SupraWallOptions(api_key="ag_xxx", on_network_error="fail-closed")
```

## Policy decisions

| Decision | Behaviour |
| -------- | --------- |
| ALLOW    | Tool executes normally |
| DENY     | Tool blocked, error string returned |
| REQUIRE_APPROVAL | Tool paused, human approves in dashboard |

## Links

Dashboard: https://suprawall.ai/
GitHub: https://github.com/wiserautomation/suprawall
Issues: https://github.com/wiserautomation/suprawall/issues
