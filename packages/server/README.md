# suprawall Self-Hosted Server

The open-source, on-premise engine for AI Agent Security.

## Features

- **PostgreSQL backed:** No dependency on Firebase/Cloud.
- **Air-Gapped Ready:** Can be deployed in isolated VPCs or zero-trust environments.
- **Docker & Compose:** Instant single-machine setup.
- **Helm Charts:** Ready for Kubernetes / Enterprise deployments.
- **O(1) Evaluation:** Ultra-fast, minimal footprint Node.js server.

## Getting Started (Docker Compose)

For local development or single-node deployments, run:

\`\`\`bash
docker-compose up -d
\`\`\`

The server will be available at \`http://localhost:3000\`.
PostgreSQL will be exposed on \`localhost:5432\`.

## Production (Docker Run)

If you have an existing Postgres DB:

\`\`\`bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://user:password@host:5432/dbname \
  suprawall/server:latest
\`\`\`

## Enterprise (Kubernetes / Helm)

Navigate to the \`charts/suprawall\` directory.

\`\`\`bash
helm install suprawall ./charts/suprawall -n suprawall-system --create-namespace
\`\`\`

## API Endpoints

- `GET /health` - Liveness probe
- `POST /v1/evaluate` - Evaluates policy (Layer 1 + optional Layer 2)

Example Evaluate payload:
```json
{
  "agentId": "agent_test",
  "toolName": "os.run",
  "arguments": { "command": "ls -la" }
}
```

## Layer 2: AI Semantic Analysis Configuration

Layer 2 adds LLM-powered contextual threat detection on top of the deterministic regex engine. It is tier-gated and requires an OpenAI API key.

### Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `SUPRAWALL_SEMANTIC_LLM_KEY` | — | OpenAI API key for semantic analysis. Without this, Layer 2 silently degrades to passthrough. |
| `SUPRAWALL_SEMANTIC_MODEL` | `gpt-4o-mini` | LLM model for analysis |
| `SUPRAWALL_SEMANTIC_TIMEOUT_MS` | `300` | Max LLM call duration before abort |
| `SUPRAWALL_DENY_THRESHOLD` | `0.85` | Score above which Layer 2 auto-DENYs |
| `SUPRAWALL_APPROVAL_THRESHOLD` | `0.60` | Score above which Layer 2 routes to HITL |
| `SUPRAWALL_FLAG_THRESHOLD` | `0.35` | Score above which Layer 2 flags in audit |

### Database Tables

Layer 2 creates three additional tables (auto-created by `initDb()`):

- **`semantic_analysis_log`** — Audit trail for every Layer 2 decision (score, anomaly, confidence, reasoning, latency)
- **`agent_behavioral_baselines`** — Running averages per agent/tool pair (args length, call patterns, sample count)
- **`custom_model_endpoints`** — Enterprise customers' fine-tuned model configuration

### Tier Gating

| Tier | Semantic Layer |
| ---- | -------------- |
| Open Source / Developer | None (Layer 1 only) |
| Team | AI semantic analysis |
| Business | Semantic + behavioral anomaly |
| Enterprise | Semantic + behavioral + custom model |
