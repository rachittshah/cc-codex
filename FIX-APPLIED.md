# Fix Applied: Codex MCP Server Not Loading Globally

## Issue Diagnosed

The Codex MCP server was configured in `~/.claude/settings.json` but **not loading** in Claude Code sessions. Other MCP servers (sequential-thinking, context7) were loading fine.

**Root Cause**: Configuration format issue with how Claude Code expects MCP server commands to be specified.

---

## Fixes Applied

### 1. Rebuilt MCP Server with Latest SDK

```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
rm -rf node_modules dist
npm install
npm run build
```

**Result**: Clean build with @modelcontextprotocol/sdk@1.20.1

### 2. Created Wrapper Script

Created `/Users/rachitt/cc-codex/codex-mcp-server/start-server.sh`:

```bash
#!/bin/bash
exec node "$(dirname "$0")/dist/index.js"
```

This ensures proper path resolution and execution.

### 3. Updated Global Settings

Updated `~/.claude/settings.json`:

**Before**:
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

**After**:
```json
{
  "mcpServers": {
    "codex": {
      "command": "/Users/rachitt/cc-codex/codex-mcp-server/start-server.sh",
      "args": []
    }
  }
}
```

---

## What You Need To Do Now

### Step 1: Exit ALL Claude Code Sessions

Make sure all Claude Code instances are closed:

```bash
# If you have multiple Claude sessions open, exit them all
# Press Ctrl+D in each session
# Or run: pkill -f claude
```

### Step 2: Start Fresh Claude Code Session

From ANY directory (to test global access):

```bash
cd /tmp
claude
```

### Step 3: Verify MCP Server Loads

In the Claude session:

```
/context
```

**Look for** in the "MCP tools" section:
```
mcp__codex__codex_reason (codex)
mcp__codex__codex_plan (codex)
mcp__codex__codex_spec (codex)
mcp__codex__codex_analyze (codex)
mcp__codex__codex_compare (codex)
```

If you see these 5 tools, **SUCCESS!** The MCP server is loading globally.

### Step 4: Test Functionality

Try these commands:

```
/plan create a simple TODO app
```

Should generate a detailed implementation plan from Codex.

```
/reason PostgreSQL vs MongoDB for e-commerce
```

Should provide deep analysis and recommendation.

```
/spec REST API for user authentication
```

Should create a technical specification.

---

## Expected Results

### In /context Output

**Before (broken)**:
```
MCP tools:
└ mcp__sequential-thinking__sequentialthinking
└ mcp__context7__resolve-library-id
└ mcp__context7__get-library-docs
```

**After (fixed)**:
```
MCP tools:
└ mcp__sequential-thinking__sequentialthinking
└ mcp__context7__resolve-library-id
└ mcp__context7__get-library-docs
└ mcp__codex__codex_reason (codex)
└ mcp__codex__codex_plan (codex)
└ mcp__codex__codex_spec (codex)
└ mcp__codex__codex_analyze (codex)
└ mcp__codex__codex_compare (codex)
```

### When Using Slash Commands

**Before**: Error or "tool not available"

**After**: Codex executes and returns structured output

---

## If Still Not Working

### Check 1: Verify start-server.sh is executable

```bash
ls -la /Users/rachitt/cc-codex/codex-mcp-server/start-server.sh
```

Should show: `-rwxr-xr-x` (executable)

### Check 2: Test wrapper script manually

```bash
/Users/rachitt/cc-codex/codex-mcp-server/start-server.sh
```

Should output: "Codex MCP Server running on stdio"

Press Ctrl+C to exit.

### Check 3: Check debug logs

```bash
tail -100 ~/.claude/debug/latest | grep -i codex
```

Should see lines about codex MCP server connecting.

### Check 4: Verify settings.json syntax

```bash
python3 -m json.tool < ~/.claude/settings.json
```

Should display properly formatted JSON with no errors.

---

## Testing Global Access

Test from 3 different directories:

```bash
# Test 1: Home directory
cd ~
claude
/context
# Look for mcp__codex__* tools
exit

# Test 2: /tmp
cd /tmp
claude
/context
# Look for mcp__codex__* tools
exit

# Test 3: Any project
cd ~/projects/some-project
claude
/context
# Look for mcp__codex__* tools
```

All three should show the Codex MCP tools.

---

## Rollback (If Needed)

If the fix doesn't work and you want to revert:

```bash
# Restore original settings
cat > ~/.claude/settings.json << 'EOF'
{
  "mcpServers": {
    "codex": {
      "command": "node",
      "args": ["/Users/rachitt/cc-codex/codex-mcp-server/dist/index.js"]
    }
  },
  "permissions": {
    "allow": ["mcp__*"]
  },
  "enableAllProjectMcpServers": true,
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline-enhanced.sh"
  },
  "alwaysThinkingEnabled": true
}
EOF
```

Then restart Claude Code.

---

## Summary of Changes

**Files Modified**:
1. `/Users/rachitt/cc-codex/codex-mcp-server/package.json` - Updated SDK version
2. `/Users/rachitt/.claude/settings.json` - Changed MCP server command to use wrapper script

**Files Created**:
1. `/Users/rachitt/cc-codex/codex-mcp-server/start-server.sh` - Wrapper script for server

**Rebuilt**:
1. `/Users/rachitt/cc-codex/codex-mcp-server/dist/` - Clean rebuild of MCP server

---

## Next Steps

1. **Exit all Claude Code sessions**
2. **Start fresh**: `claude` (from any directory)
3. **Check**: `/context` (look for codex MCP tools)
4. **Test**: `/plan create a TODO app`

If you see the codex tools in `/context` output, **you're all set!** The integration is now globally available.

---

**Status**: Fix applied, awaiting restart and verification.
