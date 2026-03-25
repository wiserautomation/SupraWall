# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

from .gate import with_suprawall, SupraWallMiddleware, SupraWallOptions, protect as secure_agent, SupraWall
from .openai import wrap_openai_agent
from .identity import AgentIdentity, AgentCredentials, SCOPE_PRESETS

__all__ = [
    "with_suprawall",
    "SupraWallMiddleware",
    "SupraWallOptions",
    "secure_agent",
    "wrap_openai_agent",
    "AgentIdentity",
    "AgentCredentials",
    "SCOPE_PRESETS",
    "SupraWall",
]
__version__ = "1.0.0"
