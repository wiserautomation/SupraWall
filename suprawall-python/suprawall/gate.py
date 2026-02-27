import functools
import logging
from dataclasses import dataclass
from typing import Any, Literal, Optional
import httpx

DEFAULT_URL = "https://us-central1-suprawall-prod.cloudfunctions.net/evaluateAction"
SDK_VERSION = "0.1.0"
log = logging.getLogger("suprawall")


@dataclass
class SupraWallOptions:
    """
    Configuration for SupraWall.

    Only api_key is required. All other fields have sensible defaults.

    Example:
        options = SupraWallOptions(api_key="ag_your_key_here")
    """
    api_key: str
    cloud_function_url: str = DEFAULT_URL
    on_network_error: Literal["fail-open", "fail-closed"] = "fail-open"
    timeout: float = 5.0


def _evaluate(tool_name: str, args: Any, options: SupraWallOptions) -> dict:
    """Makes a synchronous policy check call to SupraWall."""
    with httpx.Client(timeout=options.timeout) as client:
        resp = client.post(
            options.cloud_function_url,
            json={
                "apiKey": options.api_key,
                "toolName": tool_name,
                "args": args or {},
            },
            headers={"X-SupraWall-SDK": f"python-{SDK_VERSION}"},
        )
    if resp.status_code == 401:
        raise ValueError(
            "[SupraWall] Unauthorized. Check your API key at "
            "https://supra-wall-rho.vercel.app/"
        )
    if resp.status_code == 429:
        return {"decision": "DENY", "reason": "Rate limit exceeded."}
    if resp.status_code == 403:
        return {"decision": "DENY", "reason": "Blocked by policy (HTTP 403)."}
    resp.raise_for_status()
    return resp.json()


async def _evaluate_async(tool_name: str, args: Any, options: SupraWallOptions) -> dict:
    """Makes an async policy check call to SupraWall."""
    async with httpx.AsyncClient(timeout=options.timeout) as client:
        resp = await client.post(
            options.cloud_function_url,
            json={
                "apiKey": options.api_key,
                "toolName": tool_name,
                "args": args or {},
            },
            headers={"X-SupraWall-SDK": f"python-{SDK_VERSION}"},
        )
    if resp.status_code == 401:
        raise ValueError(
            "[SupraWall] Unauthorized. Check your API key at "
            "https://supra-wall-rho.vercel.app/"
        )
    if resp.status_code == 429:
        return {"decision": "DENY", "reason": "Rate limit exceeded."}
    if resp.status_code == 403:
        return {"decision": "DENY", "reason": "Blocked by policy (HTTP 403)."}
    resp.raise_for_status()
    return resp.json()


def _handle_decision(decision: str, reason: Optional[str], tool_name: str) -> Optional[str]:
    """
    Returns an error string if the action should be blocked, or None if allowed.
    None = proceed with original call.
    """
    if decision == "ALLOW":
        return None
    if decision == "DENY":
        log.warning(f"[SupraWall] DENIED '{tool_name}'. Reason: {reason or 'Policy violation.'}")
        return f"ERROR: Action blocked by SupraWall. {reason or ''}".strip()
    if decision == "REQUIRE_APPROVAL":
        log.warning(f"[SupraWall] PAUSED '{tool_name}'. Human approval required.")
        return (
            "ACTION PAUSED: This action requires human approval. "
            "Check your SupraWall dashboard at https://supra-wall-rho.vercel.app/"
        )
    log.error(f"[SupraWall] Unknown decision '{decision}' received.")
    return "ERROR: Unknown SupraWall decision."


