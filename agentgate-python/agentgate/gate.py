import functools
import logging
from dataclasses import dataclass
from typing import Any, Literal, Optional
import httpx

DEFAULT_URL = "https://us-central1-agentgate-prod.cloudfunctions.net/evaluateAction"
SDK_VERSION = "0.1.0"
log = logging.getLogger("agentgate")


@dataclass
class AgentGateOptions:
    """
    Configuration for AgentGate.

    Only api_key is required. All other fields have sensible defaults.

    Example:
        options = AgentGateOptions(api_key="ag_your_key_here")
    """
    api_key: str
    cloud_function_url: str = DEFAULT_URL
    on_network_error: Literal["fail-open", "fail-closed"] = "fail-open"
    timeout: float = 5.0


def _evaluate(tool_name: str, args: Any, options: AgentGateOptions) -> dict:
    """Makes a synchronous policy check call to AgentGate."""
    with httpx.Client(timeout=options.timeout) as client:
        resp = client.post(
            options.cloud_function_url,
            json={
                "apiKey": options.api_key,
                "toolName": tool_name,
                "args": args or {},
            },
            headers={"X-AgentGate-SDK": f"python-{SDK_VERSION}"},
        )
    if resp.status_code == 401:
        raise ValueError(
            "[AgentGate] Unauthorized. Check your API key at "
            "https://agent-gate-rho.vercel.app/"
        )
    if resp.status_code == 429:
        return {"decision": "DENY", "reason": "Rate limit exceeded."}
    if resp.status_code == 403:
        return {"decision": "DENY", "reason": "Blocked by policy (HTTP 403)."}
    resp.raise_for_status()
    return resp.json()


async def _evaluate_async(tool_name: str, args: Any, options: AgentGateOptions) -> dict:
    """Makes an async policy check call to AgentGate."""
    async with httpx.AsyncClient(timeout=options.timeout) as client:
        resp = await client.post(
            options.cloud_function_url,
            json={
                "apiKey": options.api_key,
                "toolName": tool_name,
                "args": args or {},
            },
            headers={"X-AgentGate-SDK": f"python-{SDK_VERSION}"},
        )
    if resp.status_code == 401:
        raise ValueError(
            "[AgentGate] Unauthorized. Check your API key at "
            "https://agent-gate-rho.vercel.app/"
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
        log.warning(f"[AgentGate] DENIED '{tool_name}'. Reason: {reason or 'Policy violation.'}")
        return f"ERROR: Action blocked by AgentGate. {reason or ''}".strip()
    if decision == "REQUIRE_APPROVAL":
        log.warning(f"[AgentGate] PAUSED '{tool_name}'. Human approval required.")
        return (
            "ACTION PAUSED: This action requires human approval. "
            "Check your AgentGate dashboard at https://agent-gate-rho.vercel.app/"
        )
    log.error(f"[AgentGate] Unknown decision '{decision}' received.")
    return "ERROR: Unknown AgentGate decision."


def with_agent_gate(agent: Any, options: AgentGateOptions) -> Any:
    """
    Wraps any AI agent with AgentGate security enforcement.

    Intercepts the agent's primary execution method (run, invoke, or __call__)
    and checks every tool call against your policies before execution.

    Works with: LangChain, CrewAI, AutoGen, custom agents.
    For OpenAI Agents SDK, use wrap_openai_agent() instead.
    For LangChain tool-level enforcement, use AgentGateLangChainCallback.

    Args:
        agent:   Any agent object with a run, invoke, or __call__ method.
        options: AgentGateOptions — only api_key is required.

    Returns:
        The same agent instance, now protected by AgentGate.

    Example:
        from agentgate import with_agent_gate, AgentGateOptions

        secured = with_agent_gate(my_agent, AgentGateOptions(
            api_key="ag_your_key_here"
        ))
        result = secured.run("delete_file", {"path": "/etc/passwd"})
    """
    if not options.api_key.startswith(("ag_", "agc_")):
        raise ValueError(
            f"[AgentGate] Invalid API key: '{options.api_key}'.\n"
            "  Get your free key at https://agent-gate-rho.vercel.app/\n"
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
            "[AgentGate] Could not find a callable method on this agent. "
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
                log.error(f"[AgentGate] Network error: {e}")
                if options.on_network_error == "fail-closed":
                    return "ERROR: AgentGate unreachable. Action blocked (fail-closed)."
                log.warning("[AgentGate] Proceeding without policy check (fail-open). "
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
                log.error(f"[AgentGate] Network error: {e}")
                if options.on_network_error == "fail-closed":
                    return "ERROR: AgentGate unreachable. Action blocked (fail-closed)."
                log.warning("[AgentGate] Proceeding without policy check (fail-open). "
                            "Set on_network_error='fail-closed' in production.")
                return original_method(tool_name, args, *a, **kw)

        setattr(agent, method_name, secured_sync)

    return agent


class AgentGateMiddleware:
    """
    Framework-agnostic middleware for MCP servers and custom agent pipelines.

    Use this when you control the tool dispatch loop directly and want to
    insert AgentGate as a middleware layer.

    Example (sync):
        from agentgate import AgentGateMiddleware, AgentGateOptions

        gate = AgentGateMiddleware(AgentGateOptions(api_key="ag_your_key"))

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

    def __init__(self, options: AgentGateOptions):
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
            log.error(f"[AgentGate] Network error: {e}")
            if self.options.on_network_error == "fail-closed":
                return "ERROR: AgentGate unreachable. Action blocked (fail-closed)."
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
            log.error(f"[AgentGate] Network error: {e}")
            if self.options.on_network_error == "fail-closed":
                return "ERROR: AgentGate unreachable. Action blocked (fail-closed)."
            result = next_fn()
            if inspect.isawaitable(result):
                return await result
            return result

    def guard(self, tool_name: Optional[str] = None):
        """
        Decorator that wraps a function with AgentGate enforcement.
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
