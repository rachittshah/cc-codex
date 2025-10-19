# Claude Code + Codex Integration - CLI-Only Setup

> **No API Keys Required!** Uses authenticated CLI sessions from your existing subscriptions.

**Cost:** $0 usage fees (uses your ChatGPT Plus/Pro and Claude Code subscriptions)

---

## 💰 Why CLI-Only?

**API Keys = Expensive**
- Pay per token
- Costs add up fast
- Need to manage billing

**CLI Authentication = Free**
- ✅ Codex: Included in ChatGPT Plus/Pro/Team/Enterprise
- ✅ Claude Code: Included in Anthropic subscription ($200/month flat rate)
- ✅ No usage-based charges
- ✅ Already paid for!

---

## Prerequisites

You need to be **logged in** to both CLIs:

### 1. Codex CLI (ChatGPT Account)

```bash
# Check if logged in
codex --version

# If not logged in, run:
codex
# Then select "Sign in with ChatGPT" and follow the browser flow
```

### 2. Claude Code CLI (Anthropic Account)

```bash
# Check if logged in
claude --version

# If not logged in, Claude will prompt you on first run
claude
```

---

## Quick Setup (3 Steps)

### Step 1: Build MCP Server

```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
npm install
npm run build
```

### Step 2: Configure Claude Code

Edit `~/.claude/settings.json`:

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

**Note:** No `OPENAI_API_KEY` needed! The codex CLI uses your authenticated session.

### Step 3: Link Slash Commands

```bash
cd /Users/rachitt/cc-codex
ln -s $(pwd)/commands/*.md ~/.claude/commands/
```

---

## Verify Setup

### Test Codex CLI

```bash
# This should work without API key (uses ChatGPT account)
codex exec -m gpt-5 "list the files in current directory"
```

### Test Claude Code

```bash
# Start Claude
claude

# Try a slash command
/plan implement a simple TODO list
```

Expected: Claude calls the codex_plan MCP tool, which uses your authenticated codex CLI session.

---

## How It Works

### Authentication Flow

```
User (You)
  │
  ├─> Logged into ChatGPT (codex CLI authenticated)
  └─> Logged into Anthropic (claude CLI authenticated)

Claude Code
  │
  ├─> Calls MCP tool: codex_plan
  │
  └─> MCP Server executes: codex exec -m gpt-5 "..."
      │
      └─> Uses your ChatGPT session (no API key!)
          │
          └─> Returns result to Claude
              │
              └─> Claude presents to you
```

### No API Keys Anywhere!

- ❌ No `OPENAI_API_KEY` needed
- ❌ No `ANTHROPIC_API_KEY` needed (for CLI)
- ✅ Uses authenticated CLI sessions
- ✅ Included in your existing subscriptions

---

## Cost Comparison

### With API Keys (OLD Way)

```
Codex API: $0.06 per 1K tokens (input) + $0.24 per 1K tokens (output)
Claude API: $3 per 1M tokens (input) + $15 per 1M tokens (output)

Example project (50 tasks):
- ~500K tokens = $50-100+ in API costs
```

### With CLI Authentication (NEW Way)

```
Codex CLI: $0 (included in ChatGPT Plus/Pro/Team)
Claude Code CLI: $0 usage fees (flat $200/month subscription)

Example project (50 tasks):
- Unlimited tokens = $0 additional cost
```

**Savings: $50-100+ per project!**

---

## Configuration Details

### Your Current Setup

Based on `~/.codex/config.toml`:

```toml
model = "gpt-5"
model_reasoning_effort = "high"

# Your project is already trusted
[projects."/Users/rachitt/cc-codex"]
trust_level = "trusted"
```

This means:
- ✅ Codex will use gpt-5 with high reasoning
- ✅ No approval prompts in this directory
- ✅ Automatically configured correctly

### Claude Code Settings

Minimal config needed in `~/.claude/settings.json`:

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

That's it! No environment variables, no API keys.

---

## Available Commands

Once set up, use these slash commands in Claude:

### `/plan` - Generate Implementation Plan
```
User: /plan implement user authentication
→ Codex (via ChatGPT session) generates plan
→ Claude presents plan
→ You approve
→ Claude implements
```

### `/reason` - Deep Reasoning
```
User: /reason should we use PostgreSQL or MongoDB?
→ Codex analyzes options
→ Recommends with rationale
→ You decide
→ Claude implements
```

### `/spec` - Technical Specification
```
User: /spec rate limiting middleware
→ Codex creates detailed spec
→ Claude shows spec
→ You approve
→ Claude implements
```

### `/codex` - Generic Codex Task
```
User: /codex compare Redis vs Memcached
→ Auto-detects best tool (codex_compare)
→ Codex analyzes
→ Claude presents results
```

---

## Troubleshooting

### "Command not found: codex"

**Solution:** Codex CLI not installed
```bash
npm install -g @openai/codex
```

### "Authentication required"

**Solution:** Log into Codex
```bash
codex
# Select "Sign in with ChatGPT"
# Follow browser authentication
```

### "MCP server not responding"

**Solution:** Check MCP server built
```bash
cd /Users/rachitt/cc-codex/codex-mcp-server
ls -l dist/index.js
# If missing:
npm run build
```

### "Permission denied"

**Solution:** Check Claude Code settings
```bash
cat ~/.claude/settings.json
# Should have: "permissions": {"allow": ["mcp__*"]}
```

---

## Limitations

### What Requires ChatGPT Plus/Pro/Team

The Codex CLI requires one of:
- ChatGPT Plus ($20/month)
- ChatGPT Pro ($200/month)
- ChatGPT Team
- ChatGPT Enterprise

**You already have this!** (Your codex CLI is working)

### What Requires Claude Code Subscription

Claude Code requires:
- Anthropic Claude subscription

**You already have this!** (Your claude CLI is working)

---

## Advantages Over API Keys

| Feature | CLI Auth | API Keys |
|---------|----------|----------|
| Cost | Flat rate (already paid) | Usage-based ($$$$) |
| Setup | Just log in | Get keys, manage billing |
| Security | Session-based | Keys can leak |
| Billing | Predictable | Variable |
| Rate Limits | Higher | Lower |

---

## Next Steps

1. **Verify logins:**
   ```bash
   codex --version  # Should show version
   claude --version # Should show version
   ```

2. **Build MCP server:**
   ```bash
   cd /Users/rachitt/cc-codex/codex-mcp-server
   npm install && npm run build
   ```

3. **Configure Claude:**
   ```bash
   # Add MCP server to ~/.claude/settings.json
   # (see config above)
   ```

4. **Link commands:**
   ```bash
   ln -s /Users/rachitt/cc-codex/commands/*.md ~/.claude/commands/
   ```

5. **Test it:**
   ```bash
   claude
   /plan implement a simple feature
   ```

---

## FAQ

**Q: Do I need an OpenAI API key?**
A: No! The codex CLI uses your ChatGPT account.

**Q: Do I need an Anthropic API key?**
A: No! Claude Code uses your Anthropic subscription.

**Q: Will this cost extra?**
A: No! It uses subscriptions you already have.

**Q: What if I get rate limited?**
A: CLI rate limits are much higher than API rate limits.

**Q: Can I use this commercially?**
A: Check your ChatGPT and Claude Code subscription terms.

---

**Setup Complete!**

You now have a **zero-cost** (beyond subscriptions) integration between Claude Code and Codex using authenticated CLI sessions.

**No API keys. No usage fees. No surprises.** ✅
