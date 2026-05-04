# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from typing import Optional

WARP_DEFAULT_TIMEOUT_MS = 5_000
WARP_MIN_TIMEOUT_MS = 1
WARP_MAX_TIMEOUT_MS = 60_000


@dataclass
class AdapterConfig:
    policy_file: Optional[str] = None
    timeout_ms: int = WARP_DEFAULT_TIMEOUT_MS
    log_level: str = "INFO"
    unavailable_behavior: str = "ask"  # allow | deny | ask

    def __post_init__(self) -> None:
        if not (WARP_MIN_TIMEOUT_MS <= self.timeout_ms <= WARP_MAX_TIMEOUT_MS):
            raise ValueError(
                f"timeout_ms must be between {WARP_MIN_TIMEOUT_MS} and {WARP_MAX_TIMEOUT_MS}"
            )
        if self.unavailable_behavior not in ("allow", "deny", "ask"):
            raise ValueError("unavailable_behavior must be allow, deny, or ask")

    @property
    def timeout_s(self) -> float:
        return self.timeout_ms / 1000.0

    def configure_logging(self) -> None:
        level = getattr(logging, self.log_level.upper(), logging.INFO)
        logging.basicConfig(
            level=level,
            format="%(asctime)s suprawall-warp %(levelname)s %(message)s",
            handlers=[logging.StreamHandler()],  # stderr only — stdout is the protocol
        )
