# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

from .gate import with_suprawall, SupraWallMiddleware, SupraWallOptions, protect as secure_agent, SupraWall
from .openai import wrap_openai_agent
from .smolagents import wrap_smolagents
from .identity import AgentIdentity, AgentCredentials, SCOPE_PRESETS
from .firewall import wrap_with_firewall, SupraWallBlocked, detect_framework
from .local_policy import LocalPolicyEngine
from .runtime.trace import Trace, PiiRedactor, generate_trace_id

__all__ = [
    # Zero-config one-liner (new in 1.1)
    "wrap_with_firewall",
    "SupraWallBlocked",
    "detect_framework",
    "LocalPolicyEngine",
    "Trace",
    "PiiRedactor",
    "generate_trace_id",
    # Cloud-policy SDK (api_key required)
    "with_suprawall",
    "SupraWallMiddleware",
    "SupraWallOptions",
    "secure_agent",
    "wrap_openai_agent",
    "wrap_smolagents",
    "AgentIdentity",
    "AgentCredentials",
    "SCOPE_PRESETS",
    "SupraWall",
]
__version__ = "1.1.0"
