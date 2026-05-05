# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import argparse
import sys

from .adapter import run_adapter
from .config import AdapterConfig, WARP_DEFAULT_TIMEOUT_MS


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="suprawall-warp",
        description="SupraWall reference adapter for warp.agent_policy_hook.v1 (stdio transport)",
    )
    parser.add_argument(
        "--policy-file",
        metavar="PATH",
        default=None,
        help="Path to a SupraWall YAML policy file. Omit to use the built-in safe policy.",
    )
    parser.add_argument(
        "--log-level",
        metavar="LEVEL",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging verbosity (default: INFO). All logs go to stderr.",
    )
    parser.add_argument(
        "--timeout-ms",
        metavar="MS",
        type=int,
        default=WARP_DEFAULT_TIMEOUT_MS,
        help=f"Max milliseconds per policy evaluation (default: {WARP_DEFAULT_TIMEOUT_MS}).",
    )
    parser.add_argument(
        "--on-unavailable",
        metavar="BEHAVIOR",
        default="ask",
        choices=["allow", "deny", "ask"],
        help="Response when evaluation fails or times out (default: ask).",
    )

    args = parser.parse_args()

    try:
        cfg = AdapterConfig(
            policy_file=args.policy_file,
            timeout_ms=args.timeout_ms,
            log_level=args.log_level,
            unavailable_behavior=args.on_unavailable,
        )
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)

    cfg.configure_logging()
    run_adapter(cfg)


if __name__ == "__main__":
    main()
