"""
agentgate.cost — Token-to-USD cost estimation utility.

Provides per-model cost tables and helpers used by the budget cap and
cost-tracking features of AgentGate.
"""

from typing import Optional


# Cost in USD per 1,000 tokens (input / output).
# Prices as of Q1 2026 — update as models change.
MODEL_COSTS_PER_1K: dict[str, dict[str, float]] = {
    # OpenAI
    "gpt-4o":               {"input": 0.005,   "output": 0.015},
    "gpt-4o-mini":          {"input": 0.00015, "output": 0.0006},
    "gpt-4-turbo":          {"input": 0.01,    "output": 0.03},
    "gpt-3.5-turbo":        {"input": 0.0005,  "output": 0.0015},
    # Anthropic
    "claude-3-5-sonnet":    {"input": 0.003,   "output": 0.015},
    "claude-3-5-haiku":     {"input": 0.0008,  "output": 0.004},
    "claude-3-opus":        {"input": 0.015,   "output": 0.075},
    # Google
    "gemini-1.5-pro":       {"input": 0.00125, "output": 0.005},
    "gemini-1.5-flash":     {"input": 0.000075,"output": 0.0003},
    "gemini-2.0-flash":     {"input": 0.0001,  "output": 0.0004},
    # Meta / open-source (via hosted APIs)
    "llama-3.1-70b":        {"input": 0.00088, "output": 0.00088},
    "llama-3.1-8b":         {"input": 0.0002,  "output": 0.0002},
}

# Fallback rates for unknown models (conservative estimate)
_FALLBACK_RATES = {"input": 0.001, "output": 0.002}


def estimate_cost(
    model: str,
    input_tokens: int,
    output_tokens: int,
) -> float:
    """
    Estimate the USD cost of a single LLM call.

    Args:
        model:         Model identifier string (e.g. "gpt-4o-mini").
                       Partial matches are attempted (e.g. "gpt-4o" matches
                       "gpt-4o-2024-11-20").
        input_tokens:  Number of prompt/input tokens consumed.
        output_tokens: Number of completion/output tokens generated.

    Returns:
        Estimated cost in USD as a float.

    Example:
        >>> estimate_cost("gpt-4o-mini", 150, 90)
        0.0000765
    """
    rates = _resolve_rates(model)
    return (input_tokens / 1_000 * rates["input"]) + (output_tokens / 1_000 * rates["output"])


def format_cost(usd: float) -> str:
    """Return a human-readable cost string, e.g. '$0.0042'."""
    if usd < 0.0001:
        return f"${usd:.6f}"
    if usd < 0.01:
        return f"${usd:.4f}"
    return f"${usd:.2f}"


def _resolve_rates(model: str) -> dict[str, float]:
    """Resolve cost rates for a model, falling back to partial match."""
    model_lower = model.lower()
    # Exact match first
    if model_lower in MODEL_COSTS_PER_1K:
        return MODEL_COSTS_PER_1K[model_lower]
    # Partial prefix match (e.g. "gpt-4o-2024-11-20" → "gpt-4o")
    for key in MODEL_COSTS_PER_1K:
        if model_lower.startswith(key):
            return MODEL_COSTS_PER_1K[key]
    return _FALLBACK_RATES
