# Codex + Claude Code Integration

> **Seamless integration between Claude Code and OpenAI Codex using CLI authentication (no API keys required)**

[![Cost](https://img.shields.io/badge/Cost-$0%20beyond%20subscriptions-green)]()
[![Setup](https://img.shields.io/badge/Setup-5%20minutes-blue)]()
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()

Combine Claude Code's implementation prowess with Codex's deep reasoning capabilities in a cost-effective, CLI-authenticated integration.

---

## Features

- **Zero API Costs**: Uses ChatGPT and Anthropic CLI subscriptions (saves $50-100+ per project)
- **Bidirectional Integration**: Claude calls Codex via MCP, Codex calls Claude via CLI
- **Automated Delegation**: Smart complexity detection suggests when to use which tool
- **5 MCP Tools**: reason, plan, spec, analyze, compare
- **Slash Commands**: `/plan`, `/reason`, `/spec`, `/codex` for easy access
- **Shared Context**: Session persistence across tool boundaries
- **Secure**: CLI authentication, no API keys to manage or leak

---

## Architecture

### Bidirectional Workflow

```
┌─────────────────────────────────────────────────┐
│           User (Developer)                      │
└───────────────┬─────────────────────────────────┘
                │
                │ Uses slash commands or direct calls
                ▼
┌─────────────────────────────────────────────────┐
│  Claude Code (Implementation Engine)            │
│  • Writes/modifies code                         │
│  • Runs tests and builds                        │
│  • Git operations (commits, PRs)                │
│  • Delegates complex reasoning to Codex         │
└───────────┬─────────────────────────────────────┘
            │
            │ /plan, /reason, /spec
            │ (via MCP tools)
            ▼
┌─────────────────────────────────────────────────┐
│  MCP Server (codex-mcp-server)                  │
│  • Receives tool calls from Claude              │
│  • Executes: codex exec -m gpt-5                │
│  • Validates outputs with JSON schemas          │
│  • Manages shared context/sessions              │
└───────────┬─────────────────────────────────────┘
            │
            │ codex exec -m gpt-5 --full-auto
            ▼
┌─────────────────────────────────────────────────┐
│  Codex (gpt-5) - Reasoning Agent                │
│  • Deep reasoning and analysis                  │
│  • Implementation planning                      │
│  • Technical specifications                     │
│  • Architectural decisions                      │
│  • Can delegate back to Claude for execution   │
└─────────────────────────────────────────────────┘
```

### Key Integration Points

1. **Claude → Codex** (via MCP): Complex reasoning, planning, specifications
2. **Codex → Claude** (via CLI): Implementation, testing, git operations
3. **Shared Context**: Session data persisted in `shared-context/`
4. **Hooks**: Automated complexity detection for delegation suggestions

---

## Quick Setup (5 Minutes)

### Prerequisites

- [x] ChatGPT Plus/Pro/Team account (for Codex CLI)
- [x] Anthropic Claude subscription (for Claude Code)
- [x] Both CLIs installed and authenticated

### 1. Verify Authentication

```bash
# Check Codex
codex --version

# Check Claude Code
claude --version
```

### 2. Build MCP Server

```bash
# Clone the repository first
git clone https://github.com/rachittshah/cc-codex.git
cd cc-codex

# Build the MCP server
cd codex-mcp-server
npm install
npm run build
```

### 3. Configure Claude Code

Add to `~/.claude/settings.json` (replace `<path-to-repo>` with your actual clone path):

```json
{
  "mcpServers": {
    "codex": {
      "command": "<path-to-repo>/cc-codex/codex-mcp-server/start-server.sh",
      "args": []
    }
  },
  "permissions": {
    "allow": ["mcp__*"]
  }
}
```

**Example**: If you cloned to `~/projects/cc-codex`, use:
```json
"command": "/Users/yourname/projects/cc-codex/codex-mcp-server/start-server.sh"
```

### 4. Link Slash Commands

```bash
# From the repository root
cd <path-to-repo>/cc-codex
ln -sf $(pwd)/commands/*.md ~/.claude/commands/
```

### 5. Test It

```bash
# Run comprehensive test (from repository root)
./test-local-setup.sh

# Or start Claude Code
claude

# Try a slash command
/plan implement a simple TODO list
```

**Setup complete!** See [CLI-ONLY-SETUP.md](./CLI-ONLY-SETUP.md) for detailed instructions.

---

## Usage

### Using Slash Commands in Claude Code

```bash
# Start Claude Code
claude

# Generate implementation plan
/plan implement user authentication with JWT

# Deep reasoning and analysis
/reason should we use PostgreSQL or MongoDB?

# Create technical specification
/spec REST API for user management

# Generic Codex task (auto-selects best tool)
/codex compare Redis vs Memcached for caching
```

### Direct Codex Usage

```bash
# For complex reasoning
codex exec -m gpt-5 --full-auto "analyze the trade-offs between microservices and monolith architecture for an e-commerce platform"

# Codex can then delegate to Claude for implementation
# (automatically calls: claude "implement recommended approach")
```

### Workflow Example

```bash
# User asks Claude
claude

> "Add user authentication to the API"

# Claude detects complexity, suggests delegation
→ Complexity Score: 5/10
→ Suggestion: Use /plan or /reason

# User accepts
> /plan implement user authentication

# Claude calls Codex via MCP
→ codex_plan tool called
→ Codex (gpt-5) analyzes requirements
→ Generates detailed plan with phases

# Claude presents plan
Phase 1: Database Schema
  - User model with email/password
  - Sessions table for JWT tokens

Phase 2: Authentication Middleware
  - JWT generation/validation
  - Password hashing (bcrypt)

Phase 3: API Routes
  - POST /auth/register
  - POST /auth/login
  - GET /auth/me

Phase 4: Testing & Security
  - Unit tests for auth logic
  - Integration tests for endpoints
  - Security audit

# User approves
> Looks good, proceed

# Claude implements step-by-step
→ Creates User model
→ Implements JWT middleware
→ Creates auth routes
→ Writes comprehensive tests
→ Runs test suite (all pass)
→ Creates git commit
→ Offers to create PR
```

---

## What's Included

### Core Components

```
cc-codex/
├── codex-mcp-server/          # MCP server for Claude → Codex integration
│   ├── src/
│   │   ├── index.ts           # Main MCP server
│   │   ├── tools/             # 5 Codex tools (reason, plan, spec, etc.)
│   │   └── utils/             # Codex executor, schema validator
│   └── dist/                  # Compiled JavaScript
│
├── commands/                   # Slash commands for Claude Code
│   ├── plan.md                # /plan command
│   ├── reason.md              # /reason command
│   ├── spec.md                # /spec command
│   └── codex.md               # /codex command
│
├── hooks/                      # Automation hooks
│   ├── detect-complexity.py   # Complexity detection
│   ├── auto-delegate.sh       # Auto-delegation logic
│   └── hooks.json             # Hook configuration
│
├── shared-context/            # Shared state management
│   ├── session-manager.ts     # Session persistence
│   └── sync.sh                # Context sync utility
│
├── schemas/                    # JSON output schemas
│   ├── plan-output.schema.json
│   ├── reasoning-output.schema.json
│   └── handoff.schema.json
│
└── Documentation
    ├── README.md              # This file
    ├── CLI-ONLY-SETUP.md      # Detailed setup guide
    ├── INTEGRATION-GUIDE.md   # Technical integration guide
    ├── CLAUDE.md              # Claude Code instructions
    ├── AGENTS.md              # Codex agent instructions
    └── TEST-REPORT.md         # Test results
```

### Available MCP Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `codex_reason` | Deep reasoning and analysis | Compare architectural approaches |
| `codex_plan` | Implementation planning | Generate step-by-step plan |
| `codex_spec` | Technical specifications | Create API spec with schemas |
| `codex_analyze` | Code/architecture review | Security audit, performance analysis |
| `codex_compare` | Option comparison | Technology selection with trade-offs |

---

## Cost Comparison

### Traditional API Approach

```
OpenAI API: $0.06/1K tokens (input) + $0.24/1K tokens (output)
Anthropic API: $3/1M tokens (input) + $15/1M tokens (output)

Example Project (50 reasoning tasks):
• ~500K tokens
• Cost: $50-100+ in API fees
```

### CLI-Only Approach (This Repo)

```
Codex CLI: $0 (included in ChatGPT Plus/Pro)
Claude Code CLI: $0 usage fees (flat $200/month Anthropic subscription)

Example Project (50 reasoning tasks):
• Unlimited tokens
• Cost: $0 additional (beyond subscriptions)

Savings: $50-100+ per project!
```

---

## Use Cases

### 1. Feature Planning
```bash
/plan implement real-time notifications with WebSockets
```
- Codex analyzes requirements
- Breaks down into phases
- Identifies dependencies and risks
- Claude implements phase-by-phase

### 2. Architectural Decisions
```bash
/reason microservices vs monolith for our e-commerce platform
```
- Codex evaluates multiple approaches
- Analyzes trade-offs (complexity, scale, team)
- Recommends solution with rationale
- Claude implements chosen architecture

### 3. Technical Documentation
```bash
/spec payment processing API with Stripe integration
```
- Codex creates detailed specification
- Includes endpoints, schemas, validation
- Documents error handling, security
- Claude implements to spec

### 4. Code Review & Optimization
```bash
/codex analyze the authentication code for security vulnerabilities
```
- Codex performs security audit
- Identifies vulnerabilities, N+1 queries
- Recommends fixes with examples
- Claude applies fixes

### 5. Technology Selection
```bash
/codex compare Redis vs Memcached vs in-memory caching
```
- Codex compares options
- Analyzes trade-offs (performance, features, ops)
- Recommends based on context
- Claude implements chosen solution

---

## Configuration

### Codex Settings (`~/.codex/config.toml`)

```toml
model = "gpt-5"
model_reasoning_effort = "high"  # Automatic high-quality reasoning

[projects."<path-to-repo>/cc-codex"]
trust_level = "trusted"
```

### Claude Code Settings (`~/.claude/settings.json`)

```json
{
  "mcpServers": {
    "codex": {
      "command": "<path-to-repo>/cc-codex/codex-mcp-server/start-server.sh",
      "args": []
    }
  },
  "permissions": {
    "allow": ["mcp__*"]
  }
}
```

### Customization

- **Hooks**: Edit `hooks/hooks.json` to customize complexity thresholds
- **Schemas**: Modify `schemas/*.schema.json` for output validation
- **Commands**: Edit `commands/*.md` to customize slash command behavior

---

## Documentation

| Document | Description |
|----------|-------------|
| [CLI-ONLY-SETUP.md](./CLI-ONLY-SETUP.md) | Complete CLI-only setup guide |
| [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) | 400+ line technical integration guide |
| [CLAUDE.md](./CLAUDE.md) | Instructions for Claude Code |
| [AGENTS.md](./AGENTS.md) | Instructions for Codex agents |
| [QUICK-START-CLI-ONLY.md](./QUICK-START-CLI-ONLY.md) | Quick start guide |
| [TEST-REPORT.md](./TEST-REPORT.md) | Test results and validation |
| [LOCAL-SETUP-COMPLETE.md](./LOCAL-SETUP-COMPLETE.md) | Local setup confirmation |

---

## Testing

Run comprehensive integration test (from repository root):

```bash
./test-local-setup.sh
```

Expected output:
```
✓ Codex CLI: Installed and authenticated
✓ MCP Server: Built and ready
✓ Claude Settings: Configured
✓ Slash Commands: Linked (4/4)
✓ Integration: Ready to use
```

---

## Troubleshooting

### MCP Server Not Responding

```bash
# Rebuild MCP server (from repository root)
cd <path-to-repo>/cc-codex/codex-mcp-server
npm run build

# Verify dist/index.js exists
ls -la dist/index.js
```

### Slash Commands Not Working

```bash
# Verify links
ls -la ~/.claude/commands/

# Re-link if needed (from repository root)
cd <path-to-repo>/cc-codex
ln -sf $(pwd)/commands/*.md ~/.claude/commands/
```

### Codex Authentication Issues

```bash
# Check authentication
codex --version

# Re-authenticate
codex
# Select "Sign in with ChatGPT"
```

### Claude Code Not Finding MCP Server

```bash
# Verify settings.json
cat ~/.claude/settings.json | jq '.mcpServers'

# Check MCP server path exists
ls -la <path-to-repo>/cc-codex/codex-mcp-server/start-server.sh
ls -la <path-to-repo>/cc-codex/codex-mcp-server/dist/index.js

# Restart Claude Code
# (exit and start again)
```

---

## Contributing

This is a personal integration setup, but feel free to:

1. Fork the repository
2. Adapt for your own use case
3. Share improvements via issues/PRs
4. Report bugs or suggest features

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- **OpenAI** for Codex CLI and gpt-5 model
- **Anthropic** for Claude Code and Claude API
- **Model Context Protocol (MCP)** for enabling tool integration
- **Community** for feedback and ideas

---

## Resources

- [OpenAI Codex CLI Docs](./openai-codex-cli-docs.md)
- [Codex Commands Cheatsheet](./codex-cli-commands-cheatsheet.md)
- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [MCP Specification](https://modelcontextprotocol.io/)
- [GitHub Repository](https://github.com/rachittshah/cc-codex)

---

## Quick Reference

### Slash Commands
```bash
/plan [task]     # Generate implementation plan
/reason [query]  # Deep reasoning and analysis
/spec [feature]  # Create technical specification
/codex [task]    # Generic Codex task (auto-detects tool)
```

### Direct Codex
```bash
codex exec -m gpt-5 --full-auto "reasoning task"
```

### Test Integration
```bash
./test-local-setup.sh
```

---

**Built for seamless AI-assisted development**

**Zero API costs • Production ready • 5-minute setup**
