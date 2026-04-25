# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""
wrap_with_firewall — the zero-config one-liner for SupraWall.

    from suprawall import wrap_with_firewall
    safe_agent = wrap_with_firewall(my_agent)
    safe_agent.invoke({"input": "Delete all files in /tmp"})
    # SupraWallBlocked: action 'terminal' blocked by policy 'no-destructive-shell'. ...
"""

import functools
import inspect
import logging
import threading
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from .local_policy import LocalPolicyEngine

log = logging.getLogger("suprawall")
SDK_VERSION = "1.1.0"

# Thread-local context that adapters and share_url() both read.
_fw_ctx = threading.local()


# ── Exception ───────────────────────────────────────────────────────────────


class SupraWallBlocked(Exception):
    """
    Raised when a tool call is blocked by SupraWall policy.

    Attributes:
        action:   The tool name that was blocked.
        policy:   The policy rule that triggered the block.
        reason:   Human-readable explanation.
        trace_id: Short random ID (e.g. "K-48291") for correlating logs.
        args:     Redacted tool arguments at the time of the block.

    Methods:
        share_url(public=True) → str
            Uploads a redacted trace to supra-wall.com and returns a public URL.
            Prompts for consent on first call.

        save_local(directory="suprawall-traces") → str
            Writes the trace as JSON to a local file. No network.
    """

    def __init__(
        self,
        action: str,
        policy: str,
        reason: str,
        trace_id: Optional[str] = None,
        args: Any = None,
    ):
        self.action = action
        self.policy = policy
        self.reason = reason
        self.trace_id = trace_id or uuid.uuid4().hex[:8]
        self._args = args or {}
        super().__init__(str(self))

    def __str__(self) -> str:
        return (
            f"SupraWallBlocked: action '{self.action}' blocked by policy '{self.policy}'. "
            f"{self.reason} (trace: {self.trace_id})"
        )

    # ── Trace helpers ──────────────────────────────────────────────────────

    def _build_trace(self) -> "Any":  # returns runtime.trace.Trace
        from .runtime.trace import Trace, PiiRedactor, compute_audit_hash

        redactor = PiiRedactor()
        redacted_args = redactor.redact_any(self._args)
        framework = getattr(_fw_ctx, "framework", "unknown")

        return Trace(
            id=self.trace_id,
            blocked_at=datetime.now(timezone.utc),
            framework=framework,
            attempted_action={"tool": self.action, "args": redacted_args},
            agent_reasoning=(
                "(agent reasoning not captured — "
                "use framework callbacks for full chain-of-thought trace)"
            ),
            matched_policy={"rule": self.policy, "reason": self.reason},
            environment="default",
            sdk_version=SDK_VERSION,
        )

    def save_local(self, directory: str = "suprawall-traces") -> str:
        """
        Writes the redacted trace JSON to ./{directory}/{trace_id}.json.

        No network call. Safe to call in any environment.
        Returns the absolute path of the saved file.

        Example:
            except SupraWallBlocked as e:
                path = e.save_local()
                print(f"Trace saved to {path}")
        """
        from .runtime.trace import save_trace_locally
        trace = self._build_trace()
        return save_trace_locally(trace, directory)

    def share_url(self, public: bool = True) -> str:
        """
        Uploads a redacted trace to supra-wall.com and returns the public URL.

        On first call, prints a clear disclosure and asks for confirmation.
        The user's answer is cached in ~/.suprawall/share-consent — they are
        not prompted again on subsequent calls.

        No PII leaves the machine: emails, phone numbers, SSNs, credit-card
        numbers, and API key prefixes are stripped by the PiiRedactor before
        the trace is serialised.

        Args:
            public: If True (default), the trace is viewable by anyone with
                    the URL. Pass False for a private link gated by a token.

        Returns:
            A public URL like "https://supra-wall.com/trace/K-48291".

        Raises:
            RuntimeError: If the user declines consent or the network is
                          unreachable.

        Example:
            except SupraWallBlocked as e:
                url = e.share_url()
                print(f"Share this: {url}")
        """
        from .runtime.trace import (
            TRACE_VIEW_BASE,
            has_consent,
            prompt_and_store_consent,
            upload_trace,
        )
        trace = self._build_trace()
        if not has_consent():
            prompt_and_store_consent(trace.id, public)
        result = upload_trace(trace, public)
        return result.get("url", f"{TRACE_VIEW_BASE}/{trace.id}")


# ── Framework detection ──────────────────────────────────────────────────────


def detect_framework(agent: Any) -> str:
    """
    Identifies the agent's framework via duck-typing and module inspection.

    Returns one of:
        'langgraph' | 'langchain' | 'autogen' | 'crewai' | 'openai' | 'anthropic' | 'generic'
    """
    cls_name = type(agent).__name__
    module = getattr(type(agent), "__module__", "") or ""

    # LangGraph must come before LangChain — it builds on top of it.
    if cls_name in ("CompiledStateGraph", "CompiledGraph", "CompiledVectorStoreRetriever"):
        return "langgraph"
    if "langgraph" in module:
        return "langgraph"

    # LangChain: AgentExecutor, any Runnable, Chain
    if cls_name in ("AgentExecutor", "LLMChain", "ReActSingleInputOutputParser"):
        return "langchain"
    if hasattr(agent, "callbacks") and hasattr(agent, "agent") and hasattr(agent, "tools"):
        return "langchain"  # AgentExecutor pattern
    if hasattr(agent, "with_config") and "langchain" in module:
        return "langchain"  # LCEL Runnable

    # AutoGen: ConversableAgent (has generate_reply + human_input_mode)
    if hasattr(agent, "generate_reply") and hasattr(agent, "human_input_mode"):
        return "autogen"

    # CrewAI: Crew or Agent objects
    if hasattr(agent, "kickoff") or (hasattr(agent, "tasks") and hasattr(agent, "agents")):
        return "crewai"
    if cls_name in ("Crew", "Agent") and "crewai" in module:
        return "crewai"

    # OpenAI Agents SDK: Agent with tools + instructions
    if hasattr(agent, "tools") and hasattr(agent, "instructions") and hasattr(agent, "name"):
        return "openai"

    # Anthropic direct wrapper
    if "anthropic" in module:
        return "anthropic"

    return "generic"


# ── Main entry point ─────────────────────────────────────────────────────────


def wrap_with_firewall(agent: Any, policy: Optional[str] = None, dry_run: bool = False) -> Any:
    """
    Wraps any AI agent with SupraWall security enforcement.

    Zero configuration required — ships with a default policy that blocks
    destructive shell commands, system-path writes, and credential exfiltration.
    Auto-detects the framework; no ``framework=`` argument needed.

    The returned object is API-identical to the original: same ``.invoke()``,
    ``.stream()``, ``.run()``, and ``.__call__()`` signatures. When no policy
    is violated, behaviour is unchanged. When a policy fires, ``SupraWallBlocked``
    is raised with a structured payload (action, policy, reason, trace_id).

    .. note::
       For certain frameworks (like CrewAI), this wrapper may monkeypatch
       internal tool methods to ensure enforcement. This is done safely and
       idempotently.

    Args:
        agent:   Any agent object. Supported: LangChain, LangGraph, AutoGen,
                 CrewAI, OpenAI Agents SDK, Anthropic, and custom agents.
        policy:  Optional path to a custom policy YAML file (requires pyyaml).
                 Defaults to the built-in safe policy bundle.
        dry_run: If True, violations are logged but not raised. Defaults to False.

    Returns:
        The agent, now protected. API-identical to the input.

    Raises:
        SupraWallBlocked: When a tool call violates the active policy (unless dry_run=True).

    Example:
        from suprawall import wrap_with_firewall

        safe_agent = wrap_with_firewall(my_langchain_agent)
        safe_agent.invoke({"input": "Delete all files in /tmp"})
        # SupraWallBlocked: action 'terminal' blocked by policy 'no-destructive-shell'. ...
    """
    engine = LocalPolicyEngine(policy)
    engine.dry_run = dry_run
    framework = detect_framework(agent)
    _fw_ctx.framework = framework  # stored for trace building in share_url()

    _adapters = {
        "langchain":  _adapt_langchain,
        "langgraph":  _adapt_langgraph,
        "autogen":    _adapt_autogen,
        "crewai":     _adapt_crewai,
        "openai":     _adapt_openai,
        "anthropic":  _adapt_anthropic,
    }

    adapter = _adapters.get(framework, _adapt_generic)
    log.debug("[SupraWall] Detected framework: %s. Applying adapter.", framework)
    return adapter(agent, engine)


# ── Adapter dispatchers ───────────────────────────────────────────────────────


def _adapt_langchain(agent: Any, engine: LocalPolicyEngine) -> Any:
    from .adapters.langchain import wrap_langchain
    return wrap_langchain(agent, engine)


def _adapt_langgraph(agent: Any, engine: LocalPolicyEngine) -> Any:
    from .adapters.langgraph import wrap_langgraph
    return wrap_langgraph(agent, engine)


def _adapt_autogen(agent: Any, engine: LocalPolicyEngine) -> Any:
    from .adapters.autogen import wrap_autogen
    return wrap_autogen(agent, engine)


def _adapt_crewai(agent: Any, engine: LocalPolicyEngine) -> Any:
    from .adapters.crewai import wrap_crewai
    return wrap_crewai(agent, engine)


def _adapt_openai(agent: Any, engine: LocalPolicyEngine) -> Any:
    from .adapters.openai import wrap_openai
    return wrap_openai(agent, engine)


def _adapt_anthropic(agent: Any, engine: LocalPolicyEngine) -> Any:
    from .adapters.anthropic import wrap_anthropic
    return wrap_anthropic(agent, engine)


def _adapt_generic(agent: Any, engine: LocalPolicyEngine) -> Any:
    """
    Fallback for custom agents. Wraps invoke/run/__call__ and checks call
    arguments against the active policy. Internal tool calls are not
    intercepted — for full enforcement, use a supported framework adapter.
    """
    for method_name in ("invoke", "run", "__call__"):
        original = getattr(agent, method_name, None)
        if not callable(original):
            continue

        if inspect.iscoroutinefunction(original):
            @functools.wraps(original)
            async def _async_guarded(*args, _orig=original, _eng=engine, _mn=method_name, **kwargs):
                _check_call_args(args, kwargs, _eng, _mn)
                return await _orig(*args, **kwargs)
            setattr(agent, method_name, _async_guarded)
        else:
            @functools.wraps(original)
            def _sync_guarded(*args, _orig=original, _eng=engine, _mn=method_name, **kwargs):
                _check_call_args(args, kwargs, _eng, _mn)
                return _orig(*args, **kwargs)
            setattr(agent, method_name, _sync_guarded)

        break  # wrap only the first available method

    return agent


def _check_call_args(args: tuple, kwargs: dict, engine: LocalPolicyEngine, method_name: str) -> None:
    """Checks invocation arguments for policy violations (generic-agent fallback)."""
    for arg in list(args) + list(kwargs.values()):
        violation = engine.check(f"generic.{method_name}", arg)
        if violation:
            _handle_violation(f"generic.{method_name}", violation, engine, {"input": arg})


def _handle_violation(action: str, violation: dict, engine: LocalPolicyEngine, args: Any) -> None:
    """Centralized violation handler: logs for dry-run, pings telemetry, raises SupraWallBlocked."""
    if getattr(engine, "dry_run", False):
        log.warning(
            "[SupraWall] [DRY-RUN] Blocked action '%s' by policy '%s': %s",
            action, violation["name"], violation["description"]
        )
        return

    _maybe_send_telemetry()
    raise SupraWallBlocked(
        action=action,
        policy=violation["name"],
        reason=violation["description"],
        args=args,
    )


def _maybe_send_telemetry() -> None:
    """Sends an anonymous block event if the user has consented."""
    from .runtime.trace import (
        TELEMETRY_ENDPOINT,
        has_telemetry_consent,
        prompt_and_store_telemetry_consent,
    )
    import os

    # Skip prompt in non-interactive environments (CI, etc.)
    if not os.isatty(0) and not has_telemetry_consent():
        return

    try:
        # Prompt on first run if in a TTY
        if not os.path.exists(os.path.expanduser("~/.suprawall/telemetry-consent")):
            prompt_and_store_telemetry_consent()

        if has_telemetry_consent():
            import httpx
            with httpx.Client(timeout=2.0) as client:
                client.post(TELEMETRY_ENDPOINT, json={"event": "block", "framework": getattr(_fw_ctx, "framework", "unknown")})
    except Exception:
        # Telemetry failures must never crash the user's agent
        pass
