# Codex + Claude Code Integration

This repository contains configuration and documentation for using OpenAI Codex with Claude Code CLI as the implementation engine.

## Architecture

```
┌─────────────────────────────────────────────┐
│  OpenAI Codex (Planning & Reasoning Agent)  │
│  - Analyzes requirements                    │
│  - Breaks down tasks                        │
│  - Makes architectural decisions            │
│  - Orchestrates workflow                    │
└─────────────────┬───────────────────────────┘
                  │
                  │ delegates via CLI
                  ▼
┌─────────────────────────────────────────────┐
│  Claude Code (Implementation Engine)        │
│  - Writes/modifies code                     │
│  - Runs tests and builds                    │
│  - Commits changes                          │
│  - Executes tasks                           │
└─────────────────────────────────────────────┘
```

## Quick Start

1. **Install both CLIs**:
   ```bash
   # Install Codex
   npm install -g @openai/codex

   # Install Claude Code (if not already installed)
   brew install claude-code  # or your preferred method
   ```

2. **Configure Codex**:
   ```bash
   # Copy AGENTS.md to your Codex config
   cp AGENTS.md ~/.codex/AGENTS.md
   ```

3. **Start using**:
   ```bash
   # Codex analyzes and plans, then calls Claude to implement
   codex "build a REST API with authentication"
   ```

## Files

| File | Purpose | Quick Access |
|------|---------|--------------|
| `AGENTS.md` | Core instructions for Codex agent | Main config |
| `openai-codex-cli-docs.md` | Complete Codex CLI documentation | `docs.md` → |
| `codex-cli-commands-cheatsheet.md` | Essential Codex commands | `commands.md` → |

## Workflow Example

```bash
# User request
codex "add user authentication to the API"

# Codex thinks and plans:
# 1. Need User model
# 2. Need JWT middleware
# 3. Need auth routes
# 4. Need tests

# Codex executes via Claude:
claude "create User model in models/user.ts"
claude "implement JWT middleware in middleware/auth.ts"
claude "create auth routes in routes/auth.ts"
claude "write tests for auth system and run them"

# Codex validates and reports results
```

## Key Principles

1. **Codex = Brain**: Planning, reasoning, orchestration
2. **Claude = Hands**: Implementation, testing, execution
3. **Clear delegation**: Codex never writes code directly
4. **Iterative**: Codex reviews Claude's work and refines

## Configuration

### Codex Config (`~/.codex/config.toml`)

```toml
model = "gpt-5-codex"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

### Agent Instructions

Copy `AGENTS.md` to:
- Global: `~/.codex/AGENTS.md` (affects all projects)
- Local: `./AGENTS.md` (project-specific)

## Command Reference

### Codex Commands

```bash
codex                              # Interactive TUI
codex "prompt"                     # TUI with prompt
codex exec "task"                  # Non-interactive
codex --full-auto "task"           # Auto-approve mode
codex resume                       # Resume session
```

### Claude Commands (called by Codex)

```bash
claude "implement [feature]"       # Implement feature
claude "write tests for [x]"       # Write & run tests
claude "fix [bug]"                 # Fix bugs
claude "refactor [component]"      # Refactor code
```

See `commands.md` for complete command reference.

## Documentation

- **Full Codex Docs**: [openai-codex-cli-docs.md](./openai-codex-cli-docs.md)
- **Commands Cheatsheet**: [codex-cli-commands-cheatsheet.md](./codex-cli-commands-cheatsheet.md)
- **Agent Instructions**: [AGENTS.md](./AGENTS.md)

## Symlinks

For quick access:
- `docs.md` → `openai-codex-cli-docs.md`
- `commands.md` → `codex-cli-commands-cheatsheet.md`

## Best Practices

1. **Let Codex plan**: Use Codex for analysis and task breakdown
2. **Let Claude implement**: Delegate all code writing to Claude
3. **Iterate**: Review Claude's output with Codex, refine as needed
4. **Stay focused**: Each agent does what it's best at
5. **Use full-auto**: When appropriate, use `--full-auto` for efficiency

## Troubleshooting

### Codex not calling Claude?
- Check that `claude` is in your PATH: `which claude`
- Review AGENTS.md instructions
- Verify Codex loaded the instructions: `codex --no-project-doc` to test

### Claude not executing?
- Ensure Claude Code is installed and authenticated
- Check Claude has proper permissions
- Try running `claude --version` manually

### Integration issues?
- Review `AGENTS.md` for correct command syntax
- Check both CLIs are authenticated
- Verify environment variables are set

## Examples

### Add Feature
```bash
codex "add pagination to the users API endpoint"
# Codex analyzes → delegates to Claude → validates
```

### Fix Bugs
```bash
codex "diagnose and fix the failing tests"
# Codex reviews tests → Claude fixes → Codex verifies
```

### Refactor
```bash
codex "refactor the authentication system to use modern patterns"
# Codex plans refactor → Claude implements → Codex reviews
```

## Resources

- [OpenAI Codex GitHub](https://github.com/openai/codex)
- [Claude Code Docs](https://docs.claude.com/claude-code)
- [Context7 MCP](https://context7.com)

---

**TL;DR**: Codex thinks and plans, Claude implements and executes. This is the way.
