# Contributing to SupraWall

Thank you for your interest in contributing to SupraWall! Whether it's a bug fix, new feature, documentation improvement, or framework plugin — every contribution makes AI agent security better for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive experience for everyone.

## How to Contribute

### Reporting Bugs

- Check [GitHub Issues](https://github.com/wiserautomation/SupraWall/issues) to see if the bug has already been reported
- If not, [open a new issue](https://github.com/wiserautomation/SupraWall/issues/new?template=bug_report.md) with a clear title and detailed description
- Include your SupraWall version, SDK language, framework, and deployment type
- Provide steps to reproduce and any relevant error output or audit logs

### Suggesting Features

- Check existing issues and the [public roadmap](https://github.com/orgs/suprawall/projects) first
- [Open a feature request](https://github.com/wiserautomation/SupraWall/issues/new?template=feature_request.md) with your use case
- Describe the problem you're solving, not just the solution you want

### Security Vulnerabilities

**Do NOT open a public issue for security vulnerabilities.** Email **security@suprawall.dev** directly. See [SECURITY.md](SECURITY.md) for our full security policy.

### Pull Requests

1. Fork the repository
2. Create a feature branch from `main` (`git checkout -b feature/my-feature`)
3. Make your changes
4. Ensure all tests pass (`npm test` from root)
5. Ensure the full build passes (`npm run build` from root)
6. Commit with a descriptive message
7. Push to your fork and submit a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+ (20 recommended)
- npm 10+
- PostgreSQL 15+ (for server development)
- Python 3.9+ (for Python SDK/plugin development)
- Go 1.21+ (for Go SDK development)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/wiserautomation/SupraWall.git
cd suprawall

# Install all dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Start development mode (watches for changes)
npm run dev
```

### Monorepo Structure

The project uses [Turborepo](https://turbo.build) to manage the monorepo:

```
packages/
  core/         - Shared types & configuration
  server/       - Backend policy engine (Express/PostgreSQL)
  sdk-ts/       - TypeScript SDK
  sdk-python/   - Python SDK
  sdk-go/       - Go SDK
  dashboard/    - Next.js admin UI
  cli/          - CLI tool
  webhooks/     - Async event workers

plugins/
  langchain-ts/ - LangChain TypeScript plugin
  langchain-py/ - LangChain Python plugin
  autogen/      - AutoGen plugin
  crewai/       - CrewAI plugin
  llama-index/  - LlamaIndex plugin
  vercel-ai/    - Vercel AI SDK plugin
  openclaw/     - OpenClaw plugin
```

### Working on a Specific Package

```bash
# Build only the TypeScript SDK
cd packages/sdk-ts
npm run build

# Work on the Python SDK
cd packages/sdk-python
pip install -e ".[dev]"
python -m pytest tests/

# Work on the Go SDK
cd packages/sdk-go
go build ./...
go test ./...
```

### Running the Server Locally

```bash
# Start PostgreSQL (via Docker)
docker compose up postgres -d

# Start the server in development mode
cd packages/server
npm run dev
```

### Running the Dashboard

```bash
cd packages/dashboard
npm run dev
# Visit http://localhost:3000
```

## Contribution Guidelines

### Code Style

- **TypeScript:** Follow the existing ESLint configuration
- **Python:** Follow PEP 8, use type hints
- **Go:** Follow standard Go formatting (`gofmt`)
- Write clear, descriptive variable and function names
- Add comments for complex logic, especially in security-sensitive code

### Testing

- All new features must include tests
- Bug fixes should include a regression test
- Run the full test suite before submitting: `npm test`
- For security-sensitive changes (vault, auth, policy engine), add extra test coverage

### Commit Messages

Use clear, descriptive commit messages:

```
feat(sdk-ts): add support for delegation chain authorization
fix(vault): prevent rate limit bypass on concurrent requests
docs(readme): add Go SDK quickstart example
chore(ci): add Python 3.12 to test matrix
```

### Documentation

- Update relevant documentation for any user-facing changes
- Add JSDoc/docstring comments to public APIs
- Update the README if adding new features or integrations

## Areas We Especially Welcome Contributions

- **New framework plugins** (PydanticAI, Haystack, Semantic Kernel, etc.)
- **Language SDKs** (Ruby, PHP, Java, Rust, C# need community love)
- **Database adapters** (DynamoDB, CockroachDB, etc.)
- **Documentation improvements** (tutorials, guides, translations)
- **Bug fixes** with clear reproduction steps
- **Performance improvements** with benchmarks

## Getting Help

- **Discord:** [Join our community](https://discord.gg/suprawall) for questions and discussion
- **GitHub Discussions:** For longer-form conversations and RFCs
- **Issues:** For bug reports and feature requests

## Recognition

All contributors are recognized in our release notes. Significant contributors are invited to the SupraWall Ambassador program.

---

Thank you for helping make AI agent security accessible to everyone.
