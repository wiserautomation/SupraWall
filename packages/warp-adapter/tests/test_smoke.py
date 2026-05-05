import json
import subprocess
import sys
from pathlib import Path

FIXTURES_DIR = Path(__file__).parent / "fixtures"

def test_stdio_smoke():
    fixture_path = FIXTURES_DIR / "shell_exec_dangerous.json"
    input_data = fixture_path.read_text()
    payload = json.dumps(json.loads(input_data))
    
    cmd = [sys.executable, "-m", "suprawall_warp"]
    result = subprocess.run(
        cmd,
        input=payload.encode("utf-8") + b"\n",
        capture_output=True,
        timeout=5,
    )
    
    assert result.returncode == 0
    stdout = result.stdout.decode("utf-8").strip()
    
    # Assert JSON shape
    resp = json.loads(stdout)
    assert resp["schema_version"] == "warp.agent_policy_hook.v1"
    assert resp["decision"] == "deny"
    assert "reason" in resp
