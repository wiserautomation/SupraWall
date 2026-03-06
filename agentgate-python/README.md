# agentgate

The security gateway for AI agents.
Enforce authentication, rate limiting, and policy controls
between users and AI agents — in one line of code.

## Install

```bash
pip install agentgate-sdk
```

With LangChain:
```bash
pip install "agentgate-sdk[langchain]"
```

With OpenAI Agents SDK:
```bash
pip install "agentgate-sdk[openai]"
```

Everything:
```bash
pip install "agentgate-sdk[all]"
```

## Quickstart

Get your free API key at https://agentgate.ai/

### Any agent (generic)
```python
from agentgate import with_agent_gate, AgentGateOptions

secured = with_agent_gate(my_agent, AgentGateOptions(
    api_key="ag_your_key_here"
))
result = secured.run("delete_file", {"path": "/etc/passwd"})
```

### LangChain
```python
from agentgate import AgentGateLangChainCallback, AgentGateOptions
from langchain.agents import AgentExecutor

callback = AgentGateLangChainCallback(
    AgentGateOptions(api_key="ag_your_key_here")
)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    callbacks=[callback],
)
```

### OpenAI Agents SDK
```python
from agentgate import wrap_openai_agent, AgentGateOptions
from agents import Agent, Runner

secured = wrap_openai_agent(agent, AgentGateOptions(
    api_key="ag_your_key_here"
))
result = await Runner.run(secured, "Send email to all users")
```

### MCP middleware
```python
from agentgate import AgentGateMiddleware, AgentGateOptions

gate = AgentGateMiddleware(AgentGateOptions(api_key="ag_your_key_here"))

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
AgentGateOptions(api_key="ag_xxx", on_network_error="fail-open")

# Production (recommended)
AgentGateOptions(api_key="ag_xxx", on_network_error="fail-closed")
```

## Policy decisions

| Decision | Behaviour |
| -------- | --------- |
| ALLOW    | Tool executes normally |
| DENY     | Tool blocked, error string returned |
| REQUIRE_APPROVAL | Tool paused, human approves in dashboard |

## Links

Dashboard: https://agentgate.ai/
GitHub: https://github.com/wiserautomation/agentgate
Issues: https://github.com/wiserautomation/agentgate/issues
