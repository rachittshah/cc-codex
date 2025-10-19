# Claude Code CLI Commands - Quick Reference

> Essential CLI commands and shortcuts for Claude Code

**Last Updated:** 2025-10-19

---

## Installation & Launch

```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Launch in interactive mode
claude

# Launch with headless mode (single command)
claude --headless "explain the main.js file"

# Launch with API key
ANTHROPIC_API_KEY=your_key claude

# Launch with custom settings
claude --settings /path/to/settings.json

# Launch with specific model
claude --model claude-opus-4

# Launch with permission mode
claude --permission-mode acceptEdits
claude --permission-mode ask

# Enable debug logging
claude --debug

# Verify installation
claude --help
```

---

## Essential Slash Commands

### Core Commands

```bash
/help             # Get help with Claude Code
/bug              # Report a bug to Claude Code team
/doctor           # Validate configuration and diagnose issues
/clear            # Clear conversation history
/config           # Configure Claude Code settings
```

### Model & Context Management

```bash
/model            # Switch AI model interactively
/context          # Check current context usage
/memory           # View memory management
/add-dir          # Add directory to context (e.g., /add-dir src/components)
```

### Usage & Cost Tracking

```bash
/usage            # Check plan limits and API usage
/cost             # View API costs and token usage
```

### Session Control

```bash
/rewind           # Undo code changes to a previous state
/clear            # Clear conversation history
```

### Integration Management

```bash
/mcp              # Manage MCP (Model Context Protocol) servers
/plugin           # Manage plugins (install, enable, disable)
```

---

## Plugin Commands

### Plugin Management

```bash
/plugin install                    # Install plugins from marketplaces
/plugin enable security-guidance   # Enable a specific plugin
/plugin disable security-guidance  # Disable a specific plugin
/plugin marketplace                # Browse available plugins
/plugin validate                   # Validate plugin structure
```

### Built-in Plugin Commands

```bash
# Git workflow commands
/commit-push-pr                    # Commit changes, push, and create PR

# GitHub utilities
/dedupe                            # Find and handle duplicate GitHub issues

# PR Review commands (requires pr-review-toolkit plugin)
/pr-review-toolkit:review-pr                  # Full comprehensive review
/pr-review-toolkit:review-pr tests errors     # Review specific aspects
/pr-review-toolkit:review-pr all parallel     # Parallel review with all agents
```

---

## MCP Server Commands

```bash
# Manage MCP servers
/mcp

# Interact with MCP servers using @-mentions
@github help                       # Get help from GitHub MCP server
@filesystem list /path             # Interact with filesystem MCP server
```

---

## Environment Variables

### API Keys

```bash
# Anthropic API
export ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (if using OpenAI models)
export OPENAI_API_KEY=sk-...
```

### AWS Bedrock

```bash
export AWS_REGION=us-west-2
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

### Google Vertex AI

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
export GOOGLE_CLOUD_PROJECT=project-id
export GOOGLE_CLOUD_LOCATION=us-central1
```

### Claude Code Settings

```bash
export CLAUDE_BASH_NO_LOGIN=1                          # Skip login shell
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-4-5 # Set default model
export NO_PROXY=localhost,127.0.0.1                    # Bypass proxy
```

---

## Keyboard Shortcuts

```bash
Tab         # Toggle thinking mode (shows Claude's reasoning)
Ctrl-R      # Search command history
Ctrl-G      # Open prompt in external editor
/t          # Temporarily disable thinking mode in prompt
```

---

## Git Workflow Commands

### Automated Git Operations

```bash
# Natural language commands (speak to Claude)
"Commit my changes and create a PR"
"Create a new branch and commit these changes"
"Push my changes to origin"
"Create a pull request for this feature"
```

### Git Branch Cleanup

```bash
# List branches with status
git branch -v

# List worktrees
git worktree list

# Clean up gone branches (via plugin)
# Use the clean_gone command from commit-commands plugin
```

---

## PR Review Commands

### Basic Review

```bash
/pr-review-toolkit:review-pr                    # Default comprehensive review
```

### Targeted Reviews

```bash
/pr-review-toolkit:review-pr tests              # Review test coverage
/pr-review-toolkit:review-pr errors             # Review error handling
/pr-review-toolkit:review-pr tests errors       # Review multiple aspects
/pr-review-toolkit:review-pr comments           # Review code comments
/pr-review-toolkit:review-pr simplify           # Simplify code suggestions
```

### Advanced Review

```bash
/pr-review-toolkit:review-pr all                # All agents sequentially
/pr-review-toolkit:review-pr all parallel       # All agents in parallel (faster)
```