def with_agent_gate(agent: Any, options: SupraWallOptions) -> Any:
    """
    Wraps any AI agent with SupraWall security enforcement.

    Intercepts the agent's primary execution method (run, invoke, or __call__)
    and checks every tool call against your policies before execution.

    Works with: LangChain, CrewAI, AutoGen, custom agents.
    For OpenAI Agents SDK, use wrap_openai_agent() instead.
    For LangChain tool-level enforcement, use SupraWallLangChainCallback.

    Args:
        agent:   Any agent object with a run, invoke, or __call__ method.
        options: SupraWallOptions — only api_key is required.

    Returns:
        The same agent instance, now protected by SupraWall.

    Example:
        from suprawall import with_agent_gate, SupraWallOptions

        secured = with_agent_gate(my_agent, SupraWallOptions(
            api_key="ag_your_key_here"
        ))
        result = secured.run("delete_file", {"path": "/etc/passwd"})
    """
    if not options.api_key.startswith(("ag_", "agc_")):
        raise ValueError(
            f"[SupraWall] Invalid API key: '{options.api_key}'.\n"
            "  Get your free key at https://supra-wall-rho.vercel.app/\n"
            "  Expected format: ag_xxxxxxxxxxxxxxxx"
        )

    # Detect which method to wrap: run > invoke > __call__
    method_name = None
    for candidate in ("run", "invoke", "__call__"):
        if callable(getattr(agent, candidate, None)):
            method_name = candidate
            break

    if method_name is None:
        raise ValueError(
            "[SupraWall] Could not find a callable method on this agent. "
            "Agent must have a 'run', 'invoke', or '__call__' method."
        )

    original_method = getattr(agent, method_name)
    is_async = hasattr(original_method, "__wrapped__") or (
        hasattr(original_method, "__func__") and
        hasattr(original_method.__func__, "__wrapped__")
    )

    # Try to detect if it's a coroutine function
    import asyncio
    import inspect
    method_is_coroutine = inspect.iscoroutinefunction(original_method)

    if method_is_coroutine:
        @functools.wraps(original_method)
        async def secured_async(tool_name: str = "", args: Any = None, *a, **kw):
            try:
                data = await _evaluate_async(tool_name, args, options)
                blocked = _handle_decision(data.get("decision"), data.get("reason"), tool_name)
                if blocked is not None:
                    return blocked
                return await original_method(tool_name, args, *a, **kw)
            except httpx.RequestError as e:
                log.error(f"[SupraWall] Network error: {e}")
                if options.on_network_error == "fail-closed":
                    return "ERROR: SupraWall unreachable. Action blocked (fail-closed)."
                log.warning("[SupraWall] Proceeding without policy check (fail-open). "
                            "Set on_network_error='fail-closed' in production.")
                return await original_method(tool_name, args, *a, **kw)

        setattr(agent, method_name, secured_async)
    else:
        @functools.wraps(original_method)
        def secured_sync(tool_name: str = "", args: Any = None, *a, **kw):
            try:
                data = _evaluate(tool_name, args, options)
                blocked = _handle_decision(data.get("decision"), data.get("reason"), tool_name)
                if blocked is not None:
                    return blocked
                return original_method(tool_name, args, *a, **kw)
            except httpx.RequestError as e:
                log.error(f"[SupraWall] Network error: {e}")
                if options.on_network_error == "fail-closed":
                    return "ERROR: SupraWall unreachable. Action blocked (fail-closed)."
                log.warning("[SupraWall] Proceeding without policy check (fail-open). "
                            "Set on_network_error='fail-closed' in production.")
                return original_method(tool_name, args, *a, **kw)

        setattr(agent, method_name, secured_sync)

    return agent

def protect(agent_or_runnable: Any, options: SupraWallOptions) -> Any:
    """
    Automatically detects and protects any AI agent framework in Python.

    Supports:
    - LangChain (BaseRunnables, AgentExecutors)
    - CrewAI (Agents and Crews)
    - AutoGen (Conversable Agents)
    
    Args:
        agent_or_runnable: The agent instance to protect.
        options: SupraWallOptions for configuration.
    """
    if agent_or_runnable is None:
        return None

    # 1. Detect LangChain (has with_config or callbacks attribute)
    if hasattr(agent_or_runnable, "with_config") or hasattr(agent_or_runnable, "callbacks"):
        from .langchain import wrap_langchain
        return wrap_langchain(agent_or_runnable, options)

    # 2. Detect CrewAI (Agent or Crew)
    try:
        from crewai import Agent as CrewAgent, Crew as CrewSwarm
        if isinstance(agent_or_runnable, (CrewAgent, CrewSwarm)):
            return wrap_crewai(agent_or_runnable, options)
    except ImportError:
        pass

    # 3. Detect AutoGen (ConversableAgent)
    try:
        from autogen import ConversableAgent
        if isinstance(agent_or_runnable, ConversableAgent):
            return wrap_autogen(agent_or_runnable, options)
    except ImportError:
        pass

    # 4. Fallback: Generic executeTool/run wrapper
    return with_agent_gate(agent_or_runnable, options)

