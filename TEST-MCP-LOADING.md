# Test: Is Codex MCP Server Actually Loading?

## Quick Test in Current Claude Session

### Step 1: Check MCP Tools

In your Claude Code session, run:
```
/mcp
```

**Do NOT dismiss the dialog.** Look for these tools in the output:

```
mcp__codex__codex_reason (codex)
mcp__codex__codex_plan (codex)
mcp__codex__codex_spec (codex)
mcp__codex__codex_analyze (codex)
mcp__codex__codex_compare (codex)
```

**If you see these**: MCP server IS loaded globally ✓
**If you DON'T see these**: MCP server NOT loaded ✗

### Step 2: Test Actual Functionality

Try this command:
```
/plan create a simple TODO app
```

**If it works**: Should call Codex and return a structured plan
**If it doesn't work**: Will say "tool not available" or similar

---

## Why You Might Think It Only Works in cc-codex Directory

### Misunderstanding #1: Slash Command vs MCP Tools

The `/codex` **slash command** is globally available because it's symlinked in `~/.claude/commands/`.

But the slash command **calls MCP tools** which might not be loaded.

**Example**:
```
/codex compare Redis vs Memcached
```

This runs the command file at `~/.claude/commands/codex.md`, which then tries to call the MCP tool `mcp__codex__codex_compare`.

If the MCP tool isn't loaded, the command will fail even though the slash command exists.

### Misunderstanding #2: Project vs Global

Your global config (`~/.claude/settings.json`) has:
```json
{
  "mcpServers": {
    "codex": {
      "command": "node",
      "args": ["/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"]
    }
  }
}
```

This should load the MCP server globally in **every** Claude Code session.

---

## Diagnosis: Is It Actually Working Globally?

### Test From Different Directories

**Test 1: From Home Directory**
```bash
cd ~
claude
/mcp
# Look for mcp__codex__* tools
/plan test task
```

**Test 2: From /tmp**
```bash
cd /tmp
claude
/mcp
# Look for mcp__codex__* tools
/plan test task
```

**Test 3: From Any Project**
```bash
cd ~/projects/some-project
claude
/mcp
# Look for mcp__codex__* tools
/plan test task
```

**Expected Result**: Should work in ALL three directories.

---

## Common Issue: MCP Server Fails to Start

Even though it's configured, the MCP server might fail to start. Check for errors:

### Manual Test

```bash
node /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
```

**Expected output**:
```
Codex MCP Server running on stdio
```

**If you see errors**: The MCP server has issues.

**Common Errors**:

1. **Module not found**
   ```
   Error: Cannot find module '@modelcontextprotocol/sdk'
   ```
   **Fix**:
   ```bash
   cd /Users/rachitt/cc-codex/codex-mcp-server
   npm install
   npm run build
   ```

2. **Syntax error**
   ```
   SyntaxError: Unexpected token
   ```
   **Fix**: Rebuild
   ```bash
   cd /Users/rachitt/cc-codex/codex-mcp-server
   npm run build
   ```

3. **Permission denied**
   ```
   EACCES: permission denied
   ```
   **Fix**:
   ```bash
   chmod +x /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
   ```

---

## If It's ONLY Working in cc-codex Directory

This would mean there's a project-specific configuration loading the MCP server only for that directory.

### Check for Project MCP Config

```bash
cd /Users/rachitt/cc-codex
ls -la .claude/
cat .claude/settings.local.json 2>/dev/null
```

**If you see MCP server config there**: That's why it only works in this directory.

**Solution**: Remove it from project, rely on global config.

---

## Current Status Check

Run this from your current Claude session:

```bash
# Copy this message exactly:
Please run this command and show me the full output without dismissing:
/mcp
```

Then look for `mcp__codex__` tools in the list.

---

## Expected Global Setup

**Global Config** (`~/.claude/settings.json`):
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

**Global Commands** (`~/.claude/commands/`):
```
plan.md -> /Users/rachitt/cc-codex/commands/plan.md
reason.md -> /Users/rachitt/cc-codex/commands/reason.md
spec.md -> /Users/rachitt/cc-codex/commands/spec.md
codex.md -> /Users/rachitt/cc-codex/commands/codex.md
```

**Result**: Works from ANY directory.

---

## Next Steps

1. **In your current Claude session**, run `/mcp` and **don't dismiss it**
2. **Look for** `mcp__codex__codex_plan` and related tools
3. **If you see them**: It's working globally! ✓
4. **If you don't see them**: MCP server isn't loading (even in current dir)

Please share what you see in the `/mcp` output.
