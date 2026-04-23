import os
import logging
from suprawall.gate import SupraWallOptions, SupraWallMiddleware

from .hooks import make_pre_tool_hook, make_post_tool_hook
from .tools import VAULT_SCHEMA, handle_vault_get, CHECK_SCHEMA, handle_suprawall_check
from .commands import handle_suprawall_command

log = logging.getLogger("suprawall.hermes")

def register(ctx):
    api_key = os.environ.get("SUPRAWALL_API_KEY")
    if not api_key:
        log.error("[SupraWall] SUPRAWALL_API_KEY not set. Plugin disabled.")
        return

    options = SupraWallOptions(
        api_key=api_key,
        cloud_function_url=os.environ.get(
            "SUPRAWALL_URL", "https://www.supra-wall.com/api/v1/evaluate"
        ),
        on_network_error=os.environ.get("SUPRAWALL_FAIL_MODE", "fail-closed"),
        max_cost_usd=float(os.environ.get("SUPRAWALL_MAX_COST_USD", "0") or "0") or None,
        budget_alert_usd=float(os.environ.get("SUPRAWALL_ALERT_USD", "0") or "0") or None,
        max_iterations=int(os.environ.get("SUPRAWALL_MAX_ITERATIONS", "0") or "0") or None,
        loop_detection=os.environ.get("SUPRAWALL_LOOP_DETECTION", "true").lower() == "true",
        tenant_id=os.environ.get("SUPRAWALL_TENANT_ID", "default-tenant"),
    )
    middleware = SupraWallMiddleware(options)

    # 1. Register Hooks (Interception)
    ctx.register_hook("pre_tool_call", make_pre_tool_hook(options))
    ctx.register_hook("post_tool_call", make_post_tool_hook(options, middleware))

    # 2. Register Tools (Capabilities)
    ctx.register_tool("suprawall_vault_get", VAULT_SCHEMA, handle_vault_get(options))
    ctx.register_tool("suprawall_check", CHECK_SCHEMA, handle_suprawall_check(options))

    # 3. Register Commands (Interface)
    ctx.register_command("suprawall", handle_suprawall_command(middleware), "SupraWall policy status & budget")

    log.info(f"[SupraWall] Plugin loaded. Fail mode: {options.on_network_error}. "
             f"Budget: {'$' + str(options.max_cost_usd) if options.max_cost_usd else 'unlimited'}.")
