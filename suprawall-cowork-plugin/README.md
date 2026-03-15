# SupraWall Security for Cowork

SupraWall is the deterministic control plane for AI agents. It ensures that your agents stay within their intended boundaries, preventing loops, budget overruns, and destructive actions through zero-trust interception.

## 🚀 Why SupraWall?
Standard LLMs can suffer from "hallucinated intent" where they execute harmful commands. SupraWall intercepts these calls at the middleware level, enforcing hard-coded policies that the LLM cannot override.

## 🛠 Installation
1. Download this directory as a ZIP or clone from [GitHub](https://github.com/supra-wall/cowork-plugin).
2. In Cowork, go to **Settings > Plugins > Upload Plugin**.
3. Add your `SUPRAWALL_API_KEY` in the configuration panel.

## 🔒 Core Use Cases
- **Destructive Action Blocking**: Automatically block `DROP TABLE`, `rm -rf`, or unauthorized `DELETE` requests.
- **Budget Guardrails**: Set a max USD spend per agent session.
- **Loop Detection**: Kill agents that get stuck in an infinite tool-calling recursion.
- **Forensic Auditing**: Every single tool call is cryptographically signed and logged.

## 📺 Demo in Action
![SupraWall Blocking Demo](https://github.com/supra-wall/cowork-plugin/raw/main/assets/demo.gif)
*In this example, an agent attempts to execute a `DELETE FROM production` command. SupraWall intercepts the call, returns a BLOCK, and the agent safely pivots to a Read-Only query.*

## 📄 Compliance & Safety
- **Public Repository**: [github.com/supra-wall/cowork-plugin](https://github.com/supra-wall/cowork-plugin)
- **Privacy Policy**: [suprawall.ai/privacy](https://www.suprawall.ai/privacy)
- **Security Policy**: [suprawall.ai/security](https://www.suprawall.ai/security)

## 🛡️ Fail-Safe Protocol
This plugin follows a **fail-safe** (closed) protocol. If the SupraWall API is unreachable, the intercepted tool call is automatically BLOCKED to ensure unvalidated execution never occurs.

---
Get your free API key and read full docs at [suprawall.ai](https://www.suprawall.ai).
