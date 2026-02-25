# AgentGate

<div align="center">

**The Stripe of AI Agent Security**

*Enterprise security for AI agents in one line of code*

[![npm](https://img.shields.io/npm/v/agentgate)](https://www.npmjs.com/package/agentgate)
[![PyPI](https://img.shields.io/pypi/v/agentgate)](https://pypi.org/project/agentgate/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Quick Start](#quick-start) • [Documentation](https://agent-gate-rho.vercel.app/docs) • [Examples](#examples) • [Spec](https://agent-gate-rho.vercel.app/spec)

</div>

## 🚀 New in v1.0: The Stripe Moment

- ✅ **8 Languages**: Python, TypeScript, Go, Ruby, PHP, Java, Rust, C#
- ✅ **5 Databases**: Postgres, MySQL, MongoDB, Supabase, Firebase
- ✅ **Self-Host**: `docker run agentgate/server`
- ✅ **CLI Tool**: `npm install -g @agentgate/cli`
- ✅ **Framework Plugins**: LangChain, LlamaIndex, AutoGen, Vercel AI, CrewAI
- ✅ **Webhooks**: Real-time event streaming to your systems
- ✅ **UI Components**: Drop-in React, Vue, Svelte components

> **AgentGate now works anywhere, with anything, in any language — just like Stripe.**


---

## ✨ Features

- 🔐 **One-line integration** — Add security to any AI agent instantly
- 🗄️ **Database agnostic** — Works with Postgres, MySQL, MongoDB, Supabase, Firebase
- 🐳 **Self-hostable** — Run on your own infrastructure with Docker
- 🌍 **8 programming languages** — Python, TypeScript, Go, Ruby, PHP, Java, Rust, C#
- 🔌 **Native framework integrations** — LangChain, LlamaIndex, AutoGen, Vercel AI, CrewAI
- 🪝 **Webhooks** — Real-time event streaming to your systems
- 🎨 **Drop-in UI components** — React, Vue, Svelte
- 🛠️ **CLI tool** — Manage everything from your terminal
- 📊 **Real-time audit logs** — See every tool execution in real-time
- 🧪 **Test mode** — Develop locally without cloud dependencies

---

## 🚀 Quick Start

### Install

\`\`\`bash
# Node.js/TypeScript
npm install agentgate

# Python
pip install agentgate

# Go
go get github.com/agentgate/agentgate-go

# Ruby
gem install agentgate
\`\`\`

### Secure Your Agent (One Line)

**Python + LangChain:**
\`\`\`python
from langchain.agents import create_react_agent
from agentgate import secure_agent

agent = create_react_agent(llm, tools, prompt)
secured_agent = secure_agent(agent, api_key="ag_your_key")

# That's it! Now all tool calls are policy-checked
\`\`\`

**TypeScript + Vercel AI:**
\`\`\`typescript
import { withAgentGate } from "agentgate";

const agent = createMyAgent();
const securedAgent = withAgentGate(agent, {
  apiKey: "ag_your_key"
});
\`\`\`

---

## 🗄️ Run Anywhere

### Cloud (Managed)
\`\`\`bash
# Use our hosted service
export AGENTGATE_API_KEY=ag_your_key
\`\`\`

### Self-Hosted (Docker)
\`\`\`bash
docker run -p 3000:3000 \\
  -e DATABASE_URL=postgres://... \\
  agentgate/server:latest
\`\`\`

### Local Development
\`\`\`bash
# Works offline with SQLite
agentgate dev
\`\`\`

---

## 🔌 Integrations

### Official Framework Plugins

- **LangChain** — \`pip install langchain-agentgate\`
- **LlamaIndex** — \`pip install llama-index-agentgate\`
- **AutoGen** — \`pip install autogen-agentgate\`
- **Vercel AI SDK** — \`npm install @agentgate/vercel-ai\`
- **CrewAI** — \`pip install crewai-agentgate\`

### Databases

- PostgreSQL
- MySQL
- MongoDB
- Supabase
- Firebase Firestore
- SQLite (local dev)

### UI Frameworks

\`\`\`bash
npm install @agentgate/react
npm install @agentgate/vue
npm install @agentgate/svelte
\`\`\`

---

## 📚 Examples

### Block Dangerous Commands
\`\`\`python
policy = {
  "toolName": "bash",
  "condition": "rm -rf",  # Regex pattern
  "ruleType": "DENY"
}
\`\`\`

### Require Human Approval for Emails
\`\`\`python
policy = {
  "toolName": "send_email",
  "ruleType": "REQUIRE_APPROVAL"
}
\`\`\`

### Allow Only Read Operations
\`\`\`python
policy = {
  "toolName": "file_*",
  "condition": "^read_",
  "ruleType": "ALLOW"
}
\`\`\`

---

## 🛠️ CLI Tool

\`\`\`bash
# Install
npm install -g @agentgate/cli

# Create agent
agentgate agents create --name "My Agent"

# Add policy
agentgate policies create \\
  --agent agent_123 \\
  --tool bash \\
  --action DENY

# Stream logs in real-time
agentgate logs --follow
\`\`\`

---

## 📖 Documentation

- [Full Documentation](https://agent-gate-rho.vercel.app/docs)
- [API Reference](https://agent-gate-rho.vercel.app/docs/api)
- [Framework Guides](https://agent-gate-rho.vercel.app/docs/frameworks/langchain)
- [AGPS Specification](https://agent-gate-rho.vercel.app/spec)

---

## 🏗️ Architecture

\`\`\`text
┌─────────────────┐
│   Your Agent    │
└────────┬────────┘
         │ withAgentGate()
         ▼
┌─────────────────┐
│  AgentGate SDK  │ ◄── Intercepts tool calls
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Policy Engine   │ ◄── Checks against rules
└────────┬────────┘
         │
         ├─► ALLOW  ──► Execute tool
         ├─► DENY   ──► Block tool
         └─► APPROVE ──► Wait for human
\`\`\`

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © [AgentGate](https://agent-gate-rho.vercel.app)

---

## 🌟 Star Us!

If AgentGate helps secure your AI agents, give us a ⭐ on GitHub!
