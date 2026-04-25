# Copyright 2026 SupraWall Contributors
# SPDX-License-Identifier: Apache-2.0

import json
import re
from pathlib import Path
from typing import Any, Optional

# Default rules ship with the package — no API key, no network, no YAML dep required.
_DEFAULT_RULES = [
    {
        "name": "no-destructive-shell",
        "description": (
            "Shell commands with destructive patterns (rm -rf, dd, mkfs, etc.) "
            "are blocked by default."
        ),
        "tool_pattern": r"(?i)\b(shell|bash|terminal|run_command|execute_code|shell_exec|subprocess|powershell)\b",
        "args_pattern": (
            r"(?i)("
            r"rm\s+-[rfRFsS]{1,4}"           # rm -rf, rm -r, rm -f, rm -rRf ...
            r"|rmdir\s"                        # rmdir <path>
            r"|dd\s+if="                       # dd if=/dev/zero ...
            r"|mkfs"                           # mkfs.ext4 / mkfs.vfat
            r"|shred\s"                        # shred <file>
            r"|wipe\s"                         # wipe <device>
            r"|truncate\s+-s\s*0"              # truncate -s 0 <file>
            r"|\bdel\s+/[sfqp]"               # Windows del /s
            r"|\brd\s+/s"                     # Windows rd /s
            r"|format\s+[c-zC-Z]:"            # Windows format C:
            r"|>\s*/dev/(?!null\b)"           # redirect to /dev/sd*, /dev/hd*
            r")"
        ),
    },
    {
        "name": "no-write-outside-cwd",
        "description": (
            "File writes to system paths (/etc, /root, /sys, /proc, /boot) "
            "are blocked by default."
        ),
        "tool_pattern": r"(?i)\b(write_file|file_write|save_file|create_file|write_to_file|file_create)\b",
        "args_pattern": r"(^/etc/|^/root/|^/sys/|^/proc/|^/boot/|[\\\\]Windows[\\\\]System32)",
    },
    {
        "name": "no-secret-exfil",
        "description": (
            "Detected a credential pattern in tool arguments. "
            "Exfiltration of API keys, tokens, or secrets is blocked by default."
        ),
        "tool_pattern": None,  # checked against all tools
        "args_pattern": (
            r"(?i)("
            r"sk-[a-zA-Z0-9]{32,}"            # OpenAI key
            r"|AKIA[A-Z0-9]{16}"              # AWS access key
            r"|gh[po]_[a-zA-Z0-9]{36,}"       # GitHub token
            r"|xoxb-[a-zA-Z0-9\-]+"           # Slack bot token
            r"|eyJhbGci[a-zA-Z0-9\._\-]{20,}" # JWT
            r")"
        ),
    },
]


class LocalPolicyEngine:
    """
    Evaluates tool calls against a local rule set — zero network, zero API key.

    By default loads the built-in policy bundle. Pass a path to a YAML file
    (requires pyyaml) to use a custom policy.
    """

    def __init__(self, policy_path: Optional[str] = None):
        if policy_path:
            self._rules = self._load_yaml(policy_path)
        else:
            self._rules = _DEFAULT_RULES

    def check(self, tool_name: str, args: Any) -> Optional[dict]:
        """
        Evaluate a single tool call.

        Returns the first matching rule dict if the call is blocked, or None if allowed.
        """
        args_str = _serialize(args)

        for rule in self._rules:
            tool_pat = rule.get("tool_pattern")
            if tool_pat and not re.search(tool_pat, tool_name):
                continue  # rule does not apply to this tool

            args_pat = rule.get("args_pattern")
            if args_pat and re.search(args_pat, args_str):
                return rule

        return None

    def _load_yaml(self, path: str) -> list:
        try:
            import yaml  # type: ignore[import]
        except ImportError as exc:
            raise ImportError(
                "Install pyyaml to use custom policy files: pip install pyyaml"
            ) from exc
        with open(path) as fh:
            data = yaml.safe_load(fh)
        return data.get("rules", _DEFAULT_RULES)


def _serialize(args: Any) -> str:
    if isinstance(args, str):
        return args
    try:
        return json.dumps(args, default=str)
    except Exception:
        return str(args)
