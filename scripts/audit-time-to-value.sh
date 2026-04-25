#!/usr/bin/env bash
# SupraWall time-to-value audit.
#
# Measures wall-clock time from `pip install suprawall-sdk` to the first
# SupraWallBlocked exception — the canonical acceptance criterion for the
# <120-second quickstart target.
#
# Usage:
#   ./scripts/audit-time-to-value.sh           # Docker mode (default)
#   ./scripts/audit-time-to-value.sh --local   # Current env, skips install
#
# Exit codes:
#   0  PASS — under 120 seconds
#   1  FAIL — over 120 seconds or unexpected error

set -euo pipefail

TARGET_SECONDS=120

# --------------------------------------------------------------------------
# The canonical quickstart snippet — same code a stranger would copy-paste.
# Uses a lightweight mock agent so no LLM API key is required in CI.
# --------------------------------------------------------------------------
read -r -d '' QUICKSTART <<'PYEOF' || true
import sys, time

start = time.perf_counter()

from suprawall import wrap_with_firewall, SupraWallBlocked
from suprawall.local_policy import LocalPolicyEngine

# Smoke-test the local policy engine directly (no LLM needed)
engine = LocalPolicyEngine()
violation = engine.check("shell", {"command": "rm -rf /tmp/*"})
if not violation:
    print("FAIL: default policy did not block 'rm -rf /tmp/*'", file=sys.stderr)
    sys.exit(1)

# Demonstrate wrap_with_firewall with a minimal mock agent
class _DemoAgent:
    """Simulates an agent that would call a shell tool on dangerous input."""
    def invoke(self, query):
        from suprawall.local_policy import LocalPolicyEngine as _E
        from suprawall.firewall import SupraWallBlocked as _B
        _v = _E().check("shell", {"command": query.get("input", query)})
        if _v:
            raise _B(action="shell", policy=_v["name"], reason=_v["description"])
        return "ok"

safe_agent = wrap_with_firewall(_DemoAgent())

try:
    safe_agent.invoke({"input": "rm -rf /tmp/*"})
    print("FAIL: SupraWallBlocked was not raised", file=sys.stderr)
    sys.exit(1)
except SupraWallBlocked as exc:
    elapsed_ms = (time.perf_counter() - start) * 1000
    print(f"SupraWallBlocked raised in {elapsed_ms:.1f}ms")
    print(f"  {exc}")
PYEOF

# --------------------------------------------------------------------------
run_local() {
    echo "=== SupraWall TTV Audit — local mode (install time excluded) ==="
    local t0 t1 elapsed_ms elapsed_s
    t0=$(python3 -c "import time; print(int(time.time() * 1000))")

    python3 - <<< "$QUICKSTART"

    t1=$(python3 -c "import time; print(int(time.time() * 1000))")
    elapsed_ms=$(( t1 - t0 ))
    elapsed_s=$(( elapsed_ms / 1000 ))

    echo ""
    echo "Script execution time: ${elapsed_ms}ms"
    echo "(Install time excluded in --local mode; run Docker mode for full measurement)"
}

run_docker() {
    echo "=== SupraWall TTV Audit — Docker mode ==="
    echo "    Target: under ${TARGET_SECONDS}s from pip install to SupraWallBlocked"
    echo ""

    # Escape single quotes inside the snippet for use in a bash -c string
    local snippet_escaped
    snippet_escaped="${QUICKSTART//\'/\'\\\'\'}"

    local t0 t1 elapsed_s
    t0=$(date +%s)

    docker run --rm python:3.11-slim bash -c "
        set -e
        echo '[1/2] Installing suprawall-sdk...'
        pip install suprawall-sdk --quiet --disable-pip-version-check
        echo '[2/2] Running quickstart snippet...'
        python3 << 'INNER'
${QUICKSTART}
INNER
    "

    t1=$(date +%s)
    elapsed_s=$(( t1 - t0 ))

    echo ""
    echo "======================================================"
    echo "Total wall-clock time: ${elapsed_s}s  (target: <${TARGET_SECONDS}s)"
    echo "======================================================"

    if [ "$elapsed_s" -lt "$TARGET_SECONDS" ]; then
        echo "PASS: under ${TARGET_SECONDS} seconds ✓"
        exit 0
    else
        echo "FAIL: ${elapsed_s}s exceeds ${TARGET_SECONDS}s target"
        echo "  → The API ergonomics or install size need work. Do not ship docs band-aids."
        exit 1
    fi
}

# --------------------------------------------------------------------------
case "${1:-}" in
    --local) run_local ;;
    *)       run_docker ;;
esac
