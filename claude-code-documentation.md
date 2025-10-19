# Claude Code - Complete Documentation

> Comprehensive guide to installing, configuring, and using Claude Code CLI

**Source:** Compiled from official Anthropic documentation via context7
**Last Updated:** 2025-10-19

---

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Configuration](#configuration)
4. [Built-in Commands](#built-in-commands)
5. [Custom Commands](#custom-commands)
6. [Permissions & Security](#permissions--security)
7. [Hooks System](#hooks-system)
8. [MCP Server Integration](#mcp-server-integration)
9. [Plugin System](#plugin-system)
10. [Git Workflows](#git-workflows)
11. [PR Review Toolkit](#pr-review-toolkit)
12. [Debugging & Troubleshooting](#debugging--troubleshooting)
13. [Advanced Features](#advanced-features)

---

## Installation

### Install via npm

```bash
npm install -g @anthropic-ai/claude-code
```

### Install VS Code Extension

```bash
# Install from VS Code marketplace
# Search for "Claude Code"

# Or via command line
code --install-extension anthropic.claude-code
```

### Verify Installation

```bash
claude --help
```

---

## Getting Started

### Basic Usage

```bash
# Navigate to your project
cd /path/to/your/project

# Launch Claude Code in interactive mode
claude

# Run a single command (headless mode)
claude --headless "explain the main.js file"

# Launch with API key
ANTHROPIC_API_KEY=your_key claude

# Launch with custom settings
claude --settings /path/to/settings.json
```

### First Steps

1. Set up your API key (see Configuration below)
2. Navigate to your project directory
3. Run `claude` to start interactive session
4. Try basic commands like `/help` or ask Claude to explain code

---

## Configuration

### Environment Variables

```bash
# API Keys
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...

# AWS Bedrock
export AWS_REGION=us-west-2
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...

# Google Vertex AI
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
export GOOGLE_CLOUD_PROJECT=project-id
export GOOGLE_CLOUD_LOCATION=us-central1

# Claude Code Settings
export CLAUDE_BASH_NO_LOGIN=1  # Skip login shell
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-5
export NO_PROXY=localhost,127.0.0.1  # Bypass proxy
```

### settings.json Configuration

Location: `~/.claude/settings.json`

```json
{
  "permissions": {
    "allowedTools": [
      "Read(**/*.{js,ts,json,md})",
      "Edit(**/*.{js,ts})",
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(node:*)"
    ],
    "deniedTools": [
      "Edit(/config/secrets.json)",
      "Bash(rm -rf:*)"
    ]
  },
  "permissionMode": "acceptEdits",
  "spinnerTipsEnabled": true,
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": []
  },
  "statusLine": {
    "enabled": true,
    "format": "{{model}} | {{tokens}}"
  },
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "oauth": {
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret",
        "scopes": ["repo", "issues"]
      }
    }
  },
  "extraKnownMarketplaces": [
    {
      "name": "company-plugins",
      "url": "https://github.com/your-org/claude-plugins"
    }
  ]
}
```

---

## Built-in Commands

### Essential Commands

```bash
/help             # Get help with Claude Code
/bug              # Report a bug
/model            # Switch AI model
/rewind           # Undo code changes to a previous state
/usage            # Check plan limits and API usage
/cost             # View API costs and token usage
/context          # Check context usage
/memory           # View memory management
/add-dir          # Add directory to context
/mcp              # Manage MCP servers
/plugin           # Manage plugins (install, enable, disable)
/doctor           # Validate configuration and diagnose issues
/clear            # Clear conversation history
/config           # Configure Claude Code settings
```

### Custom Plugin Commands

```bash
/commit-push-pr   # Commit changes, push, and create PR
/dedupe           # Find duplicate GitHub issues
```

### Model Selection

```bash
# Switch models interactively
/model

# Or specify at launch
claude --model claude-opus-4

# Available aliases: sonnet, opus, opusplan
```

### Context Management

```bash
# Check context usage
/context

# Add directory to context
/add-dir src/components

# Memory management
/memory
```

### Usage Tracking

```bash
# View API usage and costs
/cost

# Check plan limits
/usage
```

### Session Management

```bash
# Rewind conversation to undo changes
/rewind

# Clear conversation
/clear

# Save session state (automatic)
# Resume from last session on next launch
```

---

## Custom Commands

### Creating Custom Slash Commands

Create a file at `.claude/commands/<command-name>.md`:

```markdown
# File: .claude/commands/deploy.md
---
allowed-tools: Bash(npm:*), Bash(git:*)
description: Build and deploy to production
---

## Your task

1. Run `npm run build`
2. Run `npm run test`
3. If tests pass, deploy with `npm run deploy`
4. Tag the release with current version
```

### Using Custom Commands

```bash
/deploy
```

---

## Permissions & Security

### Permission Modes

```bash
# Automatically accept edits
claude --permission-mode acceptEdits

# Ask for confirmation
claude --permission-mode ask

# Validate permissions
claude /doctor
```

### Granular Permissions

```json
{
  "permissions": {
    "allowedTools": [
      "Read(/app/src/**)",
      "Edit(/app/src/**/*.js)",
      "Bash(git status:*)",
      "Bash(npm install:*)",
      "Bash(python:*)"
    ],
    "deniedTools": [
      "Bash(rm -rf:*)",
      "Edit(/config/secrets.json)"
    ]
  },
  "permissionMode": "ask"
}
```

### Permission Patterns

```bash
# Read TypeScript files
"Read(**/*.ts)"

# Allow git commands with output redirection
"Bash(git:*)"  # Matches: git status > output.txt

# Allow Python scripts in specific directory
"Bash(python /app/scripts/*)"
```

---

## Hooks System

### Pre/Post Tool Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 /path/to/validator.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint"
          }
        ]
      }
    ]
  }
}
```

### Example Validation Hook

Create `validator.py`:

```python
#!/usr/bin/env python3
import json
import re
import sys

VALIDATION_RULES = [
    (r"^grep\b", "Use 'rg' instead of 'grep'"),
    (r"^rm -rf", "Dangerous command blocked")
]

def validate_command(command: str) -> list[str]:
    issues = []
    for pattern, message in VALIDATION_RULES:
        if re.search(pattern, command):
            issues.append(message)
    return issues

def main():
    input_data = json.load(sys.stdin)

    if input_data.get("tool_name") != "Bash":
        sys.exit(0)

    command = input_data.get("tool_input", {}).get("command", "")
    issues = validate_command(command)

    if issues:
        for message in issues:
            print(f"• {message}", file=sys.stderr)
        sys.exit(2)  # Block tool call

if __name__ == "__main__":
    main()
```

---

## MCP Server Integration

### Configuring MCP Servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "oauth": {
        "clientId": "your-client-id",
        "clientSecret": "your-client-secret",
        "scopes": ["repo", "issues"]
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
```

### Using MCP Servers

```bash
# Enable/disable MCP servers by @-mentioning them
@github help

# Or manage in /mcp command
/mcp

# MCP servers provide tools that Claude can use
# Example: GitHub MCP server provides issue search, PR management, etc.
```

---

## Plugin System

### Managing Plugins

```bash
# Inside Claude Code terminal
/plugin install                    # Install plugins from marketplaces
/plugin enable security-guidance   # Enable a plugin
/plugin disable security-guidance  # Disable a plugin
/plugin marketplace                # Browse available plugins
/plugin validate                   # Validate plugin structure
```

### Available Built-in Plugins

- **security-guidance**: Security reminder hooks for potential vulnerabilities
- **pr-review-toolkit**: Comprehensive PR review agents
- **agent-sdk-dev**: Claude Agent SDK development tools
- **feature-dev**: Feature development agents
- **commit-commands**: Git commit workflow commands

### Custom Plugin Structure

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── my-command.md
├── agents/
│   └── my-agent.md
└── hooks/
    └── hooks.json
```

### Adding Custom Marketplaces

```json
{
  "extraKnownMarketplaces": [
    {
      "name": "company-plugins",
      "url": "https://github.com/your-org/claude-plugins"
    }
  ]
}
```

---

## Git Workflows

### Automated Git Commit and PR

```bash
user: "Commit my changes and create a PR"

# Claude will:
# 1. Run git status and git diff
# 2. Create a new branch if on main
# 3. Stage relevant files
# 4. Create commit with appropriate message
# 5. Push to origin
# 6. Create PR via gh cli
```

### Commit Format

```bash
git commit -m "$(cat <<'EOF'
Add user authentication feature

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Pull Request Template

```bash
gh pr create --title "Add authentication" --body "$(cat <<'EOF'
## Summary
- Implement JWT authentication
- Add login/logout endpoints
- Create auth middleware

## Test plan
- [ ] Test login flow
- [ ] Test token validation
- [ ] Test logout

🤖 Generated with [Claude.ai/code](https://claude.ai/code)
EOF
)"
```

### Clean Gone Branches

```bash
# List Git branches to identify [gone] status
git branch -v

# List Git worktrees
git worktree list

# Process all [gone] branches, removing '+' prefix if present
git branch -v | grep '\[gone\]' | sed 's/^[+* ]//' | awk '{print $1}' | while read branch; do
  echo "Processing branch: $branch"
  # Find and remove worktree if it exists
  worktree=$(git worktree list | grep "\\[$branch\\]" | awk '{print $1}')
  if [ ! -z "$worktree" ] && [ "$worktree" != "$(git rev-parse --show-toplevel)" ]; then
    echo "  Removing worktree: $worktree"
    git worktree remove --force "$worktree"
  fi
  # Delete the branch
  echo "  Deleting branch: $branch"
  git branch -D "$branch"
done
```

---

## PR Review Toolkit

### Default Comprehensive Review

```shell
/pr-review-toolkit:review-pr
```

### Review Specific Aspects

```shell
# Review only test coverage and error handling
/pr-review-toolkit:review-pr tests errors

# Review only code comments
/pr-review-toolkit:review-pr comments

# Simplify code after passing review
/pr-review-toolkit:review-pr simplify
```

### Run All Reviews in Parallel

```shell
/pr-review-toolkit:review-pr all parallel
# Launches all agents in parallel
```

### Review Summary Format

```markdown
# PR Review Summary

## Critical Issues (X found)
- [agent-name]: Issue description [file:line]

## Important Issues (X found)
- [agent-name]: Issue description [file:line]

## Suggestions (X found)
- [agent-name]: Suggestion [file:line]

## Strengths
- What's well-done in this PR

## Recommended Action
1. Fix critical issues first
2. Address important issues
3. Consider suggestions
4. Re-run review after fixes
```

### Integration Workflows

#### Before Committing

```shell
1. Write code
2. Run: /pr-review-toolkit:review-pr code errors
3. Fix any critical issues
4. Commit
```

#### Before Creating PR

```shell
1. Stage all changes
2. Run: /pr-review-toolkit:review-pr all
3. Address all critical and important issues
4. Run specific reviews again to verify
5. Create PR
```

#### After PR Feedback

```shell
1. Make requested changes
2. Run targeted reviews based on feedback
3. Verify issues are resolved
4. Push updates
```

---

## Debugging & Troubleshooting

### Debug Logging

```bash
# Enable debug logging
claude --debug

# Check logs (migrated to file in 1.0.123+)
tail -f ~/.claude/debug.log

# Validate configuration
claude /doctor
```

### Common Issues and Fixes

```bash
# OAuth errors
# Fix: Check token expiration with /usage

# Permission denied
# Fix: Update settings.json allowedTools

# Path issues
# Fix: Use POSIX format on Windows (//c/Users/...)

# Hook failures
# Fix: Check exit codes (1=stderr, 2=block+stderr)

# Plugin issues
# Fix: Run /plugin validate to check plugin structure

# MCP server issues
# Fix: Check /mcp for server status
```

---

## Advanced Features

### Thinking Mode

```bash
# Toggle thinking mode with Tab key (sticky across sessions)
# Temporarily disable with /t in your prompt
# Shows Claude's reasoning process
```

### Command History Search

```bash
# Inside Claude Code, press Ctrl-R to search command history
# Type to filter, Enter to select, Esc to cancel
```

### External Editor Integration

```bash
# Press Ctrl-G to open your prompt in your system's configured text editor
```

### GitHub Issue Deduplication

```bash
# Usage via slash command
/dedupe issue-number

# Direct script execution
./scripts/auto-close-duplicates.ts
```

### GitHub API Helper (TypeScript)

```typescript
#!/usr/bin/env bun

interface GitHubIssue {
  number: number;
  title: string;
  user: { id: number };
  created_at: string;
}

interface GitHubComment {
  id: number;
  body: string;
  created_at: string;
  user: { type: string; id: number };
}

async function githubRequest<T>(
  endpoint: string,
  token: string,
  method: string = 'GET',
  body?: any
): Promise<T> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "auto-close-duplicates-script",
      ...(body && { "Content-Type": "application/json" }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Script searches for duplicates and auto-closes after 3 days
```

---

## Quick Reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Toggle thinking mode |
| `Ctrl-R` | Search command history |
| `Ctrl-G` | Open prompt in external editor |

### File Locations

| Item | Location |
|------|----------|
| Settings | `~/.claude/settings.json` |
| Commands | `.claude/commands/` |
| Logs | `~/.claude/debug.log` |
| Plugins | `.claude-plugin/` |

### Essential Commands Quick List

```bash
/help         # Get help
/model        # Switch model
/usage        # Check usage
/cost         # View costs
/doctor       # Diagnose issues
/clear        # Clear session
/rewind       # Undo changes
/plugin       # Manage plugins
/mcp          # Manage MCP servers
```

---

## Additional Resources

- **Official Documentation**: https://docs.claude.com/claude-code
- **GitHub Repository**: https://github.com/anthropics/claude-code
- **Bug Reports**: https://github.com/anthropics/claude-code/issues
- **VS Code Extension**: Search "Claude Code" in VS Code marketplace

---

**End of Documentation**