---

## Debugging Commands

```bash
# Enable debug mode
claude --debug

# Check debug logs
tail -f ~/.claude/debug.log

# Validate configuration
claude /doctor

# Check specific issues
/usage              # Check for OAuth/token issues
/mcp                # Check MCP server status
/plugin validate    # Validate plugin structure
```

---

## Permission Modes

```bash
# Launch with auto-accept edits
claude --permission-mode acceptEdits

# Launch with manual approval
claude --permission-mode ask

# Check permission configuration
claude /doctor
```

---

## Model Aliases

```bash
# Available model aliases
claude --model sonnet       # Claude Sonnet
claude --model opus         # Claude Opus
claude --model opusplan     # Claude Opus with extended context
claude --model claude-opus-4
```

---

## File Locations

```bash
# Settings file
~/.claude/settings.json

# Custom commands directory
.claude/commands/

# Debug logs
~/.claude/debug.log

# Plugin directory
.claude-plugin/
```

---

## Common Workflows

### Quick Code Review

```bash
# 1. Start Claude
claude

# 2. Ask for code review
"Review my recent changes"

# 3. Run PR review if needed
/pr-review-toolkit:review-pr
```

### Debug Configuration Issues

```bash
# 1. Enable debug mode
claude --debug

# 2. Run doctor
/doctor

# 3. Check logs
tail -f ~/.claude/debug.log
```

### Check Usage & Costs

```bash
# 1. Start Claude
claude

# 2. Check usage
/usage

# 3. Check costs
/cost
```

### Switch Models Mid-Session

```bash
# Open model selector
/model

# Then choose from available models
```

### Add Context from Directory

```bash
# Add specific directory to context
/add-dir src/components

# Check context usage
/context
```

---

## Tips & Best Practices

### Efficient Context Management

```bash
# Start with minimal context
claude

# Add directories as needed
/add-dir src
/add-dir tests

# Monitor context usage
/context
```

### Cost Optimization

```bash
# Check costs regularly
/cost

# Use appropriate models
/model  # Switch to smaller model for simple tasks

# Clear context when switching tasks
/clear
```

### Session Management

```bash
# Save work before clearing
/rewind  # If you need to undo

# Clear for fresh start
/clear

# Sessions auto-save and resume
```

---

## Troubleshooting Quick Reference

| Issue | Command | Solution |
|-------|---------|----------|
| OAuth errors | `/usage` | Check token expiration |
| Permission denied | `/doctor` | Update settings.json allowedTools |
| Path issues | `/doctor` | Use POSIX format on Windows |
| Hook failures | `claude --debug` | Check exit codes in logs |
| Plugin issues | `/plugin validate` | Validate plugin structure |
| MCP server issues | `/mcp` | Check server status |
| High costs | `/cost` | Monitor token usage |
| Context overflow | `/context` | Clear or reduce context |

---

## Advanced Usage

### Headless Mode (Automation)

```bash
# Single command execution
claude --headless "explain main.js"

# With specific model
claude --model opus --headless "review this PR"

# With custom settings
claude --settings ./config.json --headless "run tests"
```

### Custom Command Creation

```bash
# 1. Create command file
mkdir -p .claude/commands
nano .claude/commands/test.md

# 2. Add content:
# ---
# allowed-tools: Bash(npm:*)
# description: Run all tests
# ---
#
# ## Your task
# Run `npm test` and report results

# 3. Use command
/test
```

### Environment-specific Launch

```bash
# Development
ANTHROPIC_API_KEY=$DEV_KEY claude --model sonnet

# Production
ANTHROPIC_API_KEY=$PROD_KEY claude --model opus --permission-mode ask

# Testing with debug
ANTHROPIC_API_KEY=$TEST_KEY claude --debug --headless "run tests"
```

---

## Quick Command Cheatsheet

```bash
# Most Used Commands
/help         # Help
/model        # Switch model
/usage        # Check usage
/cost         # View costs
/doctor       # Diagnose
/context      # Check context
/clear        # Clear session
/rewind       # Undo changes

# Plugin Management
/plugin       # Manage plugins
/mcp          # Manage MCP servers

# Workflows
/commit-push-pr              # Git workflow
/pr-review-toolkit:review-pr # Code review

# Shortcuts
Tab           # Toggle thinking
Ctrl-R        # Search history
Ctrl-G        # External editor
```

---

## Additional Resources

- **Official Docs**: https://docs.claude.com/claude-code
- **GitHub**: https://github.com/anthropics/claude-code
- **Issues**: https://github.com/anthropics/claude-code/issues

---

**End of CLI Commands Reference**
