# AgentGate Self-Hosted Server

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
  agentgate/server:latest
\`\`\`

## Enterprise (Kubernetes / Helm)

Navigate to the \`charts/agentgate\` directory.

\`\`\`bash
helm install agentgate ./charts/agentgate -n agentgate-system --create-namespace
\`\`\`

## API Endpoints

- \`GET /health\` - Liveness probe
- \`POST /v1/evaluate\` - Evaluates policy

Example Evaluate payload:
\`\`\`json
{
  "agentId": "agent_test",
  "toolName": "os.run",
  "arguments": { "command": "ls -la" }
}
\`\`\`
