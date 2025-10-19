# OpenAI Codex CLI - Essential Commands Cheatsheet

## Installation & Setup

```bash
# Install globally via npm
npm install -g @openai/codex

# Install via Homebrew
brew install codex

# Verify installation
codex --version

# Upgrade to latest version
npm i -g @openai/codex@latest
```

## Authentication

```bash
# Sign in with ChatGPT (Plus/Pro/Team/Enterprise)
codex
# Then select "Sign in with ChatGPT" in the UI

# Login with API key from environment
printenv OPENAI_API_KEY | codex login --with-api-key

# Login with API key from file
codex login --with-api-key < my_key.txt

# Set API key as environment variable
export OPENAI_API_KEY="your-api-key-here"
```

## Interactive Mode (TUI)

```bash
# Launch interactive session
codex

# Start with an initial prompt
codex "Refactor the Dashboard component to React Hooks"

# Attach images to prompt
codex -i screenshot.png "Explain this error"
codex --image img1.png,img2.jpg "Implement this architecture"
```

## Non-Interactive Mode (Exec)

```bash
# Execute single task (read-only by default)
codex exec "count the total number of lines of code in this project"

# Execute with file editing enabled (full-auto mode)
codex exec --full-auto "add input validation to the login form"

# Generate JSON output
codex exec --json "check if there's a README file" > output.jsonl

# Quiet mode for automation
codex -q --json "explain utils.ts"
```

## Session Management

```bash
# Open session picker
codex resume

# Resume most recent session
codex resume --last

# Resume specific session by ID
codex resume 7f9f9a2e-1b3c-4c7a-9b0e-123456789abc
```

## Sandbox Modes

```bash
# Read-only: no edits, no network
codex --sandbox read-only

# Workspace-write: can edit files, no network
codex --sandbox workspace-write

# Full access: no sandboxing (DANGEROUS!)
codex --sandbox danger-full-access
```

## Approval Policies

```bash
# Ask before any edits/commands (default for non-git folders)
codex --ask-for-approval untrusted

# Ask only on failure
codex --ask-for-approval on-failure

# Model decides when to ask (default for git folders)
codex --ask-for-approval on-request

# Never ask for approval
codex --ask-for-approval never
```

## Presets

```bash
# Full-auto preset (workspace-write + on-failure approval)
codex --full-auto "build a todo app"

# YOLO mode - bypass all approvals and sandboxing (EXTREME CAUTION!)
codex --yolo "refactor everything"
```

## Configuration Profiles

```bash
# Use specific profile
codex --profile fast "explain this file"
codex --profile production "deploy the application"
```

## MCP Server Management

```bash
# Add MCP server
codex mcp add docs -- npx -y mcp-server-docs

# List all MCP servers
codex mcp list
codex mcp list --json

# View server details
codex mcp get docs
codex mcp get docs --json

# Remove MCP server
codex mcp remove docs

# OAuth login/logout (for streamable HTTP servers)
codex mcp login linear
codex mcp logout linear

# Show all MCP commands
codex mcp --help
```

## Sandbox Testing

```bash
# Test macOS Seatbelt sandbox
codex sandbox macos ls -la /etc

# Test Linux Landlock sandbox
codex sandbox linux curl https://example.com

# With full-auto mode
codex sandbox macos --full-auto [COMMAND]...
```

## Project Documentation Control

```bash
# Disable project document loading
codex --no-project-doc "explain this code"

# Set environment variable to disable
CODEX_DISABLE_PROJECT_DOC=1 codex
```

## Debugging & Troubleshooting

```bash
# Enable verbose logging
DEBUG=true codex

# View help
codex --help

# Generate shell completion
codex completion bash  # or zsh, fish
```

## Common Use Cases

