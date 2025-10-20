# Fix: Codex MCP Server Not Loading

## Issue

The `/plan`, `/reason`, `/spec`, and `/codex` commands don't work because the Codex MCP server is not loading in Claude Code.

## Diagnosis Complete

Based on testing:
- Settings.json configuration: CORRECT ✓
- MCP server starts: YES ✓
- Tool files compiled: YES ✓
- Package.json: CORRECT ✓

**Root Cause**: Claude Code session needs restart to load new MCP server.

---

## Solution: Restart Claude Code

### Step 1: Exit Current Session

In your Claude Code terminal:
```bash
# Press Ctrl+D
# Or type: exit
```

### Step 2: Restart Claude Code

```bash
claude
```

### Step 3: Verify MCP Server Loaded

```bash
/mcp
```

**Expected output** (should include):
```
MCP tools
└ mcp__codex__codex_reason (codex)
└ mcp__codex__codex_plan (codex)
└ mcp__codex__codex_spec (codex)
└ mcp__codex__codex_analyze (codex)
└ mcp__codex__codex_compare (codex)
```

### Step 4: Test Slash Commands

```bash
/plan test global access
```

Should call Codex and generate a plan.

---

## If Still Not Working

### Debug Step 1: Check MCP Server Manually

```bash
node /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
```

**Expected**: Should output "Codex MCP Server running on stdio" and wait for input.

Press Ctrl+C to exit.

### Debug Step 2: Check Settings.json

```bash
cat ~/.claude/settings.json
```

**Should contain**:
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

### Debug Step 3: Rebuild MCP Server

```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm run build
```

Should compile without errors.

### Debug Step 4: Check File Permissions

```bash
ls -la /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
```

Should show readable file (not empty).

### Debug Step 5: Check Node Version

```bash
node --version
```

Should be v16+ (you have v22.18.0 ✓).

---

## Common Issues

### Issue: "Module not found" Error

**Fix**:
```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm install
npm run build
```

### Issue: Permission Denied

**Fix**:
```bash
chmod +x /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js
```

### Issue: Codex Command Not Found

**Fix**:
```bash
# Verify codex is installed
which codex

# If not found, install
npm install -g @openai/codex-cli

# Or use nvm
nvm use 22
```

### Issue: MCP Tools Show "Permission Denied"

**Fix**: Check `~/.claude/settings.json` has:
```json
"permissions": {
  "allow": ["mcp__*"]
}
```

---

## Verification Script

Run comprehensive verification:

```bash
/Users/rachitt/cc-codex/verify-global-mcp.sh
```

Should output:
```
✓ Codex CLI: Installed and authenticated
✓ MCP Server: Built and ready
✓ Claude Settings: Configured
✓ Slash Commands: Linked (4/4)
✓ Integration: Ready to use
```

---

## After Fix: Test Workflow

Once MCP server is loading:

```bash
# Start Claude Code
claude

# Test /plan
/plan implement a TODO list with React

# Test /reason
/reason PostgreSQL vs MongoDB for e-commerce

# Test /spec
/spec REST API for user authentication

# Test /codex
/codex compare caching solutions
```

All should call Codex and return structured responses.

---

## Still Having Issues?

If after restarting Claude Code the MCP server still doesn't load:

1. **Check Claude Code version**:
   ```bash
   claude --version
   ```
   Should be v2.0+

2. **Check for MCP server errors**:
   ```bash
   # Start MCP server manually and look for errors
   node /Users/rachitt/cc-codex/codex-mcp-server/dist/index.js 2>&1
   ```

3. **Check Claude Code logs** (if available):
   ```bash
   # Location varies, check documentation
   ```

4. **Try minimal config**:
   Create `~/.claude/settings-test.json`:
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

---

## Success Indicators

After restart, you should see:

1. **In /mcp output**:
   - `mcp__codex__codex_reason` tool
   - `mcp__codex__codex_plan` tool
   - `mcp__codex__codex_spec` tool
   - `mcp__codex__codex_analyze` tool
   - `mcp__codex__codex_compare` tool

2. **Slash commands work**:
   - `/plan` calls Codex
   - `/reason` calls Codex
   - `/spec` calls Codex
   - `/codex` calls Codex

3. **Codex responses**:
   - Detailed plans
   - Deep reasoning
   - Technical specifications
   - Analysis results

---

## Quick Fix Summary

**Most likely**: Just restart Claude Code.

```bash
# Exit current session
Ctrl+D

# Restart
claude

# Verify
/mcp

# Test
/plan test task
```

That's it!
