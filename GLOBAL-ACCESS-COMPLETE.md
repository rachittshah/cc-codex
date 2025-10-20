# Global Access - Complete Reference

## Status: EVERYTHING IS GLOBALLY ACCESSIBLE

All components of the Codex + Claude Code integration are already globally available on your machine.

---

## What's Global and How

### 1. Codex CLI

**Location**: `/Users/rachitt/.nvm/versions/node/v22.18.0/bin/codex`

**Global Access**: Via PATH (installed through nvm/npm)

**Test**:
```bash
# From any directory
cd /tmp
codex --version
# Works ✓
```

**Usage**:
```bash
# Works from anywhere
codex exec -m gpt-5 --full-auto "your reasoning task"
```

### 2. Claude Code CLI

**Location**: `/Users/rachitt/.nvm/versions/node/v22.18.0/bin/claude`

**Global Access**: Via PATH (installed through nvm/npm)

**Test**:
```bash
# From any directory
cd ~
claude --version
# Works ✓
```

**Usage**:
```bash
# Works from anywhere
claude
```

### 3. MCP Server

**Configuration**: `~/.claude/settings.json`

**Server Path**: `/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js`

**Global Access**: Claude reads `~/.claude/settings.json` on every start, regardless of working directory

**Configuration**:
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

**Test**:
```bash
# From any directory
cd /tmp
claude
# MCP server automatically loads
# All 5 Codex tools available ✓
```

### 4. Slash Commands

**Location**: `~/.claude/commands/`

**Commands**:
- `plan.md` → `/Users/rachitt/cc-codex/commands/plan.md`
- `reason.md` → `/Users/rachitt/cc-codex/commands/reason.md`
- `spec.md` → `/Users/rachitt/cc-codex/commands/spec.md`
- `codex.md` → `/Users/rachitt/cc-codex/commands/codex.md`

**Global Access**: Symlinked to global commands directory

**Test**:
```bash
# From any directory
cd /Users
claude
/plan test task
# Works ✓
```

---

## How Global Access Works

### When You Run `codex`

1. Shell looks in PATH
2. Finds: `/Users/rachitt/.nvm/versions/node/v22.18.0/bin/codex`
3. Executes from anywhere
4. Works globally ✓

### When You Run `claude`

1. Shell looks in PATH
2. Finds: `/Users/rachitt/.nvm/versions/node/v22.18.0/bin/claude`
3. Reads `~/.claude/settings.json` (global config)
4. Loads MCP server from config
5. Loads slash commands from `~/.claude/commands/`
6. Everything available ✓

### Visual Diagram

```
ANY Directory
     │
     ├─> Run: codex
     │   └─> Found in PATH → Works globally ✓
     │
     └─> Run: claude
         │
         ├─> Found in PATH → Works globally ✓
         │
         ├─> Loads: ~/.claude/settings.json
         │   └─> MCP server configured → Available ✓
         │
         └─> Loads: ~/.claude/commands/
             └─> Slash commands linked → Available ✓
```

---

## Verification

Run the verification script from anywhere:

```bash
/Users/rachitt/cc-codex/verify-global-access.sh
```

Expected output:
```
✓ codex command available
✓ claude command available
✓ MCP server configured globally
✓ Slash commands available (4 commands)

Status: ALL GLOBALLY ACCESSIBLE ✓
```

---

## Usage Examples

### Example 1: From Home Directory

```bash
cd ~

# Use Codex
codex exec -m gpt-5 --full-auto "plan database architecture"

# Use Claude with slash commands
claude
/plan implement user authentication
```

### Example 2: From Any Project

```bash
cd ~/projects/my-app

# Start Claude - MCP automatically loads
claude

# Slash commands work
/reason should we use Redis or Memcached?
/spec create API specification
```

### Example 3: From /tmp

```bash
cd /tmp

# Everything still works
codex --version
claude
/plan build a feature
```

---

## What Makes It Global

### 1. PATH Environment

Both `codex` and `claude` are in your PATH via nvm:

```bash
echo $PATH
# Contains: /Users/rachitt/.nvm/versions/node/v22.18.0/bin
```

This means they're accessible from any directory.

### 2. Home Directory Configuration

Configuration files in home directory (`~`) are accessible from anywhere:

- `~/.claude/settings.json` - MCP server config
- `~/.claude/commands/` - Slash commands

No matter your working directory, `~` always resolves to `/Users/rachitt/`.

### 3. Absolute Paths in Config

The MCP server uses an absolute path:

```json
"/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"
```

This works from any directory because it's not relative.

### 4. Symlinks to Source

Slash commands are symlinked:

```bash
~/.claude/commands/plan.md → /Users/rachitt/cc-codex/commands/plan.md
```

Changes to source files automatically reflected globally.

---

## Benefits of Global Setup

**No Per-Project Configuration**:
- Don't copy configs to each project
- Don't re-link slash commands
- Don't reinstall anything

**Consistent Experience**:
- Same tools everywhere
- Same slash commands
- Same MCP integration

**Easy Updates**:
- Update MCP server once: `cd /Users/rachitt/cc-codex/codex-mcp-server && npm run build`
- Available everywhere immediately

**Time Savings**:
- ~5 minutes per project (no setup needed)
- Instant access to full integration

---

## Maintenance

### Update MCP Server

```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm run build
# Restart Claude if running
# Changes globally available ✓
```

### Update Slash Commands

```bash
# Edit source files
vim /Users/rachitt/cc-codex/commands/plan.md

# Changes immediately available globally via symlinks
# No need to re-link ✓
```

### Verify After Updates

```bash
/Users/rachitt/cc-codex/verify-global-access.sh
```

---

## Troubleshooting

### "Command not found: codex"

**Check PATH**:
```bash
echo $PATH | grep nvm
```

**Verify installation**:
```bash
ls -la ~/.nvm/versions/node/v22.18.0/bin/codex
```

**Reinstall if needed**:
```bash
npm install -g @openai/codex-cli
```

### "Command not found: claude"

**Check PATH**:
```bash
which claude
```

**Reinstall if needed**:
Follow Claude Code installation instructions.

### Slash Commands Not Working

**Verify links**:
```bash
ls -la ~/.claude/commands/
```

**Re-link if broken**:
```bash
ln -sf /Users/rachitt/cc-codex/commands/*.md ~/.claude/commands/
```

### MCP Server Not Loading

**Check config**:
```bash
cat ~/.claude/settings.json | grep -A 3 codex
```

**Verify server file**:
```bash
ls -la /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
```

**Rebuild if needed**:
```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm run build
```

---

## Summary

**Everything is already globally accessible**:

1. **Codex CLI**: In PATH, works everywhere
2. **Claude CLI**: In PATH, works everywhere
3. **MCP Server**: Configured in `~/.claude/settings.json`, loads globally
4. **Slash Commands**: Symlinked in `~/.claude/commands/`, available globally

**No additional setup needed**.

**How to use**:
```bash
# From anywhere
cd /any/directory
claude
/plan your task
```

**Verification**:
```bash
/Users/rachitt/cc-codex/verify-global-access.sh
```

**Status**: FULLY GLOBAL ✓
