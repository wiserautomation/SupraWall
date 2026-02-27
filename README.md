# SupraWall

<div align="center">

**The Stripe of AI Agent Security**

*Enterprise security for AI agents in one line of code*

[![npm](https://img.shields.io/npm/v/suprawall)](https://www.npmjs.com/package/suprawall)
[![PyPI](https://img.shields.io/pypi/v/suprawall)](https://pypi.org/project/suprawall/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Quick Start](#quick-start) • [Documentation](https://supra-wall-rho.vercel.app/docs) • [Examples](#examples) • [Spec](https://supra-wall-rho.vercel.app/spec)

</div>

## 🚀 New in v1.0: The Stripe Moment

- ✅ **8 Languages**: Python, TypeScript, Go, Ruby, PHP, Java, Rust, C#
- ✅ **5 Databases**: Postgres, MySQL, MongoDB, Supabase, Firebase
- ✅ **Self-Host**: `docker run suprawall/server`
- ✅ **CLI Tool**: `npm install -g @suprawall/cli`
- ✅ **Framework Plugins**: LangChain, LlamaIndex, AutoGen, Vercel AI, CrewAI
- ✅ **Webhooks**: Real-time event streaming to your systems
- ✅ **UI Components**: Drop-in React, Vue, Svelte components

> **SupraWall now works anywhere, with anything, in any language — just like Stripe.**


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
npm install suprawall

# Python
pip install suprawall

# Go
go get github.com/suprawall/suprawall-go

# Ruby
gem install suprawall
\`\`\`

### Secure Your Agent (One Line)

**Python + LangChain:**
\`\`\`python
from langchain.agents import create_react_agent
from suprawall import secure_agent

agent = create_react_agent(llm, tools, prompt)
secured_agent = secure_agent(agent, api_key="ag_your_key")

# That's it! Now all tool calls are policy-checked
\`\`\`

**TypeScript + Vercel AI:**
\`\`\`typescript
import { withSupraWall } from "suprawall";

const agent = createMyAgent();
const securedAgent = withSupraWall(agent, {
  apiKey: "ag_your_key"
});
\`\`\`

---

## 🗄️ Run Anywhere

### Cloud (Managed)
\`\`\`bash
# Use our hosted service
export SUPRAWALL_API_KEY=ag_your_key
\`\`\`

### Self-Hosted (Docker)
\`\`\`bash
docker run -p 3000:3000 \\
  -e DATABASE_URL=postgres://... \\
  suprawall/server:latest
\`\`\`

### Local Development
\`\`\`bash
# Works offline with SQLite
suprawall dev
\`\`\`

---

## 🔌 Integrations

### Official Framework Plugins

- **LangChain** — \`pip install langchain-suprawall\`
- **LlamaIndex** — \`pip install llama-index-suprawall\`
- **AutoGen** — \`pip install autogen-suprawall\`
- **Vercel AI SDK** — \`npm install @suprawall/vercel-ai\`
- **CrewAI** — \`pip install crewai-suprawall\`

### Databases

- PostgreSQL
- MySQL
- MongoDB
- Supabase
- Firebase Firestore
- SQLite (local dev)

### UI Frameworks

\`\`\`bash
npm install @suprawall/react
npm install @suprawall/vue
npm install @suprawall/svelte
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
npm install -g @suprawall/cli

# Create agent
suprawall agents create --name "My Agent"

# Add policy
suprawall policies create \\
  --agent agent_123 \\
  --tool bash \\
  --action DENY

# Stream logs in real-time
suprawall logs --follow
\`\`\`

---

## 📖 Documentation

- [Full Documentation](https://supra-wall-rho.vercel.app/docs)
- [API Reference](https://supra-wall-rho.vercel.app/docs/api)
- [Framework Guides](https://supra-wall-rho.vercel.app/docs/frameworks/langchain)
- [AGPS Specification](https://supra-wall-rho.vercel.app/spec)

---

## 🏗️ Architecture

\`\`\`text
┌─────────────────┐
│   Your Agent    │
└────────┬────────┘
         │ withSupraWall()
         ▼
┌─────────────────┐
│  SupraWall SDK  │ ◄── Intercepts tool calls
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

MIT © [SupraWall](https://supra-wall-rho.vercel.app)

---

## 🌟 Star Us!

If SupraWall helps secure your AI agents, give us a ⭐ on GitHub!
