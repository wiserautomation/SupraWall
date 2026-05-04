# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

"""
Main stdio loop.

Framing: newline-delimited JSON (per Warp spec, engine.rs).
  - Reads one JSON object per line from stdin.
  - Writes one JSON response per line to stdout.
  - All logging goes to stderr only.
"""

from __future__ import annotations

import json
import logging
import sys
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from typing import Optional

from pydantic import ValidationError
from suprawall.local_policy import LocalPolicyEngine

from . import audit_emitter, policy_bridge, response_builder as rb
from .config import AdapterConfig
from .event_schema import WarpEvent

log = logging.getLogger("suprawall.adapter")

MAX_EVENT_BYTES = 128 * 1024  # Warp enforces same limit before dispatch


def run_adapter(cfg: AdapterConfig) -> None:
    engine = LocalPolicyEngine(cfg.policy_file)
    log.info("suprawall-warp-adapter started (policy=%s)", cfg.policy_file or "<builtin>")

    with ThreadPoolExecutor(max_workers=1) as pool:
        for raw_line in sys.stdin:
            raw_line = raw_line.rstrip("\n")
            if not raw_line:
                continue

            if len(raw_line.encode()) > MAX_EVENT_BYTES:
                log.warning("event exceeds 128 KB limit — sending deny")
                _write_response(rb.deny(reason="event_payload_too_large"))
                continue

            event = _parse_event(raw_line)
            if event is None:
                _write_response(rb.deny(reason="malformed_event"))
                continue

            log.debug("received event_id=%s action_kind=%s", event.event_id, event.action_kind)

            response = _evaluate_with_timeout(event, engine, pool, cfg)
            audit_emitter.emit(event, response)
            _write_response(response)

    log.info("stdin closed — adapter exiting")


def _evaluate_with_timeout(
    event: WarpEvent,
    engine: LocalPolicyEngine,
    pool: ThreadPoolExecutor,
    cfg: AdapterConfig,
) -> dict:
    future = pool.submit(policy_bridge.evaluate, event, engine)
    try:
        return future.result(timeout=cfg.timeout_s)
    except FuturesTimeoutError:
        log.warning("policy evaluation timed out after %sms", cfg.timeout_ms)
        return rb.timeout_fallback(cfg.unavailable_behavior)
    except Exception as exc:
        log.error("policy evaluation error: %s", exc)
        return rb.timeout_fallback(cfg.unavailable_behavior)


def _parse_event(raw: str) -> Optional[WarpEvent]:
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        log.warning("JSON decode error: %s", exc)
        return None
    try:
        return WarpEvent.model_validate(data)
    except ValidationError as exc:
        log.warning("event schema validation error: %s", exc)
        return None


def _write_response(resp: dict) -> None:
    line = json.dumps(resp, separators=(",", ":"))
    sys.stdout.write(line + "\n")
    sys.stdout.flush()