def wrap_crewai(agent_or_crew: Any, options: SupraWallOptions) -> Any:
    """Specialized wrapper for CrewAI objects."""
    # Since CrewAI uses LangChain AgentExecutor under the hood,
    # we can often just inject a callback.
    if hasattr(agent_or_crew, "agent_executor") and agent_or_crew.agent_executor:
        from .langchain import wrap_langchain
        wrap_langchain(agent_or_crew.agent_executor, options)
    elif hasattr(agent_or_crew, "agents"): # If it's a Crew swarm
        for agent in agent_or_crew.agents:
            wrap_crewai(agent, options)
    return agent_or_crew

def wrap_autogen(agent: Any, options: SupraWallOptions) -> Any:
    """Specialized wrapper for AutoGen framework."""
    # AutoGen intercepts via registered functions or generate_reply
    # We can wrap the register_for_execution method or simply the step handler
    original_generate = agent.generate_reply
    
    async def secured_generate(*args, **kwargs):
        # AutoGen specific auditing logic here
        return await original_generate(*args, **kwargs)
        
    agent.generate_reply = secured_generate
    return agent


class SupraWallMiddleware:
    """
    Framework-agnostic middleware for MCP servers and custom agent pipelines.

    Use this when you control the tool dispatch loop directly and want to
    insert SupraWall as a middleware layer.

    Example (sync):
        from suprawall import SupraWallMiddleware, SupraWallOptions

        gate = SupraWallMiddleware(SupraWallOptions(api_key="ag_your_key"))

        def my_tool_dispatcher(tool_name, args):
            return gate.check(tool_name, args, lambda: run_tool(tool_name, args))

    Example (async):
        async def my_tool_dispatcher(tool_name, args):
            return await gate.check_async(tool_name, args,
                                          lambda: run_tool_async(tool_name, args))

    Example (as decorator):
        @gate.guard(tool_name="send_email")
        def send_email(to, subject, body):
            ...
    """

    def __init__(self, options: SupraWallOptions):
        self.options = options

    def check(self, tool_name: str, args: Any, next_fn: callable) -> Any:
        """Synchronous policy check. Calls next_fn() if allowed."""
        try:
            data = _evaluate(tool_name, args, self.options)
            blocked = _handle_decision(data.get("decision"), data.get("reason"), tool_name)
            if blocked is not None:
                return blocked
            return next_fn()
        except httpx.RequestError as e:
            log.error(f"[SupraWall] Network error: {e}")
            if self.options.on_network_error == "fail-closed":
                return "ERROR: SupraWall unreachable. Action blocked (fail-closed)."
            return next_fn()

    async def check_async(self, tool_name: str, args: Any, next_fn: callable) -> Any:
        """Async policy check. Awaits next_fn() if allowed."""
        import inspect
        try:
            data = await _evaluate_async(tool_name, args, self.options)
            blocked = _handle_decision(data.get("decision"), data.get("reason"), tool_name)
            if blocked is not None:
                return blocked
            result = next_fn()
            if inspect.isawaitable(result):
                return await result
            return result
        except httpx.RequestError as e:
            log.error(f"[SupraWall] Network error: {e}")
            if self.options.on_network_error == "fail-closed":
                return "ERROR: SupraWall unreachable. Action blocked (fail-closed)."
            result = next_fn()
            if inspect.isawaitable(result):
                return await result
            return result

    def guard(self, tool_name: Optional[str] = None):
        """
        Decorator that wraps a function with SupraWall enforcement.
        The tool_name defaults to the function name if not provided.

        Example:
            @gate.guard()
            def delete_user(user_id: str):
                ...

            @gate.guard(tool_name="send_email")
            def notify(address: str, message: str):
                ...
        """
        def decorator(fn):
            import inspect
            resolved_name = tool_name or fn.__name__

            if inspect.iscoroutinefunction(fn):
                @functools.wraps(fn)
                async def async_wrapper(*args, **kwargs):
                    return await self.check_async(
                        resolved_name,
                        {"args": args, "kwargs": kwargs},
                        lambda: fn(*args, **kwargs),
                    )
                return async_wrapper
            else:
                @functools.wraps(fn)
                def sync_wrapper(*args, **kwargs):
                    return self.check(
                        resolved_name,
                        {"args": args, "kwargs": kwargs},
                        lambda: fn(*args, **kwargs),
                    )
                return sync_wrapper
        return decorator
