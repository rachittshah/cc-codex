# OpenAI Codex CLI Documentation

## Table of Contents
- [Installation](#installation)
- [Authentication](#authentication)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
- [MCP Server Management](#mcp-server-management)
- [Sandbox and Security](#sandbox-and-security)
- [Advanced Features](#advanced-features)
- [CI/CD Integration](#cicd-integration)
- [Development and Building](#development-and-building)

---

## Installation

### Install via npm (Global)

```bash
npm install -g @openai/codex
```

### Install via Other Package Managers

```bash
# Yarn
yarn global add @openai/codex

# Bun
bun install -g @openai/codex

# pnpm
pnpm add -g @openai/codex
```

### Install via Homebrew

```bash
brew install codex
```

### Verify Installation

```bash
codex --version
# Output: 0.20.0 (or later)
```

---

## Authentication

### Sign in with ChatGPT Account

For users with ChatGPT Plus/Pro/Team/Enterprise plans:

```bash
codex
# Select "Sign in with ChatGPT" when prompted
# Follow the browser authentication flow at localhost:1455
```

### Login with OpenAI API Key

For usage-based billing with OpenAI API:

```bash
# From environment variable
printenv OPENAI_API_KEY | codex login --with-api-key

# From a file
codex login --with-api-key < my_key.txt
```

### Set API Key as Environment Variable

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Or in `.env` file at project root:

```env
OPENAI_API_KEY=your-api-key-here
```

---

## Basic Usage

### Interactive Mode (TUI)

Launch the Terminal User Interface for conversational interaction:

```bash
# Start interactive session
codex

# Start with an initial prompt
codex "Refactor the Dashboard component to React Hooks"
```

### Non-Interactive Mode (Exec)

Execute single tasks and get immediate output:

```bash
# Basic exec mode (read-only by default)
codex exec "count the total number of lines of code in this project"

# With full-auto mode (allows file edits)
codex exec --full-auto "add input validation to the login form"

# Generate JSON output
codex exec --json "check if there's a README file" > output.jsonl
```

### Common CLI Examples

```bash
# Code refactoring
codex "Refactor the Dashboard component to React Hooks"

# Generate code
codex "Generate SQL migrations for adding a users table"

# Write tests
codex "Write unit tests for utils/date.ts"

# File operations
codex "Bulk-rename *.jpeg -> *.jpg with git mv"

# Code explanation
codex "Explain what this regex does: ^(?=.*[A-Z]).{8,}$"

# Security review
codex "Look for vulnerabilities and create a security review report"
```

### Working with Images

```bash
# Attach single image
codex -i screenshot.png "Explain this error"

# Attach multiple images
codex --image diagram1.png,diagram2.jpg "Implement this architecture"

# Paste images directly in TUI with Ctrl+V / Cmd+V
```

### Session Management

```bash
# Open session picker
codex resume

# Resume most recent session
codex resume --last

# Resume specific session by ID
codex resume 7f9f9a2e-1b3c-4c7a-9b0e-123456789abc
```

---

## Configuration

### Basic Configuration (`~/.codex/config.toml`)

```toml
# Default model
model = "gpt-5-codex"

# Approval policy: "suggest", "on-failure", "on-request", "never"
approval_policy = "on-request"

# Sandbox mode: "read-only", "workspace-write", "danger-full-access"
sandbox_mode = "workspace-write"
```

### Configuration Profiles

Define multiple profiles for different use cases:

```toml
model = "gpt-5-codex"
profile = "default"

[profiles.fast]
model = "gpt-4o-mini"
approval_policy = "never"
sandbox_mode = "read-only"

[profiles.production]
model = "o3"
model_provider = "openai"
approval_policy = "on-failure"
model_reasoning_effort = "high"
model_reasoning_summary = "detailed"

[profiles.yolo]
approval_policy = "never"
sandbox_mode = "danger-full-access"
```

Use profiles via CLI:

```bash
codex --profile fast "explain this file"
codex --profile production "deploy the application"
```

### Custom Project Instructions

#### Global Instructions (`~/.codex/AGENTS.md`)

```bash
cat > ~/.codex/AGENTS.md << 'EOF'
# Global Codex Instructions

- Always run tests after making changes
- Use TypeScript strict mode
- Follow the project's ESLint configuration
- Write detailed commit messages
EOF
```

#### Project-Specific Instructions (`AGENTS.md` in project root)

```bash
cat > AGENTS.md << 'EOF'
# Project-Specific Instructions

This is a React TypeScript project using:
- Vite for bundling
- Vitest for testing
- TailwindCSS for styling

## Testing
- Run `npm test` before committing
- Maintain >80% coverage

## Code Style
- Use functional components with hooks
- Prefer composition over inheritance
EOF
```

#### Subdirectory-Specific Instructions

```bash
cat > backend/AGENTS.md << 'EOF'
# Backend-Specific Instructions

This API uses Express.js with TypeScript.

- All routes must have input validation using Zod
- Use async/await, not callbacks
- Database migrations are in `migrations/`
EOF
```

Codex automatically merges global → project → subdirectory instructions.

### Disable Project Documentation Loading

```bash
# Via CLI flag
codex --no-project-doc "explain this code"

# Via environment variable
CODEX_DISABLE_PROJECT_DOC=1 codex
```

### Custom Fallback Filenames

```toml
# ~/.codex/config.toml
project_doc_fallback_filenames = ["CLAUDE.md", ".ai-instructions.md"]
# Codex checks in order: AGENTS.md, CLAUDE.md, .ai-instructions.md
```

---

## MCP Server Management

### Add MCP Server

```bash
# STDIO-based server
codex mcp add docs -- npx -y mcp-server-docs

# With custom port
codex mcp add docs -- docs-server --port 4000
```

### List MCP Servers

```bash
# Pretty table format
codex mcp list

# JSON format
codex mcp list --json
```

### View Server Details

```bash
# Table format
codex mcp get docs

# JSON format
codex mcp get docs --json
```

### Remove MCP Server

```bash
codex mcp remove docs
```

### OAuth Login/Logout (Streamable HTTP Servers)

```bash
# Login
codex mcp login linear

# Logout
codex mcp logout linear
```

### MCP Server Configuration (`~/.codex/config.toml`)

#### STDIO-based Server

```toml
experimental_use_rmcp_client = true

[mcp_servers.docs]
command = "npx"
args = ["-y", "mcp-server-docs"]
env = { "API_KEY" = "value" }
startup_timeout_sec = 20
tool_timeout_sec = 60
```

#### Common MCP Server Examples

```toml
# Context7 - developer documentation
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp-server"]

# Playwright - browser automation
[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp"]

# GitHub - repository management
[mcp_servers.github]
command = "npx"
args = ["-y", "@github/github-mcp-server"]
env = { "GITHUB_TOKEN" = "${GITHUB_TOKEN}" }

# Figma - design file access
[mcp_servers.figma]
url = "https://mcp.figma.com/v1"
bearer_token_env_var = "FIGMA_ACCESS_TOKEN"
```

---

## Sandbox and Security

### Sandbox Modes

Codex provides different sandbox modes for security:

```bash
# Read-only: can read files, no edits or network
codex --sandbox read-only

# Workspace-write: can edit workspace files, no network by default
codex --sandbox workspace-write

# Full access: no sandboxing (use with extreme caution)
codex --sandbox danger-full-access
```

### Approval Policies

Control when Codex requires user approval:

```bash
# Suggest mode: ask before any edits or commands (default for non-git folders)
codex --ask-for-approval untrusted

# On-failure: ask only when sandboxed command fails
codex --ask-for-approval on-failure

# On-request: model decides when to escalate (default for git folders)
codex --ask-for-approval on-request

# Never: no approval prompts
codex --ask-for-approval never
```

### Full Auto Preset

Simplified preset combining sandbox and approval settings:

```bash
codex --full-auto "build a todo app"
# Equivalent to:
# codex --sandbox workspace-write --ask-for-approval on-failure
```

### YOLO Mode (Use with Caution!)

Bypass all approvals and sandboxing:

```bash
codex --yolo "refactor everything"
# Equivalent to:
# codex --dangerously-bypass-approvals-and-sandbox
```

### Test Sandbox Behavior

#### macOS (Seatbelt)

```bash
codex sandbox macos ls -la /etc

# Legacy alias
codex debug seatbelt [--full-auto] [COMMAND]...
```

#### Linux (Landlock)

```bash
# Should fail with network disabled
codex sandbox linux curl https://example.com

# Legacy alias
codex debug landlock [--full-auto] [COMMAND]...
```

---

## Advanced Features

### Shell Environment Control

#### Default (Inherit All)

```bash
# By default, Codex passes your full environment to subprocesses
codex "check Python version"
# Subprocess sees all env vars including PATH, HOME, USER, etc.
```

#### Core Variables Only

```toml
[shell_environment_policy]
inherit = "core"
# Only HOME, PATH, USER, and system essentials
```

#### Whitelist Specific Variables

```toml
[shell_environment_policy]
inherit = "all"
include_only = ["PATH", "HOME", "USER", "NODE_ENV", "DATABASE_URL"]
```

#### Custom Environment

```toml
[shell_environment_policy]
inherit = "none"
set = { PATH = "/usr/bin:/bin", CI = "1", NODE_ENV = "test" }
```

### Desktop Notifications

Enable notifications in TUI (requires iTerm2, Ghostty, or WezTerm):

```toml
[tui]
notifications = true

# Or filter to specific types
notifications = ["agent-turn-complete", "approval-requested"]
```

### File Opener for Citations

Configure external editor for file citations:

```toml
file_opener = "cursor"  # vscode, vscode-insiders, windsurf, cursor, none
```

### Custom Notification Script

```toml
# ~/.codex/config.toml
notify = ["python3", "/Users/me/.codex/notify.py"]
```

### Structured JSON Output with Schema

```bash
# Create schema
cat > schema.json << 'EOF'
{
  "type": "object",
  "properties": {
    "project_name": { "type": "string" },
    "programming_languages": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["project_name", "programming_languages"],
  "additionalProperties": false
}
EOF

# Use schema
codex exec "Extract details of the project" --output-schema schema.json -o result.json
```

### OpenTelemetry Events

Codex emits various event types when configured with OTLP collector:

```bash
codex "analyze the code"
# Emits:
# - codex.conversation_starts: model, approval_policy, sandbox_policy, mcp_servers
# - codex.api_request: attempt, duration_ms, http.response.status_code
# - codex.sse_event: event.kind, input/output/reasoning token counts
# - codex.user_prompt: prompt_length, prompt (if log_user_prompt = true)
# - codex.tool_decision: tool_name, decision (approved/denied), source
# - codex.tool_result: tool_name, arguments, duration_ms, success, output
```

### Shell Completion

Generate completion scripts for your shell:

```bash
# Bash
codex completion bash

# Zsh
codex completion zsh

# Fish
codex completion fish
```

### Verbose Logging

```bash
DEBUG=true codex
```

---

## CI/CD Integration

### GitHub Actions - Update Changelog

```yaml
- name: Update changelog via Codex
  run: |
    npm install -g @openai/codex
    export OPENAI_API_KEY="${{ secrets.OPENAI_KEY }}"
    codex exec --full-auto "update CHANGELOG for next release"
```

### Run Tests and Report Failures

```bash
codex exec --json "run the test suite and report failures" | jq -r 'select(.type=="turn.completed") | .usage'
```

### Resume Non-Interactive Session

```bash
# Initial run
codex exec "Review the code for security issues"
# Session ID: abc-123

# Resume with context
codex exec resume --last "Fix the security issues you found"
```

---

## Development and Building

### Build from Source

```bash
# Clone repository
git clone https://github.com/openai/codex.git
cd codex/codex-cli

# Enable corepack
corepack enable

# Install dependencies and build
pnpm install
pnpm build

# Install native dependencies
./scripts/install_native_deps.sh

# Run directly
node ./dist/cli.js --help
node ./dist/cli.js

# Link globally
pnpm link
```

### Nix Flakes

#### Enter Development Shell

```bash
# For codex-cli
nix develop .#codex-cli

# For codex-rs
nix develop .#codex-rs
```

#### Build with Nix

```bash
# Build codex-cli
nix build .#codex-cli

# Build codex-rs
nix build .#codex-rs

# Run the built binary
./result/bin/codex --help
```

#### Run via Nix Flake

```bash
# Run codex-cli
nix run .#codex-cli

# Run codex-rs
nix run .#codex-rs
```

#### Integrate with Direnv

```bash
cd codex-rs
echo "use flake ../flake.nix#codex-cli" >> .envrc && direnv allow

cd codex-cli
echo "use flake ../flake.nix#codex-rs" >> .envrc && direnv allow
```

### Building with Rust (codex-rs)

```bash
# Clone and navigate
git clone https://github.com/openai/codex.git
cd codex/codex-rs

# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustup component add rustfmt
rustup component add clippy

# Build
cargo build

# Run with prompt
cargo run --bin codex -- "explain this codebase to me"

# Code quality checks
cargo fmt -- --config imports_granularity=Item
cargo clippy --tests

# Run tests
cargo test
```

### Development Workflow (TypeScript)

```bash
# Watch mode (tests rerun on change)
pnpm test:watch

# Type-check
pnpm typecheck

# Fix linting and formatting
pnpm lint:fix
pnpm format:fix

# Full test suite
pnpm test && pnpm run lint && pnpm run typecheck
```

### Debug with Node Inspector

```bash
pnpm run build
node --inspect-brk ./dist/cli.js
# Attach debugger on port 9229
```

### Snapshot Tests (Rust)

```bash
cargo test -p codex-tui
cargo insta pending-snapshots -p codex-tui
cargo insta show -p codex-tui path/to/file.snap.new
cargo insta accept -p codex-tui
cargo install cargo-insta
```

### Staging for Release

```bash
# Stage classic JavaScript implementation
pnpm stage-release

# Stage to custom directory
RELEASE_DIR=$(mktemp -d)
pnpm stage-release --tmp "$RELEASE_DIR"

# Stage 'fat' package with native Rust binaries
pnpm stage-release --native
```

### Publishing to npm

```bash
cd "$RELEASE_DIR"
npm publish
```

### Upgrade to Latest Version

```bash
npm i -g @openai/codex@latest
```

---

## Additional Resources

### TypeScript SDK

```typescript
import { Codex } from "@openai/codex-sdk";

const codex = new Codex();
const thread = codex.startThread();
const turn = await thread.run("Diagnose the test failure and propose a fix");

console.log(turn.finalResponse);
console.log(turn.items);
```

### Responses API Proxy

Install globally:

```bash
npm i -g @openai/codex-responses-api-proxy
```

View help:

```bash
node ./bin/codex-responses-api-proxy.js --help
```

Run proxy:

```bash
codex-responses-api-proxy [--port <PORT>] [--server-info <FILE>] [--http-shutdown]
```

### Multi-Provider API Keys

```bash
# OpenAI
export OPENAI_API_KEY="your-api-key-here"

# Azure OpenAI
export AZURE_OPENAI_API_KEY="your-azure-api-key-here"
export AZURE_OPENAI_API_VERSION="2025-04-01-preview"

# OpenRouter
export OPENROUTER_API_KEY="your-openrouter-key-here"
```

---

## Summary

OpenAI Codex CLI is a powerful terminal-based coding agent that can:

- **Read, modify, and run code** within your terminal
- **Integrate with MCP servers** for extended functionality
- **Operate in various security modes** (read-only, workspace-write, full-access)
- **Work both interactively (TUI) and non-interactively (exec mode)**
- **Integrate with CI/CD pipelines** for automation
- **Support custom configurations and profiles** for different workflows
- **Handle images, sessions, and structured output**

For the latest documentation, visit:
- GitHub: https://github.com/openai/codex
- Context7: https://context7.com/openai/codex

---

*Documentation generated using Context7 MCP server*