```bash
# Code refactoring
codex "Refactor the Dashboard component to React Hooks"

# Generate migrations
codex "Generate SQL migrations for adding a users table"

# Write tests
codex "Write unit tests for utils/date.ts"

# Bulk file operations
codex "Bulk-rename *.jpeg -> *.jpg with git mv"

# Code explanation
codex "Explain what this regex does: ^(?=.*[A-Z]).{8,}$"

# Security review
codex "Look for vulnerabilities and create a security review report"

# Propose PRs
codex "Carefully review this repo, and propose 3 high impact well-scoped PRs"

# Diagnose and fix
codex "fix lint errors"
codex "Diagnose the test failure and propose a fix"
```

## CI/CD Integration

```bash
# GitHub Actions - Update changelog
npm install -g @openai/codex
export OPENAI_API_KEY="${{ secrets.OPENAI_KEY }}"
codex exec --full-auto "update CHANGELOG for next release"

# Run tests and get JSON output
codex exec --json "run the test suite and report failures" | jq -r 'select(.type=="turn.completed") | .usage'
```

## Structured Output

```bash
# Generate output with schema
codex exec "Extract details of the project" --output-schema schema.json -o result.json
```

## Environment Variables

```bash
# OpenAI
export OPENAI_API_KEY="your-api-key-here"

# Azure OpenAI
export AZURE_OPENAI_API_KEY="your-azure-api-key-here"
export AZURE_OPENAI_API_VERSION="2025-04-01-preview"

# OpenRouter
export OPENROUTER_API_KEY="your-openrouter-key-here"

# Disable project docs
export CODEX_DISABLE_PROJECT_DOC=1
```

## Configuration Files

```bash
# Main config location
~/.codex/config.toml

# Global agent instructions
~/.codex/AGENTS.md

# Project-specific instructions
./AGENTS.md

# Subdirectory-specific instructions
./backend/AGENTS.md
```

## Development & Building

```bash
# Build from source
git clone https://github.com/openai/codex.git
cd codex/codex-cli
corepack enable
pnpm install
pnpm build
./scripts/install_native_deps.sh
node ./dist/cli.js --help

# Link globally for development
pnpm link

# Run tests
pnpm test
pnpm test:watch

# Type-check
pnpm typecheck

# Lint and format
pnpm lint:fix
pnpm format:fix

# Full suite
pnpm test && pnpm run lint && pnpm run typecheck
```

## Nix Flakes

```bash
# Enter development shell
nix develop .#codex-cli
nix develop .#codex-rs

# Build with Nix
nix build .#codex-cli
nix build .#codex-rs

# Run via Nix
nix run .#codex-cli
nix run .#codex-rs

# View built binary
./result/bin/codex --help
```

## Rust-specific (codex-rs)

```bash
# Clone and build
git clone https://github.com/openai/codex.git
cd codex/codex-rs

# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustup component add rustfmt clippy

# Build and run
cargo build
cargo run --bin codex -- "explain this codebase to me"

# Code quality
cargo fmt -- --config imports_granularity=Item
cargo clippy --tests
cargo test

# Snapshot tests
cargo test -p codex-tui
cargo insta pending-snapshots -p codex-tui
cargo insta accept -p codex-tui
```

## Quick Reference Table

| Command | Description |
|---------|-------------|
| `codex` | Launch interactive TUI |
| `codex "prompt"` | TUI with initial prompt |
| `codex exec "prompt"` | Non-interactive execution |
| `codex --full-auto` | Enable file edits and auto mode |
| `codex resume` | Resume previous session |
| `codex mcp list` | List MCP servers |
| `codex --sandbox MODE` | Set sandbox mode |
| `codex --profile NAME` | Use config profile |
| `codex --version` | Show version |
| `codex --help` | Show help |

---

**Pro Tips:**
- Use `--full-auto` for automated tasks that need to modify files
- Use `--json` for programmatic consumption in scripts
- Use profiles for different workflows (fast, production, etc.)
- Configure `AGENTS.md` files for project-specific behavior
- Test sandbox behavior before production use
- Enable MCP servers for extended functionality (Context7, GitHub, Playwright, etc.)

---

*Generated from Context7 MCP documentation*
