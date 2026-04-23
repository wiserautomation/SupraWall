import logging
from .hooks import get_audit_log

log = logging.getLogger("suprawall.hermes")

def handle_suprawall_command(middleware):
    def _handler(args: str = "", **kwargs):
        subcommand = args.strip().split()[0] if args.strip() else "status"

        if subcommand == "status":
            return (
                f"🛡️ SupraWall Security Status\n"
                f"  Shield:  ACTIVE\n"
                f"  Budget:  {middleware.budget.summary}\n"
                f"  Fail:    {middleware.options.on_network_error}\n"
                f"  Loops:   {'ON' if middleware.options.loop_detection else 'OFF'}\n"
                f"  Audited: {len(get_audit_log())} tool calls"
            )

        if subcommand == "audit":
            entries = get_audit_log()[-10:]  # Last 10
            if not entries:
                return "No tool calls audited yet."
            lines = [f"  [{i+1}] {e['tool']} — {e['budget']}" for i, e in enumerate(entries)]
            return "🛡️ Recent Audit Trail:\n" + "\n".join(lines)

        if subcommand == "budget":
            return f"🛡️ {middleware.budget.summary}"

        return (
            "Usage: /suprawall <subcommand>\n"
            "  status  — Show current shield status\n"
            "  audit   — Show last 10 tool calls\n"
            "  budget  — Show budget usage"
        )
    return _handler
