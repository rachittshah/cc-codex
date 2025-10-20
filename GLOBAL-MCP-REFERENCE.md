# Global MCP Installation - Quick Reference

## Status: GLOBALLY INSTALLED

Your Codex MCP server is now globally available in ALL Claude Code sessions, from ANY directory.

---

## What's Globally Installed

### 1. MCP Server Configuration
**Location**: `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "codex": {
      "command": "node",
      "args": ["/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"]
    }
  },
  "permissions": {
    "allow": ["mcp__*"]
  }
}
```

**What this means**:
- Available in every Claude Code session
- No per-project configuration needed
- Works from any directory

### 2. Global Slash Commands
**Location**: `~/.claude/commands/`

Available commands:
- `/plan` - Generate implementation plans
- `/reason` - Deep reasoning and analysis
- `/spec` - Create technical specifications
- `/codex` - Generic Codex tasks

**What this means**:
- Use slash commands anywhere
- No need to copy commands per project
- Consistent interface across all projects

### 3. MCP Tools Available
**Tool Set**: 5 Codex tools globally accessible

| Tool | Purpose |
|------|---------|
| `codex_reason` | Deep reasoning and analysis |
| `codex_plan` | Implementation planning |
| `codex_spec` | Technical specifications |
| `codex_analyze` | Code/architecture review |
| `codex_compare` | Option comparison |

---

## Usage From Any Directory

### Example 1: From Home Directory
```bash
cd ~
claude

# All slash commands work
/plan implement a feature
/reason compare two approaches
/spec create API documentation
```

### Example 2: From Any Project
```bash
cd ~/my-other-project
claude

# MCP tools automatically available
# No configuration needed
/plan add user authentication
```

### Example 3: From /tmp
```bash
cd /tmp
claude

# Still works!
/reason which database should I use?
```

---

## How It Works

1. **Claude Code Starts**: Reads `~/.claude/settings.json`
2. **MCP Server Loads**: Connects to codex MCP server
3. **Tools Available**: All 5 Codex tools ready
4. **Slash Commands**: Loaded from `~/.claude/commands/`

This happens automatically in EVERY session, regardless of:
- Current working directory
- Project type
- Whether you're in a git repo

---

## Verification

Run the verification script from anywhere:

```bash
/Users/rachitt/cc-codex/verify-global-mcp.sh
```

Or quick check:

```bash
# Check global config
cat ~/.claude/settings.json | grep -A 3 '"codex"'

# Check slash commands
ls -la ~/.claude/commands/
```

Expected output:
```
✓ Codex MCP server configured globally
✓ MCP permissions enabled globally
✓ 4/4 slash commands available globally
✓ MCP Integration Globally Installed
```

---

## What You DON'T Need To Do

- Don't copy configuration to each project
- Don't create `.claude/` folders per project
- Don't re-link slash commands
- Don't reinstall anything

**It just works everywhere.**

---

## Updating the MCP Server

If you update the MCP server code:

```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm run build
```

Changes are immediately available globally (restart Claude Code if running).

---

## Troubleshooting

### MCP Not Working in New Session?

1. **Verify global config**:
   ```bash
   cat ~/.claude/settings.json | grep codex
   ```

2. **Check MCP server exists**:
   ```bash
   ls -la /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
   ```

3. **Restart Claude Code**:
   ```bash
   # Exit and restart
   claude
   ```

### Slash Commands Not Appearing?

1. **Check links**:
   ```bash
   ls -la ~/.claude/commands/
   ```

2. **Re-link if needed**:
   ```bash
   ln -sf /Users/rachitt/cc-codex/commands/*.md ~/.claude/commands/
   ```

---

## Benefits of Global Installation

**Before (per-project)**:
- Configure each project separately
- Copy slash commands to each project
- Inconsistent setup across projects
- Manual configuration required

**After (global)**:
- Configure once, use everywhere
- Automatic slash commands
- Consistent across all projects
- Zero per-project setup

**Time Saved**: ~5 minutes per project

---

## Architecture

```
ANY Directory
     │
     └─> Start Claude Code
            │
            └─> Loads ~/.claude/settings.json (global config)
                   │
                   ├─> Connects to MCP server (codex)
                   │   └─> 5 tools available
                   │
                   └─> Loads ~/.claude/commands/ (slash commands)
                       └─> /plan, /reason, /spec, /codex available
```

**Result**: Full MCP integration everywhere, automatically.

---

## Summary

**Global Installation Complete**

- MCP Server: Configured in ~/.claude/settings.json
- Slash Commands: Linked in ~/.claude/commands/
- Availability: ALL Claude Code sessions
- Scope: From ANY directory
- Setup Required: None (already done)

**Next Steps**:
1. Open Claude Code from any directory: `claude`
2. Use slash commands: `/plan`, `/reason`, `/spec`, `/codex`
3. MCP tools work automatically

**That's it!** Your Codex integration is globally available.
